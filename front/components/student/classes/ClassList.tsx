import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  User,
  Clock,
  School,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { Class } from "@/src/types/student";

interface ClassListProps {
  classes: Class[];
  type: "enrolled" | "available";
  onEnroll?: (classItem: Class) => void;
  enrollingClass?: number | null;
}

export function ClassList({
  classes,
  type,
  onEnroll,
  enrollingClass,
}: ClassListProps) {
  if (classes.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-6">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">
              {type === "enrolled"
                ? "No enrolled classes"
                : "No available classes"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {type === "enrolled"
                ? "You're not enrolled in any classes yet. Check the available classes tab to enroll."
                : "There are no available classes for your batch and semester at the moment."}
            </p>
            {type === "enrolled" && (
              <Button
                variant="outline"
                onClick={() =>
                  document.querySelector('[data-value="available"]')?.click()
                }
              >
                Browse Available Classes
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {classes.map((classItem) => (
        <Card
          key={classItem.id}
          className={type === "enrolled" ? "overflow-hidden" : ""}
        >
          <CardHeader className={type === "enrolled" ? "bg-muted/50 pb-4" : ""}>
            {type === "enrolled" && (
              <Badge className="w-fit mb-2">Enrolled</Badge>
            )}
            <CardTitle>{classItem.course_name}</CardTitle>
            <CardDescription>{classItem.course_id}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Teacher</p>
                <p className="text-sm font-medium flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {classItem.teacher_name}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Schedule</p>
                <p className="text-sm font-medium flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {classItem.schedule || "Not specified"}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Room</p>
                <p className="text-sm font-medium flex items-center gap-1">
                  <School className="h-3 w-3" />
                  {classItem.room_number || "Not specified"}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Semester</p>
                <p className="text-sm font-medium flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" />
                  {classItem.semester}
                </p>
              </div>
            </div>

            {type === "enrolled" ? (
              <Button variant="outline" className="w-full" asChild>
                <a href={`/student/attendance?class=${classItem.id}`}>
                  View Attendance
                  <ArrowRight className="h-3 w-3 ml-2" />
                </a>
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() => onEnroll && onEnroll(classItem)}
                disabled={enrollingClass === classItem.id}
              >
                {enrollingClass === classItem.id ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    Enrolling...
                  </>
                ) : (
                  <>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                    >
                      <path
                        d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Enroll
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
