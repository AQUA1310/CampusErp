
import React, { useState, useEffect } from "react";
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
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User 
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useData } from "@/contexts/DataContext";
import DashboardLayout from "@/components/shared/DashboardLayout";

// Subject class mapping
const subjectSlotMapping = {
  "DT": { name: "MA1102 Design Thinking", faculty: "Prof. A. Benerji Babu", location: "Room No. E104", acronym: "DT" },
  "A": { name: "EE1162 Basic Electrical and Electronics Engineering", faculty: "Prof. B. L Narasimharaju", location: "Room No. E104", acronym: "BEEE" },
  "B": { name: "MA1104 Ordinary Differential Equations", faculty: "Prof. Satyanarayana Engu", location: "Room No. E104", acronym: "ODE" },
  "C": { name: "MA1108 Elementary Linear Algebra", faculty: "Prof. Jagannath Roy", location: "Room No. A315 (Electrical Dept)", acronym: "ELA" },
  "D": { name: "MA1106 Data Structures and Algorithms", faculty: "Prof. Debashis Dutta", location: "Room No. E104", acronym: "DSA" },
  "E": { name: "MA1106 Data Structures and Algorithms", faculty: "Prof. Debashis Dutta", location: "Room No. E104", acronym: "DSA" },
  "F": { name: "IC1102 EAA-II (Games & Sports / Yoga & Wellness)", faculty: "Sports Department", location: "Stadium", acronym: "GSYW" },
  "G": { name: "MA1110 Discrete Mathematical Structures", faculty: "Prof. D. Srinivasacharya", location: "Room No. E104", acronym: "DMS" },
  "H": { name: "Lab Sessions", faculty: "Various", location: "Respective Labs", acronym: "LAB" },
  "BEE LAB": { name: "EE1164 Basic Electrical Engineering Lab", faculty: "Prof. B. L Narasimharaju", location: "Electrical Dept", acronym: "BEE LAB" },
  "DSA LAB": { name: "MA1106 DSA Lab", faculty: "Prof. Debashis Dutta", location: "Computation Lab", acronym: "DSA LAB" },
  "LUNCH": { name: "Lunch Break", faculty: "", location: "Canteen", acronym: "LUNCH" },
  "FREE": { name: "Free Period", faculty: "", location: "", acronym: "FREE" },
};

