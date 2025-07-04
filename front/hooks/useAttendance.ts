"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  startAttendanceSession,
  getTodayAttendanceSession,
  endAttendanceSession,
  getAttendanceRecords,
  processWebcamImage
} from "@/src/services/features/attendanceService";
import { getTeacherClasses } from "@/src/services/features/teacherService";
import {
  AttendanceSession,
  AttendanceRecord,
  RecognizedStudent
} from "@/src/types/attendance";
import { Class } from "@/src/types/teacher";

export const useAttendance = () => {
  const { toast } = useToast();
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [currentSession, setCurrentSession] = useState<AttendanceSession | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [recentRecognitions, setRecentRecognitions] = useState<RecognizedStudent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastLoadTime, setLastLoadTime] = useState<number>(0);

  // Load teacher's classes on mount
  useEffect(() => {
    loadClasses();
  }, []);

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

  const loadTodaySession = async (classId: number) => {
    try {
      const response = await getTodayAttendanceSession(classId);
      setCurrentSession(response.session);
      return response.session;
    } catch (error) {
      // No session found for today
      setCurrentSession(null);
      return null;
    }
  };

  const startSession = async () => {
    if (!selectedClass) return;

    setIsLoading(true);
    try {
      const classId = parseInt(selectedClass);
      
      // Check if session already exists
      const existingSession = await loadTodaySession(classId);
      if (existingSession) {
        setCurrentSession(existingSession);
        toast({
          title: "Session Found",
          description: "Attendance session already exists for today",
        });
        return existingSession;
      }

      // Create new session
      const response = await startAttendanceSession(classId);
      setCurrentSession(response.session);
      setRecentRecognitions([]);
      
      toast({
        title: "Session Started",
        description: "Attendance session has been started successfully",
      });

      return response.session;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start attendance session",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const endSession = async () => {
    if (!currentSession) return;

    setIsLoading(true);
    try {
      await endAttendanceSession(currentSession.id);
      setCurrentSession(null);
      setRecentRecognitions([]);
      
      toast({
        title: "Session Ended",
        description: "Attendance session has been ended successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to end attendance session",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadAttendanceRecords = useCallback(async () => {
    if (!currentSession) return;

    // Prevent rapid successive calls
    const now = Date.now();
    if (now - lastLoadTime < 5000) { // 5 second cooldown
      console.log("Skipping loadAttendanceRecords due to cooldown");
      return;
    }

    try {
      setLastLoadTime(now);
      const response = await getAttendanceRecords(currentSession.id);
      setAttendanceRecords(response.records);
      // Update session stats
      setCurrentSession(response.session);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load attendance records",
        variant: "destructive",
      });
    }
  }, [currentSession, lastLoadTime, toast]);

  const processWebcamCapture = async (imageElement: HTMLCanvasElement | HTMLVideoElement) => {
    if (!currentSession) {
      toast({
        title: "Error",
        description: "No active session found",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("🚀 Starting face recognition process...");
      console.log("Session ID:", currentSession.id);
      console.log("Image element type:", imageElement.constructor.name);
      
      if (imageElement instanceof HTMLCanvasElement) {
        console.log("Canvas dimensions:", imageElement.width, "x", imageElement.height);
      }

      const response = await processWebcamImage(currentSession.id, imageElement);
      
      // Log the complete response
      console.log("✅ Face recognition API response:", response);
      console.log("📊 Response details:", {
        message: response.message,
        recognizedStudentsCount: response.recognized_students.length,
        recognizedStudents: response.recognized_students
      });

      // Show the exact API message in toast - ALWAYS show this
      toast({
        title: "Face Recognition Result",
        description: `📡 API: ${response.message}`,
        variant: "default",
      });

      if (response.recognized_students.length > 0) {
        // Log each recognized student
        response.recognized_students.forEach((student, index) => {
          console.log(`👤 Student ${index + 1}:`, {
            id: student.student_id,
            name: student.student_name,
            roll: student.roll_number,
            confidence: `${Math.round(student.confidence * 100)}%`
          });
        });

        // Add new recognitions to the recent list
        const newRecognitions = response.recognized_students.filter(
          (newStudent) => !recentRecognitions.some(
            (existing) => existing.student_id === newStudent.student_id
          )
        );
        
        if (newRecognitions.length > 0) {
          console.log("🆕 New recognitions (not already in recent list):", newRecognitions.length);
          
          setRecentRecognitions(prev => [
            ...newRecognitions.map(student => ({
              ...student,
              timestamp: new Date().toLocaleTimeString()
            })),
            ...prev
          ].slice(0, 10));

          // Only refresh records if new students were recognized
          console.log("🔄 Refreshing attendance records...");
          await loadAttendanceRecords();

          // Show success toast with student names
          const studentNames = newRecognitions.map(s => s.student_name).join(", ");
          toast({
            title: "✅ Students Marked Present",
            description: `${newRecognitions.length} student(s): ${studentNames}`,
            variant: "default",
          });
        } else {
          console.log("ℹ️ All recognized students were already in recent list");
          toast({
            title: "Already Recognized",
            description: "All detected students were already marked present recently",
            variant: "secondary",
          });
        }
      } else {
        // For cases like "Processed 1 faces, recognized 0 students"
        console.log("📝 API Message:", response.message);
        // Show additional context toast for no recognition
        toast({
          title: "No Recognition",
          description: `${response.message}`,
          variant: "secondary",
        });
      }

      return response;
    } catch (error) {
      console.error("❌ Face recognition error:", error);
      
      // Log detailed error information
      if (error instanceof Error) {
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      
      // Show detailed error toast
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "❌ Face Recognition Failed",
        description: `API Error: ${errorMessage}`,
        variant: "destructive",
      });
      
      throw error;
    }
  };

  const getSelectedClassDetails = () => {
    if (!selectedClass) return null;
    return classes.find(cls => cls.id.toString() === selectedClass) || null;
  };

  const getAttendanceStats = () => {
    if (!currentSession) {
      return {
        totalEnrolled: 0,
        present: 0,
        absent: 0,
        attendanceRate: 0
      };
    }

    return {
      totalEnrolled: currentSession.total_enrolled,
      present: currentSession.total_present,
      absent: currentSession.total_absent,
      attendanceRate: currentSession.total_enrolled > 0 
        ? Math.round((currentSession.total_present / currentSession.total_enrolled) * 100)
        : 0
    };
  };

  return {
    // State
    classes,
    selectedClass,
    setSelectedClass,
    currentSession,
    attendanceRecords,
    recentRecognitions,
    isLoading,

    // Actions
    startSession,
    endSession,
    loadTodaySession,
    processWebcamCapture,
    loadAttendanceRecords,

    // Computed
    getSelectedClassDetails,
    getAttendanceStats,
    isSessionActive: !!currentSession?.is_active,
  };
};
