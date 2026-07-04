import Signup from "./pages/Signup";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { DataProvider } from "@/contexts/DataContext";
import ProtectedRoute from "@/components/shared/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Student Pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentAssignments from "./pages/student/Assignments";
import StudentAttendance from "./pages/student/Attendance";
import StudentTimetable from "./pages/student/Timetable";
import StudentChat from "./pages/student/Chat";
import StudentResults from "./pages/student/Results";

// Teacher Pages
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherAssignments from "./pages/teacher/Assignments";
import TeacherAttendance from "./pages/teacher/Attendance";
import TeacherStudents from "./pages/teacher/Students";
import TeacherChat from "./pages/teacher/Chat";
import TeacherResults from "./pages/teacher/Results";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/signup" element={<Signup />} />
              {/* Student Routes */}
              <Route 
                path="/student-dashboard" 
                element={
                  <ProtectedRoute requiredUserType="student">
                    <StudentDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student-dashboard/assignments" 
                element={
                  <ProtectedRoute requiredUserType="student">
                    <StudentAssignments />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student-dashboard/attendance" 
                element={
                  <ProtectedRoute requiredUserType="student">
                    <StudentAttendance />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student-dashboard/timetable" 
                element={
                  <ProtectedRoute requiredUserType="student">
                    <StudentTimetable />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student-dashboard/results" 
                element={
                  <ProtectedRoute requiredUserType="student">
                    <StudentResults />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student-dashboard/chat" 
                element={
                  <ProtectedRoute requiredUserType="student">
                    <StudentChat />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/student-dashboard/profile"
                element={<Navigate to="/student-dashboard" replace />}
              />
              <Route
                path="/student-dashboard/settings"
                element={<Navigate to="/student-dashboard" replace />}
              />

              {/* Teacher Routes */}
              <Route 
                path="/teacher-dashboard" 
                element={
                  <ProtectedRoute requiredUserType="teacher">
                    <TeacherDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teacher-dashboard/assignments" 
                element={
                  <ProtectedRoute requiredUserType="teacher">
                    <TeacherAssignments />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teacher-dashboard/attendance" 
                element={
                  <ProtectedRoute requiredUserType="teacher">
                    <TeacherAttendance />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teacher-dashboard/students" 
                element={
                  <ProtectedRoute requiredUserType="teacher">
                    <TeacherStudents />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teacher-dashboard/results" 
                element={
                  <ProtectedRoute requiredUserType="teacher">
                    <TeacherResults />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teacher-dashboard/chat" 
                element={
                  <ProtectedRoute requiredUserType="teacher">
                    <TeacherChat />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/teacher-dashboard/subjects"
                element={<Navigate to="/teacher-dashboard" replace />}
              />
              <Route
                path="/teacher-dashboard/settings"
                element={<Navigate to="/teacher-dashboard" replace />}
              />

              {/* Catch-all Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
