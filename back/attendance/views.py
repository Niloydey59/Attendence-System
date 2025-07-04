from django.shortcuts import render
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import date
import base64
import numpy as np
import face_recognition
from PIL import Image
import io

from .models import AttendanceSession, AttendanceRecord
from .serializers import AttendanceSessionSerializer, AttendanceRecordSerializer, FaceRecognitionDataSerializer
from teachers.models import Class, ClassEnrollment
from students.models import StudentFaceImage

class AttendanceSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, class_id):
        """Start a new attendance session"""
        try:
            if not hasattr(request.user, 'teacher_profile'):
                return Response(
                    {'error': 'User is not a teacher'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            teacher = request.user.teacher_profile
            class_instance = get_object_or_404(Class, id=class_id, teacher=teacher)
            
            # Check if session already exists for today
            today = date.today()
            existing_session = AttendanceSession.objects.filter(
                class_instance=class_instance,
                date=today
            ).first()
            
            if existing_session:
                return Response({
                    'message': 'Attendance session already exists for today',
                    'session': AttendanceSessionSerializer(existing_session).data
                }, status=status.HTTP_200_OK)
            
            # Create new session - remove start_time parameter
            session = AttendanceSession.objects.create(
                class_instance=class_instance,
                date=today
            )
            
            # Initialize attendance records for all enrolled students
            enrollments = ClassEnrollment.objects.filter(
                class_instance=class_instance,
                is_active=True
            )
            
            for enrollment in enrollments:
                AttendanceRecord.objects.create(
                    session=session,
                    student=enrollment.student,
                    status='ABSENT'  # Default to absent
                )
            
            return Response({
                'message': 'Attendance session started',
                'session': AttendanceSessionSerializer(session).data
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'error': f'Error starting session: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def get(self, request, class_id):
        """Get today's attendance session"""
        try:
            if not hasattr(request.user, 'teacher_profile'):
                return Response(
                    {'error': 'User is not a teacher'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            teacher = request.user.teacher_profile
            class_instance = get_object_or_404(Class, id=class_id, teacher=teacher)
            
            today = date.today()
            session = AttendanceSession.objects.filter(
                class_instance=class_instance,
                date=today
            ).first()
            
            if not session:
                return Response({
                    'message': 'No attendance session found for today'
                }, status=status.HTTP_404_NOT_FOUND)
            
            return Response({
                'session': AttendanceSessionSerializer(session).data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Error retrieving session: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class FaceRecognitionAttendanceView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, session_id):
        """Process face recognition for attendance"""
        try:
            if not hasattr(request.user, 'teacher_profile'):
                return Response(
                    {'error': 'User is not a teacher'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            teacher = request.user.teacher_profile
            session = get_object_or_404(
                AttendanceSession, 
                id=session_id, 
                class_instance__teacher=teacher,
                is_active=True
            )
            
            serializer = FaceRecognitionDataSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            # Decode image
            image_data = serializer.validated_data['image_data']
            image_bytes = base64.b64decode(image_data)
            image = Image.open(io.BytesIO(image_bytes))
            image_array = np.array(image)
            
            # Find faces in the image
            face_locations = face_recognition.face_locations(image_array)
            face_encodings = face_recognition.face_encodings(image_array, face_locations)
            
            if not face_encodings:
                return Response({
                    'message': 'No faces detected in the image',
                    'recognized_students': []
                }, status=status.HTTP_200_OK)
            
            # Get enrolled students with face images
            enrolled_students = ClassEnrollment.objects.filter(
                class_instance=session.class_instance,
                is_active=True
            ).select_related('student')
            
            recognized_students = []
            
            for face_encoding in face_encodings:
                best_match = None
                best_distance = float('inf')
                
                for enrollment in enrolled_students:
                    student = enrollment.student
                    face_images = StudentFaceImage.objects.filter(student=student)
                    
                    for face_image in face_images:
                        stored_encoding = face_image.get_face_encoding_array()
                        if stored_encoding is not None:
                            distance = face_recognition.face_distance([stored_encoding], face_encoding)[0]
                            
                            if distance < 0.5 and distance < best_distance:  # Threshold for recognition
                                best_match = student
                                best_distance = distance
                
                if best_match:
                    # Mark student as present
                    attendance_record = AttendanceRecord.objects.get(
                        session=session,
                        student=best_match
                    )
                    attendance_record.status = 'PRESENT'
                    attendance_record.confidence_score = 1 - best_distance
                    attendance_record.marked_at = timezone.now()
                    attendance_record.save()
                    
                    recognized_students.append({
                        'student_id': best_match.id,
                        'student_name': best_match.user.username,
                        'roll_number': best_match.roll_number,
                        'confidence': 1 - best_distance
                    })
            
            return Response({
                'message': f'Processed {len(face_encodings)} faces, recognized {len(recognized_students)} students',
                'recognized_students': recognized_students
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Error processing faces: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AttendanceRecordsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, session_id):
        """Get attendance records for a session"""
        try:
            if not hasattr(request.user, 'teacher_profile'):
                return Response(
                    {'error': 'User is not a teacher'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            teacher = request.user.teacher_profile
            session = get_object_or_404(
                AttendanceSession, 
                id=session_id, 
                class_instance__teacher=teacher
            )
            
            records = AttendanceRecord.objects.filter(session=session).order_by('student__roll_number')
            serializer = AttendanceRecordSerializer(records, many=True)
            
            return Response({
                'session': AttendanceSessionSerializer(session).data,
                'records': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Error retrieving records: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class EndAttendanceSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def patch(self, request, session_id):
        """End attendance session"""
        try:
            if not hasattr(request.user, 'teacher_profile'):
                return Response(
                    {'error': 'User is not a teacher'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            teacher = request.user.teacher_profile
            session = get_object_or_404(
                AttendanceSession, 
                id=session_id, 
                class_instance__teacher=teacher,
                is_active=True
            )
            
            # Remove end_time parameter since it might not exist in model
            session.is_active = False
            session.save()
            
            return Response({
                'message': 'Attendance session ended',
                'session': AttendanceSessionSerializer(session).data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Error ending session: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class DeleteAttendanceSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request, session_id):
        """Delete an attendance session and all its records"""
        try:
            if not hasattr(request.user, 'teacher_profile'):
                return Response(
                    {'error': 'User is not a teacher'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            teacher = request.user.teacher_profile
            session = get_object_or_404(
                AttendanceSession, 
                id=session_id, 
                class_instance__teacher=teacher
            )
            
            session_info = {
                'id': session.id,
                'class_name': session.class_instance.course.name,
                'date': session.date,
                'records_deleted': session.attendance_records.count()
            }
            
            session.delete()
            
            return Response({
                'message': 'Attendance session deleted successfully',
                'deleted_session': session_info
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Error deleting session: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class DeleteAllAttendanceSessionsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request, class_id):
        """Delete all attendance sessions for a class"""
        try:
            if not hasattr(request.user, 'teacher_profile'):
                return Response(
                    {'error': 'User is not a teacher'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            teacher = request.user.teacher_profile
            class_instance = get_object_or_404(Class, id=class_id, teacher=teacher)
            
            sessions = AttendanceSession.objects.filter(class_instance=class_instance)
            sessions_count = sessions.count()
            records_count = AttendanceRecord.objects.filter(session__class_instance=class_instance).count()
            
            sessions.delete()
            
            return Response({
                'message': f'All attendance sessions deleted for class {class_instance.course.name}',
                'sessions_deleted': sessions_count,
                'records_deleted': records_count
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Error deleting sessions: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class DeleteAttendanceRecordView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request, record_id):
        """Delete a specific attendance record"""
        try:
            if not hasattr(request.user, 'teacher_profile'):
                return Response(
                    {'error': 'User is not a teacher'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            teacher = request.user.teacher_profile
            record = get_object_or_404(
                AttendanceRecord, 
                id=record_id,
                session__class_instance__teacher=teacher
            )
            
            record_info = {
                'id': record.id,
                'student_name': record.student.user.username,
                'student_roll': record.student.roll_number,
                'status': record.status,
                'session_date': record.session.date
            }
            
            record.delete()
            
            return Response({
                'message': 'Attendance record deleted successfully',
                'deleted_record': record_info
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Error deleting record: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class GetAllAttendanceSessionsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, class_id):
        """Get all attendance sessions for a class"""
        try:
            if not hasattr(request.user, 'teacher_profile'):
                return Response(
                    {'error': 'User is not a teacher'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            teacher = request.user.teacher_profile
            class_instance = get_object_or_404(Class, id=class_id, teacher=teacher)
            
            sessions = AttendanceSession.objects.filter(
                class_instance=class_instance
            ).order_by('-date')
            
            serializer = AttendanceSessionSerializer(sessions, many=True)
            
            return Response({
                'class_name': class_instance.course.name,
                'total_sessions': sessions.count(),
                'sessions': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Error retrieving sessions: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
