import { useState, useEffect, useMemo } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, BookOpen, CalendarCheck, Award, Bell, MessageSquare } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Assignment } from "@/contexts/DataContext";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { assignments, notifications, attendanceSummary, subjects, addNotification } = useData();
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Function to get the current day of the week
  const getCurrentDay = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    return days[today.getDay()];
  };

  // Function to format notification date
  const formatNotificationDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffInHours < 24) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffInHours < 48) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Function to get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return <BookOpen className="h-5 w-5 text-blue-600" />;
      case "attendance":
        return <CalendarCheck className="h-5 w-5 text-yellow-600" />;
      case "result":
        return <Award className="h-5 w-5 text-green-600" />;
      case "announcement":
        return <Bell className="h-5 w-5 text-purple-600" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-600" />;
    }
  };

  // Function to handle adding a new event
  const handleAddEvent = (data: any) => {
    // Add the event to calendar events
    const newEvent = {
      id: `event-${Date.now()}`,
      title: data.title,
      date: data.date,
      type: data.type === 'exam' ? 'announcement' : 'other',
      description: data.description
    };
    
    setCalendarEvents([...calendarEvents, newEvent]);
    
    // Add a notification for students
    addNotification({
      title: data.title,
      content: data.description,
      type: data.type === 'exam' ? 'announcement' : 'other',
      link: '/student-dashboard'
    });
    
    // Close modal
    setShowEventModal(false);
  };

  // Function to handle adding a new assignment
  const handleAddAssignment = (data: any) => {
    setShowAssignmentModal(false);
  };

  // Get upcoming assignments
  const upcomingAssignments = useMemo(() => {
    return assignments
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 3);
  }, [assignments]);

  // Get recent notifications
  const recentNotifications = useMemo(() => {
    return notifications
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  }, [notifications]);

  // Get attendance summary for current student
  const studentSummary = attendanceSummary.find(
    (summary) => summary.studentId === user?.id
  );

  const attendanceStat = studentSummary ? {
    totalClasses: studentSummary.overall?.totalClasses || 0,
    attended: studentSummary.overall?.attended || 0,
    percentage: studentSummary.overall?.percentage || 0,
    status: studentSummary.overall?.percentage >= 85 
      ? "Good" 
      : studentSummary.overall?.percentage >= 75 
      ? "Warning" 
      : "Critical"
  } : {
    totalClasses: 0,
    attended: 0,
    percentage: 0,
    status: "Good"
  };

  return (
    <DashboardLayout title="Dashboard" subtitle="Welcome to your dashboard">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Attendance</CardTitle>
            <CardDescription>Your attendance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm">Total Classes</div>
                <div className="font-medium">{attendanceStat.totalClasses}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">Classes Attended</div>
                <div className="font-medium">{attendanceStat.attended}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">Attendance Percentage</div>
                <Badge
                  variant="secondary"
                  className={`${
                    attendanceStat.percentage >= 85
                      ? "bg-green-50 text-green-700 border-green-200"
                      : attendanceStat.percentage >= 75
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  {attendanceStat.percentage.toFixed(1)}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">Attendance Status</div>
                <div className="font-medium">{attendanceStat.status}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Assignments</CardTitle>
            <CardDescription>Your next 3 assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingAssignments.map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between">
                  <div className="text-sm">{assignment.title}</div>
                  <Badge variant="outline">{new Date(assignment.dueDate).toLocaleDateString()}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>Your latest notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-center justify-between rounded-md border p-3 shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {notification.content}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatNotificationDate(notification.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subjects</CardTitle>
            <CardDescription>Your subjects and attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {studentSummary?.subjects?.slice(0, 3).map((subject) => (
                <div key={subject.subjectId} className="flex items-center justify-between">
                  <div className="text-sm">{subject.subjectName}</div>
                  <Badge
                    variant="outline"
                    className={`${
                      subject.percentage >= 85
                        ? "bg-green-50 text-green-700 border-green-200"
                        : subject.percentage >= 75
                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {subject.percentage.toFixed(0)}%
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="link" className="mt-4">
              View All Subjects
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Your events and assignments</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="relative">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={{ before: new Date() }}
                    className="border-0 shadow-md"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex justify-between">
              <Button onClick={() => setShowEventModal(true)}>Add Event</Button>
              <Button onClick={() => setShowAssignmentModal(true)}>Add Assignment</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Event Modal */}
      <AlertDialog open={showEventModal} onOpenChange={setShowEventModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Event</AlertDialogTitle>
            <AlertDialogDescription>
              Add a new event to your calendar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input id="title" defaultValue="Event Title" className="col-span-3" />
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
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={{ before: new Date() }}
                    className="border-0 shadow-md"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exam">Exam</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right mt-2">
                Description
              </Label>
              <Textarea id="description" className="col-span-3" />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowEventModal(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => handleAddEvent}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Assignment Modal */}
      <AlertDialog open={showAssignmentModal} onOpenChange={setShowAssignmentModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Assignment</AlertDialogTitle>
            <AlertDialogDescription>
              Add a new assignment to your calendar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input id="title" defaultValue="Assignment Title" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Subject
              </Label>
              <Select>
                <SelectTrigger className="w-[180px]">
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
                Due Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={{ before: new Date() }}
                    className="border-0 shadow-md"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right mt-2">
                Description
              </Label>
              <Textarea id="description" className="col-span-3" />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowAssignmentModal(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => handleAddAssignment}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
