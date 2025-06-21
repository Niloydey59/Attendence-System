from django.db import models
from accounts.models import User
import face_recognition
import numpy as np
from PIL import Image
import io
import base64

class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    roll_number = models.CharField(max_length=20, unique=True)
    department = models.CharField(max_length=100)
    semester = models.PositiveIntegerField()
    batch = models.CharField(max_length=10)
    
    def __str__(self):
        return f"{self.user.username} - {self.roll_number}"

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    student_id = models.CharField(max_length=20, unique=True)

class StudentFaceImage(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='face_images')
    image = models.ImageField(upload_to='student_faces/')
    face_encoding = models.TextField(blank=True, null=True)  # Store face encoding as base64 string
    is_primary = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['student', 'is_primary']  # Only one primary image per student
    
    def save(self, *args, **kwargs):
        if self.image:
            # Process the image and extract face encoding
            self.extract_face_encoding()
        super().save(*args, **kwargs)
    
    def extract_face_encoding(self):
        """Extract face encoding from the uploaded image"""
        try:
            # Open and process the image
            image = Image.open(self.image)
            image_array = np.array(image)
            
            # Find face locations and encodings
            face_locations = face_recognition.face_locations(image_array)
            
            if face_locations:
                # Get the first face encoding
                face_encodings = face_recognition.face_encodings(image_array, face_locations)
                if face_encodings:
                    # Convert numpy array to base64 string for storage
                    encoding_bytes = face_encodings[0].tobytes()
                    self.face_encoding = base64.b64encode(encoding_bytes).decode('utf-8')
            else:
                raise ValueError("No face detected in the image")
                
        except Exception as e:
            raise ValueError(f"Error processing image: {str(e)}")
    
    def get_face_encoding_array(self):
        """Convert stored face encoding back to numpy array"""
        if self.face_encoding:
            encoding_bytes = base64.b64decode(self.face_encoding.encode('utf-8'))
            return np.frombuffer(encoding_bytes, dtype=np.float64)
        return None
    
    def __str__(self):
        return f"{self.student.user.username} - {'Primary' if self.is_primary else 'Secondary'}"