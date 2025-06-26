from django.urls import path
from .views import StudentFaceImageUploadView, StudentFaceImageDetailView, StudentProfileView

urlpatterns = [
    path('profile/', StudentProfileView.as_view(), name='student-profile'),
    path('face-images/', StudentFaceImageUploadView.as_view(), name='student-face-images'),
    path('face-images/<int:image_id>/', StudentFaceImageDetailView.as_view(), name='student-face-image-detail'),
]