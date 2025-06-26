"use client";

import * as React from "react";
import { Star, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { StudentFaceImage } from "@/src/types/student";
import {
  deleteFaceImage,
  setPrimaryImage,
} from "@/src/services/features/studentService";
import { formatDate } from "@/src/utils/dateFormatter";
import { cn } from "@/lib/utils";

interface FaceImageGalleryProps {
  images: StudentFaceImage[];
  isLoading: boolean;
  onImageUpdate: () => void;
}

export function FaceImageGallery({
  images,
  isLoading,
  onImageUpdate,
}: FaceImageGalleryProps) {
  const [loadingActions, setLoadingActions] = React.useState<
    Record<number, string>
  >({});
  const { toast } = useToast();

  const handleSetPrimary = async (imageId: number) => {
    setLoadingActions((prev) => ({ ...prev, [imageId]: "primary" }));

    try {
      await setPrimaryImage(imageId);
      toast({
        title: "Primary image updated",
        description: "This image is now your primary face image.",
      });
      onImageUpdate();
    } catch (error) {
      toast({
        title: "Failed to update",
        description:
          error instanceof Error ? error.message : "Failed to set as primary.",
        variant: "destructive",
      });
    } finally {
      setLoadingActions((prev) => {
        const newState = { ...prev };
        delete newState[imageId];
        return newState;
      });
    }
  };

  const handleDelete = async (imageId: number) => {
    setLoadingActions((prev) => ({ ...prev, [imageId]: "delete" }));

    try {
      await deleteFaceImage(imageId);
      toast({
        title: "Image deleted",
        description: "The face image has been removed.",
      });
      onImageUpdate();
    } catch (error) {
      toast({
        title: "Failed to delete",
        description:
          error instanceof Error ? error.message : "Failed to delete image.",
        variant: "destructive",
      });
    } finally {
      setLoadingActions((prev) => {
        const newState = { ...prev };
        delete newState[imageId];
        return newState;
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Your Face Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Your Face Images
          <Badge variant="secondary" className="ml-auto">
            {images.length}/3
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {images.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">No face images uploaded</h3>
            <p className="text-sm text-muted-foreground">
              Upload your first face image to enable attendance recognition.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image.id} className="space-y-3">
                <div className="relative group">
                  <img
                    src={image.image_url}
                    alt="Face"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  {image.is_primary && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-yellow-500 text-yellow-900">
                        <Star className="h-3 w-3 mr-1" />
                        Primary
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Uploaded {formatDate(image.uploaded_at)}
                  </p>

                  <div className="flex gap-2">
                    {!image.is_primary && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleSetPrimary(image.id)}
                        disabled={loadingActions[image.id] === "primary"}
                      >
                        {loadingActions[image.id] === "primary" ? (
                          <>
                            <Star className="h-3 w-3 mr-1 animate-spin" />
                            Setting...
                          </>
                        ) : (
                          <>
                            <Star className="h-3 w-3 mr-1" />
                            Set Primary
                          </>
                        )}
                      </Button>
                    )}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className={cn(image.is_primary ? "flex-1" : "px-3")}
                          disabled={loadingActions[image.id] === "delete"}
                        >
                          {loadingActions[image.id] === "delete" ? (
                            <Trash2 className="h-3 w-3 animate-pulse" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Face Image</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this face image?
                            This action cannot be undone.
                            {image.is_primary &&
                              " Another image will be set as primary automatically."}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(image.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
