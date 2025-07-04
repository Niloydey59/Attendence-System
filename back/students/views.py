from django.shortcuts import render, get_object_or_404
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from .models import StudentProfile, StudentFaceImage
from .serializers import StudentFaceImageSerializer, StudentFaceImageListSerializer, StudentProfileSerializer
from teachers.models import Class, ClassEnrollment
from teachers.serializers import StudentEnrollmentSerializer, ClassSerializer

class StudentProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Get the authenticated student's profile data"""
        try:
            if not hasattr(request.user, 'student_profile'):
                return Response(
                    {'error': 'User is not a student'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            student_profile = request.user.student_profile
            serializer = StudentProfileSerializer(student_profile)
            
            return Response({
                'message': 'Profile data retrieved successfully',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Error retrieving profile: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def put(self, request):
        """Update the authenticated student's profile data"""
        try:
            if not hasattr(request.user, 'student_profile'):
                return Response(
                    {'error': 'User is not a student'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            student_profile = request.user.student_profile
            serializer = StudentProfileSerializer(
                student_profile, 
                data=request.data, 
                partial=False
            )
            
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'message': 'Profile updated successfully',
                    'data': serializer.data
                }, status=status.HTTP_200_OK)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response(
                {'error': f'Error updating profile: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def patch(self, request):
        """Partially update the authenticated student's profile data"""
        try:
            if not hasattr(request.user, 'student_profile'):
                return Response(
                    {'error': 'User is not a student'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            student_profile = request.user.student_profile
            serializer = StudentProfileSerializer(
                student_profile, 
                data=request.data, 
                partial=True
            )
            
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'message': 'Profile updated successfully',
                    'data': serializer.data
                }, status=status.HTTP_200_OK)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response(
                {'error': f'Error updating profile: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class StudentFaceImageUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def post(self, request):
        """Upload a new face image for the authenticated student"""
        try:
            # Check if user has a student profile
            if not hasattr(request.user, 'student_profile'):
                return Response(
                    {'error': 'User is not a student'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Check if student already has maximum number of images (limit to 3)
            student = request.user.student_profile
            existing_images_count = StudentFaceImage.objects.filter(student=student).count()
            
            if existing_images_count >= 3:
                return Response(
                    {'error': 'Maximum 3 face images allowed per student'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Only set as primary if this is the first image AND not explicitly set in request
            if existing_images_count == 0 and 'is_primary' not in request.data:
                request.data['is_primary'] = True
            elif 'is_primary' not in request.data:
                # For subsequent images, default to False if not specified
                request.data['is_primary'] = False
            
            serializer = StudentFaceImageSerializer(
                data=request.data, 
                context={'request': request}
            )
            
            if serializer.is_valid():
                face_image = serializer.save()
                return Response(
                    {
                        'message': 'Face image uploaded successfully',
                        'data': StudentFaceImageListSerializer(face_image, context={'request': request}).data
                    }, 
                    status=status.HTTP_201_CREATED
                )
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response(
                {'error': f'Error uploading image: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def get(self, request):
        """Get all face images for the authenticated student"""
        try:
            if not hasattr(request.user, 'student_profile'):
                return Response(
                    {'error': 'User is not a student'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            student = request.user.student_profile
            face_images = StudentFaceImage.objects.filter(student=student).order_by('-is_primary', '-uploaded_at')
            
            serializer = StudentFaceImageListSerializer(
                face_images, 
                many=True, 
                context={'request': request}
            )
            
            return Response({
                'count': face_images.count(),
                'images': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Error retrieving images: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class StudentFaceImageDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request, image_id):
        """Delete a specific face image"""
        try:
            if not hasattr(request.user, 'student_profile'):
                return Response(
                    {'error': 'User is not a student'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            student = request.user.student_profile
            face_image = get_object_or_404(
                StudentFaceImage, 
                id=image_id, 
                student=student
            )
            
            # If deleting primary image, make another image primary if exists
            if face_image.is_primary:
                other_images = StudentFaceImage.objects.filter(
                    student=student
                ).exclude(id=image_id).first()
                
                if other_images:
                    other_images.is_primary = True
                    other_images.save()
            
            face_image.delete()
            
            return Response(
                {'message': 'Face image deleted successfully'}, 
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            return Response(
                {'error': f'Error deleting image: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def patch(self, request, image_id):
        """Update image properties (e.g., set as primary)"""
        try:
            if not hasattr(request.user, 'student_profile'):
                return Response(
                    {'error': 'User is not a student'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            student = request.user.student_profile
            face_image = get_object_or_404(
                StudentFaceImage, 
                id=image_id, 
                student=student
            )
            
            # If setting as primary, remove primary flag from other images
            if request.data.get('is_primary', False):
                StudentFaceImage.objects.filter(
                    student=student
                ).exclude(id=image_id).update(is_primary=False)
                
                face_image.is_primary = True
                face_image.save()
            
            serializer = StudentFaceImageListSerializer(
                face_image, 
                context={'request': request}
            )
            
            return Response({
                'message': 'Image updated successfully',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Error updating image: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class StudentClassListView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Get available classes for student enrollment"""
        try:
            if not hasattr(request.user, 'student_profile'):
                return Response(
                    {'error': 'User is not a student'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            student = request.user.student_profile
            available_classes = Class.objects.filter(
                batch=student.batch,
                semester=student.semester
            ).exclude(
                enrollments__student=student,
                enrollments__is_active=True
            )
            
            serializer = ClassSerializer(available_classes, many=True)
            
            return Response({
                'available_classes': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Error retrieving classes: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class StudentEnrollmentView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Enroll student in a class"""
        try:
            if not hasattr(request.user, 'student_profile'):
                return Response(
                    {'error': 'User is not a student'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            serializer = StudentEnrollmentSerializer(
                data=request.data, 
                context={'request': request}
            )
            
            if serializer.is_valid():
                student = request.user.student_profile
                class_instance = Class.objects.get(id=serializer.validated_data['class_id'])
                
                enrollment = ClassEnrollment.objects.create(
                    student=student,
                    class_instance=class_instance
                )
                
                return Response({
                    'message': 'Enrolled successfully',
                    'enrollment_id': enrollment.id
                }, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response(
                {'error': f'Error enrolling in class: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def get(self, request):
        """Get student's enrolled classes"""
        try:
            if not hasattr(request.user, 'student_profile'):
                return Response(
                    {'error': 'User is not a student'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            student = request.user.student_profile
            enrollments = ClassEnrollment.objects.filter(
                student=student, 
                is_active=True
            ).select_related('class_instance__course')
            
            enrolled_classes = [enrollment.class_instance for enrollment in enrollments]
            serializer = ClassSerializer(enrolled_classes, many=True)
            
            return Response({
                'enrolled_classes': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Error retrieving enrolled classes: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class StudentAttendanceRecordsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Get all attendance records for the authenticated student"""
        try:
            if not hasattr(request.user, 'student_profile'):
                return Response(
                    {'error': 'User is not a student'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            from attendance.models import AttendanceRecord
            from attendance.serializers import AttendanceRecordSerializer
            
            student = request.user.student_profile
            attendance_records = AttendanceRecord.objects.filter(
                student=student
            ).select_related('session', 'session__class_instance', 'session__class_instance__course').order_by('-session__date')
            
            # Group records by class
            records_by_class = {}
            for record in attendance_records:
                class_id = record.session.class_instance.id
                class_name = record.session.class_instance.course.name
                course_code = record.session.class_instance.course.code
                section = record.session.class_instance.section
                
                if class_id not in records_by_class:
                    records_by_class[class_id] = {
                        'class_id': class_id,
                        'class_name': class_name,
                        'course_code': course_code,
                        'section': section,
                        'total_sessions': 0,
                        'present_count': 0,
                        'absent_count': 0,
                        'attendance_percentage': 0,
                        'records': []
                    }
                
                records_by_class[class_id]['total_sessions'] += 1
                if record.status == 'PRESENT':
                    records_by_class[class_id]['present_count'] += 1
                else:
                    records_by_class[class_id]['absent_count'] += 1
                
                records_by_class[class_id]['records'].append({
                    'id': record.id,
                    'date': record.session.date,
                    'status': record.status,
                    'marked_at': record.marked_at,
                    'confidence_score': record.confidence_score
                })
            
            # Calculate attendance percentage for each class
            for class_data in records_by_class.values():
                if class_data['total_sessions'] > 0:
                    class_data['attendance_percentage'] = round(
                        (class_data['present_count'] / class_data['total_sessions']) * 100, 2
                    )
            
            return Response({
                'total_classes': len(records_by_class),
                'attendance_by_class': list(records_by_class.values())
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Error retrieving attendance records: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class StudentClassAttendanceView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, class_id):
        """Get attendance records for a specific class"""
        try:
            if not hasattr(request.user, 'student_profile'):
                return Response(
                    {'error': 'User is not a student'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            from attendance.models import AttendanceRecord
            from teachers.models import Class, ClassEnrollment
            
            student = request.user.student_profile
            
            # Verify student is enrolled in this class
            try:
                enrollment = ClassEnrollment.objects.get(
                    student=student,
                    class_instance__id=class_id,
                    is_active=True
                )
                class_instance = enrollment.class_instance
            except ClassEnrollment.DoesNotExist:
                return Response(
                    {'error': 'You are not enrolled in this class'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Get attendance records for this class
            attendance_records = AttendanceRecord.objects.filter(
                student=student,
                session__class_instance=class_instance
            ).select_related('session').order_by('-session__date')
            
            records_data = []
            present_count = 0
            total_sessions = attendance_records.count()
            
            for record in attendance_records:
                if record.status == 'PRESENT':
                    present_count += 1
                
                records_data.append({
                    'id': record.id,
                    'date': record.session.date,
                    'status': record.status,
                    'marked_at': record.marked_at,
                    'confidence_score': record.confidence_score,
                    'session_id': record.session.id
                })
            
            attendance_percentage = 0
            if total_sessions > 0:
                attendance_percentage = round((present_count / total_sessions) * 100, 2)
            
            return Response({
                'class_info': {
                    'id': class_instance.id,
                    'course_name': class_instance.course.name,
                    'course_code': class_instance.course.code,
                    'section': class_instance.section,
                    'teacher': class_instance.teacher.user.username
                },
                'attendance_summary': {
                    'total_sessions': total_sessions,
                    'present_count': present_count,
                    'absent_count': total_sessions - present_count,
                    'attendance_percentage': attendance_percentage
                },
                'records': records_data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Error retrieving class attendance: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