// Updated timetable according to the provided image
const timetableData = {
  slots: [
    // Monday
    { day: "Monday", time: "8:00 - 8:55", subject: "MA1110 Discrete Mathematical Structures", location: "Room No. E104", faculty: "Prof. D. Srinivasacharya" },
    { day: "Monday", time: "9:00 - 9:55", subject: "EE1164 Basic Electrical Engineering Lab", location: "Electrical Dept", faculty: "Prof. B. L Narasimharaju" },
    { day: "Monday", time: "10:00 - 10:55", subject: "EE1164 Basic Electrical Engineering Lab", location: "Electrical Dept", faculty: "Prof. B. L Narasimharaju" },
    { day: "Monday", time: "11:05 - 12:00", subject: "EE1164 Basic Electrical Engineering Lab", location: "Electrical Dept", faculty: "Prof. B. L Narasimharaju" },
    { day: "Monday", time: "12:05 - 1:00", subject: "Lunch Break", location: "Canteen", faculty: "" },
    { day: "Monday", time: "1:00 - 1:55", subject: "IC1102 EAA-II (Games & Sports / Yoga & Wellness)", location: "Stadium", faculty: "Sports Department" },
    { day: "Monday", time: "2:00 - 2:55", subject: "MA1104 Ordinary Differential Equations", location: "Room No. E104", faculty: "Prof. Satyanarayana Engu" },
    { day: "Monday", time: "3:05 - 4:00", subject: "MA1108 Elementary Linear Algebra", location: "Room No. A315 (Electrical Dept)", faculty: "Prof. Jagannath Roy" },
    
    // Tuesday
    { day: "Tuesday", time: "8:00 - 8:55", subject: "MA1110 Discrete Mathematical Structures", location: "Room No. E104", faculty: "Prof. D. Srinivasacharya" },
    { day: "Tuesday", time: "9:00 - 9:55", subject: "Free Period", location: "", faculty: "" },
    { day: "Tuesday", time: "10:00 - 10:55", subject: "Free Period", location: "", faculty: "" },
    { day: "Tuesday", time: "11:05 - 12:00", subject: "Free Period", location: "", faculty: "" },
    { day: "Tuesday", time: "12:05 - 1:00", subject: "Lunch Break", location: "Canteen", faculty: "" },
    { day: "Tuesday", time: "1:00 - 1:55", subject: "MA1106 Data Structures and Algorithms", location: "Room No. E104", faculty: "Prof. Debashis Dutta" },
    { day: "Tuesday", time: "2:00 - 2:55", subject: "EE1162 Basic Electrical and Electronics Engineering", location: "Room No. E104", faculty: "Prof. B. L Narasimharaju" },
    { day: "Tuesday", time: "3:05 - 4:00", subject: "MA1104 Ordinary Differential Equations", location: "Room No. E104", faculty: "Prof. Satyanarayana Engu" },
    { day: "Tuesday", time: "4:05 - 5:00", subject: "MA1108 Elementary Linear Algebra", location: "Room No. A315 (Electrical Dept)", faculty: "Prof. Jagannath Roy" },
    
    // Wednesday
    { day: "Wednesday", time: "8:00 - 8:55", subject: "Lab Sessions", location: "Respective Labs", faculty: "Various" },
    { day: "Wednesday", time: "9:00 - 9:55", subject: "MA1110 Discrete Mathematical Structures", location: "Room No. E104", faculty: "Prof. D. Srinivasacharya" },
    { day: "Wednesday", time: "10:00 - 10:55", subject: "MA1106 Data Structures and Algorithms", location: "Room No. E104", faculty: "Prof. Debashis Dutta" },
    { day: "Wednesday", time: "11:05 - 12:00", subject: "EE1162 Basic Electrical and Electronics Engineering", location: "Room No. E104", faculty: "Prof. B. L Narasimharaju" },
    { day: "Wednesday", time: "12:05 - 1:00", subject: "MA1104 Ordinary Differential Equations", location: "Room No. E104", faculty: "Prof. Satyanarayana Engu" },
    { day: "Wednesday", time: "1:00 - 1:55", subject: "Lunch Break", location: "Canteen", faculty: "" },
    { day: "Wednesday", time: "2:00 - 2:55", subject: "Free Period", location: "", faculty: "" },
    { day: "Wednesday", time: "3:05 - 4:00", subject: "Free Period", location: "", faculty: "" },
    
    // Thursday
    { day: "Thursday", time: "8:00 - 8:55", subject: "Lab Sessions", location: "Respective Labs", faculty: "Various" },
    { day: "Thursday", time: "9:00 - 9:55", subject: "MA1106 Data Structures and Algorithms", location: "Room No. E104", faculty: "Prof. Debashis Dutta" },
    { day: "Thursday", time: "10:00 - 10:55", subject: "IC1102 EAA-II (Games & Sports / Yoga & Wellness)", location: "Stadium", faculty: "Sports Department" },
    { day: "Thursday", time: "11:05 - 12:00", subject: "MA1106 Data Structures and Algorithms", location: "Room No. E104", faculty: "Prof. Debashis Dutta" },
    { day: "Thursday", time: "12:05 - 1:00", subject: "EE1162 Basic Electrical and Electronics Engineering", location: "Room No. E104", faculty: "Prof. B. L Narasimharaju" },
    { day: "Thursday", time: "1:00 - 1:55", subject: "Lunch Break", location: "Canteen", faculty: "" },
    { day: "Thursday", time: "2:00 - 4:00", subject: "MA1106 DSA Lab", location: "Computation Lab", faculty: "Prof. Debashis Dutta" },
    { day: "Thursday", time: "4:05 - 5:00", subject: "Free Period", location: "", faculty: "" },
    
    // Friday
    { day: "Friday", time: "8:00 - 8:55", subject: "Lab Sessions", location: "Respective Labs", faculty: "Various" },
    { day: "Friday", time: "9:00 - 9:55", subject: "MA1108 Elementary Linear Algebra", location: "Room No. A315 (Electrical Dept)", faculty: "Prof. Jagannath Roy" },
    { day: "Friday", time: "10:00 - 10:55", subject: "MA1106 Data Structures and Algorithms", location: "Room No. E104", faculty: "Prof. Debashis Dutta" },
    { day: "Friday", time: "11:05 - 12:00", subject: "IC1102 EAA-II (Games & Sports / Yoga & Wellness)", location: "Stadium", faculty: "Sports Department" },
    { day: "Friday", time: "12:05 - 1:00", subject: "MA1106 Data Structures and Algorithms", location: "Room No. E104", faculty: "Prof. Debashis Dutta" },
    { day: "Friday", time: "2:00 - 3:00", subject: "MA1102 Design Thinking", location: "Room No. E104", faculty: "Prof. A. Benerji Babu" },
    { day: "Friday", time: "3:00 - 4:00", subject: "MA1102 Design Thinking", location: "Room No. E104", faculty: "Prof. A. Benerji Babu" },
    { day: "Friday", time: "4:00 - 5:00", subject: "MA1102 Design Thinking", location: "Room No. E104", faculty: "Prof. A. Benerji Babu" },
    { day: "Friday", time: "5:00 - 6:00", subject: "MA1102 Design Thinking", location: "Room No. E104", faculty: "Prof. A. Benerji Babu" },
  ]
};

