from rest_framework import serializers
from .models import Student, StudentFaceImage
from django.core.files.uploadedfile import InMemoryUploadedFile
import face_recognition
import numpy as np
from PIL import Image

class StudentFaceImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentFaceImage
        fields = ['id', 'image', 'is_primary', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']
    
    def validate_image(self, value):
        """Validate that the uploaded image contains a detectable face"""
        if not value:
            raise serializers.ValidationError("No image provided")
        
        # Check file size (limit to 5MB)
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("Image file too large. Maximum size is 5MB.")
        
        # Check file type
        if not value.content_type.startswith('image/'):
            raise serializers.ValidationError("File must be an image.")
        
        try:
            # Open and process the image to check for faces
            image = Image.open(value)
            image_array = np.array(image)
            
            # Find face locations
            face_locations = face_recognition.face_locations(image_array)
            
            if not face_locations:
                raise serializers.ValidationError("No face detected in the image. Please upload a clear image with your face visible.")
            
            if len(face_locations) > 1:
                raise serializers.ValidationError("Multiple faces detected. Please upload an image with only your face.")
                
        except Exception as e:
            if isinstance(e, serializers.ValidationError):
                raise e
            raise serializers.ValidationError(f"Error processing image: {str(e)}")
        
        # Reset file pointer
        value.seek(0)
        return value
    
    def create(self, validated_data):
        # Get the student from the request user
        student = self.context['request'].user.student
        validated_data['student'] = student
        
        # If this is set as primary, remove primary flag from other images
        if validated_data.get('is_primary', False):
            StudentFaceImage.objects.filter(student=student, is_primary=True).update(is_primary=False)
        
        return super().create(validated_data)

class StudentFaceImageListSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = StudentFaceImage
        fields = ['id', 'image_url', 'is_primary', 'uploaded_at']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        return None