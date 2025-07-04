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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Trash2,
  AlertTriangle,
  Eye,
} from "lucide-react";
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
import { getTeacherClasses } from "@/src/services/features/teacherService";
import {
  getTodayAttendanceSession,
  getAttendanceRecords,
  getAllAttendanceSessions,
  deleteAttendanceSession,
  deleteAllAttendanceSessions,
  deleteAttendanceRecord,
} from "@/src/services/features/attendanceService";
import { Class } from "@/src/types/teacher";
import { AttendanceSession, AttendanceRecord } from "@/src/types/attendance";
import { formatTime, formatDate } from "@/src/utils/dateFormatter";

export function AttendanceRecords() {
  const { toast } = useToast();
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState("today");
  const [currentSession, setCurrentSession] =
    useState<AttendanceSession | null>(null);
  const [allSessions, setAllSessions] = useState<AttendanceSession[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"today" | "all">("today");

  // Load classes on mount
  useEffect(() => {
    loadClasses();
  }, []);

  // Load session when class changes
  useEffect(() => {
    if (selectedClass && selectedDate === "today") {
      loadTodaySession();
    } else {
      setCurrentSession(null);
      setAttendanceRecords([]);
    }
  }, [selectedClass, selectedDate]);

  const loadClasses = async () => {
    try {
      const response = await getTeacherClasses();
      setClasses(response.classes);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load classes",
        variant: "destructive",
      });
    }
  };

  const loadTodaySession = async () => {
    if (!selectedClass) return;

    setIsLoading(true);
    try {
      const classId = parseInt(selectedClass);
      const sessionResponse = await getTodayAttendanceSession(classId);
      setCurrentSession(sessionResponse.session);

      // Load attendance records
      const recordsResponse = await getAttendanceRecords(
        sessionResponse.session.id
      );
      setAttendanceRecords(recordsResponse.records);
    } catch (error) {
      // No session found for today
      setCurrentSession(null);
      setAttendanceRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllSessions = async () => {
    if (!selectedClass) return;

    setIsLoading(true);
    try {
      const classId = parseInt(selectedClass);
      const response = await getAllAttendanceSessions(classId);
      setAllSessions(response.sessions);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load sessions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshRecords = async () => {
    if (currentSession) {
      setIsLoading(true);
      try {
        const response = await getAttendanceRecords(currentSession.id);
        setAttendanceRecords(response.records);
        setCurrentSession(response.session); // Update session stats
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to refresh records",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const exportRecords = () => {
    if (!attendanceRecords.length) {
      toast({
        title: "No Data",
        description: "No attendance records to export",
        variant: "destructive",
      });
      return;
    }

    // Create CSV content
    const headers = [
      "Student Name",
      "Roll Number",
      "Status",
      "Time",
      "Confidence",
    ];
    const rows = attendanceRecords.map((record) => [
      record.student_name,
      record.student_roll,
      record.status,
      record.marked_at ? formatTime(record.marked_at) : "N/A",
      record.confidence_score
        ? `${Math.round(record.confidence_score * 100)}%`
        : "N/A",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${selectedClass}_${formatDate(
      new Date().toISOString()
    )}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Attendance records exported successfully",
    });
  };

  const handleDeleteSession = async (sessionId: number) => {
    try {
      const response = await deleteAttendanceSession(sessionId);
      toast({
        title: "Session Deleted",
        description: response.message,
      });

      // Refresh data
      if (viewMode === "today") {
        loadTodaySession();
      } else {
        loadAllSessions();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete session",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAllSessions = async () => {
    if (!selectedClass) return;

    try {
      const classId = parseInt(selectedClass);
      const response = await deleteAllAttendanceSessions(classId);
      toast({
        title: "All Sessions Deleted",
        description: response.message,
      });

      // Clear data
      setCurrentSession(null);
      setAllSessions([]);
      setAttendanceRecords([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete all sessions",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRecord = async (recordId: number) => {
    try {
      const response = await deleteAttendanceRecord(recordId);
      toast({
        title: "Record Deleted",
        description: response.message,
      });

      // Refresh attendance records
      refreshRecords();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete record",
        variant: "destructive",
      });
    }
  };

  const handleSessionSelect = async (sessionId: string) => {
    const session = allSessions.find((s) => s.id.toString() === sessionId);
    if (session) {
      setCurrentSession(session);

      // Load records for this session
      try {
        const response = await getAttendanceRecords(session.id);
        setAttendanceRecords(response.records);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load records for selected session",
          variant: "destructive",
        });
      }
    }
  };

  // Update the useEffect for loading data based on view mode
  useEffect(() => {
    if (selectedClass) {
      if (viewMode === "today") {
        loadTodaySession();
      } else {
        loadAllSessions();
      }
    } else {
      setCurrentSession(null);
      setAllSessions([]);
      setAttendanceRecords([]);
    }
  }, [selectedClass, viewMode]);

  const getSelectedClassDetails = () => {
    if (!selectedClass) return null;
    return classes.find((cls) => cls.id.toString() === selectedClass) || null;
  };

  const selectedClassDetails = getSelectedClassDetails();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Attendance Records</h1>
          <p className="text-muted-foreground">
            View and manage attendance records for your classes
          </p>
        </div>
        <div className="flex gap-2">
          {selectedClass && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All Sessions
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    all attendance sessions and records for the selected class.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAllSessions}>
                    Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {currentSession && viewMode === "today" && (
            <Button
              onClick={refreshRecords}
              variant="outline"
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          )}
          <Button onClick={exportRecords} disabled={!attendanceRecords.length}>
            <Download className="h-4 w-4 mr-2" />
            Export Records
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id.toString()}>
                    {cls.course.code} - {cls.course.name} - Section{" "}
                    {cls.section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={viewMode}
              onValueChange={(value: "today" | "all") => setViewMode(value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today's Session</SelectItem>
                <SelectItem value="all">All Sessions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* All Sessions View */}
      {viewMode === "all" && selectedClass && (
        <Card>
          <CardHeader>
            <CardTitle>All Sessions</CardTitle>
            <CardDescription>
              All attendance sessions for {selectedClassDetails?.course.code}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                Loading sessions...
              </div>
            ) : allSessions.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  No Sessions Found
                </h3>
                <p className="text-muted-foreground">
                  No attendance sessions found for this class.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Present</TableHead>
                    <TableHead>Absent</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>{formatDate(session.date)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={session.is_active ? "default" : "secondary"}
                        >
                          {session.is_active ? "Active" : "Ended"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-green-600">
                        {session.total_present}
                      </TableCell>
                      <TableCell className="text-red-600">
                        {session.total_absent}
                      </TableCell>
                      <TableCell>{session.total_enrolled}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleSessionSelect(session.id.toString())
                            }
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Session
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the session
                                  for {formatDate(session.date)}? This will also
                                  delete all attendance records for this
                                  session.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteSession(session.id)
                                  }
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Session Summary */}
      {currentSession && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="ml-2">
                  <p className="text-2xl font-bold">1</p>
                  <p className="text-xs text-muted-foreground">
                    {viewMode === "today"
                      ? "Session Today"
                      : "Selected Session"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="ml-2">
                  <p className="text-2xl font-bold">
                    {currentSession.total_enrolled}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total Students
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="ml-2">
                  <p className="text-2xl font-bold text-green-600">
                    {currentSession.total_present}
                  </p>
                  <p className="text-xs text-muted-foreground">Present</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="ml-2">
                  <p className="text-2xl font-bold text-red-600">
                    {currentSession.total_absent}
                  </p>
                  <p className="text-xs text-muted-foreground">Absent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* No Data State for Today's Session */}
      {viewMode === "today" &&
        !currentSession &&
        selectedClass &&
        !isLoading && (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Session Found</h3>
              <p className="text-muted-foreground">
                No attendance session found for{" "}
                {selectedClassDetails?.course.code} today.
                <br />
                Start a session from the attendance page to begin tracking.
              </p>
            </CardContent>
          </Card>
        )}

      {/* Records Table */}
      {currentSession && attendanceRecords.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Attendance Records</CardTitle>
                <CardDescription>
                  {selectedClassDetails?.course.code} - Section{" "}
                  {selectedClassDetails?.section} -{" "}
                  {formatDate(currentSession.date)}
                </CardDescription>
              </div>
              {currentSession.is_active && viewMode === "today" && (
                <Badge variant="default">Live Session</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {record.student_name}
                    </TableCell>
                    <TableCell>{record.student_roll}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          record.status === "PRESENT"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {record.marked_at ? formatTime(record.marked_at) : "N/A"}
                    </TableCell>
                    <TableCell>
                      {record.confidence_score
                        ? `${Math.round(record.confidence_score * 100)}%`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Record</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the attendance
                              record for {record.student_name}?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteRecord(record.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
