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
  Clock,
  Users,
  Play,
  Square,
  RefreshCw,
  Eye,
  UserCheck,
  UserX,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAttendance } from "@/hooks/useAttendance";
import { formatTime, formatDate } from "@/src/utils/dateFormatter";

export default function AttendanceSession() {
  const { toast } = useToast();
  const {
    classes,
    selectedClass,
    setSelectedClass,
    currentSession,
    attendanceRecords,
    isLoading,
    startSession,
    endSession,
    loadAttendanceRecords,
    getSelectedClassDetails,
    getAttendanceStats,
    isSessionActive,
  } = useAttendance();

  const [autoRefresh, setAutoRefresh] = useState(false); // Keep as false by default

  const stats = getAttendanceStats();
  const selectedClassDetails = getSelectedClassDetails();

  // Auto-refresh records every 30 seconds if session is active AND auto-refresh is enabled
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (autoRefresh && isSessionActive) {
      interval = setInterval(() => {
        console.log("Auto-refreshing attendance records...");
        loadAttendanceRecords();
      }, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, isSessionActive, loadAttendanceRecords]);

  const handleStartSession = async () => {
    const session = await startSession();
    if (session) {
      // Don't auto-enable refresh
      // setAutoRefresh(true);
      toast({
        title: "Session Started",
        description: `Attendance session for ${selectedClassDetails?.course.code} has been started`,
      });
    }
  };

  const handleEndSession = async () => {
    await endSession();
    setAutoRefresh(false);
    toast({
      title: "Session Ended",
      description: "Attendance session has been ended successfully",
    });
  };

  const handleRefreshRecords = () => {
    loadAttendanceRecords();
    toast({
      title: "Records Refreshed",
      description: "Attendance records have been updated",
    });
  };

  const getStatusColor = (status: string) => {
    return status === "PRESENT" ? "default" : "destructive";
  };

  const getStatusIcon = (status: string) => {
    return status === "PRESENT" ? (
      <UserCheck className="h-4 w-4" />
    ) : (
      <UserX className="h-4 w-4" />
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Attendance Sessions</h1>
        <p className="text-muted-foreground">
          Manage and monitor active attendance sessions
        </p>
      </div>

      {/* Session Control */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Session Control</CardTitle>
              <CardDescription>
                Start or manage attendance sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Class</label>
                <Select
                  value={selectedClass}
                  onValueChange={setSelectedClass}
                  disabled={isSessionActive}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>
                        {cls.course.code} - {cls.course.name} (Section{" "}
                        {cls.section})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {!isSessionActive ? (
                <Button
                  onClick={handleStartSession}
                  className="w-full"
                  disabled={!selectedClass || isLoading}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isLoading ? "Starting..." : "Start Session"}
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button
                    onClick={handleEndSession}
                    variant="destructive"
                    className="w-full"
                    disabled={isLoading}
                  >
                    <Square className="h-4 w-4 mr-2" />
                    {isLoading ? "Ending..." : "End Session"}
                  </Button>

                  <Button
                    onClick={handleRefreshRecords}
                    variant="outline"
                    className="w-full"
                    disabled={isLoading}
                  >
                    <RefreshCw
                      className={`h-4 w-4 mr-2 ${
                        isLoading ? "animate-spin" : ""
                      }`}
                    />
                    Refresh Records
                  </Button>

                  <Button
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    variant={autoRefresh ? "default" : "outline"}
                    className="w-full"
                  >
                    {autoRefresh ? "Disable" : "Enable"} Auto-Refresh
                  </Button>
                </div>
              )}

              {isSessionActive && currentSession && (
                <div className="space-y-3 mt-4 p-3 bg-muted rounded-lg">
                  <Badge variant="default" className="w-full justify-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Session Active
                  </Badge>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-medium">
                      {selectedClassDetails?.course.code} - Section{" "}
                      {selectedClassDetails?.section}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Started: {formatTime(currentSession.created_at)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Date: {formatDate(currentSession.date)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Session Stats */}
        <div className="lg:col-span-2">
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalEnrolled}</p>
                    <p className="text-xs text-muted-foreground">
                      Total Students
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.present}
                    </p>
                    <p className="text-xs text-muted-foreground">Present</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <UserX className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {stats.absent}
                    </p>
                    <p className="text-xs text-muted-foreground">Absent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Attendance Records */}
          {currentSession && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Live Attendance Records
                    </CardTitle>
                    <CardDescription>
                      Real-time attendance status for{" "}
                      {selectedClassDetails?.course.code}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                      Live
                    </div>
                    <Badge variant="outline">
                      {stats.attendanceRate}% Present
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                    Loading records...
                  </div>
                ) : attendanceRecords.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Roll Number</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Time Marked</TableHead>
                          <TableHead>Confidence</TableHead>
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
                                variant={getStatusColor(record.status)}
                                className="flex items-center gap-1 w-fit"
                              >
                                {getStatusIcon(record.status)}
                                {record.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {record.marked_at
                                ? formatTime(record.marked_at)
                                : "Not marked"}
                            </TableCell>
                            <TableCell>
                              {record.confidence_score
                                ? `${Math.round(
                                    record.confidence_score * 100
                                  )}%`
                                : "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">
                      No Records Yet
                    </h3>
                    <p className="text-muted-foreground">
                      No attendance records found. Students will appear here as
                      they are marked present.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* No Session State */}
          {!currentSession && selectedClass && (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  No Active Session
                </h3>
                <p className="text-muted-foreground">
                  Start an attendance session to begin tracking student
                  attendance.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
