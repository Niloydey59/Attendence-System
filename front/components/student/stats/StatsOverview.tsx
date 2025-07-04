"use client";

import * as React from "react";
import { Calendar, Clock, TrendingUp, User, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface StatsOverviewProps {
  totalClasses?: number;
  attendedClasses?: number;
  totalSessions?: number;
  attendanceRate?: number;
  totalImages?: number;
}

export function StatsOverview({
  totalClasses = 0,
  attendedClasses = 0,
  totalSessions = 0,
  attendanceRate,
  totalImages = 0,
}: StatsOverviewProps) {
  // Calculate attendance percentage if not provided
  const attendancePercentage =
    attendanceRate ??
    (totalSessions > 0
      ? Math.round((attendedClasses / totalSessions) * 100)
      : 0);

  const imageSetupComplete = totalImages > 0;

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 75)
      return {
        color: "bg-green-500",
        label: "Good",
        variant: "default" as const,
      };
    if (percentage >= 60)
      return {
        color: "bg-yellow-500",
        label: "Average",
        variant: "secondary" as const,
      };
    return {
      color: "bg-red-500",
      label: "Poor",
      variant: "destructive" as const,
    };
  };

  const attendanceStatus = getAttendanceStatus(attendancePercentage);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Enrolled Classes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Enrolled Classes
          </CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalClasses}</div>
          <p className="text-xs text-muted-foreground">
            {totalClasses === 0 ? "No classes enrolled" : "This semester"}
          </p>
        </CardContent>
      </Card>

      {/* Total Sessions Attended */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Sessions Attended
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{attendedClasses}</div>
          <p className="text-xs text-muted-foreground">
            {totalSessions > 0
              ? `Out of ${totalSessions} total`
              : "No sessions yet"}
          </p>
        </CardContent>
      </Card>

      {/* Attendance Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {attendancePercentage.toFixed(1)}%
          </div>
          <div className="mt-2 space-y-2">
            <Progress value={attendancePercentage} className="h-2" />
            <Badge variant={attendanceStatus.variant} className="text-xs">
              {attendanceStatus.label}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Face Recognition Setup */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Face Recognition
          </CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalImages}/3</div>
          <div className="mt-2 space-y-2">
            <Progress value={(totalImages / 3) * 100} className="h-2" />
            <Badge
              variant={imageSetupComplete ? "default" : "secondary"}
              className="text-xs"
            >
              {imageSetupComplete ? "Active" : "Setup Required"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
