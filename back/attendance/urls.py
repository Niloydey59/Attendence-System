from django.urls import path
from .views import (
    AttendanceSessionView, FaceRecognitionAttendanceView, 
    AttendanceRecordsView, EndAttendanceSessionView
)

urlpatterns = [
    path('sessions/class/<int:class_id>/', AttendanceSessionView.as_view(), name='attendance-session'),
    path('sessions/<int:session_id>/recognize/', FaceRecognitionAttendanceView.as_view(), name='face-recognition'),
    path('sessions/<int:session_id>/records/', AttendanceRecordsView.as_view(), name='attendance-records'),
    path('sessions/<int:session_id>/end/', EndAttendanceSessionView.as_view(), name='end-session'),
]
