from django.db import models
from teachers.models import Class
from students.models import StudentProfile

class AttendanceSession(models.Model):
    class_instance = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='attendance_sessions')
    date = models.DateField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['class_instance', 'date']
    
    def __str__(self):
        return f"{self.class_instance} - {self.date}"
    
    @property
    def total_enrolled(self):
        return self.class_instance.enrollments.filter(is_active=True).count()
    
    @property
    def total_present(self):
        return self.attendance_records.filter(status='PRESENT').count()
    
    @property
    def total_absent(self):
        return self.attendance_records.filter(status='ABSENT').count()

class AttendanceRecord(models.Model):
    STATUS_CHOICES = [
        ('PRESENT', 'Present'),
        ('ABSENT', 'Absent'),
    ]
    
    session = models.ForeignKey(AttendanceSession, on_delete=models.CASCADE, related_name='attendance_records')
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='attendance_records')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='ABSENT')
    marked_at = models.DateTimeField(auto_now_add=True)
    confidence_score = models.FloatField(null=True, blank=True)  # Face recognition confidence
    
    class Meta:
        unique_together = ['session', 'student']
    
    def __str__(self):
        return f"{self.student.user.username} - {self.session.date} - {self.status}"
    
    def __str__(self):
        return f"{self.student.user.username} - {self.session.date} - {self.status}"
