from django.shortcuts import render, get_object_or_404
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import TeacherProfile, Course, Class, ClassEnrollment
from .serializers import (
    TeacherProfileSerializer, CourseSerializer, ClassSerializer, 
    ClassEnrollmentSerializer
)

# Create your views here.

class TeacherProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        try:
            if not hasattr(request.user, 'teacher_profile'):
                return Response(
                    {'error': 'User is not a teacher'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            teacher_profile = request.user.teacher_profile
            serializer = TeacherProfileSerializer(teacher_profile)
            
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
        try:
            if not hasattr(request.user, 'teacher_profile'):
                return Response(
                    {'error': 'User is not a teacher'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            teacher_profile = request.user.teacher_profile
            serializer = TeacherProfileSerializer(teacher_profile, data=request.data)
            
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
        try:
            if not hasattr(request.user, 'teacher_profile'):
                return Response(
                    {'error': 'User is not a teacher'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            teacher_profile = request.user.teacher_profile
            serializer = TeacherProfileSerializer(teacher_profile, data=request.data, partial=True)
            
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

class CourseListView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        try:
            if not hasattr(request.user, 'teacher_profile'):
                return Response(
                    {'error': 'User is not a teacher'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            teacher = request.user.teacher_profile
            courses = Course.objects.filter(department=teacher.department)
            serializer = CourseSerializer(courses, many=True)
            
            return Response({
                'courses': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Error retrieving courses: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def post(self, request):
        try:
            if not hasattr(request.user, 'teacher_profile'):
                return Response(
                    {'error': 'User is not a teacher'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Set department to teacher's department
            data = request.data.copy()
            data['department'] = request.user.teacher_profile.department
            
            serializer = CourseSerializer(data=data)
            
            if serializer.is_valid():
                course = serializer.save()
                return Response({
                    'message': 'Course created successfully',
                    'data': CourseSerializer(course).data
                }, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response(
                {'error': f'Error creating course: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ClassListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        try:
            if not hasattr(request.user, 'teacher_profile'):
                return Response(
                    {'error': 'User is not a teacher'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            teacher = request.user.teacher_profile
            classes = Class.objects.filter(teacher=teacher).order_by('-created_at')
            serializer = ClassSerializer(classes, many=True)
            
            return Response({
                'classes': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Error retrieving classes: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def post(self, request):
        try:
            if not hasattr(request.user, 'teacher_profile'):
                return Response(
                    {'error': 'User is not a teacher'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            serializer = ClassSerializer(data=request.data, context={'request': request})
            
            if serializer.is_valid():
                class_instance = serializer.save()
                return Response({
                    'message': 'Class created successfully',
                    'data': ClassSerializer(class_instance).data
                }, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response(
                {'error': f'Error creating class: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ClassDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, class_id):
        try:
            if not hasattr(request.user, 'teacher_profile'):
                return Response(
                    {'error': 'User is not a teacher'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            teacher = request.user.teacher_profile
            class_instance = get_object_or_404(Class, id=class_id, teacher=teacher)
            serializer = ClassSerializer(class_instance)
            
            return Response({
                'class': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Error retrieving class: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ClassEnrollmentListView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, class_id):
        try:
            if not hasattr(request.user, 'teacher_profile'):
                return Response(
                    {'error': 'User is not a teacher'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            teacher = request.user.teacher_profile
            class_instance = get_object_or_404(Class, id=class_id, teacher=teacher)
            enrollments = ClassEnrollment.objects.filter(
                class_instance=class_instance, 
                is_active=True
            ).order_by('student__roll_number')
            
            serializer = ClassEnrollmentSerializer(enrollments, many=True)
            
            return Response({
                'enrollments': serializer.data,
                'total_enrolled': enrollments.count()
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Error retrieving enrollments: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
