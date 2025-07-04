# Facial Recognition Attendance System API Documentation

## Overview
This is a Django REST API for a facial recognition-based attendance system. The system supports two types of users: Students and Teachers. Students can upload face images and enroll in classes, while teachers can create classes and conduct attendance sessions using facial recognition.

## Base URL
```
http://localhost:8000/api/
```

## Authentication
All endpoints (except registration and login) require authentication using Token-based authentication.

**Header Format:**
```
Authorization: Token <your_token_here>
```

---

## 1. Authentication Endpoints

### 1.1 Register User
**Endpoint:** `POST /accounts/register/`

**Description:** Register a new user (student or teacher)

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "STUDENT",  // or "TEACHER"
  
  // For Students
  "roll_number": "CSE2021001",
  "department": "Computer Science",
  "semester": 5,
  "batch": "2021"
  
  // For Teachers
  "employee_id": "EMP001",
  "department": "Computer Science",
  "designation": "Assistant Professor"
}
```

**Response:**
```json
{
  "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b",
  "user_id": 1,
  "role": "STUDENT"
}
```

### 1.2 Login User
**Endpoint:** `POST /accounts/login/`

**Description:** Login existing user

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b",
  "user_id": 1,
  "role": "STUDENT"
}
```

---

## 2. Student Endpoints

### 2.1 Get Student Profile
**Endpoint:** `GET /students/profile/`

**Description:** Get authenticated student's profile information

**Response:**
```json
{
  "message": "Profile data retrieved successfully",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "roll_number": "CSE2021001",
    "department": "Computer Science",
    "semester": 5,
    "batch": "2021"
  }
}
```

### 2.2 Update Student Profile
**Endpoint:** `PUT /students/profile/` or `PATCH /students/profile/`

**Description:** Update student profile (PUT for full update, PATCH for partial)

**Request Body:**
```json
{
  "roll_number": "CSE2021001",
  "department": "Computer Science",
  "semester": 6,
  "batch": "2021"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "roll_number": "CSE2021001",
    "department": "Computer Science",
    "semester": 6,
    "batch": "2021"
  }
}
```

### 2.3 Upload Face Image
**Endpoint:** `POST /students/face-images/`

**Description:** Upload a face image for facial recognition (max 3 images per student)

**Request Body:** (multipart/form-data)
```
image: <image_file>
is_primary: true  // optional, boolean
```

**Response:**
```json
{
  "message": "Face image uploaded successfully",
  "data": {
    "id": 1,
    "image_url": "http://localhost:8000/media/student_faces/image.jpg",
    "is_primary": true,
    "uploaded_at": "2024-01-15T10:30:00Z"
  }
}
```

### 2.4 Get Face Images
**Endpoint:** `GET /students/face-images/`

**Description:** Get all uploaded face images for the student

**Response:**
```json
{
  "count": 2,
  "images": [
    {
      "id": 1,
      "image_url": "http://localhost:8000/media/student_faces/image1.jpg",
      "is_primary": true,
      "uploaded_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "image_url": "http://localhost:8000/media/student_faces/image2.jpg",
      "is_primary": false,
      "uploaded_at": "2024-01-15T11:00:00Z"
    }
  ]
}
```

### 2.5 Delete Face Image
**Endpoint:** `DELETE /students/face-images/<image_id>/`

**Description:** Delete a specific face image

**Response:**
```json
{
  "message": "Face image deleted successfully"
}
```

### 2.6 Update Face Image
**Endpoint:** `PATCH /students/face-images/<image_id>/`

**Description:** Update face image properties (e.g., set as primary)

**Request Body:**
```json
{
  "is_primary": true
}
```

**Response:**
```json
{
  "message": "Image updated successfully",
  "data": {
    "id": 1,
    "image_url": "http://localhost:8000/media/student_faces/image.jpg",
    "is_primary": true,
    "uploaded_at": "2024-01-15T10:30:00Z"
  }
}
```

