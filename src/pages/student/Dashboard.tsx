
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

// Subject class mapping
const subjectSlotMapping = {
  "DT": { name: "MA1102 Design Thinking", faculty: "Prof. A. Benerji Babu", location: "Computation Lab" },
  "A": { name: "EE1162 Basic Electrical and Electronics Engineering", faculty: "Prof. B. L Narasimharaju", location: "E104 (NAB)" },
  "B": { name: "MA1104 Ordinary Differential Equations", faculty: "Prof. Satyanarayana Engu", location: "E104 (NAB)" },
  "C": { name: "MA1108 Elementary Linear Algebra", faculty: "Prof. Jagannath Roy", location: "A315 (Electrical Dept)" },
  "D": { name: "EE1164 Basic Electrical Engineering Lab", faculty: "Prof. B. L Narasimharaju", location: "Electrical Dept" },
  "E": { name: "MA1106 Data Structures and Algorithms", faculty: "Prof. Debashis Dutta", location: "E104 (NAB)" },
  "F": { name: "IC1102 EAA-II (Games & Sports / Yoga & Wellness)", faculty: "Sports Department", location: "Stadium" },
  "G": { name: "MA1110 Discrete Mathematical Structures", faculty: "Prof. D. Srinivasacharya", location: "E104 (NAB)" },
  "H": { name: "Lab Sessions", faculty: "Various", location: "Respective Labs" },
};

