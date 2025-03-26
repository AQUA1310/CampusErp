
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

export default function StudentTimetable() {
  const { timetable } = useData();
  const [currentDay, setCurrentDay] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");

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
    const slot = timetable.slots.find(
      (s) => s.day === day && s.time === timeSlot
    );
    return slot;
  };

  const getDaySchedule = (day: string) => {
    return timetable.slots.filter((slot) => slot.day === day);
  };

  return (
    <DashboardLayout title="Class Timetable" subtitle="Your weekly schedule">
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
                    Current time: {currentDay}, {currentTime}
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
                        
                        return (
                          <div 
                            key={`${day}-${timeSlot}`} 
                            className={`
                              rounded-lg border p-2 h-20 flex flex-col
                              ${isCurrentClass 
                                ? "bg-oliveGreen-200 border-oliveGreen-300 animate-pulse" 
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
                                        <div className="font-medium text-oliveGreen-900">
                                          {classInfo.subject}
                                        </div>
                                        <div className="flex items-center justify-center mt-1">
                                          <MapPin className="h-3 w-3 text-oliveGreen-500 mr-1" />
                                          <span className="text-xs text-oliveGreen-600">
                                            {classInfo.location}
                                          </span>
                                        </div>
                                      </div>
                                      {isCurrentClass && (
                                        <Badge className="bg-oliveGreen-600 self-center">
                                          Current Class
                                        </Badge>
                                      )}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="bottom">
                                    <div className="text-sm">
                                      <div className="font-medium">{classInfo.subject}</div>
                                      <div className="flex items-center mt-1">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        <span>{classInfo.location}</span>
                                      </div>
                                      {classInfo.faculty && (
                                        <div className="flex items-center mt-1">
                                          <User className="h-3 w-3 mr-1" />
                                          <span>Prof. {classInfo.faculty}</span>
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
                      
                      return (
                        <div 
                          key={index}
                          className={`
                            p-4 rounded-lg border
                            ${isCurrentClass 
                              ? "bg-oliveGreen-200 border-oliveGreen-300 animate-pulse" 
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
                                <span>{slot.location}</span>
                              </div>
                              {slot.faculty && (
                                <div className="flex items-center justify-end text-oliveGreen-600 text-sm">
                                  <User className="h-4 w-4 mr-1" />
                                  <span>Prof. {slot.faculty}</span>
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
