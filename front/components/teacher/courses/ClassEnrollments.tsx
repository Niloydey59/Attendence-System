"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  getTeacherClasses,
  getClassEnrollments,
} from "@/src/services/features/teacherService";
import { formatDate } from "@/src/utils/dateFormatter";
import { Class, ClassEnrollment } from "@/src/types/teacher";

interface ClassEnrollmentsProps {
  classId?: number;
}

export function ClassEnrollments({ classId }: ClassEnrollmentsProps) {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(
    classId || null
  );
  const [enrollments, setEnrollments] = useState<ClassEnrollment[]>([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState<
    ClassEnrollment[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isClassesLoading, setIsClassesLoading] = useState(true);
  const [isEnrollmentsLoading, setIsEnrollmentsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { toast } = useToast();

  // Fetch classes
  const fetchClasses = async () => {
    setIsClassesLoading(true);
    setIsError(false);
    try {
      const response = await getTeacherClasses();
      setClasses(response.classes);

      // If no class is selected yet but we have classes, select the first one
      if (!selectedClassId && response.classes.length > 0) {
        setSelectedClassId(response.classes[0].id);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      setIsError(true);
      toast({
        title: "Error",
        description: "Failed to fetch classes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsClassesLoading(false);
    }
  };

  // Fetch enrollments for a selected class
  const fetchEnrollments = async (classId: number) => {
    setIsEnrollmentsLoading(true);
    setIsError(false);
    try {
      const response = await getClassEnrollments(classId);
      setEnrollments(response.enrollments);
      setFilteredEnrollments(response.enrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      setIsError(true);
      toast({
        title: "Error",
        description: "Failed to fetch enrollments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnrollmentsLoading(false);
    }
  };

  // Initial data loading
  useEffect(() => {
    fetchClasses();
  }, []);

  // When selected class changes, fetch enrollments
  useEffect(() => {
    if (selectedClassId) {
      fetchEnrollments(selectedClassId);
    } else {
      setEnrollments([]);
      setFilteredEnrollments([]);
    }
  }, [selectedClassId]);

  // Filter enrollments based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredEnrollments(enrollments);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = enrollments.filter(
      (enrollment) =>
        enrollment.student_name.toLowerCase().includes(query) ||
        enrollment.student_roll.toLowerCase().includes(query)
    );
    setFilteredEnrollments(filtered);
  }, [searchQuery, enrollments]);

  // Handle class change
  const handleClassChange = (classId: string) => {
    setSelectedClassId(parseInt(classId));
  };

  // Get selected class name for display
  const getSelectedClassName = () => {
    if (!selectedClassId) return "No class selected";

    const selectedClass = classes.find((c) => c.id === selectedClassId);
    if (!selectedClass) return "Unknown class";

    return `${selectedClass.course?.code || "Unknown"} - ${
      selectedClass.course?.name || "Course"
    } - Section ${selectedClass.section}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Class Enrollments</h1>
        <p className="text-muted-foreground">
          View and manage student enrollments in your classes
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Student Enrollments
              </CardTitle>
              <CardDescription>
                {isClassesLoading
                  ? "Loading classes..."
                  : classes.length === 0
                  ? "No classes available"
                  : "Select a class to view enrolled students"}
              </CardDescription>
            </div>
            {selectedClassId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  selectedClassId && fetchEnrollments(selectedClassId)
                }
                disabled={isEnrollmentsLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${
                    isEnrollmentsLoading ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Select
              value={selectedClassId?.toString() || ""}
              onValueChange={handleClassChange}
              disabled={isClassesLoading || classes.length === 0}
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((classItem) => (
                  <SelectItem
                    key={classItem.id}
                    value={classItem.id.toString()}
                  >
                    {classItem.course?.code || "Unknown"} - {classItem.section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={!selectedClassId || isEnrollmentsLoading}
              />
            </div>
          </div>

          {isClassesLoading ? (
            <div className="flex justify-center items-center py-8">
              <Spinner size="md" />
            </div>
          ) : classes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No classes available. Create a class first.
              </p>
            </div>
          ) : !selectedClassId ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Please select a class to view enrollments
              </p>
            </div>
          ) : isEnrollmentsLoading ? (
            <div className="flex justify-center items-center py-8">
              <Spinner size="md" />
            </div>
          ) : isError ? (
            <div className="text-center py-8">
              <p className="text-destructive mb-4">
                Failed to load enrollments
              </p>
              <Button
                variant="outline"
                onClick={() =>
                  selectedClassId && fetchEnrollments(selectedClassId)
                }
              >
                Try Again
              </Button>
            </div>
          ) : filteredEnrollments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No students match your search criteria"
                  : "No students enrolled in this class"}
              </p>
            </div>
          ) : (
            <>
              <div className="bg-muted/40 p-2 rounded-md mb-2">
                <p className="text-sm font-medium">{getSelectedClassName()}</p>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Enrolled Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEnrollments.map((enrollment) => (
                    <TableRow key={enrollment.id}>
                      <TableCell className="font-medium">
                        {enrollment.student_name}
                      </TableCell>
                      <TableCell>{enrollment.student_roll}</TableCell>
                      <TableCell>
                        {formatDate(enrollment.enrolled_at)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            enrollment.is_active ? "default" : "secondary"
                          }
                        >
                          {enrollment.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ClassEnrollments;
