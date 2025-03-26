
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar,
  BookOpen,
  Users,
  Bell,
  Clock,
  BarChart,
  BrainCircuit
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useData } from "@/contexts/DataContext";
import DashboardLayout from "@/components/shared/DashboardLayout";
import ChatBot from "@/components/student/ChatBot";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { assignments, attendanceSummary, notifications, timetable } = useData();
  const navigate = useNavigate();
  const [showChatbot, setShowChatbot] = useState(false);

  const studentName = user?.name || "Student";
  const studentAttendance = attendanceSummary.find(
    (a) => a.studentId === "1"
  ); // For the demo, we use the fixed student (Dhruv)

  const pendingAssignments = assignments.filter(
    (a) => !a.submissions?.some((s) => s.studentId === "1")
  );

  const upcomingEvents = notifications
    .filter((n) => new Date(n.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Get current day and time for timetable
  const [currentDay, setCurrentDay] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [currentClass, setCurrentClass] = useState<any>(null);
  const [nextClass, setNextClass] = useState<any>(null);

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const day = days[now.getDay()];
      const hours = now.getHours();
      const minutes = now.getMinutes();
      
      setCurrentDay(day);
      setCurrentTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
      
      // Find current and next classes
      if (day !== "Sunday" && day !== "Saturday") {
        const daySchedule = timetable.slots.filter(slot => slot.day === day);
        
        // Find current class
        const currentClassFound = daySchedule.find(slot => {
          const [startTime, endTime] = slot.time.split(' - ');
          const [startHour, startMinute] = startTime.split(':').map(Number);
          const [endHour, endMinute] = endTime.split(':').map(Number);
          
          const currentTimeInMinutes = hours * 60 + minutes;
          const startTimeInMinutes = startHour * 60 + startMinute;
          const endTimeInMinutes = endHour * 60 + endMinute;
          
          return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes;
        });
        
        setCurrentClass(currentClassFound || null);
        
        // Find next class
        if (currentClassFound) {
          const currentIndex = daySchedule.indexOf(currentClassFound);
          setNextClass(currentIndex < daySchedule.length - 1 ? daySchedule[currentIndex + 1] : null);
        } else {
          // If no current class, find the next upcoming class
          const upcoming = daySchedule.find(slot => {
            const [startTime] = slot.time.split(' - ');
            const [startHour, startMinute] = startTime.split(':').map(Number);
            const startTimeInMinutes = startHour * 60 + startMinute;
            const currentTimeInMinutes = hours * 60 + minutes;
            
            return startTimeInMinutes > currentTimeInMinutes;
          });
          
          setNextClass(upcoming || null);
        }
      }
    };
    
    updateCurrentTime();
    const intervalId = setInterval(updateCurrentTime, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, [timetable.slots]);

  return (
    <DashboardLayout 
      title={`Welcome, ${studentName}`} 
      subtitle="Your academic dashboard"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="col-span-2 space-y-6">
          {/* Class Schedule */}
          <Card className="shadow-md hover:shadow-lg transition-shadow border border-oliveGreen-100">
            <CardHeader className="flex flex-row items-center justify-between bg-oliveGreen-50 border-b border-oliveGreen-100 rounded-t-lg">
              <div>
                <CardTitle className="text-oliveGreen-800">Current Schedule</CardTitle>
                <CardDescription className="text-oliveGreen-600">
                  {currentDay}, {currentTime}
                </CardDescription>
              </div>
              <Clock className="h-6 w-6 text-oliveGreen-600" />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {currentClass ? (
                  <div className="bg-oliveGreen-50 p-4 rounded-lg border border-oliveGreen-200 animate-pulse">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-oliveGreen-900">Current Class</h3>
                        <p className="text-2xl font-bold text-oliveGreen-800">{currentClass.subject}</p>
                        <p className="text-oliveGreen-600">{currentClass.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-oliveGreen-700">Location</p>
                        <p className="text-oliveGreen-800">{currentClass.location}</p>
                        {currentClass.faculty && (
                          <p className="text-oliveGreen-600 text-sm">Prof. {currentClass.faculty}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-secondary p-4 rounded-lg">
                    <p className="text-center text-muted-foreground">No ongoing class right now</p>
                  </div>
                )}

                {nextClass && (
                  <div className="bg-white p-4 rounded-lg border border-oliveGreen-100">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-oliveGreen-900">Next Class</h3>
                        <p className="text-xl font-bold text-oliveGreen-800">{nextClass.subject}</p>
                        <p className="text-oliveGreen-600">{nextClass.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-oliveGreen-700">Location</p>
                        <p className="text-oliveGreen-800">{nextClass.location}</p>
                        {nextClass.faculty && (
                          <p className="text-oliveGreen-600 text-sm">Prof. {nextClass.faculty}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    className="w-full border-oliveGreen-300 text-oliveGreen-700 hover:bg-oliveGreen-50"
                    onClick={() => navigate("/student-dashboard/timetable")}
                  >
                    View Full Timetable
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignments Section */}
          <Card className="shadow-md hover:shadow-lg transition-shadow border border-oliveGreen-100">
            <CardHeader className="flex flex-row items-center justify-between bg-oliveGreen-50 border-b border-oliveGreen-100 rounded-t-lg">
              <div>
                <CardTitle className="text-oliveGreen-800">Assignments</CardTitle>
                <CardDescription className="text-oliveGreen-600">Pending tasks and due dates</CardDescription>
              </div>
              <BookOpen className="h-6 w-6 text-oliveGreen-600" />
            </CardHeader>
            <CardContent className="pt-6">
              {pendingAssignments.length > 0 ? (
                <div className="space-y-4">
                  {pendingAssignments.slice(0, 3).map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div>
                        <h3 className="font-medium">{assignment.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {assignment.subjectName}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          new Date(assignment.dueDate) < new Date() 
                            ? "destructive" 
                            : new Date(assignment.dueDate) < new Date(new Date().setDate(new Date().getDate() + 3))
                            ? "secondary"
                            : "outline"
                        }>
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Max marks: {assignment.maxMarks}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No pending assignments</p>
                </div>
              )}
              <div className="pt-4">
                <Button 
                  variant="outline" 
                  className="w-full border-oliveGreen-300 text-oliveGreen-700 hover:bg-oliveGreen-50"
                  onClick={() => navigate("/student-dashboard/assignments")}
                >
                  View All Assignments
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Attendance Card */}
          <Card className="shadow-md hover:shadow-lg transition-shadow border border-oliveGreen-100">
            <CardHeader className="flex flex-row items-center justify-between bg-oliveGreen-50 border-b border-oliveGreen-100 rounded-t-lg">
              <div>
                <CardTitle className="text-oliveGreen-800">Attendance</CardTitle>
                <CardDescription className="text-oliveGreen-600">
                  Your current attendance status
                </CardDescription>
              </div>
              <Users className="h-6 w-6 text-oliveGreen-600" />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center p-1 bg-white rounded-full">
                    <div 
                      className={`inline-flex items-center justify-center h-24 w-24 rounded-full ${
                        studentAttendance?.overall.percentage >= 90
                          ? "bg-success-100"
                          : studentAttendance?.overall.percentage >= 85
                          ? "bg-warning-100"
                          : "bg-danger-100"
                      }`}
                    >
                      <span 
                        className={`text-3xl font-bold ${
                          studentAttendance?.overall.percentage >= 90
                            ? "text-success-700"
                            : studentAttendance?.overall.percentage >= 85
                            ? "text-warning-700"
                            : "text-danger-700"
                        }`}
                      >
                        {studentAttendance?.overall.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-center text-sm text-oliveGreen-600 mt-2">
                    Overall attendance across all subjects
                  </p>
                </div>

                <div className="pt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="col-span-2">
                    <h3 className="text-sm font-medium text-oliveGreen-700 mb-2">Subject-wise Attendance</h3>
                  </div>
                  
                  {studentAttendance?.subjects.slice(0, 4).map((subject) => (
                    <div key={subject.subjectId} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-oliveGreen-700">{subject.subjectName.split(' ')[0]}</span>
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
                        className={`h-2 ${
                          subject.percentage >= 90 ? "bg-success-100" : 
                          subject.percentage >= 85 ? "bg-warning-100" : 
                          "bg-danger-100"
                        }`}
                        indicatorClassName={`${
                          subject.percentage >= 90 ? "bg-success-500" : 
                          subject.percentage >= 85 ? "bg-warning-500" : 
                          "bg-danger-500"
                        }`}
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    className="w-full border-oliveGreen-300 text-oliveGreen-700 hover:bg-oliveGreen-50"
                    onClick={() => navigate("/student-dashboard/attendance")}
                  >
                    View Detailed Attendance
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="shadow-md hover:shadow-lg transition-shadow border border-oliveGreen-100">
            <CardHeader className="flex flex-row items-center justify-between bg-oliveGreen-50 border-b border-oliveGreen-100 rounded-t-lg">
              <div>
                <CardTitle className="text-oliveGreen-800">Upcoming Events</CardTitle>
                <CardDescription className="text-oliveGreen-600">
                  Exams and department events
                </CardDescription>
              </div>
              <Bell className="h-6 w-6 text-oliveGreen-600" />
            </CardHeader>
            <CardContent className="pt-6">
              {upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="bg-white p-3 rounded-lg border border-oliveGreen-100">
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center justify-center min-w-[3rem] p-1 border rounded-md border-oliveGreen-200 bg-oliveGreen-50">
                          <span className="text-xs text-oliveGreen-600">
                            {new Date(event.date).toLocaleString('default', { month: 'short' })}
                          </span>
                          <span className="text-lg font-bold text-oliveGreen-800">
                            {new Date(event.date).getDate()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-oliveGreen-900">{event.title}</h3>
                          <p className="text-sm text-oliveGreen-600 line-clamp-2">{event.description}</p>
                          <Badge
                            variant={event.type === "exam" ? "default" : "secondary"}
                            className={event.type === "exam" ? "bg-oliveGreen-500" : ""}
                          >
                            {event.type === "exam" ? "Exam" : "Event"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No upcoming events</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Chatbot Button */}
          <Button 
            className="w-full bg-oliveGreen-600 hover:bg-oliveGreen-700 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 py-6"
            onClick={() => setShowChatbot(prev => !prev)}
          >
            <BrainCircuit className="h-5 w-5" />
            <span>Ask AI Tutor</span>
          </Button>
        </div>
      </div>

      {/* AI Chatbot Modal */}
      {showChatbot && (
        <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white shadow-2xl rounded-xl border border-oliveGreen-200 overflow-hidden animate-scale-in z-50">
          <ChatBot onClose={() => setShowChatbot(false)} />
        </div>
      )}
    </DashboardLayout>
  );
}
