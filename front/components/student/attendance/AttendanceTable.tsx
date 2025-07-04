import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock, Calendar as CalendarIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AttendanceRecord {
  id: number;
  date: string;
  status: "present" | "absent" | "late";
  timestamp: string;
  classId: number;
}

interface AttendanceTableProps {
  records: AttendanceRecord[];
  courseName?: string;
}

export function AttendanceTable({
  records,
  courseName = "this course",
}: AttendanceTableProps) {
  if (records.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-6">
            <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
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
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Your attendance records for {courseName}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  {new Date(record.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {record.status === "present" ? (
                    <Badge variant="default" className="bg-green-500">
                      <Check className="h-3 w-3 mr-1" /> Present
                    </Badge>
                  ) : record.status === "late" ? (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-500 text-yellow-950"
                    >
                      <Clock className="h-3 w-3 mr-1" /> Late
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <X className="h-3 w-3 mr-1" /> Absent
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{record.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
