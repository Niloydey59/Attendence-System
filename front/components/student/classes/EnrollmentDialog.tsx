import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Info, Loader2 } from "lucide-react";
import { Class } from "@/src/types/student";

interface EnrollmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedClass: Class | null;
  onConfirm: () => void;
  isEnrolling: boolean;
}

export function EnrollmentDialog({
  open,
  onOpenChange,
  selectedClass,
  onConfirm,
  isEnrolling,
}: EnrollmentDialogProps) {
  if (!selectedClass) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Enrollment</DialogTitle>
          <DialogDescription>
            You are about to enroll in the following class:
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">{selectedClass.course_name}</p>
            <p className="text-xs text-muted-foreground">
              {selectedClass.course_id}
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Teacher</p>
              <p className="text-sm">{selectedClass.teacher_name}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Semester</p>
              <p className="text-sm">{selectedClass.semester}</p>
            </div>
          </div>

          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              By enrolling in this class, you agree to participate in attendance
              tracking.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isEnrolling}>
            {isEnrolling ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Enrolling...
              </>
            ) : (
              "Confirm Enrollment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
