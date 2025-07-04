"use client";

import React, { useState } from "react";
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
import { Calendar, Download, Filter } from "lucide-react";

export function AttendanceRecords() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const mockRecords = [
    {
      id: 1,
      student_name: "john_doe",
      student_roll: "CSE2021001",
      status: "PRESENT",
      marked_at: "2024-01-15T14:15:00Z",
      confidence_score: 0.95,
    },
    {
      id: 2,
      student_name: "jane_smith",
      student_roll: "CSE2021002",
      status: "PRESENT",
      marked_at: "2024-01-15T14:16:00Z",
      confidence_score: 0.92,
    },
    {
      id: 3,
      student_name: "bob_wilson",
      student_roll: "CSE2021003",
      status: "ABSENT",
      marked_at: "2024-01-15T14:00:00Z",
      confidence_score: null,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Attendance Records</h1>
          <p className="text-muted-foreground">
            View and manage attendance records for your classes
          </p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Records
        </Button>
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
                <SelectItem value="cse301-a">
                  CSE301 - Database Systems - Section A
                </SelectItem>
                <SelectItem value="cse301-b">
                  CSE301 - Database Systems - Section B
                </SelectItem>
                <SelectItem value="cse401-a">
                  CSE401 - Software Engineering - Section A
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Session Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-2xl font-bold">1</p>
                <p className="text-xs text-muted-foreground">Session Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="ml-2">
                <p className="text-2xl font-bold">45</p>
                <p className="text-xs text-muted-foreground">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="ml-2">
                <p className="text-2xl font-bold text-green-600">32</p>
                <p className="text-xs text-muted-foreground">Present</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="ml-2">
                <p className="text-2xl font-bold text-red-600">13</p>
                <p className="text-xs text-muted-foreground">Absent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>
            Detailed attendance records for selected class and date
          </CardDescription>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {record.student_name}
                  </TableCell>
                  <TableCell>{record.student_roll}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        record.status === "PRESENT" ? "default" : "destructive"
                      }
                    >
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(record.marked_at).toLocaleTimeString()}
                  </TableCell>
                  <TableCell>
                    {record.confidence_score
                      ? `${Math.round(record.confidence_score * 100)}%`
                      : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
