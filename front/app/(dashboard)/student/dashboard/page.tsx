"use client";

import * as React from "react";
import { StatsOverview } from "@/components/student/stats/StatsOverview";
import { QuickActions } from "@/components/student/dashboard/QuickActions";
import { SystemStatus } from "@/components/student/dashboard/SystemStatus";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Info } from "lucide-react";
import {
  getFaceImages,
  getEnrolledClasses,
  getStudentAttendanceRecords,
} from "@/src/services/features/studentService";
import {
  StudentFaceImage,
  Class,
  StudentAttendanceRecordsResponse,
} from "@/src/types/student";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function StudentDashboard() {
  const [faceImages, setFaceImages] = React.useState<StudentFaceImage[]>([]);
  const [enrolledClasses, setEnrolledClasses] = React.useState<Class[]>([]);
  const [attendanceData, setAttendanceData] =
    React.useState<StudentAttendanceRecordsResponse | null>(null);
  const [isLoadingImages, setIsLoadingImages] = React.useState(true);
  const [isLoadingDashboard, setIsLoadingDashboard] = React.useState(true);
  const { toast } = useToast();

  const loadFaceImages = React.useCallback(async () => {
    try {
      setIsLoadingImages(true);
      const response = await getFaceImages();
      setFaceImages(response.images);
    } catch (error) {
      toast({
        title: "Failed to load images",
        description:
          error instanceof Error
            ? error.message
            : "Could not fetch your face images.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingImages(false);
    }
  }, [toast]);

  const loadDashboardData = React.useCallback(async () => {
    try {
      setIsLoadingDashboard(true);

      // Load enrolled classes and attendance data in parallel
      const [classesResponse, attendanceResponse] = await Promise.all([
        getEnrolledClasses(),
        getStudentAttendanceRecords().catch(() => null), // Don't fail if no attendance data
      ]);

      setEnrolledClasses(classesResponse.enrolled_classes);
      setAttendanceData(attendanceResponse);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast({
        title: "Failed to load dashboard data",
        description:
          error instanceof Error
            ? error.message
            : "Could not fetch your dashboard information.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDashboard(false);
    }
  }, [toast]);

  React.useEffect(() => {
    // Load both face images and dashboard data
    Promise.all([loadFaceImages(), loadDashboardData()]);
  }, [loadFaceImages, loadDashboardData]);

  const hasPrimaryImage = faceImages.some((img) => img.is_primary);

  // Calculate attendance statistics
  const totalEnrolledClasses = enrolledClasses.length;
  const totalSessionsAttended = attendanceData
    ? attendanceData.attendance_by_class.reduce(
        (acc, cls) => acc + cls.present_count,
        0
      )
    : 0;
  const totalSessions = attendanceData
    ? attendanceData.attendance_by_class.reduce(
        (acc, cls) => acc + cls.total_sessions,
        0
      )
    : 0;
  const overallAttendanceRate =
    totalSessions > 0
      ? Math.round((totalSessionsAttended / totalSessions) * 100)
      : 0;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to Your Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage your attendance and class enrollments
        </p>
      </div>

      {/* Loading State */}
      {isLoadingImages || isLoadingDashboard ? (
        <div className="flex justify-center p-8">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <StatsOverview
            totalClasses={totalEnrolledClasses}
            attendedClasses={totalSessionsAttended}
            totalSessions={totalSessions}
            attendanceRate={overallAttendanceRate}
            totalImages={faceImages.length}
          />

          {/* Alert for face recognition setup */}
          {!hasPrimaryImage && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Face recognition setup required:</strong> Upload at
                least one clear photo of your face to enable automatic
                attendance tracking.{" "}
                <Button variant="link" asChild className="p-0 h-auto">
                  <Link href="/student/face-images">Set up now</Link>
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Alert for no enrolled classes */}
          {totalEnrolledClasses === 0 && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>No classes enrolled:</strong> You haven't enrolled in
                any classes yet. Enroll in classes to start tracking your
                attendance.{" "}
                <Button variant="link" asChild className="p-0 h-auto">
                  <Link href="/student/classes">Browse classes</Link>
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Quick Action Cards */}
          <QuickActions />

          {/* Recent Activity and Status */}
          <SystemStatus
            imagesCount={faceImages.length}
            hasPrimaryImage={hasPrimaryImage}
          />
        </>
      )}
    </div>
  );
}
