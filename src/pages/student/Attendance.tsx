
import { useState } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/hooks/useAuth";
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check, X, Calendar, BarChart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StudentAttendance() {
  const { user } = useAuth();
  const { subjects, attendance, attendanceSummary } = useData();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("all");

  // Get attendance summary for current student
  const studentSummary = attendanceSummary.find(
    (summary) => summary.studentId === user?.id
  );

  // Get all attendance records for the student
  const studentAttendance = attendance.filter((record) =>
    record.students?.some((s) => s.studentId === user?.id)
  );

  // Filter by subject if selected
  const filteredAttendance =
    selectedSubjectId === "all"
      ? studentAttendance
      : studentAttendance.filter((record) => record.subjectId === selectedSubjectId);

  // Sort attendance by date (newest first)
  const sortedAttendance = [...filteredAttendance].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Group attendance by subject for day-wise view
  const attendanceBySubject = subjects.map(subject => {
    const subjectAttendance = studentAttendance.filter(
      record => record.subjectId === subject.id
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return {
      subject,
      attendance: subjectAttendance
    };
  });

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format short date
  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Get attendance status color
  const getAttendanceStatusColor = (percentage: number) => {
    if (percentage >= 85) return "text-green-600 bg-green-100";
    if (percentage >= 75) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  // Get attendance progress color
  const getAttendanceProgressColor = (percentage: number) => {
    if (percentage >= 85) return "bg-green-600";
    if (percentage >= 75) return "bg-yellow-600";
    return "bg-red-600";
  };

  return (
    <DashboardLayout
      title="Attendance"
      subtitle="Track your attendance across all subjects"
    >
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
          <Card className="w-full md:w-auto">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Overall Attendance</p>
                  <p className="text-2xl font-bold">
                    {studentSummary?.overall?.percentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex-1 md:flex-none">
            <Select
              value={selectedSubjectId}
              onValueChange={setSelectedSubjectId}
            >
              <SelectTrigger className="w-full md:w-[220px]">
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="summary">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="daywise" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Day-wise
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <Card className="shadow-md">
              <CardHeader className="bg-primary/5">
                <CardTitle>Attendance Summary</CardTitle>
                <CardDescription>
                  Your attendance percentage across all subjects
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-primary/5">
                        <TableHead>Subject</TableHead>
                        <TableHead className="w-[150px] text-center">Classes</TableHead>
                        <TableHead className="w-[150px] text-center">Attended</TableHead>
                        <TableHead className="w-[200px] text-right">Percentage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentSummary?.subjects?.map((subject) => (
                        <TableRow key={subject.subjectId}>
                          <TableCell className="font-medium">
                            {subject.subjectName}
                          </TableCell>
                          <TableCell className="text-center">
                            {subject.totalClasses}
                          </TableCell>
                          <TableCell className="text-center">
                            {subject.attended}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-36">
                                <Progress
                                  value={subject.percentage}
                                  className="h-2"
                                  style={{ 
                                    '--progress-indicator-color': subject.percentage >= 85 
                                      ? 'var(--green-600)' 
                                      : subject.percentage >= 75 
                                        ? 'var(--yellow-600)' 
                                        : 'var(--red-600)'
                                  } as React.CSSProperties}
                                />
                              </div>
                              <Badge
                                variant="outline"
                                className={getAttendanceStatusColor(
                                  subject.percentage
                                )}
                              >
                                {subject.percentage.toFixed(1)}%
                              </Badge>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="shadow-md">
              <CardHeader className="bg-primary/5">
                <CardTitle>Attendance History</CardTitle>
                <CardDescription>
                  Daily attendance records
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-primary/5">
                        <TableHead>Date</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedAttendance.length > 0 ? (
                        sortedAttendance.map((record) => {
                          const studentRecord = record.students?.find(
                            (s) => s.studentId === user?.id
                          );
                          
                          return (
                            <TableRow key={`${record.id}-${user?.id}`}>
                              <TableCell>
                                {formatDate(record.date)}
                              </TableCell>
                              <TableCell className="font-medium">
                                {record.subjectName}
                              </TableCell>
                              <TableCell className="text-center">
                                {studentRecord?.present ? (
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                    <Check className="h-3 w-3 mr-1" />
                                    Present
                                  </Badge>
                                ) : (
                                  <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                                    <X className="h-3 w-3 mr-1" />
                                    Absent
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-center py-8 text-muted-foreground"
                          >
                            No attendance records found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="daywise">
            <Card className="shadow-md">
              <CardHeader className="bg-primary/5">
                <CardTitle>Day-wise Attendance</CardTitle>
                <CardDescription>
                  View your daily attendance status for each subject
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {attendanceBySubject.map(({ subject, attendance }) => (
                  attendance.length > 0 && (
                    <div key={subject.id} className="mb-8">
                      <h3 className="text-lg font-semibold mb-3">{subject.name}</h3>
                      <div className="overflow-x-auto">
                        <div className="flex items-center space-x-2 min-w-max">
                          <div className="w-24 shrink-0"></div>
                          {attendance.map(record => (
                            <div key={record.id} className="w-12 text-center text-xs font-medium">
                              {formatShortDate(record.date)}
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 flex items-center space-x-2 min-w-max">
                          <div className="w-24 text-sm font-medium shrink-0">Attendance</div>
                          {attendance.map(record => {
                            const studentRecord = record.students?.find(s => s.studentId === user?.id);
                            return (
                              <div key={record.id} className="w-12 flex justify-center">
                                {studentRecord?.present ? (
                                  <div className="h-8 w-8 bg-green-100 text-green-800 rounded-full flex items-center justify-center">
                                    <Check className="h-4 w-4" />
                                  </div>
                                ) : (
                                  <div className="h-8 w-8 bg-red-100 text-red-800 rounded-full flex items-center justify-center">
                                    <X className="h-4 w-4" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
