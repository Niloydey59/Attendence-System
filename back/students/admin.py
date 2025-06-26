from django.contrib import admin

from .models import StudentProfile, StudentFaceImage

# Register your models here.
admin.site.register(StudentProfile)
admin.site.register(StudentFaceImage)