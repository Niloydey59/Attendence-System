import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Info } from "lucide-react";

interface SystemStatusProps {
  imagesCount: number;
  hasPrimaryImage: boolean;
}

export function SystemStatus({
  imagesCount,
  hasPrimaryImage,
}: SystemStatusProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Face Recognition
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
            <Badge variant="outline">{imagesCount}/3</Badge>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Recognition Status
            </span>
            <Badge variant={hasPrimaryImage ? "default" : "destructive"}>
              {hasPrimaryImage ? "Ready" : "Setup Required"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Tips for Best Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="space-y-2">
            <p>• Upload clear face images in good lighting</p>
            <p>• Attend classes regularly to maintain good records</p>
            <p>• Enroll in all your relevant courses</p>
            <p>• Update your profile information if it changes</p>
            <p>• Check attendance records periodically for accuracy</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
