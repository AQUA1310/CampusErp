import { useState } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/hooks/useAuth";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Check, X, Calendar } from "lucide-react";

export default function StudentAttendance() {
  const { user } = useAuth();
  const { attendanceSummary, attendance } = useData();
  
  const studentAttendanceSummary = attendanceSummary.find(summary => 
    summary.studentId === user?.id || summary.rollNumber === user?.rollNumber
  );
  
  const attendanceRecords = attendance.filter(record => {
    const studentRecord = record.students.find(s => 
      s.studentId === user?.id || s.rollNumber === user?.rollNumber
    );
    return !!studentRecord;
  });
  
  const attendanceBySubject = attendanceRecords.reduce((acc, record) => {
    if (!acc[record.subjectId]) {
      acc[record.subjectId] = {
        subjectName: record.subjectName,
        records: []
      };
    }
    
    const studentRecord = record.students.find(s => 
      s.studentId === user?.id || s.rollNumber === user?.rollNumber
    );
    
    if (studentRecord) {
      acc[record.subjectId].records.push({
        date: record.date,
        present: studentRecord.present
      });
    }
    
    return acc;
  }, {} as Record<string, { subjectName: string; records: { date: string; present: boolean }[] }>);
  
  return (
    <DashboardLayout title="Attendance" subtitle="View your attendance records and statistics">
      <div className="space-y-6">
        <Card className="shadow-md">
          <CardHeader className="bg-primary/5">
            <CardTitle>Attendance Summary</CardTitle>
            <CardDescription>
              Your overall attendance percentage for all subjects
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {studentAttendanceSummary ? (
              <div>
                <div className="mb-6">
                  <div className="text-2xl font-bold mb-2">
                    {studentAttendanceSummary.overall.percentage.toFixed(2)}%
                  </div>
                  <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        studentAttendanceSummary.overall.percentage >= 85 
                          ? "bg-green-500" 
                          : studentAttendanceSummary.overall.percentage >= 75 
                          ? "bg-yellow-500" 
                          : "bg-red-500"
                      }`}
                      style={{ width: `${studentAttendanceSummary.overall.percentage}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 flex justify-between text-sm text-gray-500">
                    <span>Total Classes: {studentAttendanceSummary.overall.totalClasses}</span>
                    <span>Present: {studentAttendanceSummary.overall.attended}</span>
                    <span>Absent: {studentAttendanceSummary.overall.totalClasses - studentAttendanceSummary.overall.attended}</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Subject-wise Attendance</h3>
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-primary/5">
                          <TableHead>Subject</TableHead>
                          <TableHead>Total Classes</TableHead>
                          <TableHead className="text-center">Present</TableHead>
                          <TableHead className="text-center">Absent</TableHead>
                          <TableHead className="text-right">Percentage</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {studentAttendanceSummary.subjects.map((subject, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{subject.subjectName}</TableCell>
                            <TableCell>{subject.totalClasses}</TableCell>
                            <TableCell className="text-center">{subject.attended}</TableCell>
                            <TableCell className="text-center">{subject.totalClasses - subject.attended}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <div className="w-24">
                                  <Progress 
                                    value={subject.percentage} 
                                    className={`h-2 ${
                                      subject.percentage >= 85 
                                        ? "bg-green-500" 
                                        : subject.percentage >= 75 
                                        ? "bg-yellow-500" 
                                        : "bg-red-500"
                                    }`}
                                  />
                                </div>
                                <span 
                                  className={`${
                                    subject.percentage >= 85 
                                      ? "text-green-600" 
                                      : subject.percentage >= 75 
                                      ? "text-yellow-600" 
                                      : "text-red-600"
                                  } font-medium`}
                                >
                                  {subject.percentage.toFixed(2)}%
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No attendance data available at this time.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Detailed Attendance Records</h2>
          
          {Object.entries(attendanceBySubject).map(([subjectId, data]) => (
            <Card key={subjectId} className="shadow-md">
              <CardHeader className="bg-primary/5">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{data.subjectName}</CardTitle>
                    <CardDescription>
                      Day-wise attendance records
                    </CardDescription>
                  </div>
                  <div className="bg-primary/10 px-3 py-1 rounded-full text-sm font-medium">
                    {data.records.length} Classes
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-primary/5">
                        <TableHead>Date</TableHead>
                        <TableHead className="text-center">Day</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.records.map((record, index) => {
                        const date = new Date(record.date);
                        const formattedDate = date.toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        });
                        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
                        
                        return (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                {formattedDate}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">{dayOfWeek}</TableCell>
                            <TableCell className="text-right">
                              {record.present ? (
                                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <Check className="mr-1 h-3 w-3" />
                                  Present
                                </div>
                              ) : (
                                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  <X className="mr-1 h-3 w-3" />
                                  Absent
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
