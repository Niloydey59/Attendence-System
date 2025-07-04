import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Calendar as CalendarIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StudentClassAttendanceRecord } from "@/src/types/student";
import { formatDate, formatTime } from "@/src/utils/dateFormatter";

interface AttendanceTableProps {
  records: StudentClassAttendanceRecord[];
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
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>
              Your attendance records for {courseName}
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
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{formatDate(record.date)}</span>
                      <span className="text-xs text-muted-foreground sm:hidden">
                        {record.marked_at ? formatTime(record.marked_at) : "—"}
                      </span>
                    </div>
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
}
