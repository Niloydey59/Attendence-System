from rest_framework import serializers
from .models import AttendanceSession, AttendanceRecord
from teachers.models import Class

class AttendanceSessionSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source='class_instance.course.name', read_only=True)
    course_code = serializers.CharField(source='class_instance.course.code', read_only=True)
    section = serializers.CharField(source='class_instance.section', read_only=True)
    total_enrolled = serializers.ReadOnlyField()
    total_present = serializers.ReadOnlyField()
    total_absent = serializers.ReadOnlyField()
    
    class Meta:
        model = AttendanceSession
        fields = [
            'id', 'class_instance', 'class_name', 'course_code', 'section',
            'date', 'is_active', 'total_enrolled', 'total_present', 'total_absent', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

class AttendanceRecordSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.username', read_only=True)
    student_roll = serializers.CharField(source='student.roll_number', read_only=True)
    
    class Meta:
        model = AttendanceRecord
        fields = [
            'id', 'student_name', 'student_roll', 'status', 
            'marked_at', 'confidence_score'
        ]
        read_only_fields = ['id', 'marked_at']

class FaceRecognitionDataSerializer(serializers.Serializer):
    image_data = serializers.CharField()  # Base64 encoded image
    
    def validate_image_data(self, value):
        import base64
        try:
            # Validate base64 format
            base64.b64decode(value)
        except Exception:
            raise serializers.ValidationError("Invalid image data format")
        return value
        return value
