"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Users, Calendar, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getCourses } from "@/src/services/features/teacherService";
import { getTeacherClasses } from "@/src/services/features/teacherService";
import { Course, Class } from "@/src/types/teacher";

export function DashboardOverview() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch courses and classes concurrently
        const [coursesResponse, classesResponse] = await Promise.all([
          getCourses(),
          getTeacherClasses(),
        ]);

        setCourses(coursesResponse.courses);
        setClasses(classesResponse.classes);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  // Calculate statistics from real data
  const calculateStats = () => {
    const totalCourses = courses.length;
    const totalClasses = classes.length;
    const totalStudents = classes.reduce(
      (sum, cls) => sum + cls.enrolled_count,
      0
    );

    // Calculate average enrollment percentage as attendance rate placeholder
    const avgEnrollmentRate =
      classes.length > 0
        ? Math.round(((totalStudents / classes.length) * 100) / 50) // Assuming max 50 students per class
        : 0;

    return {
      totalCourses,
      totalClasses,
      totalStudents,
      avgEnrollmentRate: Math.min(avgEnrollmentRate, 100),
    };
  };

  const stats = calculateStats();

  const statsCards = [
    {
      title: "Total Courses",
      value: loading ? "..." : stats.totalCourses.toString(),
      description: "Active courses this semester",
      icon: BookOpen,
      trend:
        courses.length > 0 ? `${courses.length} courses` : "No courses yet",
    },
    {
      title: "Total Classes",
      value: loading ? "..." : stats.totalClasses.toString(),
      description: "Classes across all courses",
      icon: Users,
      trend:
        classes.length > 0
          ? `${classes.length} active classes`
          : "No classes yet",
    },
    {
      title: "Students Enrolled",
      value: loading ? "..." : stats.totalStudents.toString(),
      description: "Total enrolled students",
      icon: Calendar,
      trend:
        stats.totalStudents > 0
          ? `Across ${stats.totalClasses} classes`
          : "No enrollments yet",
    },
    {
      title: "Avg. Class Size",
      value: loading
        ? "..."
        : stats.totalClasses > 0
        ? Math.round(stats.totalStudents / stats.totalClasses).toString()
        : "0",
      description: "Average students per class",
      icon: TrendingUp,
      trend:
        stats.totalClasses > 0
          ? `${stats.totalClasses} classes total`
          : "No data available",
    },
  ];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "courses":
        router.push("/teacher/courses");
        break;
      case "attendance":
        router.push("/teacher/attendance");
        break;
      case "records":
        router.push("/teacher/records");
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your teaching activities.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">{stat.trend}</p>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleQuickAction("courses")}
        >
          <CardHeader>
            <CardTitle className="text-lg">Manage Courses & Classes</CardTitle>
            <CardDescription>
              Create and manage your courses and classes
            </CardDescription>
          </CardHeader>
        </Card>

        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleQuickAction("attendance")}
        >
          <CardHeader>
            <CardTitle className="text-lg">Take Attendance</CardTitle>
            <CardDescription>
              Start a new attendance session using facial recognition
            </CardDescription>
          </CardHeader>
        </Card>

        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleQuickAction("records")}
        >
          <CardHeader>
            <CardTitle className="text-lg">View Records</CardTitle>
            <CardDescription>
              Check attendance records and analytics
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Current Courses Overview */}
      {!loading && courses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Courses</CardTitle>
            <CardDescription>
              Currently teaching {courses.length} course
              {courses.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {courses.slice(0, 4).map((course) => (
                <div key={course.id} className="p-4 border rounded-lg">
                  <h4 className="font-medium">{course.code}</h4>
                  <p className="text-sm text-muted-foreground">{course.name}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-blue-600">
                      {course.credits} credits
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Semester {course.semester}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {courses.length > 4 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  and {courses.length - 4} more courses...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Active Classes Overview */}
      {!loading && classes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Classes</CardTitle>
            <CardDescription>
              Managing {classes.length} class
              {classes.length !== 1 ? "es" : ""} this semester
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classes.slice(0, 5).map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">
                      {cls.course.code} - Section {cls.section}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {cls.course.name} • Batch {cls.batch}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {cls.enrolled_count} students
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {cls.academic_year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {classes.length > 5 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  and {classes.length - 5} more classes...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && courses.length === 0 && classes.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Create your first course and class to begin teaching
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                You haven't created any courses yet. Start by creating your
                first course.
              </p>
              <button
                onClick={() => handleQuickAction("courses")}
                className="text-primary hover:underline"
              >
                Create your first course &rarr;
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
