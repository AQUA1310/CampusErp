
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
import { Calendar, Users, Check, X, AlertCircle, Download, FileDown, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/shared/DashboardLayout";

export default function TeacherAttendance() {
  const { students,subjects, attendance, markAttendance } = useData();
  
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.id || "");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [studentAttendance, setStudentAttendance] = useState<{ studentId: string; present: boolean }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canResubmit, setCanResubmit] = useState(true);
  
  // Get all students with roll numbers starting with 24MAB0A
  const classMabStudents = students.filter(student => 
    student.rollNumber.startsWith('24MAB0A')
  ).sort((a, b) => a.rollNumber.localeCompare(b.rollNumber));
  
  // Effect to initialize student attendance when subject or date changes
  useEffect(() => {
    const existingAttendance = attendance.find(
      a => a.subjectId === selectedSubject && a.date === selectedDate
    );
    
    if (existingAttendance) {
      // Create a map of existing attendance records
      const attendanceMap = new Map(
        existingAttendance.students.map(s => [s.studentId, s.present])
      );
      
      // Initialize attendance for all students based on the map
      setStudentAttendance(
        classMabStudents.map(student => ({
          studentId: student.id,
          present: attendanceMap.has(student.id) ? attendanceMap.get(student.id)! : true
        }))
      );
      
      // If attendance already exists, disable resubmit initially
      setCanResubmit(false);
    } else {
      // For new attendance, all students are present by default
      setStudentAttendance(
        classMabStudents.map(student => ({
          studentId: student.id,
          present: true
        }))
      );
      
      // New attendance can be submitted
      setCanResubmit(true);
    }
  }, [selectedSubject, selectedDate, attendance, classMabStudents]);
  
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
    
    setTimeout(() => {
      markAttendance(selectedSubject, selectedDate, studentAttendance);
      setIsSubmitting(false);
      setCanResubmit(false);
      toast.success("Attendance submitted successfully");
    }, 1000);
  };
  
  const enableResubmit = () => {
    setCanResubmit(true);
    toast.info("You can now resubmit the attendance data");
  };
  
  const downloadAttendanceData = () => {
    const existingAttendance = attendance.find(
      a => a.subjectId === selectedSubject && a.date === selectedDate
    );
    
    if (!existingAttendance) {
      toast.error("No attendance data to download");
      return;
    }
    
    // Create CSV content
    const subject = subjects.find(s => s.id === selectedSubject);
    const headers = ["Roll Number", "Student Name", "Status"];
    const rows = existingAttendance.students.map(student => [
      student.rollNumber,
      student.name,
      student.present ? "Present" : "Absent"
    ]);
    
    const csvContent = [
      `Subject: ${subject?.name || "Unknown Subject"}`,
      `Date: ${new Date(selectedDate).toLocaleDateString()}`,
      "",
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance_${subject?.name}_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Attendance data downloaded");
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

  return (
    <DashboardLayout title="Attendance" subtitle="Mark and manage student attendance">
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4 flex flex-col gap-2">
            <label htmlFor="subject" className="text-sm font-medium text-gray-700">
              Select Subject
            </label>
            <select
              id="subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full h-10 rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-primary"
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
            <label htmlFor="date" className="text-sm font-medium text-gray-700">
              Select Date
            </label>
            <input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full h-10 rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-primary"
            />
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Quick Actions</h3>
              <p className="text-xs text-gray-600">Mark all students at once</p>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm"
                variant="outline" 
                className="border-green-300 text-green-700 hover:bg-green-50"
                onClick={markAllPresent}
              >
                <Check className="h-4 w-4 mr-1" />
                All Present
              </Button>
              <Button 
                size="sm"
                variant="outline" 
                className="border-red-300 text-red-700 hover:bg-red-50"
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
        <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-slate-800">Mark Attendance</CardTitle>
              <CardDescription className="text-slate-600">
                {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardDescription>
            </div>
            <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-200 flex items-center gap-1">
              <Users className="h-3 w-3" />
              {classMabStudents.length} Students
            </Badge>
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
          
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="w-[100px]">Roll No</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead className="text-center">Attendance</TableHead>
                <TableHead className="text-right">Subject Attendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classMabStudents.map((student) => {
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
                              ? "bg-green-100 border-green-300 text-green-700" 
                              : "bg-white border-green-200 text-green-400"
                          } hover:bg-green-50 hover:text-green-700`}
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
                              ? "bg-red-100 border-red-300 text-red-700" 
                              : "bg-white border-red-200 text-red-400"
                          } hover:bg-red-50 hover:text-red-700`}
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
                            className={`h-2 ${
                              attendancePercentage >= 90 
                                ? "bg-green-100" 
                                : attendancePercentage >= 85 
                                ? "bg-yellow-100"
                                : "bg-red-100"
                            }`}
                          />
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`
                            ${attendancePercentage >= 90 
                              ? "bg-green-50 text-green-700 border-green-200" 
                              : attendancePercentage >= 85 
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : "bg-red-50 text-red-700 border-red-200"
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
          
          <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex justify-between">
            <div>
              <Button
                variant="outline"
                onClick={downloadAttendanceData}
                className="mr-2"
              >
                <FileDown className="h-4 w-4 mr-2" />
                Download Attendance
              </Button>
              
              {!canResubmit && (
                <Button
                  variant="outline"
                  onClick={enableResubmit}
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Enable Re-submission
                </Button>
              )}
            </div>
            
            <Button
              className="min-w-32"
              onClick={handleSubmit}
              disabled={isSubmitting || !canResubmit}
            >
              {isSubmitting ? "Submitting..." : canResubmit ? "Submit Attendance" : "Already Submitted"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
