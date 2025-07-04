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
            
            # If this is the first image, make it primary by default
            if existing_images_count == 0:
                request.data['is_primary'] = True
            
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
