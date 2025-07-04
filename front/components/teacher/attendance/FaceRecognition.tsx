"use client";

import React, { useEffect, useRef, useCallback } from "react";
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
import { Camera, Play, Square, Users, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAttendance } from "@/hooks/useAttendance";
import { useWebcam } from "@/hooks/useWebcam";
import { formatTime } from "@/src/utils/dateFormatter";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function FaceRecognition() {
  const { toast } = useToast();
  const {
    classes,
    selectedClass,
    setSelectedClass,
    currentSession,
    recentRecognitions,
    isLoading,
    startSession,
    endSession,
    processWebcamCapture,
    getSelectedClassDetails,
    getAttendanceStats,
    isSessionActive,
  } = useAttendance();

  const {
    videoRef,
    isWebcamActive,
    isLoading: webcamLoading,
    error: webcamError,
    startWebcam,
    stopWebcam,
    captureFrame,
  } = useWebcam();

  const processingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasAttemptedAutoStart = useRef(false);

  const stats = getAttendanceStats();
  const selectedClassDetails = getSelectedClassDetails();

  const handleStartSession = async () => {
    const session = await startSession();
    if (session) {
      // Wait a bit for the video element to be rendered
      setTimeout(async () => {
        try {
          await startWebcam();
          // Don't auto-start the recognition loop
          // startFaceRecognitionLoop();
        } catch (error) {
          console.error("Failed to start webcam after session start:", error);
        }
      }, 200);
    }
  };

  const handleEndSession = async () => {
    stopFaceRecognitionLoop();
    stopWebcam();
    await endSession();
  };

  const startFaceRecognitionLoop = () => {
    // Increase interval to 10 seconds to reduce API calls
    intervalRef.current = setInterval(async () => {
      if (processingRef.current || !isWebcamActive || !videoRef.current) return;

      processingRef.current = true;
      try {
        const canvas = captureFrame();
        if (canvas) {
          await processWebcamCapture(canvas);
        }
      } catch (error) {
        console.error("Error processing frame:", error);
      } finally {
        processingRef.current = false;
      }
    }, 10000); // Changed from 3000 to 10000 (10 seconds)
  };

  const stopFaceRecognitionLoop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    processingRef.current = false;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopFaceRecognitionLoop();
    };
  }, []);

  // Remove the problematic auto-start useEffect and replace with a better approach
  const handleVideoRefReady = useCallback(async () => {
    if (
      isSessionActive &&
      !isWebcamActive &&
      !webcamLoading &&
      !hasAttemptedAutoStart.current
    ) {
      hasAttemptedAutoStart.current = true;
      console.log("Video ref is ready, auto-starting webcam...");

      try {
        await startWebcam();
        // Don't auto-start the recognition loop
        // startFaceRecognitionLoop();
      } catch (error) {
        console.error("Failed to auto-start webcam:", error);
        hasAttemptedAutoStart.current = false; // Allow retry
      }
    }
  }, [isSessionActive, isWebcamActive, webcamLoading, startWebcam]);

  // Reset auto-start flag when session changes
  useEffect(() => {
    hasAttemptedAutoStart.current = false;
  }, [isSessionActive]);

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
                <Button
                  onClick={handleEndSession}
                  variant="destructive"
                  className="w-full"
                  disabled={isLoading}
                >
                  <Square className="h-4 w-4 mr-2" />
                  {isLoading ? "Ending..." : "End Session"}
                </Button>
              )}

              {isSessionActive && currentSession && (
                <div className="space-y-2">
                  <Badge variant="default" className="w-full justify-center">
                    Session Active
                  </Badge>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      {selectedClassDetails?.course.code} - Section{" "}
                      {selectedClassDetails?.section}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Started: {formatTime(currentSession.created_at)}
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
                  <span className="font-medium">{stats.totalEnrolled}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Present:</span>
                  <span className="font-medium text-green-600">
                    {stats.present}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Absent:</span>
                  <span className="font-medium text-red-600">
                    {stats.absent}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Attendance Rate:</span>
                  <span className="font-medium">{stats.attendanceRate}%</span>
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
                {processingRef.current && (
                  <Badge variant="outline" className="ml-auto">
                    Processing...
                  </Badge>
                )}
                {isWebcamActive && (
                  <Badge variant="default" className="ml-auto">
                    Live
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Position the camera to capture student faces for recognition
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Show webcam error if any */}
              {webcamError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Webcam Error: {webcamError}
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2"
                      onClick={() => startWebcam()}
                    >
                      Retry
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                {isWebcamActive ? (
                  <>
                    <video
                      ref={(el) => {
                        if (el) {
                          videoRef.current = el;
                          // Auto-start webcam when video element is ready
                          setTimeout(() => {
                            handleVideoRefReady();
                          }, 100);
                        }
                      }}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                      style={{
                        display: "block",
                        backgroundColor: "#000",
                      }}
                      onLoadedMetadata={() => {
                        console.log(
                          "Video loaded metadata - dimensions:",
                          videoRef.current?.videoWidth,
                          "x",
                          videoRef.current?.videoHeight
                        );
                      }}
                      onCanPlay={() => {
                        console.log("Video can play");
                      }}
                      onPlay={() => {
                        console.log("Video started playing");
                      }}
                    />
                    {/* Overlay for debugging */}
                    <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      {videoRef.current?.videoWidth}x
                      {videoRef.current?.videoHeight}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Hidden video element for ref setup when not active */}
                    <video
                      ref={(el) => {
                        if (el) {
                          videoRef.current = el;
                          console.log("Video ref set:", !!el);
                          // Auto-start webcam when video element is ready and session is active
                          setTimeout(() => {
                            handleVideoRefReady();
                          }, 100);
                        }
                      }}
                      style={{ display: "none" }}
                    />
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {webcamLoading
                            ? "Starting camera..."
                            : webcamError
                            ? "Camera unavailable"
                            : isSessionActive
                            ? "Camera not started"
                            : "Start a session to begin camera feed"}
                        </p>
                        {webcamLoading && (
                          <div className="mt-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                          </div>
                        )}
                        {/* Manual start button for debugging */}
                        {isSessionActive &&
                          !isWebcamActive &&
                          !webcamLoading && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => startWebcam()}
                            >
                              Start Camera Manually
                            </Button>
                          )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Camera Controls for debugging */}
              {isSessionActive && (
                <div className="mt-4 space-y-2">
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={
                        isWebcamActive ? stopWebcam : () => startWebcam()
                      }
                      disabled={webcamLoading}
                    >
                      {isWebcamActive ? "Stop Camera" : "Start Camera"}
                    </Button>
                    {isWebcamActive && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (intervalRef.current) {
                              stopFaceRecognitionLoop();
                              toast({
                                title: "Auto Recognition Stopped",
                                description:
                                  "Automatic face recognition has been stopped",
                              });
                            } else {
                              startFaceRecognitionLoop();
                              toast({
                                title: "Auto Recognition Started",
                                description:
                                  "Automatic face recognition is now running every 10 seconds",
                              });
                            }
                          }}
                        >
                          {intervalRef.current
                            ? "Stop Auto Recognition"
                            : "Start Auto Recognition"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            console.log("🎯 Manual capture initiated...");
                            toast({
                              title: "📸 Processing Frame",
                              description:
                                "Capturing and processing frame for face recognition...",
                            });

                            const canvas = captureFrame();
                            if (canvas) {
                              try {
                                console.log("📸 Frame captured, processing...");
                                const result = await processWebcamCapture(
                                  canvas
                                );
                                console.log(
                                  "✅ Manual capture completed:",
                                  result
                                );

                                // Additional toast for manual capture completion
                                toast({
                                  title: "Manual Capture Complete",
                                  description: `✅ Frame processed successfully. Check results above.`,
                                });
                              } catch (error) {
                                console.error(
                                  "❌ Manual capture failed:",
                                  error
                                );
                                toast({
                                  title: "❌ Manual Capture Failed",
                                  description:
                                    "Failed to process the captured frame",
                                  variant: "destructive",
                                });
                              }
                            } else {
                              console.error("❌ Failed to capture frame");
                              toast({
                                title: "❌ Capture Failed",
                                description:
                                  "Could not capture frame from camera",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          Manual Capture
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Debug Panel with API Message Display */}
                  <div className="bg-muted p-3 rounded-lg text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Debug Info</span>
                      <Badge variant="outline" className="text-xs">
                        {processingRef.current ? "Processing..." : "Ready"}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-muted-foreground">
                      <div>Session ID: {currentSession?.id || "None"}</div>
                      <div>
                        Camera: {isWebcamActive ? "Active" : "Inactive"}
                      </div>
                      <div>
                        Auto Recognition:{" "}
                        {intervalRef.current ? "Running" : "Stopped"}
                      </div>
                      <div>
                        Recent Recognitions: {recentRecognitions.length}
                      </div>
                      <div className="mt-2 pt-2 border-t border-border">
                        <span className="font-medium">Last API Response:</span>
                        <div className="text-xs mt-1 p-2 bg-background rounded border">
                          Check toast notifications for API messages
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
                  {recentRecognitions.length > 0 ? (
                    recentRecognitions.map((recognition, index) => (
                      <div
                        key={`${recognition.student_id}-${index}`}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {recognition.student_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {recognition.roll_number}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {Math.round(recognition.confidence * 100)}%
                            confidence
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {recognition.timestamp}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">
                        No students recognized yet
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
