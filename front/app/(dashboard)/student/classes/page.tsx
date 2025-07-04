"use client";

import * as React from "react";
import { ClassList } from "@/components/student/classes/ClassList";
import { EnrollmentDialog } from "@/components/student/classes/EnrollmentDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import {
  getAvailableClasses,
  getEnrolledClasses,
  enrollInClass,
} from "@/src/services/features/studentService";
import { Class } from "@/src/types/student";

export default function ClassesPage() {
  const [availableClasses, setAvailableClasses] = React.useState<Class[]>([]);
  const [enrolledClasses, setEnrolledClasses] = React.useState<Class[]>([]);
  const [loadingAvailable, setLoadingAvailable] = React.useState(true);
  const [loadingEnrolled, setLoadingEnrolled] = React.useState(true);
  const [enrollingClass, setEnrollingClass] = React.useState<number | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedClass, setSelectedClass] = React.useState<Class | null>(null);
  const { toast } = useToast();

  const loadClasses = React.useCallback(async () => {
    try {
      setLoadingAvailable(true);
      setLoadingEnrolled(true);

      const [availableRes, enrolledRes] = await Promise.all([
        getAvailableClasses(),
        getEnrolledClasses(),
      ]);

      setAvailableClasses(availableRes.available_classes);
      setEnrolledClasses(enrolledRes.enrolled_classes);
    } catch (error) {
      toast({
        title: "Failed to load classes",
        description:
          error instanceof Error
            ? error.message
            : "Could not fetch class information.",
        variant: "destructive",
      });
    } finally {
      setLoadingAvailable(false);
      setLoadingEnrolled(false);
    }
  }, [toast]);

  React.useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  const handleEnrollClick = (classItem: Class) => {
    setSelectedClass(classItem);
    setDialogOpen(true);
  };

  const handleEnroll = async () => {
    if (!selectedClass) return;

    try {
      setEnrollingClass(selectedClass.id);
      await enrollInClass(selectedClass.id);

      toast({
        title: "Enrolled successfully",
        description: `You are now enrolled in ${selectedClass.course_name}.`,
      });

      setDialogOpen(false);
      loadClasses();
    } catch (error) {
      toast({
        title: "Enrollment failed",
        description:
          error instanceof Error ? error.message : "Failed to enroll in class.",
        variant: "destructive",
      });
    } finally {
      setEnrollingClass(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          My Classes
        </h1>
        <p className="text-muted-foreground">
          Manage your class enrollments and view available courses
        </p>
      </div>

      <Tabs defaultValue="enrolled">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="enrolled">Enrolled Classes</TabsTrigger>
          <TabsTrigger value="available">Available Classes</TabsTrigger>
        </TabsList>

        {/* Enrolled Classes Tab */}
        <TabsContent value="enrolled" className="space-y-4 pt-4">
          {loadingEnrolled ? (
            <div className="flex justify-center p-8">
              <Spinner size="lg" />
            </div>
          ) : (
            <ClassList classes={enrolledClasses} type="enrolled" />
          )}
        </TabsContent>

        {/* Available Classes Tab */}
        <TabsContent value="available" className="space-y-4 pt-4">
          {loadingAvailable ? (
            <div className="flex justify-center p-8">
              <Spinner size="lg" />
            </div>
          ) : (
            <ClassList
              classes={availableClasses}
              type="available"
              onEnroll={handleEnrollClick}
              enrollingClass={enrollingClass}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Enrollment Confirmation Dialog */}
      <EnrollmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedClass={selectedClass}
        onConfirm={handleEnroll}
        isEnrolling={enrollingClass !== null}
      />
    </div>
  );
}
