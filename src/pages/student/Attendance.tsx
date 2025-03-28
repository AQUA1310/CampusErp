
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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar,
  Users, 
  BookOpen,
  BarChart2
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/shared/DashboardLayout";

export default function StudentAttendance() {
  const { attendanceSummary, attendance, subjects } = useData();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);

  // Get data for the currently logged-in student
  const studentData = attendanceSummary.find(a => a.studentId === user?.id);
  
  if (!studentData) {
    return (
      <DashboardLayout title="Attendance" subtitle="Your attendance records">
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-danger-500" />
          </div>
          <h3 className="text-xl font-medium text-navy-800">No Attendance Data</h3>
          <p className="text-navy-600 mt-2">
            Your attendance records have not been uploaded yet.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return "bg-success-500";
    if (percentage >= 85) return "bg-warning-500";
    return "bg-danger-500";
  };
  
  const getAttendanceBgColor = (percentage: number) => {
    if (percentage >= 90) return "bg-success-100";
    if (percentage >= 85) return "bg-warning-100";
    return "bg-danger-100";
  };
  
  const getAttendanceTextColor = (percentage: number) => {
    if (percentage >= 90) return "text-success-700";
    if (percentage >= 85) return "text-warning-700";
    return "text-danger-700";
  };
  
  const getAttendanceBgClass = (percentage: number) => {
    if (percentage >= 90) return "bg-success-100";
    if (percentage >= 85) return "bg-warning-100";
    return "bg-danger-100";
  };
  
  const openSubjectModal = (subjectId: string) => {
    const subject = studentData.subjects.find(s => s.subjectId === subjectId);
    if (subject) {
      setSelectedSubject(subject);
      setIsModalOpen(true);
    }
  };
  
  const getSubjectAttendanceRecords = (subjectId: string) => {
    return attendance
      .filter(a => a.subjectId === subjectId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map(a => ({
        ...a,
        status: a.students.find(s => s.studentId === user?.id)?.present
      }));
  };
  
  return (
    <DashboardLayout title="Attendance" subtitle="Your attendance records">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow border border-navy-100 col-span-1">
          <CardHeader className="bg-navy-50 border-b border-navy-100 rounded-t-lg">
            <CardTitle className="text-navy-800">Overall Attendance</CardTitle>
            <CardDescription className="text-navy-600">
              Your current attendance status
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-36 h-36 rounded-full flex items-center justify-center border-8 border-opacity-20" 
                  style={{ 
                    borderColor: studentData.overall.percentage >= 90 
                      ? 'rgba(0, 200, 0, 0.2)' 
                      : studentData.overall.percentage >= 85 
                      ? 'rgba(255, 180, 0, 0.2)' 
                      : 'rgba(255, 0, 0, 0.2)' 
                  }}
                >
                  <div className={`w-28 h-28 rounded-full flex items-center justify-center ${getAttendanceBgClass(studentData.overall.percentage)}`}>
                    <span className={`text-4xl font-bold ${getAttendanceTextColor(studentData.overall.percentage)}`}>
                      {studentData.overall.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-lg text-navy-800">
                  <span className="font-bold">{studentData.overall.attended}</span> / {studentData.overall.totalClasses} classes attended
                </p>
                <p className="text-sm text-navy-600 mt-1">
                  Across all subjects
                </p>
              </div>
              
              <div className="w-full border-t border-navy-100 mt-6 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-navy-50 rounded-lg">
                    <p className="text-sm text-navy-600">Subjects</p>
                    <p className="text-xl font-bold text-navy-800">{studentData.subjects.length}</p>
                  </div>
                  <div className="text-center p-3 bg-navy-50 rounded-lg">
                    <p className="text-sm text-navy-600">Total Classes</p>
                    <p className="text-xl font-bold text-navy-800">{studentData.overall.totalClasses}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow border border-navy-100 col-span-2">
          <CardHeader className="bg-navy-50 border-b border-navy-100 rounded-t-lg">
            <CardTitle className="text-navy-800">Subject-wise Attendance</CardTitle>
            <CardDescription className="text-navy-600">
              Attendance breakdown by subject
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {studentData.subjects.map((subject) => (
                <div 
                  key={subject.subjectId} 
                  className="p-3 border border-navy-100 rounded-lg hover:bg-navy-50 cursor-pointer transition-colors"
                  onClick={() => openSubjectModal(subject.subjectId)}
                >
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium text-navy-900">{subject.subjectName}</h3>
                    <Badge 
                      className={`
                        ${subject.percentage >= 90 
                          ? "bg-success-100 text-success-700 hover:bg-success-200" 
                          : subject.percentage >= 85 
                          ? "bg-warning-100 text-warning-700 hover:bg-warning-200"
                          : "bg-danger-100 text-danger-700 hover:bg-danger-200"
                        }
                      `}
                    >
                      {subject.percentage.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-navy-600">
                          {subject.attended} / {subject.totalClasses} classes
                        </span>
                        <span className={`
                          ${subject.percentage >= 90 ? "text-success-600" : 
                            subject.percentage >= 85 ? "text-warning-600" : 
                            "text-danger-600"}
                        `}>
                          {subject.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        value={subject.percentage} 
                        className={getAttendanceBgClass(subject.percentage)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md hover:shadow-lg transition-shadow border border-navy-100">
        <CardHeader className="bg-navy-50 border-b border-navy-100 rounded-t-lg">
          <CardTitle className="text-navy-800">Attendance Log</CardTitle>
          <CardDescription className="text-navy-600">
            Recent attendance records across all subjects
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all" className="w-full">
            <div className="px-4 pt-4">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="all" className="data-[state=active]:bg-navy-100 data-[state=active]:text-navy-900">
                  All Records
                </TabsTrigger>
                <TabsTrigger value="absent" className="data-[state=active]:bg-navy-100 data-[state=active]:text-navy-900">
                  Absent Days
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow className="bg-navy-50/50">
                    <TableHead>Date</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 10)
                    .map((record) => {
                      const studentRecord = record.students.find(s => s.studentId === user?.id);
                      if (!studentRecord) return null;
                      
                      return (
                        <TableRow key={record.id}>
                          <TableCell>
                            {new Date(record.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </TableCell>
                          <TableCell>{record.subjectName}</TableCell>
                          <TableCell className="text-center">
                            <Badge 
                              className={`
                                ${studentRecord.present 
                                  ? "bg-success-100 text-success-700 hover:bg-success-200" 
                                  : "bg-danger-100 text-danger-700 hover:bg-danger-200"
                                }
                              `}
                            >
                              {studentRecord.present ? "Present" : "Absent"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="absent" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow className="bg-navy-50/50">
                    <TableHead>Date</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance
                    .filter(record => {
                      const studentRecord = record.students.find(s => s.studentId === user?.id);
                      return studentRecord && !studentRecord.present;
                    })
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((record) => {
                      const studentRecord = record.students.find(s => s.studentId === user?.id);
                      if (!studentRecord) return null;
                      
                      return (
                        <TableRow key={record.id}>
                          <TableCell>
                            {new Date(record.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </TableCell>
                          <TableCell>{record.subjectName}</TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-danger-100 text-danger-700 hover:bg-danger-200">
                              Absent
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Subject Attendance Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedSubject && selectedSubject.subjectName} Attendance
            </DialogTitle>
          </DialogHeader>
          
          {selectedSubject && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-navy-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-navy-600">Attendance Rate</p>
                  <p className={`text-2xl font-bold ${getAttendanceTextColor(selectedSubject.percentage)}`}>
                    {selectedSubject.percentage.toFixed(1)}%
                  </p>
                </div>
                
                <div className="bg-navy-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-navy-600">Classes Attended</p>
                  <p className="text-2xl font-bold text-navy-800">
                    {selectedSubject.attended} / {selectedSubject.totalClasses}
                  </p>
                </div>
                
                <div className="bg-navy-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-navy-600">Absences</p>
                  <p className="text-2xl font-bold text-navy-800">
                    {selectedSubject.totalClasses - selectedSubject.attended}
                  </p>
                </div>
              </div>
              
              <div className="rounded-lg border border-navy-100 overflow-hidden">
                <div className="bg-navy-50 px-4 py-3 border-b border-navy-100">
                  <h3 className="font-medium text-navy-800">Attendance Log</h3>
                </div>
                
                <div className="max-h-60 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-navy-50/50">
                        <TableHead>Date</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getSubjectAttendanceRecords(selectedSubject.subjectId).map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            {new Date(record.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge 
                              className={`
                                ${record.status 
                                  ? "bg-success-100 text-success-700 hover:bg-success-200" 
                                  : "bg-danger-100 text-danger-700 hover:bg-danger-200"
                                }
                              `}
                            >
                              {record.status ? "Present" : "Absent"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
