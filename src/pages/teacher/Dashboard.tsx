import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ArrowUpRight, Calendar as CalendarIcon, GraduationCap, Users, CheckCircle, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Assignment } from "@/contexts/DataContext";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { students, assignments, subjects, attendance, addAssignment } = useData();

  const [showModal, setShowModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [calendarValue, setCalendarValue] = useState<Date>();
  const [performanceSubject, setPerformanceSubject] = useState("");

  const formattedDate = calendarValue ? format(calendarValue, "yyyy-MM-dd") : "";

  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    dueDate: formattedDate,
    subject: "",
    subjectId: "",
    maxMarks: ""
  });

  const [scheduleFormValues, setScheduleFormValues] = useState({
    subject: "",
    date: formattedDate,
    startTime: "",
    endTime: "",
    room: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleScheduleFormChange = (name: string, value: string) => {
    setScheduleFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAssignment = (data: any) => {
    const newAssignment: Assignment = {
      id: `assign-${Date.now()}`,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      subject: data.subject,
      subjectId: data.subjectId,
      subjectName: subjects.find(s => s.id === data.subjectId)?.name || data.subject,
      status: 'pending',
      teacherId: user?.id || '',
      maxMarks: parseInt(data.maxMarks, 10)
    };

    addAssignment(newAssignment);
    setShowModal(false);

    toast.success("Assignment added successfully");
  };

  const handleScheduleClass = () => {
    setShowScheduleModal(false);
    toast.success("Class scheduled successfully");
  };

  const totalStudents = students.length;
  const totalAssignments = assignments.length;

  const now = new Date();
  const upcomingAssignments = assignments.filter(assignment => new Date(assignment.dueDate) > now).length;

  const attendanceRate = (attendance.filter(record => record.status === 'present').length / attendance.length) * 100;

  const studentPerformanceData = [
    { name: "Excellent", value: 30 },
    { name: "Good", value: 40 },
    { name: "Average", value: 20 },
    { name: "Poor", value: 10 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
        {`${studentPerformanceData[index].name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const safeToFixed = (value: number | undefined, digits: number = 2): string => {
    if (value === undefined || value === null) {
      return '0.00';
    }
    return value.toFixed(digits);
  };

  return (
    <DashboardLayout title="Dashboard" subtitle="Welcome to your teacher dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-sm text-gray-500">
              <ArrowUpRight className="inline-block h-4 w-4 text-green-500 mr-1" />
              {safeToFixed(attendanceRate)}% increase in attendance this month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <GraduationCap className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssignments}</div>
            <p className="text-sm text-gray-500">
              <ArrowUpRight className="inline-block h-4 w-4 text-green-500 mr-1" />
              {upcomingAssignments} upcoming assignments
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-sm text-gray-500">
              <ArrowUpRight className="inline-block h-4 w-4 text-green-500 mr-1" />
              View scheduled classes
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeToFixed(attendanceRate)}%</div>
            <p className="text-sm text-gray-500">
              <ArrowUpRight className="inline-block h-4 w-4 text-green-500 mr-1" />
              Track student attendance
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="col-span-1">
          <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-lg">
            <CardTitle className="text-slate-800">Student Performance</CardTitle>
            <CardDescription className="text-slate-600">
              Filter by subject to view student performance
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <Select value={performanceSubject} onValueChange={setPerformanceSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={studentPerformanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {studentPerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-lg">
            <CardTitle className="text-slate-800">Class Schedule</CardTitle>
            <CardDescription className="text-slate-600">
              View upcoming classes and manage your schedule
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Room</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Calculus</TableCell>
                  <TableCell>9:00 AM - 10:00 AM</TableCell>
                  <TableCell>LH-1</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Linear Algebra</TableCell>
                  <TableCell>10:00 AM - 11:00 AM</TableCell>
                  <TableCell>LH-2</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Differential Equations</TableCell>
                  <TableCell>11:15 AM - 12:15 PM</TableCell>
                  <TableCell>LH-3</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Button onClick={() => setShowScheduleModal(true)} className="mt-4 w-full">
              Schedule Class
            </Button>
          </CardContent>
        </Card>

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Assignment</DialogTitle>
              <DialogDescription>
                Create a new assignment for your students
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={formValues.title}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formValues.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">
                  Subject
                </Label>
                <Select onValueChange={(value) => setFormValues(prev => ({ ...prev, subjectId: value, subject: subjects.find(s => s.id === value)?.name || "" }))} defaultValue={formValues.subjectId}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">
                  Due Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !calendarValue && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {calendarValue ? format(calendarValue, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      captionLayout="dropdown"
                      selected={calendarValue}
                      onSelect={setCalendarValue}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="maxMarks" className="text-right">
                  Max Marks
                </Label>
                <Input
                  type="number"
                  id="maxMarks"
                  name="maxMarks"
                  value={formValues.maxMarks}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="ghost" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => handleAddAssignment(formValues)}
                className="bg-slate-900 text-white"
              >
                Create Assignment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Class</DialogTitle>
              <DialogDescription>
                Schedule a new class for your students
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">
                  Subject
                </Label>
                <Select value={scheduleFormValues.subject} onValueChange={(value) => handleScheduleFormChange('subject', value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !calendarValue && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {calendarValue ? format(calendarValue, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      captionLayout="dropdown"
                      selected={calendarValue}
                      onSelect={(date) => {
                        setCalendarValue(date);
                        handleScheduleFormChange('date', format(date!, "yyyy-MM-dd"));
                      }}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startTime" className="text-right">
                  Start Time
                </Label>
                <Input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={scheduleFormValues.startTime}
                  onChange={(e) => handleScheduleFormChange('startTime', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endTime" className="text-right">
                  End Time
                </Label>
                <Input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={scheduleFormValues.endTime}
                  onChange={(e) => handleScheduleFormChange('endTime', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room" className="text-right">
                  Room
                </Label>
                <Input
                  type="text"
                  id="room"
                  name="room"
                  value={scheduleFormValues.room}
                  onChange={(e) => handleScheduleFormChange('room', e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleScheduleClass}
                className="bg-slate-900 text-white"
              >
                Schedule Class
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
