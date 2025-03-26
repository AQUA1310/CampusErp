
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
import { Button } from "@/components/ui/button";
import { 
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  RadioGroup,
  RadioGroupItem,
  Label
} from "@/components/ui";
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
  Check, 
  X, 
  UserCheck,
  Users,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useData } from "@/contexts/DataContext";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { toast } from "sonner";

export default function TeacherAttendance() {
  const { students, subjects, attendance, markAttendance } = useData();
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.id || "");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [searchTerm, setSearchTerm] = useState("");
  
  // Initialize studentAttendance with all students marked as present
  const [studentAttendance, setStudentAttendance] = useState<Record<string, boolean>>(
    students.reduce((acc, student) => {
      acc[student.id] = true;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const handleAttendanceChange = (studentId: string, present: boolean) => {
    setStudentAttendance((prev) => ({
      ...prev,
      [studentId]: present,
    }));
  };

  const handleMarkAllAs = (present: boolean) => {
    setStudentAttendance(
      students.reduce((acc, student) => {
        acc[student.id] = present;
        return acc;
      }, {} as Record<string, boolean>)
    );
  };

  const handleSubmitAttendance = () => {
    if (!selectedSubject || !selectedDate) {
      toast.error("Please select subject and date");
      return;
    }

    const attendanceData = Object.entries(studentAttendance).map(
      ([studentId, present]) => ({
        studentId,
        present,
      })
    );

    markAttendance(selectedSubject, selectedDate, attendanceData);
    
    toast.success("Attendance marked successfully");
  };

  const filteredStudents = students.filter((student) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      student.name.toLowerCase().includes(searchTermLower) ||
      student.rollNumber.toLowerCase().includes(searchTermLower)
    );
  }).sort((a, b) => a.rollNumber.localeCompare(b.rollNumber));

  const getExistingAttendance = () => {
    return attendance.find(
      (a) => a.subjectId === selectedSubject && a.date === selectedDate
    );
  };

  const existingAttendance = getExistingAttendance();

  // Update student attendance from existing records if available
  useState(() => {
    if (existingAttendance) {
      const newAttendance = { ...studentAttendance };
      existingAttendance.students.forEach((student) => {
        newAttendance[student.studentId] = student.present;
      });
      setStudentAttendance(newAttendance);
    }
  });

  return (
    <DashboardLayout title="Attendance" subtitle="Mark and manage student attendance">
      <Tabs defaultValue="mark" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger 
            value="mark" 
            className="data-[state=active]:bg-oliveGreen-100 data-[state=active]:text-oliveGreen-900"
          >
            Mark Attendance
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="data-[state=active]:bg-oliveGreen-100 data-[state=active]:text-oliveGreen-900"
          >
            Attendance History
          </TabsTrigger>
        </TabsList>

        {/* Mark Attendance */}
        <TabsContent value="mark" className="mt-0">
          <Card className="shadow-md">
            <CardHeader className="bg-oliveGreen-50 border-b border-oliveGreen-100 rounded-t-lg">
              <CardTitle className="text-oliveGreen-800">Mark Attendance</CardTitle>
              <CardDescription className="text-oliveGreen-600">
                Record student attendance for classes
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Select Subject *
                  </label>
                  <Select
                    value={selectedSubject}
                    onValueChange={setSelectedSubject}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name} ({subject.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="date" className="text-sm font-medium">
                    Select Date *
                  </label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="w-full md:w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-oliveGreen-500" />
                    <Input
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    className="border-success-200 text-success-700 hover:bg-success-50 hover:text-success-800"
                    onClick={() => handleMarkAllAs(true)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    <span>Mark All Present</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-danger-200 text-danger-700 hover:bg-danger-50 hover:text-danger-800"
                    onClick={() => handleMarkAllAs(false)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    <span>Mark All Absent</span>
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden mb-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Roll No.</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-center">Attendance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            {student.rollNumber}
                          </TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>
                            <RadioGroup 
                              className="flex justify-center"
                              value={studentAttendance[student.id] ? "present" : "absent"}
                              onValueChange={(value) => handleAttendanceChange(student.id, value === "present")}
                            >
                              <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="present" id={`present-${student.id}`} className="text-success-600" />
                                  <Label htmlFor={`present-${student.id}`} className="text-success-700">Present</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="absent" id={`absent-${student.id}`} className="text-danger-600" />
                                  <Label htmlFor={`absent-${student.id}`} className="text-danger-700">Absent</Label>
                                </div>
                              </div>
                            </RadioGroup>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                          No students found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end">
                <Button 
                  className="bg-oliveGreen-600 hover:bg-oliveGreen-700"
                  onClick={handleSubmitAttendance}
                >
                  {existingAttendance ? "Update Attendance" : "Submit Attendance"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance History */}
        <TabsContent value="history" className="mt-0">
          <Card className="shadow-md">
            <CardHeader className="bg-oliveGreen-50 border-b border-oliveGreen-100 rounded-t-lg">
              <CardTitle className="text-oliveGreen-800">Attendance History</CardTitle>
              <CardDescription className="text-oliveGreen-600">
                Past attendance records
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center gap-4 mb-6">
                <div className="w-full md:w-64">
                  <Select
                    value={selectedSubject}
                    onValueChange={setSelectedSubject}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Subjects</SelectItem>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead className="text-center">Present</TableHead>
                      <TableHead className="text-center">Absent</TableHead>
                      <TableHead className="text-center">Attendance %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance
                      .filter((record) => !selectedSubject || record.subjectId === selectedSubject)
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((record) => {
                        const presentCount = record.students.filter((s) => s.present).length;
                        const absentCount = record.students.filter((s) => !s.present).length;
                        const totalCount = record.students.length;
                        const attendancePercentage = (presentCount / totalCount) * 100;
                        
                        return (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-oliveGreen-500" />
                                {new Date(record.date).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell>{record.subjectName}</TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1 text-success-700">
                                <UserCheck className="h-4 w-4" />
                                <span>{presentCount}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1 text-danger-700">
                                <Users className="h-4 w-4" />
                                <span>{absentCount}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge className={`
                                ${attendancePercentage >= 90 
                                  ? "bg-success-100 text-success-700" 
                                  : attendancePercentage >= 75 
                                  ? "bg-oliveGreen-100 text-oliveGreen-700"
                                  : attendancePercentage >= 60
                                  ? "bg-warning-100 text-warning-700" 
                                  : "bg-danger-100 text-danger-700"
                                }
                              `}>
                                {attendancePercentage.toFixed(1)}%
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    {attendance.filter((record) => !selectedSubject || record.subjectId === selectedSubject).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                          <Calendar className="mx-auto h-12 w-12 text-oliveGreen-300" />
                          <h3 className="mt-2 text-lg font-medium text-oliveGreen-900">No attendance records</h3>
                          <p className="mt-1 text-sm text-oliveGreen-500">No attendance has been marked yet.</p>
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
