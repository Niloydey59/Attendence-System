"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, RefreshCw } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { getTeacherClasses } from "@/src/services/features/teacherService";
import { Class } from "@/src/types/teacher";

interface ClassListProps {
  courseId?: number;
}

export function ClassList({ courseId }: ClassListProps) {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { toast } = useToast();

  const fetchClasses = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await getTeacherClasses();
      // If courseId is provided, filter classes for that course
      const filteredClasses = courseId
        ? response.classes.filter((cls) => cls.course_id === courseId)
        : response.classes;
      setClasses(filteredClasses);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setIsError(true);
      toast({
        title: "Error",
        description: "Failed to fetch classes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">Failed to load classes</p>
        <Button variant="outline" onClick={fetchClasses}>
          Try Again
        </Button>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No classes found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={fetchClasses}
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {classes.map((classItem) => (
          <Card key={classItem.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold">
                    {classItem.course
                      ? `${classItem.course.code} - ${classItem.course.name}`
                      : "Unknown Course"}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Section {classItem.section}
                    </span>
                    <span>Batch {classItem.batch}</span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {classItem.enrolled_count || 0} enrolled
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/teacher/classes/${classItem.id}/enrollments`}>
                    <Button variant="outline" size="sm">
                      View Enrollments
                    </Button>
                  </Link>
                  <Link href={`/teacher/classes/${classItem.id}/attendance`}>
                    <Button size="sm">Take Attendance</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ClassList;
