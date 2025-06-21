from django.db import models
from accounts.models import User

class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    roll_number = models.CharField(max_length=20, unique=True)
    department = models.CharField(max_length=100)
    semester = models.PositiveIntegerField()
    batch = models.CharField(max_length=10)
    
    def __str__(self):
        return f"{self.user.username} - {self.roll_number}"