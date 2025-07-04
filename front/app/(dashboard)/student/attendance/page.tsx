"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { AttendanceStats } from "@/components/student/attendance/AttendanceStats";
import { AttendanceTable } from "@/components/student/attendance/AttendanceTable";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { getEnrolledClasses } from "@/src/services/features/studentService";
import { Class } from "@/src/types/student";
import { useToast } from "@/hooks/use-toast";

// Mocked attendance data for demonstration
interface AttendanceRecord {
  id: number;
  date: string;
  status: "present" | "absent" | "late";
  timestamp: string;
  classId: number;
}

const mockAttendanceData: AttendanceRecord[] = [
  {
    id: 1,
    date: "2023-06-01",
    status: "present",
    timestamp: "10:05 AM",
    classId: 1,
  },
  {
    id: 2,
    date: "2023-06-03",
    status: "present",
    timestamp: "10:02 AM",
    classId: 1,
  },
  {
    id: 3,
    date: "2023-06-08",
    status: "late",
    timestamp: "10:15 AM",
    classId: 1,
  },
  { id: 4, date: "2023-06-10", status: "absent", timestamp: "—", classId: 1 },
  {
    id: 5,
    date: "2023-06-15",
    status: "present",
    timestamp: "10:01 AM",
    classId: 1,
  },
  {
    id: 6,
    date: "2023-06-01",
    status: "present",
    timestamp: "02:05 PM",
    classId: 2,
  },
  { id: 7, date: "2023-06-05", status: "absent", timestamp: "—", classId: 2 },
  {
    id: 8,
    date: "2023-06-12",
    status: "late",
    timestamp: "02:20 PM",
    classId: 2,
  },
];

export default function AttendancePage() {
  const [classes, setClasses] = React.useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = React.useState<string>("");
  const [attendanceData, setAttendanceData] = React.useState<
    AttendanceRecord[]
  >([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();
  const searchParams = useSearchParams();

  // Load enrolled classes
  React.useEffect(() => {
    async function loadClasses() {
      try {
        setLoading(true);
        const response = await getEnrolledClasses();
        setClasses(response.enrolled_classes);

        // Set default selected class from URL or first class
        const classParam = searchParams.get("class");
        if (
          classParam &&
          response.enrolled_classes.some((c) => c.id.toString() === classParam)
        ) {
          setSelectedClassId(classParam);
        } else if (response.enrolled_classes.length > 0) {
          setSelectedClassId(response.enrolled_classes[0].id.toString());
        }
      } catch (error) {
        toast({
          title: "Failed to load classes",
          description:
            error instanceof Error
              ? error.message
              : "Could not fetch enrolled classes.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    loadClasses();
  }, [searchParams, toast]);

  // Filter attendance data based on selected class
  React.useEffect(() => {
    if (selectedClassId) {
      // This would be an API call in production
      // Here we're just filtering the mock data
      const filteredData = mockAttendanceData.filter(
        (record) => record.classId === parseInt(selectedClassId)
      );
      setAttendanceData(filteredData);
    } else {
      setAttendanceData([]);
    }
  }, [selectedClassId]);

  // Calculate statistics
  const totalClasses = attendanceData.length;
  const presentCount = attendanceData.filter(
    (r) => r.status === "present"
  ).length;
  const lateCount = attendanceData.filter((r) => r.status === "late").length;
  const absentCount = attendanceData.filter(
    (r) => r.status === "absent"
  ).length;

  // Get current course name
  const currentCourseName = classes.find(
    (c) => c.id.toString() === selectedClassId
  )?.course_name;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          Attendance Records
        </h1>
        <p className="text-muted-foreground">
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
            <div className="text-center py-6">
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
          {/* Class Selection */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="w-full md:w-80">
              <Select
                value={selectedClassId}
                onValueChange={setSelectedClassId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((classItem) => (
                    <SelectItem
                      key={classItem.id}
                      value={classItem.id.toString()}
                    >
                      {classItem.course_name} ({classItem.course_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Statistics and Table Tabs */}
          <Tabs defaultValue="records">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="records">Attendance Records</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>

            <TabsContent value="records" className="space-y-4 pt-4">
              {selectedClassId ? (
                <AttendanceTable
                  records={attendanceData}
                  courseName={currentCourseName}
                />
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-6">
                      <p className="text-sm text-muted-foreground">
                        Please select a class to view attendance records.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="stats" className="pt-4">
              {selectedClassId ? (
                <AttendanceStats
                  totalClasses={totalClasses}
                  presentCount={presentCount}
                  lateCount={lateCount}
                  absentCount={absentCount}
                />
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-6">
                      <p className="text-sm text-muted-foreground">
                        Please select a class to view attendance statistics.
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
