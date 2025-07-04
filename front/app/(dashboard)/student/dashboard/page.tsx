"use client";

import * as React from "react";
import { StatsOverview } from "@/components/student/stats/StatsOverview";
import { QuickActions } from "@/components/student/dashboard/QuickActions";
import { SystemStatus } from "@/components/student/dashboard/SystemStatus";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { getFaceImages } from "@/src/services/features/studentService";
import { StudentFaceImage } from "@/src/types/student";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function StudentDashboard() {
  const [faceImages, setFaceImages] = React.useState<StudentFaceImage[]>([]);
  const [isLoadingImages, setIsLoadingImages] = React.useState(true);
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

  React.useEffect(() => {
    loadFaceImages();
  }, [loadFaceImages]);

  const hasPrimaryImage = faceImages.some((img) => img.is_primary);

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

      {/* Stats Overview */}
      <StatsOverview
        totalClasses={0}
        attendedClasses={0}
        totalImages={faceImages.length}
      />

      {/* Alert for face recognition setup */}
      {!hasPrimaryImage && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Face recognition setup required:</strong> Upload at least
            one clear photo of your face to enable automatic attendance
            tracking.{" "}
            <Button variant="link" asChild className="p-0 h-auto">
              <Link href="/student/face-images">Set up now</Link>
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
    </div>
  );
}