### 2.7 Get Available Classes
**Endpoint:** `GET /students/classes/`

**Description:** Get classes available for enrollment (matching student's batch and semester)

**Response:**
```json
{
  "available_classes": [
    {
      "id": 1,
      "course": {
        "id": 1,
        "code": "CSE301",
        "name": "Database Systems",
        "department": "Computer Science",
        "semester": 5,
        "credits": 3
      },
      "section": "A",
      "batch": "2021",
      "semester": 5,
      "academic_year": "2024-25",
      "enrolled_count": 45,
      "teacher_name": "prof_smith",
      "created_at": "2024-01-15T09:00:00Z"
    }
  ]
}
```

### 2.8 Enroll in Class
**Endpoint:** `POST /students/enrollments/`

**Description:** Enroll student in a class

**Request Body:**
```json
{
  "class_id": 1
}
```

**Response:**
```json
{
  "message": "Enrolled successfully",
  "enrollment_id": 1
}
```

### 2.9 Get Enrolled Classes
**Endpoint:** `GET /students/enrollments/`

**Description:** Get student's enrolled classes

**Response:**
```json
{
  "enrolled_classes": [
    {
      "id": 1,
      "course": {
        "id": 1,
        "code": "CSE301",
        "name": "Database Systems",
        "department": "Computer Science",
        "semester": 5,
        "credits": 3
      },
      "section": "A",
      "batch": "2021",
      "semester": 5,
      "academic_year": "2024-25",
      "enrolled_count": 46,
      "teacher_name": "prof_smith",
      "created_at": "2024-01-15T09:00:00Z"
    }
  ]
}
```

---

## 3. Teacher Endpoints

### 3.1 Get Teacher Profile
**Endpoint:** `GET /teachers/profile/`

**Description:** Get authenticated teacher's profile information

**Response:**
```json
{
  "message": "Profile data retrieved successfully",
  "data": {
    "id": 1,
    "username": "prof_smith",
    "email": "smith@example.com",
    "employee_id": "EMP001",
    "department": "Computer Science",
    "designation": "Assistant Professor"
  }
}
```

### 3.2 Update Teacher Profile
**Endpoint:** `PUT /teachers/profile/` or `PATCH /teachers/profile/`

**Description:** Update teacher profile (PUT for full update, PATCH for partial)

**Request Body:**
```json
{
  "employee_id": "EMP001",
  "department": "Computer Science",
  "designation": "Associate Professor"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "username": "prof_smith",
    "email": "smith@example.com",
    "employee_id": "EMP001",
    "department": "Computer Science",
    "designation": "Associate Professor"
  }
}
```

### 3.3 Get Courses
**Endpoint:** `GET /teachers/courses/`

**Description:** Get courses available in teacher's department

**Response:**
```json
{
  "courses": [
    {
      "id": 1,
      "code": "CSE301",
      "name": "Database Systems",
      "department": "Computer Science",
      "semester": 5,
      "credits": 3
    },
    {
      "id": 2,
      "code": "CSE302",
      "name": "Software Engineering",
      "department": "Computer Science",
      "semester": 5,
      "credits": 3
    }
  ]
}
```

### 3.4 Create Course
**Endpoint:** `POST /teachers/courses/`

**Description:** Create a new course in teacher's department

**Request Body:**
```json
{
  "code": "CSE303",
  "name": "Computer Networks",
  "semester": 6,
  "credits": 3
}
```

**Note:** The department is automatically set to the teacher's department.

**Response:**
```json
{
  "message": "Course created successfully",
  "data": {
    "id": 3,
    "code": "CSE303",
    "name": "Computer Networks",
    "department": "Computer Science",
    "semester": 6,
    "credits": 3
  }
}
```

### 3.5 Get Teacher's Classes
**Endpoint:** `GET /teachers/classes/`

**Description:** Get all classes created by the teacher

**Response:**
```json
{
  "classes": [
    {
      "id": 1,
      "course": {
        "id": 1,
        "code": "CSE301",
        "name": "Database Systems",
        "department": "Computer Science",
        "semester": 5,
        "credits": 3
      },
      "section": "A",
      "batch": "2021",
      "semester": 5,
      "academic_year": "2024-25",
      "enrolled_count": 46,
      "teacher_name": "prof_smith",
      "created_at": "2024-01-15T09:00:00Z"
    }
  ]
}
```

### 3.6 Create Class
**Endpoint:** `POST /teachers/classes/`

**Description:** Create a new class

**Request Body:**
```json
{
  "course_id": 1,
  "section": "A",
  "batch": "2021",
  "semester": 5,
  "academic_year": "2024-25"
}
```

**Response:**
```json
{
  "message": "Class created successfully",
  "data": {
    "id": 1,
    "course": {
      "id": 1,
      "code": "CSE301",
      "name": "Database Systems",
      "department": "Computer Science",
      "semester": 5,
      "credits": 3
    },
    "section": "A",
    "batch": "2021",
    "semester": 5,
    "academic_year": "2024-25",
    "enrolled_count": 0,
    "teacher_name": "prof_smith",
    "created_at": "2024-01-15T09:00:00Z"
  }
}
```

### 3.7 Get Class Details
**Endpoint:** `GET /teachers/classes/<class_id>/`

**Description:** Get details of a specific class

**Response:**
```json
{
  "class": {
    "id": 1,
    "course": {
      "id": 1,
      "code": "CSE301",
      "name": "Database Systems",
      "department": "Computer Science",
      "semester": 5,
      "credits": 3
    },
    "section": "A",
    "batch": "2021",
    "semester": 5,
    "academic_year": "2024-25",
    "enrolled_count": 46,
    "teacher_name": "prof_smith",
    "created_at": "2024-01-15T09:00:00Z"
  }
}
```

### 3.8 Get Class Enrollments
**Endpoint:** `GET /teachers/classes/<class_id>/enrollments/`

**Description:** Get all students enrolled in a specific class

**Response:**
```json
{
  "enrollments": [
    {
      "id": 1,
      "student_name": "john_doe",
      "student_roll": "CSE2021001",
      "class_name": "Database Systems",
      "enrolled_at": "2024-01-15T10:00:00Z",
      "is_active": true
    }
  ],
  "total_enrolled": 1
}
```

---

## 4. Attendance Endpoints

### 4.1 Start Attendance Session
**Endpoint:** `POST /attendance/sessions/class/<class_id>/`

**Description:** Start a new attendance session for a class (one per day)

**Response:**
```json
{
  "message": "Attendance session started",
  "session": {
    "id": 1,
    "class_instance": 1,
    "class_name": "Database Systems",
    "course_code": "CSE301",
    "section": "A",
    "date": "2024-01-15",
    "is_active": true,
    "total_enrolled": 46,
    "total_present": 0,
    "total_absent": 46,
    "created_at": "2024-01-15T14:00:00Z"
  }
}
```

### 4.2 Get Today's Attendance Session
**Endpoint:** `GET /attendance/sessions/class/<class_id>/`

**Description:** Get today's attendance session for a class

**Response:**
```json
{
  "session": {
    "id": 1,
    "class_instance": 1,
    "class_name": "Database Systems",
    "course_code": "CSE301",
    "section": "A",
    "date": "2024-01-15",
    "is_active": true,
    "total_enrolled": 46,
    "total_present": 12,
    "total_absent": 34,
    "created_at": "2024-01-15T14:00:00Z"
  }
}
```

### 4.3 Process Face Recognition
**Endpoint:** `POST /attendance/sessions/<session_id>/recognize/`

**Description:** Process webcam image for face recognition and mark attendance

**Request Body:**
```json
{
  "image_data": "base64_encoded_image_string"
}
```

**Response:**
```json
{
  "message": "Processed 3 faces, recognized 2 students",
  "recognized_students": [
    {
      "student_id": 1,
      "student_name": "john_doe",
      "roll_number": "CSE2021001",
      "confidence": 0.85
    },
    {
      "student_id": 2,
      "student_name": "jane_smith",
      "roll_number": "CSE2021002",
      "confidence": 0.92
    }
  ]
}
```

### 4.4 Get Attendance Records
**Endpoint:** `GET /attendance/sessions/<session_id>/records/`

**Description:** Get all attendance records for a session

**Response:**
```json
{
  "session": {
    "id": 1,
    "class_instance": 1,
    "class_name": "Database Systems",
    "course_code": "CSE301",
    "section": "A",
    "date": "2024-01-15",
    "is_active": true,
    "total_enrolled": 46,
    "total_present": 12,
    "total_absent": 34,
    "created_at": "2024-01-15T14:00:00Z"
  },
  "records": [
    {
      "id": 1,
      "student_name": "john_doe",
      "student_roll": "CSE2021001",
      "status": "PRESENT",
      "marked_at": "2024-01-15T14:15:00Z",
      "confidence_score": 0.85
    },
    {
      "id": 2,
      "student_name": "jane_smith",
      "student_roll": "CSE2021002",
      "status": "ABSENT",
      "marked_at": "2024-01-15T14:00:00Z",
      "confidence_score": null
    }
  ]
}
```

### 4.5 End Attendance Session
**Endpoint:** `PATCH /attendance/sessions/<session_id>/end/`

**Description:** End an active attendance session

**Response:**
```json
{
  "message": "Attendance session ended",
  "session": {
    "id": 1,
    "class_instance": 1,
    "class_name": "Database Systems",
    "course_code": "CSE301",
    "section": "A",
    "date": "2024-01-15",
    "is_active": false,
    "total_enrolled": 46,
    "total_present": 12,
    "total_absent": 34,
    "created_at": "2024-01-15T14:00:00Z"
  }
}
```

---

## Error Handling

All endpoints return appropriate HTTP status codes and error messages:

### Common Error Responses:

**401 Unauthorized:**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

**403 Forbidden:**
```json
{
  "error": "User is not a teacher"
}
```

**404 Not Found:**
```json
{
  "message": "No attendance session found for today"
}
```

**400 Bad Request:**
```json
{
  "error": "Maximum 3 face images allowed per student"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Error starting session: <error_message>"
}
```

---

## Workflow Examples

### Student Workflow:
1. Register as student → `POST /accounts/register/`
2. Login → `POST /accounts/login/`
3. Upload face images → `POST /students/face-images/`
4. View available classes → `GET /students/classes/`
5. Enroll in classes → `POST /students/enrollments/`

### Teacher Workflow:
1. Register as teacher → `POST /accounts/register/`
2. Login → `POST /accounts/login/`
3. Create courses → `POST /teachers/courses/`
4. View courses → `GET /teachers/courses/`
5. Create class → `POST /teachers/classes/`
6. Start attendance session → `POST /attendance/sessions/class/<class_id>/`
7. Process webcam images → `POST /attendance/sessions/<session_id>/recognize/`
8. View attendance records → `GET /attendance/sessions/<session_id>/records/`
9. End session → `PATCH /attendance/sessions/<session_id>/end/`

---

## Notes

1. **Face Recognition:** Images should be clear with single face visible for best results
2. **File Uploads:** Face images should be in standard image formats (JPG, PNG)
3. **Base64 Encoding:** For webcam images, encode the image as base64 string
4. **Attendance Logic:** Students default to ABSENT and are marked PRESENT when face is recognized
5. **Session Limits:** Only one attendance session per class per day
6. **Image Limits:** Maximum 3 face images per student

## Dependencies

- Django REST Framework
- face_recognition library
- PIL (Python Imaging Library)
- numpy

Make sure your frontend handles file uploads for face images and base64 encoding for webcam captures.
