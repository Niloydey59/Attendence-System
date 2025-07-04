import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Check, X, BookOpen, TrendingUp } from "lucide-react";

interface AttendanceStatsProps {
  totalClasses: number;
  presentCount: number;
  absentCount: number;
  attendancePercentage?: number;
}

export function AttendanceStats({
  totalClasses,
  presentCount,
  absentCount,
  attendancePercentage,
}: AttendanceStatsProps) {
  const calculatedPercentage =
    attendancePercentage ??
    (totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Total Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClasses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-600">
              <Check className="h-4 w-4" />
              Present
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {presentCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-red-600">
              <X className="h-4 w-4" />
              Absent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{absentCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Percentage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculatedPercentage}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Attendance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Attendance Rate</span>
                <span className="font-medium">{calculatedPercentage}%</span>
              </div>
              <Progress value={calculatedPercentage} className="h-2" />
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                Breakdown by Status
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm">Present</span>
                  </div>
                  <span className="text-sm font-medium">
                    {totalClasses > 0
                      ? Math.round((presentCount / totalClasses) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm">Absent</span>
                  </div>
                  <span className="text-sm font-medium">
                    {totalClasses > 0
                      ? Math.round((absentCount / totalClasses) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
    </>
  );
}
