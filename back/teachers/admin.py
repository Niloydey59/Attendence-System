from django.contrib import admin

from .models import TeacherProfile, Course, Class, ClassEnrollment

admin.site.register(TeacherProfile)
admin.site.register(Course)
admin.site.register(Class)
admin.site.register(ClassEnrollment)