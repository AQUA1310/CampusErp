
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Calendar, 
  CalendarDays, 
  Check, 
  X, 
  Info 
} from "lucide-react";
import { useData } from "@/contexts/DataContext";
import DashboardLayout from "@/components/shared/DashboardLayout";

export default function StudentAttendance() {
  const { attendanceSummary, attendance } = useData();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  
  const studentAttendance = attendanceSummary.find(
    (a) => a.studentId === "1" // For the demo, we use the fixed student (Dhruv)
  );

  const getColorClass = (percentage: number) => {
    if (percentage >= 90) return "text-success-600";
    if (percentage >= 85) return "text-warning-600";
    return "text-danger-600";
  };

  const getProgressColorClass = (percentage: number) => {
    if (percentage >= 90) return "bg-success-500";
    if (percentage >= 85) return "bg-warning-500";
    return "bg-danger-500";
  };

  const getProgressBgColorClass = (percentage: number) => {
    if (percentage >= 90) return "bg-success-100";
    if (percentage >= 85) return "bg-warning-100";
    return "bg-danger-100";
  };

  const getMarksFromAttendance = (percentage: number) => {
    if (percentage <= 80) return 0;
    if (percentage <= 85) return 2;
    if (percentage <= 90) return 4;
    if (percentage <= 95) return 7;
    return 10;
  };

  const subjectAttendanceRecords = selectedSubject
    ? attendance.filter(
        (record) => record.subjectId === selectedSubject
      ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  return (
    <DashboardLayout title="Attendance" subtitle="Track your class attendance">
      <Tabs defaultValue="subject" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="subject" className="data-[state=active]:bg-oliveGreen-100 data-[state=active]:text-oliveGreen-900">
            Subject-wise
          </TabsTrigger>
          <TabsTrigger value="daily" className="data-[state=active]:bg-oliveGreen-100 data-[state=active]:text-oliveGreen-900">
            Daily Attendance
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="subject" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Overall Attendance Card */}
            <div className="md:col-span-2">
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3 bg-oliveGreen-50 border-b border-oliveGreen-100 rounded-t-lg">
                  <CardTitle className="text-oliveGreen-800 flex items-center justify-between">
                    <span>Overall Attendance</span>
                    <div className="flex items-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="text-oliveGreen-500 hover:text-oliveGreen-700">
                            <Info className="h-5 w-5" />
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Attendance Marking Scheme</DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Attendance</TableHead>
                                  <TableHead>Marks (out of 10)</TableHead>
                                  <TableHead>Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell>≤ 80%</TableCell>
                                  <TableCell>0</TableCell>
                                  <TableCell><Badge variant="destructive">Low</Badge></TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>81 - 85%</TableCell>
                                  <TableCell>2</TableCell>
                                  <TableCell><Badge variant="outline" className="bg-warning-100 text-warning-700 hover:bg-warning-200">Needs Improvement</Badge></TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>86 - 90%</TableCell>
                                  <TableCell>4</TableCell>
                                  <TableCell><Badge variant="outline" className="bg-warning-100 text-warning-700 hover:bg-warning-200">Moderate</Badge></TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>91 - 95%</TableCell>
                                  <TableCell>7</TableCell>
                                  <TableCell><Badge variant="outline" className="bg-success-100 text-success-700 hover:bg-success-200">Good</Badge></TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>96 - 100%</TableCell>
                                  <TableCell>10</TableCell>
                                  <TableCell><Badge variant="outline" className="bg-success-100 text-success-700 hover:bg-success-200">Excellent</Badge></TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardTitle>
                  <CardDescription className="text-oliveGreen-600">
                    Your attendance across all subjects
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="relative w-32 h-32 mx-auto">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle
                            className="text-oliveGreen-100"
                            strokeWidth="10"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                          />
                          <circle
                            className={getProgressColorClass(studentAttendance?.overall.percentage || 0)}
                            strokeWidth="10"
                            strokeDasharray={`${
                              ((studentAttendance?.overall.percentage || 0) * 2.51327412)
                            } 251.327412`}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className={`text-2xl font-bold ${getColorClass(studentAttendance?.overall.percentage || 0)}`}>
                            {studentAttendance?.overall.percentage.toFixed(1)}%
                          </span>
                          <span className="text-xs text-oliveGreen-500">
                            {studentAttendance?.overall.attended}/{studentAttendance?.overall.totalClasses} classes
                          </span>
                        </div>
                      </div>
                      <div className="text-center mt-2">
                        <Badge variant="outline" className={`
                          ${studentAttendance?.overall.percentage >= 90 
                            ? "bg-success-100 text-success-700 hover:bg-success-200" 
                            : studentAttendance?.overall.percentage >= 85 
                            ? "bg-warning-100 text-warning-700 hover:bg-warning-200"
                            : "bg-danger-100 text-danger-700 hover:bg-danger-200"
                          }
                        `}>
                          Marks: {getMarksFromAttendance(studentAttendance?.overall.percentage || 0)}/10
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      {studentAttendance?.subjects.map((subject) => (
                        <Dialog key={subject.subjectId}>
                          <DialogTrigger asChild>
                            <div className="cursor-pointer hover:bg-oliveGreen-50 p-2 rounded-lg transition-colors" onClick={() => setSelectedSubject(subject.subjectId)}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-oliveGreen-800">
                                  {subject.subjectName}
                                </span>
                                <span className={getColorClass(subject.percentage)}>
                                  {subject.percentage.toFixed(1)}%
                                </span>
                              </div>
                              <Progress 
                                value={subject.percentage} 
                                className={getProgressBgColorClass(subject.percentage)}
                                indicatorClassName={getProgressColorClass(subject.percentage)}
                              />
                              <div className="flex justify-between text-xs mt-1">
                                <span className="text-oliveGreen-600">
                                  {subject.attended}/{subject.totalClasses} classes
                                </span>
                                <span className={getColorClass(subject.percentage)}>
                                  Marks: {getMarksFromAttendance(subject.percentage)}/10
                                </span>
                              </div>
                            </div>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>{subject.subjectName} Attendance</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                              <div className="flex items-center justify-between mb-4">
                                <div className="text-center px-4 py-2 bg-oliveGreen-50 rounded-lg">
                                  <div className="text-sm text-oliveGreen-600">Attended</div>
                                  <div className="text-xl font-bold text-oliveGreen-800">{subject.attended}</div>
                                </div>
                                <div className="text-center px-4 py-2 bg-oliveGreen-50 rounded-lg">
                                  <div className="text-sm text-oliveGreen-600">Total Classes</div>
                                  <div className="text-xl font-bold text-oliveGreen-800">{subject.totalClasses}</div>
                                </div>
                                <div className="text-center px-4 py-2 bg-oliveGreen-50 rounded-lg">
                                  <div className="text-sm text-oliveGreen-600">Percentage</div>
                                  <div className={`text-xl font-bold ${getColorClass(subject.percentage)}`}>
                                    {subject.percentage.toFixed(1)}%
                                  </div>
                                </div>
                              </div>
                              
                              <div className="border rounded-lg overflow-hidden">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Date</TableHead>
                                      <TableHead className="text-center">Status</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {subjectAttendanceRecords.map((record) => {
                                      const studentRecord = record.students.find(
                                        (s) => s.studentId === "1"
                                      );
                                      return (
                                        <TableRow key={record.id}>
                                          <TableCell>
                                            {new Date(record.date).toLocaleDateString()}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            {studentRecord?.present ? (
                                              <div className="inline-flex items-center gap-1 px-2 py-1 bg-success-100 text-success-700 rounded">
                                                <Check className="h-4 w-4" />
                                                <span>Present</span>
                                              </div>
                                            ) : (
                                              <div className="inline-flex items-center gap-1 px-2 py-1 bg-danger-100 text-danger-700 rounded">
                                                <X className="h-4 w-4" />
                                                <span>Absent</span>
                                              </div>
                                            )}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })}
                                    {subjectAttendanceRecords.length === 0 && (
                                      <TableRow>
                                        <TableCell colSpan={2} className="text-center text-muted-foreground py-4">
                                          No attendance records found
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="daily" className="mt-0">
          <Card className="shadow-md">
            <CardHeader className="bg-oliveGreen-50 border-b border-oliveGreen-100 rounded-t-lg">
              <CardTitle className="text-oliveGreen-800">Daily Attendance Records</CardTitle>
              <CardDescription className="text-oliveGreen-600">
                Your attendance records by date
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Date</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance
                      .filter((record) => record.students.some((s) => s.studentId === "1"))
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((record) => {
                        const studentRecord = record.students.find(
                          (s) => s.studentId === "1"
                        );
                        return (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-oliveGreen-500" />
                                {new Date(record.date).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell>{record.subjectName}</TableCell>
                            <TableCell className="text-center">
                              {studentRecord?.present ? (
                                <div className="inline-flex items-center gap-1 px-2 py-1 bg-success-100 text-success-700 rounded">
                                  <Check className="h-4 w-4" />
                                  <span>Present</span>
                                </div>
                              ) : (
                                <div className="inline-flex items-center gap-1 px-2 py-1 bg-danger-100 text-danger-700 rounded">
                                  <X className="h-4 w-4" />
                                  <span>Absent</span>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    {attendance.filter((record) => record.students.some((s) => s.studentId === "1")).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                          <Calendar className="mx-auto h-12 w-12 text-oliveGreen-300" />
                          <h3 className="mt-2 text-lg font-medium text-oliveGreen-900">No attendance records</h3>
                          <p className="mt-1 text-sm text-oliveGreen-500">Attendance records will appear here when marked by professors.</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
