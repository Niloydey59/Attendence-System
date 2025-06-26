"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { FaceImageUpload } from "@/components/dashboard/face-image-upload";
import { FaceImageGallery } from "@/components/dashboard/face-image-gallery";
import { StudentProfileCard } from "@/components/dashboard/student-profile-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Info, Calendar, Camera } from "lucide-react";
import {
  getFaceImages,
  getStudentProfile,
  partialUpdateStudentProfile,
} from "@/src/services/features/studentService";
import {
  StudentFaceImage,
  StudentProfile,
  StudentProfileUpdateRequest,
} from "@/src/types/student";
import { useToast } from "@/hooks/use-toast";

export default function StudentDashboard() {
  const [faceImages, setFaceImages] = React.useState<StudentFaceImage[]>([]);
  const [profile, setProfile] = React.useState<StudentProfile | null>(null);
  const [isLoadingImages, setIsLoadingImages] = React.useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = React.useState(true);
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

  const loadProfile = React.useCallback(async () => {
    try {
      setIsLoadingProfile(true);
      const response = await getStudentProfile();
      setProfile(response.data);
    } catch (error) {
      toast({
        title: "Failed to load profile",
        description:
          error instanceof Error
            ? error.message
            : "Could not fetch your profile information.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingProfile(false);
    }
  }, [toast]);

  React.useEffect(() => {
    loadFaceImages();
    loadProfile();
  }, [loadFaceImages, loadProfile]);

  const handleImageUpdate = () => {
    loadFaceImages();
  };

  const handleProfileUpdate = async (data: StudentProfileUpdateRequest) => {
    const response = await partialUpdateStudentProfile(data);
    setProfile(response.data);
  };

  const maxImagesReached = faceImages.length >= 3;
  const hasImages = faceImages.length > 0;
  const hasPrimaryImage = faceImages.some((img) => img.is_primary);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to Your Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your attendance profile and face recognition settings.
          </p>
        </div>

        {/* Profile Section */}
        <StudentProfileCard
          profile={profile}
          isLoading={isLoadingProfile}
          onUpdateProfile={handleProfileUpdate}
        />

        {/* Stats Overview */}
        <StatsOverview
          totalClasses={0}
          attendedClasses={0}
          totalImages={faceImages.length}
        />

        {/* Alert for face recognition setup */}
        {!hasImages && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Face recognition setup required:</strong> Upload at least
              one clear photo of your face to enable automatic attendance
              tracking. For best results, upload 2-3 images with different
              angles.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Face Image Management */}
          <div className="xl:col-span-2 space-y-6">
            {/* Face Image Gallery */}
            <FaceImageGallery
              images={faceImages}
              isLoading={isLoadingImages}
              onImageUpdate={handleImageUpdate}
            />

            {/* Upload Section */}
            {!maxImagesReached && (
              <FaceImageUpload
                onUploadSuccess={handleImageUpdate}
                disabled={maxImagesReached}
              />
            )}

            {maxImagesReached && (
              <Alert>
                <Camera className="h-4 w-4" />
                <AlertDescription>
                  You have reached the maximum limit of 3 face images. Delete an
                  existing image to upload a new one.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Recognition Status
                  </span>
                  <Badge variant={hasPrimaryImage ? "default" : "secondary"}>
                    {hasPrimaryImage ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Images Uploaded
                  </span>
                  <Badge variant="outline">{faceImages.length}/3</Badge>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Primary Image
                  </span>
                  <Badge variant={hasPrimaryImage ? "default" : "destructive"}>
                    {hasPrimaryImage ? "Set" : "Not Set"}
                  </Badge>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Profile Status
                  </span>
                  <Badge variant={profile ? "default" : "secondary"}>
                    {profile ? "Complete" : "Loading"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Tips for Best Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="space-y-2">
                  <p>• Use good lighting when taking photos</p>
                  <p>• Face the camera directly</p>
                  <p>• Avoid wearing sunglasses or hats</p>
                  <p>• Upload multiple angles for better accuracy</p>
                  <p>• Keep your expression neutral</p>
                  <p>• Ensure your profile information is up to date</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No recent attendance activity
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
