import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clipboard, ShieldAlert } from "lucide-react";

export function ProfileGuidelines() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clipboard className="h-4 w-4" />
            Profile Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="space-y-2">
            <p>• Keep your profile information up to date</p>
            <p>• Ensure your roll number is correctly entered</p>
            <p>• Your batch and semester affect available classes</p>
            <p>• Department information helps with class filtering</p>
            <p>• Profile data is used for attendance records</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            Privacy Notice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Your profile data is used only for attendance tracking purposes
            within the educational institution. Face images and personal details
            are securely stored and not shared with third parties.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
