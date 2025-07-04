from django.db import models
from accounts.models import User

class TeacherProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='teacher_profile')
    employee_id = models.CharField(max_length=20, unique=True)
    department = models.CharField(max_length=100)
    designation = models.CharField(max_length=100)
    
    def __str__(self):
        return f"{self.user.username} - {self.employee_id}"

class Course(models.Model):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=200)
    department = models.CharField(max_length=100)
    semester = models.PositiveIntegerField()
    credits = models.PositiveIntegerField(default=3)
    
    def __str__(self):
        return f"{self.code} - {self.name}"

class Class(models.Model):
    teacher = models.ForeignKey(TeacherProfile, on_delete=models.CASCADE, related_name='classes')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='classes')
    section = models.CharField(max_length=10)
    batch = models.CharField(max_length=10)
    semester = models.PositiveIntegerField()
    academic_year = models.CharField(max_length=10)  # e.g., "2024-25"
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['course', 'section', 'batch', 'academic_year']
    
    def __str__(self):
        return f"{self.course.code} - {self.section} - {self.batch}"
    
    @property
    def enrolled_count(self):
        return self.enrollments.filter(is_active=True).count()

class ClassEnrollment(models.Model):
    student = models.ForeignKey('students.StudentProfile', on_delete=models.CASCADE, related_name='enrollments')
    class_instance = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='enrollments')
    enrolled_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ['student', 'class_instance']
    
    def __str__(self):
        return f"{self.student.user.username} - {self.class_instance}"