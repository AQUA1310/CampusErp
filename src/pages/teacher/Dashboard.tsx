
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, CheckCircle, AlertCircle, BookOpen, Bell, MessageSquare, Award, CalendarCheck } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
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
import { Assignment } from "@/contexts/DataContext";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { students, assignments, subjects, notifications, addNotification, addAssignment } = useData();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [showEventModal, setShowEventModal] = useState<boolean>(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  useEffect(() => {
    // Load initial calendar events from local storage or default data
    const storedEvents = localStorage.getItem('calendarEvents');
    if (storedEvents) {
      setCalendarEvents(JSON.parse(storedEvents));
    }
  }, []);

  useEffect(() => {
    // Save calendar events to local storage whenever they change
    localStorage.setItem('calendarEvents', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

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
    
    // Add notification for students
    addNotification({
      title: "New Assignment",
      content: `${newAssignment.title} has been posted. Due: ${newAssignment.dueDate}`,
      type: "assignment",
      link: "/student-dashboard/assignments"
    });
    
    setShowAssignmentModal(false);
  };

  const upcomingAssignments = assignments
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  const recentNotifications = notifications
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

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

  // Make sure we properly handle undefined values for student.cgpa
  const safeToFixed = (value: any, digits: number = 2) => {
    if (value === undefined || value === null) return "N/A";
    return Number(value).toFixed(digits);
  };

  return (
    <DashboardLayout title="Dashboard" subtitle="Manage your classes and students">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Welcome back, {user?.name}!</CardTitle>
            <CardDescription>
              Here's what's happening in your classroom today.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">{students.length}</h3>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </div>
            <CalendarIcon className="w-10 h-10 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Upcoming Assignments</CardTitle>
            <CardDescription>
              Stay on top of your assignment deadlines.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {upcomingAssignments.length > 0 ? (
              upcomingAssignments.map((assignment) => (
                <div key={assignment.id} className="mb-4">
                  <h4 className="font-medium">{assignment.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No upcoming assignments
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>
              View your schedule for the day.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <p className="text-sm text-muted-foreground">
              No classes scheduled for today.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>
              Stay up-to-date with the latest notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {recentNotifications.length > 0 ? (
              recentNotifications.map((notification) => (
                <div key={notification.id} className="mb-3 flex items-start gap-2">
                  <div className="shrink-0">{getNotificationIcon(notification.type)}</div>
                  <div>
                    <h4 className="font-medium">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {notification.content}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatNotificationDate(notification.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <AlertCircle className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No recent notifications
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3 mt-8">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>
              View events and manage your schedule.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={""}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    new Date(date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <div className="border rounded-md p-2">
              <h4 className="text-sm font-medium mb-1">Events on this day:</h4>
              {calendarEvents.filter(event => event.date === date?.toLocaleDateString()).length > 0 ? (
                calendarEvents
                  .filter(event => event.date === date?.toLocaleDateString())
                  .map(event => (
                    <div key={event.id} className="text-xs">
                      {event.title}
                    </div>
                  ))
              ) : (
                <div className="text-xs text-muted-foreground">No events on this day.</div>
              )}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add Event</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Event</DialogTitle>
                  <DialogDescription>
                    Create a new event to add to the calendar.
                  </DialogDescription>
                </DialogHeader>
                <AddEventForm onSubmit={handleAddEvent} />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Add New Assignment</CardTitle>
            <CardDescription>
              Create a new assignment for your students.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add Assignment</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Assignment</DialogTitle>
                  <DialogDescription>
                    Create a new assignment for your students.
                  </DialogDescription>
                </DialogHeader>
                <AddAssignmentForm onSubmit={handleAddAssignment} subjects={subjects} setSelectedSubject={setSelectedSubject} selectedSubject={selectedSubject} />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Student List</CardTitle>
            <CardDescription>
              View a list of all your students.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Roll No</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.slice(0, 5).map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.rollNumber || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

interface AddEventFormProps {
  onSubmit: (data: any) => void;
}

function AddEventForm({ onSubmit }: AddEventFormProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [type, setType] = useState("exam");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!title || !date || !type || !description) {
      toast.error("Please fill in all fields.");
      return;
    }

    onSubmit({
      title,
      date: date.toLocaleDateString(),
      type,
      description,
    });

    setTitle("");
    setDate(undefined);
    setType("exam");
    setDescription("");
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Title
        </Label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="date" className="text-right">
          Date
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className="col-span-3 justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? (
                new Date(date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="type" className="text-right">
          Type
        </Label>
        <Select value={type} onValueChange={setType} className="col-span-3">
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="exam">Exam</SelectItem>
            <SelectItem value="event">Event</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="col-span-3"
        />
      </div>
      <DialogFooter>
        <Button type="button" onClick={handleSubmit}>
          Add Event
        </Button>
      </DialogFooter>
    </div>
  );
}

interface AddAssignmentFormProps {
  onSubmit: (data: any) => void;
  subjects: any[];
  setSelectedSubject: (subject: string) => void;
  selectedSubject: string;
}

function AddAssignmentForm({ onSubmit, subjects, setSelectedSubject, selectedSubject }: AddAssignmentFormProps) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [subject, setSubject] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [maxMarks, setMaxMarks] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!title || !dueDate || !subject || !maxMarks || !description) {
      toast.error("Please fill in all fields.");
      return;
    }

    onSubmit({
      title,
      dueDate: dueDate.toLocaleDateString(),
      subject,
      subjectId,
      maxMarks,
      description,
    });

    setTitle("");
    setDueDate(undefined);
    setSubject("");
    setMaxMarks("");
    setDescription("");
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Title
        </Label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="dueDate" className="text-right">
          Due Date
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className="col-span-3 justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? (
                new Date(dueDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="subject" className="text-right">
          Subject
        </Label>
        <Select value={selectedSubject} onValueChange={(value) => {
          setSubject(subjects.find(s => s.id === value)?.name || "");
          setSubjectId(value);
          setSelectedSubject(value);
        }} className="col-span-3">
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
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="maxMarks" className="text-right">
          Max Marks
        </Label>
        <Input
          type="number"
          id="maxMarks"
          value={maxMarks}
          onChange={(e) => setMaxMarks(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="col-span-3"
        />
      </div>
      <DialogFooter>
        <Button type="button" onClick={handleSubmit}>
          Add Assignment
        </Button>
      </DialogFooter>
    </div>
  );
}
