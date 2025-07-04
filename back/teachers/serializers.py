from rest_framework import serializers
from .models import TeacherProfile, Course, Class, ClassEnrollment
from students.models import StudentProfile

class TeacherProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = TeacherProfile
        fields = ['id', 'username', 'email', 'employee_id', 'department', 'designation']
        read_only_fields = ['id', 'username', 'email']

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'code', 'name', 'department', 'semester', 'credits']

class ClassSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    course_id = serializers.IntegerField(write_only=True)
    enrolled_count = serializers.ReadOnlyField()
    teacher_name = serializers.CharField(source='teacher.user.username', read_only=True)
    
    class Meta:
        model = Class
        fields = [
            'id', 'course', 'course_id', 'section', 'batch', 'semester', 
            'academic_year', 'enrolled_count', 'teacher_name', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'enrolled_count', 'teacher_name']
    
    def validate(self, data):
        # Validate that teacher can only create classes for their department
        teacher = self.context['request'].user.teacher_profile
        course = Course.objects.get(id=data['course_id'])
        
        if course.department != teacher.department:
            raise serializers.ValidationError("You can only create classes for your department")
        
        return data
    
    def create(self, validated_data):
        teacher = self.context['request'].user.teacher_profile
        validated_data['teacher'] = teacher
        return super().create(validated_data)

class ClassEnrollmentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.username', read_only=True)
    student_roll = serializers.CharField(source='student.roll_number', read_only=True)
    class_name = serializers.CharField(source='class_instance.course.name', read_only=True)
    
    class Meta:
        model = ClassEnrollment
        fields = [
            'id', 'student_name', 'student_roll', 'class_name', 
            'enrolled_at', 'is_active'
        ]
        read_only_fields = ['id', 'enrolled_at']

class StudentEnrollmentSerializer(serializers.Serializer):
    class_id = serializers.IntegerField()
    
    def validate_class_id(self, value):
        try:
            class_instance = Class.objects.get(id=value)
        except Class.DoesNotExist:
            raise serializers.ValidationError("Class does not exist")
        
        # Validate student can enroll based on batch and semester
        student = self.context['request'].user.student_profile
        
        if class_instance.batch != student.batch:
            raise serializers.ValidationError("You can only enroll in classes for your batch")
        
        if class_instance.semester != student.semester:
            raise serializers.ValidationError("You can only enroll in classes for your semester")
        
        # Check if already enrolled
        if ClassEnrollment.objects.filter(
            student=student, 
            class_instance=class_instance, 
            is_active=True
        ).exists():
            raise serializers.ValidationError("You are already enrolled in this class")
        
        return value
        if class_instance.enrolled_count >= class_instance.max_students:
            raise serializers.ValidationError("Class is full")
        
        return value