// Timetable structure
const timetableData = {
  "Monday": [
    { slot: "G", time: "8:00 - 8:55", subject: subjectSlotMapping["G"] },
    { slot: "BEE LAB", time: "9:00 - 9:55", subject: { name: "EE1164 Basic Electrical Engineering Lab", faculty: "Prof. B. L Narasimharaju", location: "Electrical Dept" } },
    { slot: "BEE LAB", time: "10:00 - 10:55", subject: { name: "EE1164 Basic Electrical Engineering Lab", faculty: "Prof. B. L Narasimharaju", location: "Electrical Dept" } },
    { slot: "BEE LAB", time: "11:05 - 12:00", subject: { name: "EE1164 Basic Electrical Engineering Lab", faculty: "Prof. B. L Narasimharaju", location: "Electrical Dept" } },
    { slot: "LUNCH", time: "12:05 - 1:00", subject: { name: "Lunch Break", faculty: "", location: "Canteen" } },
    { slot: "F", time: "1:05 - 2:00", subject: subjectSlotMapping["F"] },
    { slot: "B", time: "2:05 - 3:00", subject: subjectSlotMapping["B"] },
    { slot: "C", time: "3:05 - 4:00", subject: subjectSlotMapping["C"] },
  ],
  "Tuesday": [
    { slot: "G", time: "8:00 - 8:55", subject: subjectSlotMapping["G"] },
    { slot: "FREE", time: "9:00 - 9:55", subject: { name: "Free Period", faculty: "", location: "" } },
    { slot: "FREE", time: "10:00 - 10:55", subject: { name: "Free Period", faculty: "", location: "" } },
    { slot: "FREE", time: "11:05 - 12:00", subject: { name: "Free Period", faculty: "", location: "" } },
    { slot: "FREE", time: "12:05 - 1:00", subject: { name: "Free Period", faculty: "", location: "" } },
    { slot: "D", time: "1:05 - 2:00", subject: subjectSlotMapping["D"] },
    { slot: "A", time: "2:05 - 3:00", subject: subjectSlotMapping["A"] },
    { slot: "B", time: "3:05 - 4:00", subject: subjectSlotMapping["B"] },
    { slot: "C", time: "4:05 - 5:00", subject: subjectSlotMapping["C"] },
  ],
  "Wednesday": [
    { slot: "H", time: "8:00 - 8:55", subject: subjectSlotMapping["H"] },
    { slot: "G", time: "9:00 - 9:55", subject: subjectSlotMapping["G"] },
    { slot: "E", time: "10:00 - 10:55", subject: subjectSlotMapping["E"] },
    { slot: "A", time: "11:05 - 12:00", subject: subjectSlotMapping["A"] },
    { slot: "LUNCH", time: "12:05 - 1:00", subject: { name: "Lunch Break", faculty: "", location: "Canteen" } },
    { slot: "B", time: "1:05 - 2:00", subject: subjectSlotMapping["B"] },
    { slot: "FREE", time: "2:05 - 3:00", subject: { name: "Free Period", faculty: "", location: "" } },
    { slot: "FREE", time: "3:05 - 4:00", subject: { name: "Free Period", faculty: "", location: "" } },
    { slot: "FREE", time: "4:05 - 5:00", subject: { name: "Free Period", faculty: "", location: "" } },
  ],
  "Thursday": [
    { slot: "H", time: "8:00 - 8:55", subject: subjectSlotMapping["H"] },
    { slot: "D", time: "9:00 - 9:55", subject: subjectSlotMapping["D"] },
    { slot: "F", time: "10:00 - 10:55", subject: subjectSlotMapping["F"] },
    { slot: "E", time: "11:05 - 12:00", subject: subjectSlotMapping["E"] },
    { slot: "A", time: "12:05 - 1:00", subject: subjectSlotMapping["A"] },
    { slot: "FREE", time: "1:05 - 2:00", subject: { name: "Free Period", faculty: "", location: "" } },
    { slot: "FREE", time: "2:05 - 3:00", subject: { name: "Free Period", faculty: "", location: "" } },
    { slot: "FREE", time: "3:05 - 4:00", subject: { name: "Free Period", faculty: "", location: "" } },
    { slot: "FREE", time: "4:05 - 5:00", subject: { name: "Free Period", faculty: "", location: "" } },
  ],
  "Friday": [
    { slot: "H", time: "8:00 - 8:55", subject: subjectSlotMapping["H"] },
    { slot: "C", time: "9:00 - 9:55", subject: subjectSlotMapping["C"] },
    { slot: "D", time: "10:00 - 10:55", subject: subjectSlotMapping["D"] },
    { slot: "F", time: "11:05 - 12:00", subject: subjectSlotMapping["F"] },
    { slot: "E", time: "12:05 - 1:00", subject: subjectSlotMapping["E"] },
    { slot: "DT", time: "1:05 - 2:00", subject: subjectSlotMapping["DT"] },
    { slot: "DT", time: "2:05 - 3:00", subject: subjectSlotMapping["DT"] },
    { slot: "DT", time: "3:05 - 4:00", subject: subjectSlotMapping["DT"] },
    { slot: "DT", time: "4:05 - 5:00", subject: subjectSlotMapping["DT"] },
  ],
  "Saturday": [],
  "Sunday": []
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const { assignments, attendanceSummary, notifications, timetable } = useData();
  const navigate = useNavigate();
  const [showChatbot, setShowChatbot] = useState(false);
  const [currentDay, setCurrentDay] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [currentClass, setCurrentClass] = useState<any>(null);
  const [nextClass, setNextClass] = useState<any>(null);

  const studentName = user?.name || "Student";
  const studentAttendance = attendanceSummary.find(
    (a) => a.studentId === "1"
  );

  const pendingAssignments = assignments.filter(
    (a) => !a.submissions?.some((s) => s.studentId === "1")
  );

  const upcomingEvents = notifications
    .filter((n) => new Date(n.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getCurrentAndNextClass = () => {
    const now = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const day = days[now.getDay()];
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTimeInMinutes = hours * 60 + minutes;
    
    setCurrentDay(day);
    setCurrentTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
    
    // Weekend check
    if (day === "Sunday" || day === "Saturday") {
      setCurrentClass(null);
      setNextClass(null);
      return;
    }
    
    const daySchedule = timetableData[day as keyof typeof timetableData] || [];
    
    // Find current class
    let foundCurrentClass = null;
    for (const slot of daySchedule) {
      const [startTime, endTime] = slot.time.split(' - ');
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      
      const startTimeInMinutes = startHour * 60 + startMinute;
      const endTimeInMinutes = endHour * 60 + endMinute;
      
      if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes) {
        foundCurrentClass = slot;
        break;
      }
    }
    
    setCurrentClass(foundCurrentClass);
    
    // Find next class
    if (foundCurrentClass) {
      const currentIndex = daySchedule.indexOf(foundCurrentClass);
      setNextClass(currentIndex < daySchedule.length - 1 ? daySchedule[currentIndex + 1] : null);
    } else {
      // If no current class, find next upcoming class
      let nextUpcomingClass = null;
      for (const slot of daySchedule) {
        const [startTime] = slot.time.split(' - ');
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const startTimeInMinutes = startHour * 60 + startMinute;
        
        if (startTimeInMinutes > currentTimeInMinutes && slot.slot !== "LUNCH" && slot.slot !== "FREE") {
          nextUpcomingClass = slot;
          break;
        }
      }
      
      setNextClass(nextUpcomingClass);
      
      // If no class today, check tomorrow
      if (!nextUpcomingClass) {
        const tomorrowDay = days[(now.getDay() + 1) % 7];
        if (tomorrowDay !== "Sunday" && tomorrowDay !== "Saturday") {
          const tomorrowSchedule = timetableData[tomorrowDay as keyof typeof timetableData] || [];
          if (tomorrowSchedule.length > 0) {
            // Find first class tomorrow that isn't lunch or free
            for (const slot of tomorrowSchedule) {
              if (slot.slot !== "LUNCH" && slot.slot !== "FREE") {
                setNextClass({
                  ...slot,
                  time: `Tomorrow, ${slot.time}`
                });
                break;
              }
            }
          }
        }
      }
    }
  };

  useEffect(() => {
    getCurrentAndNextClass();
    const intervalId = setInterval(getCurrentAndNextClass, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <DashboardLayout 
      title={`Welcome, ${studentName}`} 
      subtitle="Your academic dashboard"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card className="shadow-md hover:shadow-lg transition-shadow border border-primary-100">
            <CardHeader className="flex flex-row items-center justify-between bg-primary-50 border-b border-primary-100 rounded-t-lg">
              <div>
                <CardTitle className="text-primary-800">Current Schedule</CardTitle>
                <CardDescription className="text-primary-600">
                  {currentDay}, {currentTime}
                </CardDescription>
              </div>
              <Clock className="h-6 w-6 text-primary-600" />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {currentClass && currentClass.slot !== "LUNCH" && currentClass.slot !== "FREE" ? (
                  <div className="bg-primary-50 p-4 rounded-lg border border-primary-200 animate-pulse">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-primary-900">Current Class</h3>
                        <p className="text-2xl font-bold text-primary-800">{currentClass.subject.name}</p>
                        <p className="text-primary-600">{currentClass.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-primary-700">Location</p>
                        <p className="text-primary-800">{currentClass.subject.location}</p>
                        {currentClass.subject.faculty && (
                          <p className="text-primary-600 text-sm">{currentClass.subject.faculty}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-secondary p-4 rounded-lg">
                    <p className="text-center text-muted-foreground">No ongoing class right now</p>
                  </div>
                )}

                {nextClass && nextClass.slot !== "LUNCH" && nextClass.slot !== "FREE" ? (
                  <div className="bg-white p-4 rounded-lg border border-primary-100">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-primary-900">Next Class</h3>
                        <p className="text-xl font-bold text-primary-800">{nextClass.subject.name}</p>
                        <p className="text-primary-600">{nextClass.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-primary-700">Location</p>
                        <p className="text-primary-800">{nextClass.subject.location}</p>
                        {nextClass.subject.faculty && (
                          <p className="text-primary-600 text-sm">{nextClass.subject.faculty}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-4 rounded-lg border border-primary-100">
                    <p className="text-center text-muted-foreground">No upcoming classes scheduled</p>
                  </div>
                )}

                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    className="w-full border-primary-300 text-primary-700 hover:bg-primary-50"
                    onClick={() => navigate("/student-dashboard/timetable")}
                  >
                    View Full Timetable
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow border border-primary-100">
            <CardHeader className="flex flex-row items-center justify-between bg-primary-50 border-b border-primary-100 rounded-t-lg">
              <div>
                <CardTitle className="text-primary-800">Assignments</CardTitle>
                <CardDescription className="text-primary-600">Pending tasks and due dates</CardDescription>
              </div>
              <BookOpen className="h-6 w-6 text-primary-600" />
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
                  className="w-full border-primary-300 text-primary-700 hover:bg-primary-50"
                  onClick={() => navigate("/student-dashboard/assignments")}
                >
                  View All Assignments
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-md hover:shadow-lg transition-shadow border border-primary-100">
            <CardHeader className="flex flex-row items-center justify-between bg-primary-50 border-b border-primary-100 rounded-t-lg">
              <div>
                <CardTitle className="text-primary-800">Attendance</CardTitle>
                <CardDescription className="text-primary-600">
                  Your current attendance status
                </CardDescription>
              </div>
              <Users className="h-6 w-6 text-primary-600" />
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
                  <p className="text-center text-sm text-primary-600 mt-2">
                    Overall attendance across all subjects
                  </p>
                </div>

                <div className="pt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="col-span-2">
                    <h3 className="text-sm font-medium text-primary-700 mb-2">Subject-wise Attendance</h3>
                  </div>
                  
                  {studentAttendance?.subjects.slice(0, 4).map((subject) => (
                    <div key={subject.subjectId} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-primary-700">{subject.subjectName.split(' ')[0]}</span>
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
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    className="w-full border-primary-300 text-primary-700 hover:bg-primary-50"
                    onClick={() => navigate("/student-dashboard/attendance")}
                  >
                    View Detailed Attendance
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow border border-primary-100">
            <CardHeader className="flex flex-row items-center justify-between bg-primary-50 border-b border-primary-100 rounded-t-lg">
              <div>
                <CardTitle className="text-primary-800">Upcoming Events</CardTitle>
                <CardDescription className="text-primary-600">
                  Exams and department events
                </CardDescription>
              </div>
              <Bell className="h-6 w-6 text-primary-600" />
            </CardHeader>
            <CardContent className="pt-6">
              {upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="bg-white p-3 rounded-lg border border-primary-100">
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center justify-center min-w-[3rem] p-1 border rounded-md border-primary-200 bg-primary-50">
                          <span className="text-xs text-primary-600">
                            {new Date(event.date).toLocaleString('default', { month: 'short' })}
                          </span>
                          <span className="text-lg font-bold text-primary-800">
                            {new Date(event.date).getDate()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-primary-900">{event.title}</h3>
                          <p className="text-sm text-primary-600 line-clamp-2">{event.description}</p>
                          <Badge
                            variant={event.type === "exam" ? "default" : "secondary"}
                            className={event.type === "exam" ? "bg-primary-500" : ""}
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

          <Button 
            className="w-full bg-primary hover:bg-primary-700 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 py-6"
            onClick={() => setShowChatbot(prev => !prev)}
          >
            <BrainCircuit className="h-5 w-5" />
            <span>Ask AI Tutor</span>
          </Button>
        </div>
      </div>

      {showChatbot && (
        <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white shadow-2xl rounded-xl border border-primary-200 overflow-hidden animate-scale-in z-50">
          <ChatBot onClose={() => setShowChatbot(false)} />
        </div>
      )}
    </DashboardLayout>
  );
}