export default function StudentTimetable() {
  const { timetable: contextTimetable } = useData();
  const [currentDay, setCurrentDay] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [formattedDate, setFormattedDate] = useState<string>("");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = [
    "8:00 - 8:55",
    "9:00 - 9:55",
    "10:00 - 10:55",
    "11:05 - 12:00",
    "12:05 - 1:00",
    "1:00 - 1:55",
    "2:00 - 2:55",
    "3:05 - 4:00",
    "4:05 - 5:00",
    "5:05 - 6:00",
  ];

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const day = daysOfWeek[now.getDay()];
      const hours = now.getHours();
      const minutes = now.getMinutes();
      
      // Format current date
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      setFormattedDate(now.toLocaleDateString('en-US', options));
      
      setCurrentDay(day);
      setCurrentTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
    };
    
    updateCurrentTime();
    const intervalId = setInterval(updateCurrentTime, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, []);

  const isCurrentTimeSlot = (day: string, timeSlot: string) => {
    if (day !== currentDay) return false;
    
    const [startTime, endTime] = timeSlot.split(" - ");
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    
    const [currentHour, currentMinute] = currentTime.split(":").map(Number);
    const currentTotalMinutes = currentHour * 60 + currentMinute;
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    
    return currentTotalMinutes >= startTotalMinutes && currentTotalMinutes <= endTotalMinutes;
  };

  const getClassForTimeSlot = (day: string, timeSlot: string) => {
    const slot = timetableData.slots.find(
      (s) => s.day === day && s.time === timeSlot
    );
    return slot;
  };

  const getDaySchedule = (day: string) => {
    return timetableData.slots.filter((slot) => slot.day === day);
  };

  return (
    <DashboardLayout title="Class Timetable" subtitle="Your weekly schedule">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-medium text-primary-800">
            BTech, MnC, I Year II Semester / (ACADEMIC YEAR 2024-25)
          </h2>
          <p className="text-sm text-primary-600">
            Current time: {formattedDate}, {currentTime}
          </p>
        </div>
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
          Room No. E104
        </Badge>
      </div>
      
      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger 
            value="weekly" 
            className="data-[state=active]:bg-oliveGreen-100 data-[state=active]:text-oliveGreen-900"
          >
            Weekly View
          </TabsTrigger>
          {days.map((day) => (
            <TabsTrigger 
              key={day} 
              value={day.toLowerCase()}
              className="data-[state=active]:bg-oliveGreen-100 data-[state=active]:text-oliveGreen-900"
            >
              {day}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Weekly View */}
        <TabsContent value="weekly" className="mt-0">
          <Card className="shadow-md">
            <CardHeader className="bg-oliveGreen-50 border-b border-oliveGreen-100 rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-oliveGreen-800">Weekly Schedule</CardTitle>
                  <CardDescription className="text-oliveGreen-600">
                    Pattern-A (w.e.f. 16-Dec-2024)
                  </CardDescription>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-xs px-3 py-1 bg-oliveGreen-200 text-oliveGreen-800 rounded-full">
                        Legend
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-xs space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-oliveGreen-200 rounded"></div>
                          <span>Current class</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-oliveGreen-50 rounded"></div>
                          <span>Regular class</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-100 rounded"></div>
                          <span>Lab session</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gray-100 rounded"></div>
                          <span>No class</span>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent className="pt-6 overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="grid grid-cols-[100px_repeat(5,1fr)] gap-2">
                  {/* Header row with days */}
                  <div className="text-center font-medium text-oliveGreen-800 py-2">Time</div>
                  {days.map((day) => (
                    <div 
                      key={day} 
                      className={`text-center font-medium py-2 rounded ${
                        day === currentDay 
                          ? "bg-oliveGreen-100 text-oliveGreen-900" 
                          : "text-oliveGreen-800"
                      }`}
                    >
                      {day}
                    </div>
                  ))}

                  {/* Time slots and classes */}
                  {timeSlots.map((timeSlot) => (
                    <React.Fragment key={timeSlot}>
                      <div className="text-center text-sm text-oliveGreen-600 py-2 px-1">
                        {timeSlot}
                      </div>
                      
                      {days.map((day) => {
                        const classInfo = getClassForTimeSlot(day, timeSlot);
                        const isCurrentClass = isCurrentTimeSlot(day, timeSlot);
                        const isLabSession = classInfo && (classInfo.subject.includes("Lab") || classInfo.subject === "Lab Sessions");
                        const isLunchOrFree = classInfo && (classInfo.subject === "Lunch Break" || classInfo.subject === "Free Period");
                        
                        return (
                          <div 
                            key={`${day}-${timeSlot}`} 
                            className={`
                              rounded-lg border p-2 h-20 flex flex-col
                              ${isCurrentClass 
                                ? "bg-oliveGreen-200 border-oliveGreen-300 animate-pulse" 
                                : isLabSession
                                ? "bg-yellow-50 border-yellow-200"
                                : isLunchOrFree
                                ? "bg-gray-100 border-gray-200"
                                : classInfo 
                                ? "bg-oliveGreen-50 border-oliveGreen-200" 
                                : "bg-gray-100 border-gray-200"}
                            `}
                          >
                            {classInfo ? (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="h-full flex flex-col justify-between">
                                      <div>
                                        <div className="font-medium text-oliveGreen-900 text-sm">
                                          {classInfo.subject.length > 30 
                                            ? `${classInfo.subject.substring(0, 27)}...` 
                                            : classInfo.subject
                                          }
                                        </div>
                                        <div className="flex items-center justify-center mt-1">
                                          <MapPin className="h-3 w-3 text-oliveGreen-500 mr-1" />
                                          <span className="text-xs text-oliveGreen-600">
                                            {classInfo.location || "N/A"}
                                          </span>
                                        </div>
                                      </div>
                                      {isCurrentClass && (
                                        <Badge className="bg-oliveGreen-600 self-center">
                                          Current
                                        </Badge>
                                      )}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="bottom">
                                    <div className="text-sm">
                                      <div className="font-medium">{classInfo.subject}</div>
                                      <div className="flex items-center mt-1">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        <span>{classInfo.location || "N/A"}</span>
                                      </div>
                                      {classInfo.faculty && (
                                        <div className="flex items-center mt-1">
                                          <User className="h-3 w-3 mr-1" />
                                          <span>{classInfo.faculty}</span>
                                        </div>
                                      )}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ) : (
                              <div className="h-full flex items-center justify-center text-sm text-gray-500">
                                No Class
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Day-specific views */}
        {days.map((day) => (
          <TabsContent key={day} value={day.toLowerCase()} className="mt-0">
            <Card className="shadow-md">
              <CardHeader className="bg-oliveGreen-50 border-b border-oliveGreen-100 rounded-t-lg">
                <CardTitle className="text-oliveGreen-800">{day}'s Schedule</CardTitle>
                <CardDescription className="text-oliveGreen-600">
                  {currentDay === day ? "Today's classes" : "Classes for " + day}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {getDaySchedule(day).length > 0 ? (
                    getDaySchedule(day).map((slot, index) => {
                      const isCurrentClass = isCurrentTimeSlot(day, slot.time);
                      const isLabSession = slot.subject.includes("Lab") || slot.subject === "Lab Sessions";
                      const isLunchOrFree = slot.subject === "Lunch Break" || slot.subject === "Free Period";
                      
                      return (
                        <div 
                          key={index}
                          className={`
                            p-4 rounded-lg border
                            ${isCurrentClass 
                              ? "bg-oliveGreen-200 border-oliveGreen-300 animate-pulse" 
                              : isLabSession
                              ? "bg-yellow-50 border-yellow-200"
                              : isLunchOrFree
                              ? "bg-gray-100 border-gray-200"
                              : "bg-oliveGreen-50 border-oliveGreen-200"}
                          `}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-oliveGreen-900 text-lg">
                                {slot.subject}
                              </h3>
                              <div className="flex items-center mt-1 text-oliveGreen-600">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{slot.time}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center justify-end mb-1 text-oliveGreen-700">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{slot.location || "N/A"}</span>
                              </div>
                              {slot.faculty && (
                                <div className="flex items-center justify-end text-oliveGreen-600 text-sm">
                                  <User className="h-4 w-4 mr-1" />
                                  <span>{slot.faculty}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {isCurrentClass && (
                            <div className="mt-3 flex justify-end">
                              <Badge className="bg-oliveGreen-600">
                                Current Class
                              </Badge>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="mx-auto h-12 w-12 text-oliveGreen-300" />
                      <h3 className="mt-2 text-lg font-medium text-oliveGreen-900">No Classes</h3>
                      <p className="mt-1 text-sm text-oliveGreen-500">There are no scheduled classes for {day}.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </DashboardLayout>
  );
}
