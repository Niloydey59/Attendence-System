"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Check,
  X,
  BarChart,
  TrendingUp,
  Users,
  BookOpen,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Progress } from "@/components/ui/progress";
import {
  getEnrolledClasses,
  getStudentAttendanceRecords,
  getStudentClassAttendance,
} from "@/src/services/features/studentService";
import {
  Class,
  StudentAttendanceRecordsResponse,
  StudentClassAttendanceResponse,
  StudentClassAttendanceData,
} from "@/src/types/student";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatTime } from "@/src/utils/dateFormatter";

export default function AttendancePage() {
  const [classes, setClasses] = React.useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = React.useState<string>("");
  const [allAttendanceData, setAllAttendanceData] =
    React.useState<StudentAttendanceRecordsResponse | null>(null);
  const [classAttendanceData, setClassAttendanceData] =
    React.useState<StudentClassAttendanceResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [loadingClassData, setLoadingClassData] = React.useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();

  // Load enrolled classes and overall attendance data
  React.useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);

        // Load both classes and overall attendance data
        const [classesResponse, attendanceResponse] = await Promise.all([
          getEnrolledClasses(),
          getStudentAttendanceRecords(),
        ]);

        setClasses(classesResponse.enrolled_classes);
        setAllAttendanceData(attendanceResponse);

        // Set default selected class from URL or first class
        const classParam = searchParams.get("class");
        if (
          classParam &&
          classesResponse.enrolled_classes.some(
            (c) => c.id.toString() === classParam
          )
        ) {
          setSelectedClassId(classParam);
        } else if (classesResponse.enrolled_classes.length > 0) {
          setSelectedClassId(classesResponse.enrolled_classes[0].id.toString());
        }
      } catch (error) {
        console.error("Error loading attendance data:", error);
        toast({
          title: "Failed to load attendance data",
          description:
            error instanceof Error
              ? error.message
              : "Could not fetch attendance information.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, [searchParams, toast]);

  // Load specific class attendance data when class is selected
  React.useEffect(() => {
    async function loadClassAttendance() {
      if (!selectedClassId) {
        setClassAttendanceData(null);
        return;
      }

      try {
        setLoadingClassData(true);
        const response = await getStudentClassAttendance(
          parseInt(selectedClassId)
        );
        setClassAttendanceData(response);
      } catch (error) {
        console.error("Error loading class attendance:", error);
        toast({
          title: "Failed to load class attendance",
          description:
            error instanceof Error
              ? error.message
              : "Could not fetch class attendance data.",
          variant: "destructive",
        });
      } finally {
        setLoadingClassData(false);
      }
    }

    loadClassAttendance();
  }, [selectedClassId, toast]);

  // Get current class data from overall attendance data
  const getCurrentClassData = (): StudentClassAttendanceData | null => {
    if (!allAttendanceData || !selectedClassId) return null;

    return (
      allAttendanceData.attendance_by_class.find(
        (classData) => classData.class_id.toString() === selectedClassId
      ) || null
    );
  };

  const currentClassOverview = getCurrentClassData();
  const currentCourseName =
    classes.find((c) => c.id.toString() === selectedClassId)?.course?.name ||
    classes.find((c) => c.id.toString() === selectedClassId)?.course_name;

  // Statistics Cards Component
  const AttendanceStatsCards = ({
    data,
  }: {
    data: StudentClassAttendanceData;
  }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Total Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.total_sessions}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-600">
            <Check className="h-4 w-4" />
            Present
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {data.present_count}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-red-600">
            <X className="h-4 w-4" />
            Absent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {data.absent_count}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Percentage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.attendance_percentage}%
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Attendance Summary Component
  const AttendanceSummary = ({
    data,
  }: {
    data: StudentClassAttendanceData;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          Attendance Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Attendance Rate</span>
            <span className="font-medium">{data.attendance_percentage}%</span>
          </div>
          <Progress value={data.attendance_percentage} className="h-2" />
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">
            Breakdown by Status
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm">Present</span>
              </div>
              <span className="text-sm font-medium">
                {data.total_sessions > 0
                  ? Math.round((data.present_count / data.total_sessions) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm">Absent</span>
              </div>
              <span className="text-sm font-medium">
                {data.total_sessions > 0
                  ? Math.round((data.absent_count / data.total_sessions) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Attendance Records Table Component
  const AttendanceRecordsTable = () => {
    if (loadingClassData) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center p-8">
              <Spinner size="md" />
            </div>
          </CardContent>
        </Card>
      );
    }

    if (!classAttendanceData || classAttendanceData.records.length === 0) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-medium mb-2">No attendance records found</h3>
              <p className="text-sm text-muted-foreground">
                There are no attendance records yet for this class.
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
          {classAttendanceData.class_info && (
            <p className="text-sm text-muted-foreground">
              {classAttendanceData.class_info.course_code} -{" "}
              {classAttendanceData.class_info.course_name}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>
                Your attendance records for {currentCourseName}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Time Marked
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Confidence
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classAttendanceData.records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {formatDate(record.date)}
                    </TableCell>
                    <TableCell>
                      {record.status === "PRESENT" ? (
                        <Badge
                          variant="default"
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <Check className="h-3 w-3 mr-1" /> Present
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <X className="h-3 w-3 mr-1" /> Absent
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {record.marked_at ? formatTime(record.marked_at) : "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {record.confidence_score
                        ? `${Math.round(record.confidence_score * 100)}%`
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Overall Statistics Component
  const OverallStatistics = () => {
    if (
      !allAttendanceData ||
      allAttendanceData.attendance_by_class.length === 0
    ) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-medium mb-2">No attendance data available</h3>
              <p className="text-sm text-muted-foreground">
                You don't have attendance records yet.
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Overall Attendance Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">
                  {allAttendanceData.total_classes}
                </div>
                <div className="text-sm text-muted-foreground">
                  Enrolled Classes
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {allAttendanceData.attendance_by_class.reduce(
                    (acc, cls) => acc + cls.present_count,
                    0
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Present
                </div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {allAttendanceData.attendance_by_class.reduce(
                    (acc, cls) => acc + cls.absent_count,
                    0
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Absent
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Class-wise Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allAttendanceData.attendance_by_class.map((classData) => (
                <div key={classData.class_id} className="p-4 border rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{classData.class_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {classData.course_code} - Section {classData.section}
                      </p>
                    </div>
                    <div className="text-right mt-2 sm:mt-0">
                      <div className="text-lg font-bold">
                        {classData.attendance_percentage}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {classData.present_count}/{classData.total_sessions}{" "}
                        present
                      </div>
                    </div>
                  </div>
                  <Progress
                    value={classData.attendance_percentage}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          Attendance Records
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Track your attendance and view your attendance history
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Spinner size="lg" />
        </div>
      ) : classes.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-medium mb-2">No classes enrolled</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You need to enroll in classes before you can view attendance
                records.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="detailed">Class Details</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <OverallStatistics />
            </TabsContent>

            <TabsContent value="detailed" className="space-y-6">
              {/* Class Selection */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="w-full sm:w-80">
                  <Select
                    value={selectedClassId}
                    onValueChange={setSelectedClassId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((classItem) => {
                        // Handle both nested course object and flat course_name
                        const courseName =
                          classItem.course?.name ||
                          classItem.course_name ||
                          "Unknown Course";
                        const courseCode =
                          classItem.course?.code || classItem.course_id || "";

                        return (
                          <SelectItem
                            key={classItem.id}
                            value={classItem.id.toString()}
                          >
                            {courseCode} - {courseName} (Section{" "}
                            {classItem.section || "N/A"})
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedClassId && currentClassOverview ? (
                <div className="space-y-6">
                  <AttendanceStatsCards data={currentClassOverview} />
                  <AttendanceSummary data={currentClassOverview} />
                  <AttendanceRecordsTable />
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">
                        Please select a class to view detailed attendance
                        records.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
