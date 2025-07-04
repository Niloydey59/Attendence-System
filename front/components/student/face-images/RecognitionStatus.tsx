import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Info } from "lucide-react";

interface RecognitionStatusProps {
  imagesCount: number;
  hasPrimaryImage: boolean;
}

export function RecognitionStatus({
  imagesCount,
  hasPrimaryImage,
}: RecognitionStatusProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recognition Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
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
            <span className="text-sm text-muted-foreground">Primary Image</span>
            <Badge variant={hasPrimaryImage ? "default" : "destructive"}>
              {hasPrimaryImage ? "Set" : "Not Set"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-4 w-4" />
            Image Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="space-y-2">
            <p>• Use good lighting when taking photos</p>
            <p>• Face the camera directly</p>
            <p>• Avoid wearing sunglasses or hats</p>
            <p>• Upload multiple angles for better accuracy</p>
            <p>• Keep your expression neutral</p>
            <p>• Each image should contain only your face</p>
            <p>• Set your best photo as the primary image</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
