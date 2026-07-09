import { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { 
  Calendar, 
  Menu, 
  Users, 
  FileText, 
  MessageSquare, 
  Bell, 
  LogOut, 
  BarChart3, 
  Clock, 
  FileBarChart2,
  BookOpen,
  Mail
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function DashboardLayout({
  children,
  title,
  subtitle,
}: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user, logout } = useAuth();
  const [activeItem, setActiveItem] = useState<string | null>(null);

  // Read .type safely from your auth context
  const userType = user?.type || "student";
  const isStudent = userType === "student";

  const userInitials = useMemo(() => {
    return user?.name
      ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
      : "U";
  }, [user?.name]);

  // Wrapped in useMemo to prevent re-creation loops
  const studentNavItems = useMemo(() => [
    { name: "Dashboard", path: "/student-dashboard", icon: <BarChart3 className="mr-2 h-4 w-4" /> },
    { name: "Timetable", path: "/student-dashboard/timetable", icon: <Clock className="mr-2 h-4 w-4" /> },
    { name: "Assignments", path: "/student-dashboard/assignments", icon: <FileText className="mr-2 h-4 w-4" /> },
    { name: "Attendance", path: "/student-dashboard/attendance", icon: <Calendar className="mr-2 h-4 w-4" /> },
    { name: "Results", path: "/student-dashboard/results", icon: <FileBarChart2 className="mr-2 h-4 w-4" /> },
    { name: "Chat", path: "/student-dashboard/chat", icon: <MessageSquare className="mr-2 h-4 w-4" /> },
  ], []);

  const teacherNavItems = useMemo(() => [
    { name: "Dashboard", path: "/teacher-dashboard", icon: <BarChart3 className="mr-2 h-4 w-4" /> },
    { name: "Students", path: "/teacher-dashboard/students", icon: <Users className="mr-2 h-4 w-4" /> },
    { name: "Assignments", path: "/teacher-dashboard/assignments", icon: <FileText className="mr-2 h-4 w-4" /> },
    { name: "Attendance", path: "/teacher-dashboard/attendance", icon: <Calendar className="mr-2 h-4 w-4" /> },
    { name: "Results", path: "/teacher-dashboard/results", icon: <FileBarChart2 className="mr-2 h-4 w-4" /> },
    { name: "Chat", path: "/teacher-dashboard/chat", icon: <MessageSquare className="mr-2 h-4 w-4" /> },
  ], []);

  const navItems = isStudent ? studentNavItems : teacherNavItems;

  // Track and update selection matching paths cleanly
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Find item that matches the URL path exactly or handles deep nesting links safely
    const matchingItem = navItems.find((item) => {
      if (item.path === "/student-dashboard" || item.path === "/teacher-dashboard") {
        return currentPath === item.path;
      }
      return currentPath === item.path || currentPath.startsWith(`${item.path}/`);
    });

    setActiveItem(matchingItem?.path || null);
  }, [location.pathname, navItems]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-blue-50/50">
      {/* Desktop Top Header */}
      <header className="sticky top-0 z-40 w-full h-16 bg-blue-700 text-white border-b border-blue-800 shadow-md">
        <div className="container mx-auto h-full flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/01aa3e2d-72b1-482f-81a3-5878ef282949.png" alt="Logo" className="h-10 w-auto" />
            <div className="flex flex-col justify-center">
              <h1 className="text-xl font-bold">ARC Portal</h1>
              <p className="text-xs opacity-90">Mathematics Department</p>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-white hover:bg-blue-600"><Bell className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-blue-600"><Mail className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-blue-600" onClick={handleLogout}><LogOut className="h-5 w-5" /></Button>
            <Avatar className="h-10 w-10 bg-blue-800 border-2 border-white">
              <AvatarFallback className="bg-blue-600 text-white">{userInitials}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-16 left-0 hidden lg:flex lg:w-64 flex-col border-r border-blue-200 bg-white z-30">
        <div className="flex flex-col flex-1 overflow-hidden">
          <nav className="flex-1 overflow-y-auto p-3 pt-4">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    activeItem === item.path 
                      ? "bg-blue-100 text-blue-700 font-semibold" 
                      : "text-slate-800 hover:bg-blue-50"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
          <div className="border-t border-slate-200 p-4">
            <div className="flex items-center space-x-2">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-blue-700 text-white">{userInitials}</AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize truncate">{userType}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header + Sheet Sidebar */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center gap-4 border-b bg-blue-700 text-white p-4 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white"><Menu className="h-5 w-5" /></Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex h-16 items-center border-b px-6 bg-blue-700 text-white font-bold text-xl">
              ARC Portal
            </div>
            <nav className="flex flex-col gap-1 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    activeItem === item.path 
                      ? "bg-blue-100 text-blue-700 font-semibold" 
                      : "text-slate-800 hover:bg-blue-50"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
              <Button variant="ghost" className="flex items-center justify-start px-3 mt-4 w-full text-slate-800 hover:bg-blue-50" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex-1 flex items-center justify-between">
          <h1 className="text-lg font-semibold">{isStudent ? "Student Portal" : "Teacher Portal"}</h1>
        </div>
      </header>

      {/* Main content */}
      <main className={cn("p-6 lg:p-8 pt-8 pb-20 min-h-screen bg-blue-50/50", isMobile ? "" : "lg:ml-64")}>
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-blue-900">{title}</h1>
            {subtitle && <p className="mt-1 text-lg text-slate-600">{subtitle}</p>}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}