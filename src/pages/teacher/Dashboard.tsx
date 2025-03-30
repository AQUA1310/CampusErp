
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  BookOpen, 
  Users, 
  PieChart, 
  Bell, 
  Layers,
  Upload,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useData } from "@/contexts/DataContext";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { students, assignments, submissions, messages, subjects, addAssignment, addNotification } = useData();
  const navigate = useNavigate();
  
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);
  const [isViewStudentsDialogOpen, setIsViewStudentsDialogOpen] = useState(false);
  const [assignmentData, setAssignmentData] = useState({
    title: "",
    description: "",
    subjectId: subjects[0]?.id || "",
    dueDate: "",
    maxMarks: 10,
  });
  
  const [notificationData, setNotificationData] = useState({
    title: "",
    description: "",
    type: "exam" as "exam" | "event",
    date: "",
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const teacherName = user?.name || "Teacher";
  const department = user?.department || "Mathematics Department";
  
  const pendingSubmissions = submissions.filter(
    (s) => s.marks === undefined
  );
  
  const topStudents = [...students]
    .sort((a, b) => b.cgpa - a.cgpa)
    .slice(0, 3);
  
  const sortedStudents = [...students].sort((a, b) => b.cgpa - a.cgpa);
  
  const unreadMessages = messages.filter(
    (m) => m.receiverId === "1" && !m.read && m.senderType === "student"
  );

  const handleAssignmentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAssignmentSubmit = () => {
    if (!assignmentData.title || !assignmentData.subjectId || !assignmentData.dueDate) {
      toast.error("Please fill in required fields");
      return;
    }

    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    // Create a fake URL for the file
    const fileUrl = URL.createObjectURL(selectedFile);
    
    const subject = subjects.find((s) => s.id === assignmentData.subjectId);
    
    addAssignment({
      title: assignmentData.title,
      description: assignmentData.description,
      subjectId: assignmentData.subjectId,
      subjectName: subject?.name || "",
      dueDate: assignmentData.dueDate,
      maxMarks: assignmentData.maxMarks,
      fileUrl,
      createdBy: "1",
    });
    
    setIsAssignmentDialogOpen(false);
    setAssignmentData({
      title: "",
      description: "",
      subjectId: subjects[0]?.id || "",
      dueDate: "",
      maxMarks: 10,
    });
    setSelectedFile(null);
  };

  const handleNotificationSubmit = () => {
    if (!notificationData.title || !notificationData.date) {
      toast.error("Please fill in required fields");
      return;
    }
    
    addNotification({
      title: notificationData.title,
      description: notificationData.description,
      type: notificationData.type,
      date: notificationData.date,
      createdBy: "1",
    });
    
    setIsNotificationDialogOpen(false);
    setNotificationData({
      title: "",
      description: "",
      type: "exam",
      date: "",
    });
  };

  return (
    <DashboardLayout 
      title={`Welcome, Professor ${teacherName}`} 
      subtitle={department}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="col-span-2 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Card className="shadow-sm hover:shadow-md transition-shadow border border-oliveGreen-100">
              <CardHeader className="pb-2">
                <CardDescription className="text-oliveGreen-600">Total Students</CardDescription>
                <CardTitle className="text-3xl text-oliveGreen-900">{students.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-oliveGreen-600">Mathematics & Computing</span>
                  <Users className="h-5 w-5 text-oliveGreen-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm hover:shadow-md transition-shadow border border-oliveGreen-100">
              <CardHeader className="pb-2">
                <CardDescription className="text-oliveGreen-600">Total Assignments</CardDescription>
                <CardTitle className="text-3xl text-oliveGreen-900">{assignments.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-oliveGreen-600">
                    {pendingSubmissions.length} pending review
                  </span>
                  <BookOpen className="h-5 w-5 text-oliveGreen-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm hover:shadow-md transition-shadow border border-oliveGreen-100">
              <CardHeader className="pb-2">
                <CardDescription className="text-oliveGreen-600">Unread Messages</CardDescription>
                <CardTitle className="text-3xl text-oliveGreen-900">{unreadMessages.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-oliveGreen-600">
                    From {unreadMessages.length > 0 ? unreadMessages.length : "no"} student{unreadMessages.length !== 1 ? "s" : ""}
                  </span>
                  <Bell className="h-5 w-5 text-oliveGreen-400" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="shadow-sm hover:shadow-md transition-shadow border border-oliveGreen-100 cursor-pointer" onClick={() => setIsAssignmentDialogOpen(true)}>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-oliveGreen-100 rounded-full flex items-center justify-center text-oliveGreen-600 mb-3">
                  <Upload className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-oliveGreen-900">Upload Assignment</h3>
                <p className="text-sm text-oliveGreen-600 mt-2">Create and upload a new assignment</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm hover:shadow-md transition-shadow border border-oliveGreen-100 cursor-pointer" onClick={() => navigate("/teacher-dashboard/attendance")}>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-oliveGreen-100 rounded-full flex items-center justify-center text-oliveGreen-600 mb-3">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-oliveGreen-900">Mark Attendance</h3>
                <p className="text-sm text-oliveGreen-600 mt-2">Record student attendance</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm hover:shadow-md transition-shadow border border-oliveGreen-100 cursor-pointer" onClick={() => setIsNotificationDialogOpen(true)}>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-oliveGreen-100 rounded-full flex items-center justify-center text-oliveGreen-600 mb-3">
                  <Bell className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-oliveGreen-900">Add Notification</h3>
                <p className="text-sm text-oliveGreen-600 mt-2">Create exam/event notification</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Assignments */}
          <Card className="shadow-md hover:shadow-lg transition-shadow border border-oliveGreen-100">
            <CardHeader className="flex flex-row items-center justify-between bg-oliveGreen-50 border-b border-oliveGreen-100 rounded-t-lg">
              <div>
                <CardTitle className="text-oliveGreen-800">Recent Assignments</CardTitle>
                <CardDescription className="text-oliveGreen-600">Recently created assignments and submissions</CardDescription>
              </div>
              <Button 
                variant="outline" 
                className="border-oliveGreen-300 text-oliveGreen-700 hover:bg-oliveGreen-50"
                onClick={() => navigate("/teacher-dashboard/assignments")}
              >
                View All
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              {assignments.length > 0 ? (
                <div className="space-y-4">
                  {assignments.slice(0, 3).map((assignment) => {
                    const submissionCount = assignment.submissions?.length || 0;
                    const submissionPercentage = students.length > 0 
                      ? (submissionCount / students.length) * 100 
                      : 0;
                    
                    return (
                      <div key={assignment.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between mb-2">
                          <h3 className="font-medium text-oliveGreen-900">{assignment.title}</h3>
                          <Badge variant="outline">
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </Badge>
                        </div>
                        <p className="text-sm text-oliveGreen-600 mb-2">{assignment.subjectName}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Submissions ({submissionCount}/{students.length})</span>
                              <span>{submissionPercentage.toFixed(0)}%</span>
                            </div>
                            <Progress value={submissionPercentage} />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-oliveGreen-700 hover:text-oliveGreen-900 hover:bg-oliveGreen-50 p-0"
                            onClick={() => navigate(`/teacher-dashboard/assignments`)}
                          >
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No assignments created yet</p>
                  <Button
                    className="mt-2 bg-oliveGreen-600 hover:bg-oliveGreen-700"
                    onClick={() => setIsAssignmentDialogOpen(true)}
                  >
                    Create Assignment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Top Students */}
          <Card className="shadow-md hover:shadow-lg transition-shadow border border-oliveGreen-100">
            <CardHeader className="flex flex-row items-center justify-between bg-oliveGreen-50 border-b border-oliveGreen-100 rounded-t-lg">
              <div>
                <CardTitle className="text-oliveGreen-800">Top Students</CardTitle>
                <CardDescription className="text-oliveGreen-600">
                  Highest performing students
                </CardDescription>
              </div>
              <Dialog open={isViewStudentsDialogOpen} onOpenChange={setIsViewStudentsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="border-oliveGreen-300 text-oliveGreen-700 hover:bg-oliveGreen-50"
                    onClick={() => setIsViewStudentsDialogOpen(true)}
                  >
                    View All
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>All Students</DialogTitle>
                    <DialogDescription>
                      Students sorted by CGPA in descending order
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 max-h-[400px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Roll Number</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="text-right">CGPA</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedStudents.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.rollNumber}</TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell className="text-right">
                              <Badge className={`
                                ${student.cgpa >= 9.0 
                                  ? "bg-success-100 text-success-700 hover:bg-success-200" 
                                  : student.cgpa >= 8.0 
                                  ? "bg-oliveGreen-100 text-oliveGreen-700 hover:bg-oliveGreen-200"
                                  : "bg-warning-100 text-warning-700 hover:bg-warning-200"
                                }
                              `}>
                                {student.cgpa.toFixed(2)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {topStudents.map((student, index) => (
                  <div key={student.id} className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-oliveGreen-100 flex items-center justify-center">
                      <span className="text-oliveGreen-700 font-semibold">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-oliveGreen-900">{student.name}</h3>
                        <Badge variant="outline" className="bg-oliveGreen-50 text-oliveGreen-700">
                          {student.cgpa.toFixed(2)}
                        </Badge>
                      </div>
                      <p className="text-sm text-oliveGreen-600">{student.rollNumber}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* My Subjects */}
          <Card className="shadow-md hover:shadow-lg transition-shadow border border-oliveGreen-100">
            <CardHeader className="bg-oliveGreen-50 border-b border-oliveGreen-100 rounded-t-lg">
              <CardTitle className="text-oliveGreen-800">My Subjects</CardTitle>
              <CardDescription className="text-oliveGreen-600">
                Courses you are teaching
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {subjects.map((subject) => (
                  <div key={subject.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-oliveGreen-50">
                    <div className="h-8 w-8 bg-oliveGreen-100 rounded-full flex items-center justify-center text-oliveGreen-700">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-oliveGreen-900">{subject.name}</h3>
                      <div className="flex justify-between">
                        <p className="text-xs text-oliveGreen-600">{subject.code}</p>
                        <p className="text-xs text-oliveGreen-600">{subject.credits}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card className="shadow-md hover:shadow-lg transition-shadow border border-oliveGreen-100">
            <CardHeader className="flex flex-row items-center justify-between bg-oliveGreen-50 border-b border-oliveGreen-100 rounded-t-lg">
              <div>
                <CardTitle className="text-oliveGreen-800">Recent Messages</CardTitle>
                <CardDescription className="text-oliveGreen-600">
                  Messages from students
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                className="border-oliveGreen-300 text-oliveGreen-700 hover:bg-oliveGreen-50"
                onClick={() => navigate("/teacher-dashboard/chat")}
              >
                View All
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              {messages.filter(m => m.senderType === "student" && m.receiverType === "teacher").length > 0 ? (
                <div className="space-y-4">
                  {messages
                    .filter(m => m.senderType === "student" && m.receiverType === "teacher")
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .slice(0, 3)
                    .map((message) => (
                      <div key={message.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-oliveGreen-900">{message.senderName}</h3>
                          <span className="text-xs text-oliveGreen-500">
                            {new Date(message.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-oliveGreen-600 line-clamp-2 mt-1">
                          {message.content}
                        </p>
                        {!message.read && (
                          <Badge className="mt-2 bg-oliveGreen-600">New</Badge>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No messages yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upload Assignment Dialog */}
      <Dialog open={isAssignmentDialogOpen} onOpenChange={setIsAssignmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload New Assignment</DialogTitle>
            <DialogDescription>
              Create and upload a new assignment for students
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Assignment Title *
              </label>
              <Input
                id="title"
                value={assignmentData.title}
                onChange={(e) => setAssignmentData({ ...assignmentData, title: e.target.value })}
                placeholder="Enter assignment title"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject *
              </label>
              <select
                id="subject"
                value={assignmentData.subjectId}
                onChange={(e) => setAssignmentData({ ...assignmentData, subjectId: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={assignmentData.description}
                onChange={(e) => setAssignmentData({ ...assignmentData, description: e.target.value })}
                placeholder="Enter assignment description"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="dueDate" className="text-sm font-medium">
                  Due Date *
                </label>
                <Input
                  id="dueDate"
                  type="date"
                  value={assignmentData.dueDate}
                  onChange={(e) => setAssignmentData({ ...assignmentData, dueDate: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="maxMarks" className="text-sm font-medium">
                  Maximum Marks
                </label>
                <Input
                  id="maxMarks"
                  type="number"
                  min="1"
                  value={assignmentData.maxMarks}
                  onChange={(e) => setAssignmentData({ ...assignmentData, maxMarks: parseInt(e.target.value) })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="file" className="text-sm font-medium">
                Assignment File *
              </label>
              <Input
                id="file"
                type="file"
                onChange={handleAssignmentFileChange}
              />
              {selectedFile && (
                <p className="text-xs text-oliveGreen-600">
                  Selected file: {selectedFile.name}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignmentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignmentSubmit} className="bg-black-600 hover:bg-black-700">
              Upload Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Notification Dialog */}
      <Dialog open={isNotificationDialogOpen} onOpenChange={setIsNotificationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Notification</DialogTitle>
            <DialogDescription>
              Create a new exam or event notification for students
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="notificationTitle" className="text-sm font-medium">
                Title *
              </label>
              <Input
                id="notificationTitle"
                value={notificationData.title}
                onChange={(e) => setNotificationData({ ...notificationData, title: e.target.value })}
                placeholder="Enter notification title"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="notificationType" className="text-sm font-medium">
                Type
              </label>
              <select
                id="notificationType"
                value={notificationData.type}
                onChange={(e) => setNotificationData({ ...notificationData, type: e.target.value as "exam" | "event" })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="exam">Exam</option>
                <option value="event">Event</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="notificationDescription" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="notificationDescription"
                value={notificationData.description}
                onChange={(e) => setNotificationData({ ...notificationData, description: e.target.value })}
                placeholder="Enter notification description"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="notificationDate" className="text-sm font-medium">
                Date *
              </label>
              <Input
                id="notificationDate"
                type="date"
                value={notificationData.date}
                onChange={(e) => setNotificationData({ ...notificationData, date: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNotificationDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleNotificationSubmit} className="bg-oliveGreen-600 hover:bg-oliveGreen-700">
              Add Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
