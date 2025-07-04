"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BookOpen, Users, Calendar, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CourseCreate } from "./CourseCreate";
import { ClassCreate } from "./ClassCreate";
import Link from "next/link";
import {
  getCourses,
  getTeacherClasses,
} from "@/src/services/features/teacherService";
import { Course, Class } from "@/src/types/teacher";

export function CourseList() {
  const [activeTab, setActiveTab] = useState("courses");
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isCoursesLoading, setIsCoursesLoading] = useState(true);
  const [isClassesLoading, setIsClassesLoading] = useState(true);
  const [isCoursesError, setIsCoursesError] = useState(false);
  const [isClassesError, setIsClassesError] = useState(false);
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false);
  const { toast } = useToast();

  // Function to fetch courses
  const fetchCourses = async () => {
    setIsCoursesLoading(true);
    setIsCoursesError(false);
    try {
      const response = await getCourses();
      setCourses(response.courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setIsCoursesError(true);
      toast({
        title: "Error",
        description: "Failed to fetch courses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCoursesLoading(false);
    }
  };

  // Function to fetch classes
  const fetchClasses = async () => {
    setIsClassesLoading(true);
    setIsClassesError(false);
    try {
      const response = await getTeacherClasses();
      setClasses(response.classes);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setIsClassesError(true);
      toast({
        title: "Error",
        description: "Failed to fetch classes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsClassesLoading(false);
    }
  };

  // Initial data fetching
  useEffect(() => {
    fetchCourses();
    fetchClasses();
  }, []);

  // Handle successful course creation
  const handleCourseCreated = (newCourse: Course) => {
    setCourses((prev) => [...prev, newCourse]);
    setIsCreateCourseOpen(false);
    toast({
      title: "Success",
      description: "Course created successfully!",
    });
  };

  // Handle successful class creation
  const handleClassCreated = (newClass: Class) => {
    setClasses((prev) => [...prev, newClass]);
    setIsCreateClassOpen(false);
    toast({
      title: "Success",
      description: "Class created successfully!",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Courses & Classes</h1>
          <p className="text-muted-foreground">
            Manage your courses and class sections
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <div className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchCourses}
              disabled={isCoursesLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${
                  isCoursesLoading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </Button>
            <Dialog
              open={isCreateCourseOpen}
              onOpenChange={setIsCreateCourseOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
              </DialogTrigger>
              <DialogContent>
                <CourseCreate onSuccess={handleCourseCreated} />
              </DialogContent>
            </Dialog>
          </div>

          {isCoursesLoading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner size="lg" />
            </div>
          ) : isCoursesError ? (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">Failed to load courses</p>
              <Button variant="outline" onClick={fetchCourses}>
                Try Again
              </Button>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No courses found</p>
              <Dialog
                open={isCreateCourseOpen}
                onOpenChange={setIsCreateCourseOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Course
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <CourseCreate onSuccess={handleCourseCreated} />
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{course.code}</CardTitle>
                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <CardDescription>{course.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Department:</span>
                        <span>{course.department || "N/A"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Semester:</span>
                        <Badge variant="secondary">{course.semester}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Credits:</span>
                        <span>{course.credits}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Classes:</span>
                        <span>
                          {
                            classes.filter((cls) => cls.course_id === course.id)
                              .length
                          }
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setActiveTab("classes");
                        }}
                      >
                        View Classes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <div className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchClasses}
              disabled={isClassesLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${
                  isClassesLoading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </Button>
            <Dialog
              open={isCreateClassOpen}
              onOpenChange={setIsCreateClassOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Class
                </Button>
              </DialogTrigger>
              <DialogContent>
                <ClassCreate onSuccess={handleClassCreated} courses={courses} />
              </DialogContent>
            </Dialog>
          </div>

          {isClassesLoading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner size="lg" />
            </div>
          ) : isClassesError ? (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">Failed to load classes</p>
              <Button variant="outline" onClick={fetchClasses}>
                Try Again
              </Button>
            </div>
          ) : classes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No classes found</p>
              {courses.length > 0 ? (
                <Dialog
                  open={isCreateClassOpen}
                  onOpenChange={setIsCreateClassOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Class
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <ClassCreate
                      onSuccess={handleClassCreated}
                      courses={courses}
                    />
                  </DialogContent>
                </Dialog>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    You need to create a course first
                  </p>
                  <Dialog
                    open={isCreateCourseOpen}
                    onOpenChange={setIsCreateCourseOpen}
                  >
                    <DialogTrigger asChild>
                      <Button>Create Course</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <CourseCreate onSuccess={handleCourseCreated} />
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {classes.map((classItem) => (
                <Card key={classItem.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">
                          {classItem.course
                            ? `${classItem.course.code} - ${classItem.course.name}`
                            : "Unknown Course"}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Section {classItem.section}
                          </span>
                          <span>Batch {classItem.batch}</span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {classItem.enrolled_count || 0} enrolled
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/teacher/enrollments`}>
                          <Button variant="outline" size="sm">
                            View Enrollments
                          </Button>
                        </Link>
                        <Link href={`/teacher/attendance`}>
                          <Button size="sm">Take Attendance</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CourseList;
