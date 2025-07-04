from django.urls import path
from .views import (
    TeacherProfileView, CourseListView, ClassListCreateView, 
    ClassDetailView, ClassEnrollmentListView
)

urlpatterns = [
    path('profile/', TeacherProfileView.as_view(), name='teacher-profile'),
    path('courses/', CourseListView.as_view(), name='course-list'),
    path('classes/', ClassListCreateView.as_view(), name='class-list-create'),
    path('classes/<int:class_id>/', ClassDetailView.as_view(), name='class-detail'),
    path('classes/<int:class_id>/enrollments/', ClassEnrollmentListView.as_view(), name='class-enrollments'),
]
