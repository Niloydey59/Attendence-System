from django.urls import path
from .views import (
    StudentFaceImageUploadView, StudentFaceImageDetailView, StudentProfileView, 
    StudentClassListView, StudentEnrollmentView, StudentAttendanceRecordsView, 
    StudentClassAttendanceView
)

urlpatterns = [
    path('profile/', StudentProfileView.as_view(), name='student-profile'),
    path('face-images/', StudentFaceImageUploadView.as_view(), name='student-face-images'),
    path('face-images/<int:image_id>/', StudentFaceImageDetailView.as_view(), name='student-face-image-detail'),
    path('classes/', StudentClassListView.as_view(), name='student-available-classes'),
    path('enrollments/', StudentEnrollmentView.as_view(), name='student-enrollments'),
    path('attendance/', StudentAttendanceRecordsView.as_view(), name='student-attendance-records'),
    path('attendance/class/<int:class_id>/', StudentClassAttendanceView.as_view(), name='student-class-attendance'),
]