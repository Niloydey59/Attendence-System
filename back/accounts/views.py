from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .serializers import UserRegistrationSerializer, UserLoginSerializer

from students.models import StudentProfile
from teachers.models import TeacherProfile

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Create profile based on role
            if user.role == 'STUDENT':
                StudentProfile.objects.create(
                    user=user,
                    roll_number=request.data.get('roll_number', ''),
                    department=request.data.get('department', ''),
                    semester=request.data.get('semester', 1),
                    batch=request.data.get('batch', '')
                )
            elif user.role == 'TEACHER':
                TeacherProfile.objects.create(
                    user=user,
                    employee_id=request.data.get('employee_id', ''),
                    department=request.data.get('department', ''),
                    designation=request.data.get('designation', '')
                )
                
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.pk,
                'role': user.role
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password']
            )
            if user:
                token, created = Token.objects.get_or_create(user=user)
                return Response({
                    'token': token.key,
                    'user_id': user.pk,
                    'role': user.role
                })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)