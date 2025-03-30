
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar, Users, Check, X, AlertCircle, Download } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/shared/DashboardLayout";

export default function TeacherAttendance() {
  const { students, subjects, attendance, markAttendance, exportAttendance } = useData();
  const { user } = useAuth();
  
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.id || "");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [studentAttendance, setStudentAttendance] = useState<{ studentId: string; present: boolean }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Sort students by roll number
  const sortedStudents = [...students].sort((a, b) => 
    a.rollNumber.localeCompare(b.rollNumber)
  );
  
  // Initialize student attendance when subject or date changes
  useEffect(() => {
    const existingAttendance = attendance.find(
      a => a.subjectId === selectedSubject && a.date === selectedDate
    );
    
    if (existingAttendance) {
      setStudentAttendance(
        existingAttendance.students.map(s => ({
          studentId: s.studentId,
          present: s.present
        }))
      );
    } else {
      setStudentAttendance(
        sortedStudents.map(student => ({
          studentId: student.id,
          present: true
        }))
      );
    }
  }, [selectedSubject, selectedDate, attendance, sortedStudents]);
  
  const toggleAttendance = (studentId: string) => {
    setStudentAttendance(prev => 
      prev.map(item => 
        item.studentId === studentId 
          ? { ...item, present: !item.present } 
          : item
      )
    );
  };
  
  const markAllPresent = () => {
    setStudentAttendance(prev => 
      prev.map(item => ({ ...item, present: true }))
    );
    toast.success("Marked all students present");
  };
  
  const markAllAbsent = () => {
    setStudentAttendance(prev => 
      prev.map(item => ({ ...item, present: false }))
    );
    toast.success("Marked all students absent");
  };
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Make sure we're tracking all students
    const allStudentsAttendance = sortedStudents.map(student => {
      const existing = studentAttendance.find(sa => sa.studentId === student.id);
      return {
        studentId: student.id,
        present: existing ? existing.present : true
      };
    });
    
    setTimeout(() => {
      markAttendance(selectedSubject, selectedDate, allStudentsAttendance);
      setIsSubmitting(false);
      toast.success("Attendance submitted successfully");
    }, 1000);
  };
  
  const handleExportAttendance = () => {
    if (attendance.filter(a => a.subjectId === selectedSubject).length === 0) {
      toast.error("No attendance data available to export. Please mark attendance first.");
      return;
    }
    
    exportAttendance(selectedSubject);
    toast.success("Attendance data exported to Excel. Download started.");
    
    // Create a fake download link to simulate file download
    const link = document.createElement('a');
    link.href = '#';
    link.setAttribute('download', `attendance_${selectedSubject}_${new Date().toISOString().split('T')[0]}.xlsx`);
    link.click();
  };
  
  const getAttendancePercentage = (studentId: string) => {
    const studentAttendances = attendance.filter(a => 
      a.subjectId === selectedSubject && 
      a.students.some(s => s.studentId === studentId)
    );
    
    if (studentAttendances.length === 0) return 0;
    
    const totalClasses = studentAttendances.length;
    const attendedClasses = studentAttendances.filter(a => 
      a.students.find(s => s.studentId === studentId)?.present
    ).length;
    
    return (attendedClasses / totalClasses) * 100;
  };
  
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

  return (
    <DashboardLayout title="Attendance" subtitle="Mark and manage student attendance">
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4 flex flex-col gap-2">
            <label htmlFor="subject" className="text-sm font-medium text-navy-800">
              Select Subject
            </label>
            <select
              id="subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full h-10 rounded-md border border-navy-200 bg-background px-3 py-2 text-sm focus:outline-primary"
            >
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="p-4 flex flex-col gap-2">
            <label htmlFor="date" className="text-sm font-medium text-navy-800">
              Select Date
            </label>
            <input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full h-10 rounded-md border border-navy-200 bg-background px-3 py-2 text-sm focus:outline-primary"
            />
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-navy-800">Quick Actions</h3>
              <p className="text-xs text-navy-600">Mark all students at once</p>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm"
                variant="outline" 
                className="border-success-300 text-success-700 hover:bg-success-50"
                onClick={markAllPresent}
              >
                <Check className="h-4 w-4 mr-1" />
                All Present
              </Button>
              <Button 
                size="sm"
                variant="outline" 
                className="border-danger-300 text-danger-700 hover:bg-danger-50"
                onClick={markAllAbsent}
              >
                <X className="h-4 w-4 mr-1" />
                All Absent
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-md">
        <CardHeader className="bg-navy-50 border-b border-navy-100 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-navy-800">Mark Attendance</CardTitle>
              <CardDescription className="text-navy-600">
                {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardDescription>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleExportAttendance}
                className="border-primary text-primary hover:bg-primary/10"
              >
                <Download className="h-4 w-4 mr-2" />
                Export to Excel
              </Button>
              <Badge className="bg-navy-100 text-navy-800 hover:bg-navy-200 flex items-center gap-1">
                <Users className="h-3 w-3" />
                {students.length} Students
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Alert className="m-4 bg-blue-50 text-blue-800 border-blue-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Attendance Instructions</AlertTitle>
            <AlertDescription className="text-blue-700">
              Mark each student as present or absent. Make sure to check attendance carefully and submit when complete.
            </AlertDescription>
          </Alert>
          
          <div className="max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10">
                <TableRow className="bg-navy-50/50">
                  <TableHead className="w-[100px]">Roll No</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead className="text-center">Attendance</TableHead>
                  <TableHead className="text-right">Subject Attendance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedStudents.map((student) => {
                  const studentAttendanceRecord = studentAttendance.find(
                    sa => sa.studentId === student.id
                  );
                  const isPresent = studentAttendanceRecord?.present ?? true;
                  const attendancePercentage = getAttendancePercentage(student.id);
                  
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.rollNumber}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className={`border ${
                              isPresent 
                                ? "bg-success-100 border-success-300 text-success-700" 
                                : "bg-white border-success-200 text-success-400"
                            } hover:bg-success-50 hover:text-success-700`}
                            onClick={() => toggleAttendance(student.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Present
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className={`border ${
                              !isPresent 
                                ? "bg-danger-100 border-danger-300 text-danger-700" 
                                : "bg-white border-danger-200 text-danger-400"
                            } hover:bg-danger-50 hover:text-danger-700`}
                            onClick={() => toggleAttendance(student.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Absent
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-24">
                            <div className="text-xs text-right mb-1">
                              {attendancePercentage.toFixed(1)}%
                            </div>
                            <Progress 
                              value={attendancePercentage} 
                              className={`h-2 ${getAttendanceBgColor(attendancePercentage)}`}
                            />
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`
                              ${attendancePercentage >= 90 
                                ? "bg-success-50 text-success-700 border-success-200" 
                                : attendancePercentage >= 85 
                                ? "bg-warning-50 text-warning-700 border-warning-200"
                                : "bg-danger-50 text-danger-700 border-danger-200"
                              }
                            `}
                          >
                            {attendancePercentage.toFixed(0)}%
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          <div className="p-4 border-t border-navy-100 bg-navy-50/30 flex justify-end">
            <Button
              className="min-w-32 bg-primary text-white"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Attendance"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
