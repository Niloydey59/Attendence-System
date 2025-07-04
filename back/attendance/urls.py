from django.urls import path
from .views import (
    AttendanceSessionView, FaceRecognitionAttendanceView, 
    AttendanceRecordsView, EndAttendanceSessionView,
    DeleteAttendanceSessionView, DeleteAllAttendanceSessionsView,
    DeleteAttendanceRecordView, GetAllAttendanceSessionsView
)

urlpatterns = [
    path('sessions/class/<int:class_id>/', AttendanceSessionView.as_view(), name='attendance-session'),
    path('sessions/class/<int:class_id>/all/', GetAllAttendanceSessionsView.as_view(), name='get-all-sessions'),
    path('sessions/class/<int:class_id>/delete-all/', DeleteAllAttendanceSessionsView.as_view(), name='delete-all-sessions'),
    path('sessions/<int:session_id>/recognize/', FaceRecognitionAttendanceView.as_view(), name='face-recognition'),
    path('sessions/<int:session_id>/records/', AttendanceRecordsView.as_view(), name='attendance-records'),
    path('sessions/<int:session_id>/end/', EndAttendanceSessionView.as_view(), name='end-session'),
    path('sessions/<int:session_id>/delete/', DeleteAttendanceSessionView.as_view(), name='delete-session'),
    path('records/<int:record_id>/delete/', DeleteAttendanceRecordView.as_view(), name='delete-record'),
]
