"use client";

import * as React from "react";
import { FaceImageUpload } from "@/components/student/face-images/FaceImageUpload";
import { FaceImageGallery } from "@/components/student/face-images/FaceImageGallery";
import { RecognitionStatus } from "@/components/student/face-images/RecognitionStatus";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera, Info, UserCheck } from "lucide-react";
import { getFaceImages } from "@/src/services/features/studentService";
import { StudentFaceImage } from "@/src/types/student";
import { useToast } from "@/hooks/use-toast";

export default function FaceImagesPage() {
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

  const handleImageUpdate = () => {
    loadFaceImages();
  };

  const maxImagesReached = faceImages.length >= 3;
  const hasImages = faceImages.length > 0;
  const hasPrimaryImage = faceImages.some((img) => img.is_primary);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <UserCheck className="h-6 w-6" />
          Face Recognition
        </h1>
        <p className="text-muted-foreground">
          Manage your face images for attendance recognition
        </p>
      </div>

      {/* Alert for face recognition setup */}
      {!hasImages && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Face recognition setup required:</strong> Upload at least
            one clear photo of your face to enable automatic attendance
            tracking. For best results, upload 2-3 images with different angles.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
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

        {/* Sidebar Info */}
        <div className="space-y-6">
          <RecognitionStatus
            imagesCount={faceImages.length}
            hasPrimaryImage={hasPrimaryImage}
          />
        </div>
      </div>
    </div>
  );
}
