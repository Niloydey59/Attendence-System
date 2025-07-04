"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, Play, Square, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function FaceRecognition() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");

  const handleStartSession = () => {
    setIsSessionActive(true);
  };

  const handleEndSession = () => {
    setIsSessionActive(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Take Attendance</h1>
        <p className="text-muted-foreground">
          Use facial recognition to automatically mark student attendance
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Session Control */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Session Control</CardTitle>
              <CardDescription>
                Start an attendance session for your class
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Class</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cse301-a">CSE301 - Section A</SelectItem>
                    <SelectItem value="cse301-b">CSE301 - Section B</SelectItem>
                    <SelectItem value="cse401-a">CSE401 - Section A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {!isSessionActive ? (
                <Button
                  onClick={handleStartSession}
                  className="w-full"
                  disabled={!selectedClass}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Session
                </Button>
              ) : (
                <Button
                  onClick={handleEndSession}
                  variant="destructive"
                  className="w-full"
                >
                  <Square className="h-4 w-4 mr-2" />
                  End Session
                </Button>
              )}

              {isSessionActive && (
                <div className="space-y-2">
                  <Badge variant="default" className="w-full justify-center">
                    Session Active
                  </Badge>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Session started at 2:30 PM
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Attendance Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Attendance Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Total Enrolled:</span>
                  <span className="font-medium">45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Present:</span>
                  <span className="font-medium text-green-600">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Absent:</span>
                  <span className="font-medium text-red-600">22</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Attendance Rate:</span>
                  <span className="font-medium">51%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Camera Feed */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Camera Feed
              </CardTitle>
              <CardDescription>
                Position the camera to capture student faces for recognition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                {isSessionActive ? (
                  <div className="text-center">
                    <Camera className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Camera feed would appear here
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Real-time facial recognition in progress...
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Camera className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Start a session to begin camera feed
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Recognitions */}
          {isSessionActive && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Recent Recognitions</CardTitle>
                <CardDescription>
                  Students identified in the last few minutes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {/*
                    { name: "John Doe", roll: "CSE2021001", time: "2:35 PM", confidence: "95%" },
                    { name: "Jane Smith", roll: "CSE2021002", time: "2:34 PM", confidence: "92%" },
                    { name: "Bob Wilson", roll: "CSE2021003", time: "2:33 PM", confidence: "89%" },
                  */}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
