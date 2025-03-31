import { useState, useMemo } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
// Import the timetableWithSlots helper from DataContext
import { useData, timetableWithSlots } from "@/contexts/DataContext";

export default function StudentTimetable() {
  const { user } = useAuth();
  const { timetable } = useData();
  const [currentView, setCurrentView] = useState<"weekly" | "daily">("weekly");
  const [selectedDay, setSelectedDay] = useState<string>(getCurrentDay());

  // Group timetable entries by day
  const timetableByDay = useMemo(() => {
    const grouped: Record<string, typeof timetable> = {};
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    daysOfWeek.forEach(day => {
      grouped[day] = timetable.filter(entry => entry.day === day);
    });
    
    return grouped;
  }, [timetable]);

  // Sort entries by start time
  const sortedByTime = useMemo(() => {
    const result: Record<string, typeof timetable> = {};
    
    Object.keys(timetableByDay).forEach(day => {
      result[day] = [...timetableByDay[day]].sort((a, b) => {
        return a.startTime.localeCompare(b.startTime);
      });
    });
    
    return result;
  }, [timetableByDay]);

  // Create hour slots for the timetable view (8am to 6pm)
  const hourSlots = useMemo(() => {
    const slots = [];
    for (let i = 8; i <= 18; i++) {
      const hour = i % 12 === 0 ? 12 : i % 12;
      const ampm = i < 12 ? "am" : "pm";
      slots.push(`${hour}:00 ${ampm}`);
    }
    return slots;
  }, []);

  // Get current day
  function getCurrentDay() {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    return days[today.getDay()];
  }

  return (
    <DashboardLayout title="Timetable" subtitle="View your weekly class schedule">
      {/* Weekly Timetable View */}
      {currentView === "weekly" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(sortedByTime).map(([day, entries]) => (
            <div key={day} className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-2">{day}</h3>
              {entries.length > 0 ? (
                entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="border-b border-gray-200 py-2 last:border-b-0"
                  >
                    <p className="font-medium">{entry.subject}</p>
                    <p className="text-sm text-gray-500">
                      {entry.startTime} - {entry.endTime}
                    </p>
                    <p className="text-sm text-gray-500">
                      Room: {entry.room} ({entry.type})
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No classes scheduled for today.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
