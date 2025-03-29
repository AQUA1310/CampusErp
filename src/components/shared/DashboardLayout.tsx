
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { 
  Calendar, 
  GraduationCap, 
  Menu, 
  Users, 
  FileText, 
  MessageSquare, 
  Bell, 
  LogOut, 
  BarChart3, 
  Clock, 
  User,
  FileBarChart2
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
  const isMobile = useMobile();
  const { user, logout } = useAuth();
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  const userType = user?.type || "student";
  const isStudent = userType === "student";
  const isTeacher = userType === "teacher";

  const studentNavItems = [
    {
      name: "Dashboard",
      path: "/student-dashboard",
      icon: <BarChart3 className="mr-2 h-4 w-4" />,
    },
    {
      name: "Timetable",
      path: "/student-dashboard/timetable",
      icon: <Clock className="mr-2 h-4 w-4" />,
    },
    {
      name: "Assignments",
      path: "/student-dashboard/assignments",
      icon: <FileText className="mr-2 h-4 w-4" />,
    },
    {
      name: "Attendance",
      path: "/student-dashboard/attendance",
      icon: <Calendar className="mr-2 h-4 w-4" />,
    },
    {
      name: "Results",
      path: "/student-dashboard/results",
      icon: <FileBarChart2 className="mr-2 h-4 w-4" />,
    },
    {
      name: "Chat",
      path: "/student-dashboard/chat",
      icon: <MessageSquare className="mr-2 h-4 w-4" />,
    },
  ];

  const teacherNavItems = [
    {
      name: "Dashboard",
      path: "/teacher-dashboard",
      icon: <BarChart3 className="mr-2 h-4 w-4" />,
    },
    {
      name: "Students",
      path: "/teacher-dashboard/students",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
    {
      name: "Assignments",
      path: "/teacher-dashboard/assignments",
      icon: <FileText className="mr-2 h-4 w-4" />,
    },
    {
      name: "Attendance",
      path: "/teacher-dashboard/attendance",
      icon: <Calendar className="mr-2 h-4 w-4" />,
    },
    {
      name: "Results",
      path: "/teacher-dashboard/results",
      icon: <FileBarChart2 className="mr-2 h-4 w-4" />,
    },
    {
      name: "Chat",
      path: "/teacher-dashboard/chat",
      icon: <MessageSquare className="mr-2 h-4 w-4" />,
    },
  ];

  const navItems = isStudent ? studentNavItems : teacherNavItems;
  
  const basePath = isStudent 
    ? "/student-dashboard" 
    : "/teacher-dashboard";

  useEffect(() => {
    const currentPath = location.pathname;
    const matchingItem = navItems.find((item) =>
      currentPath === item.path || currentPath.startsWith(`${item.path}/`)
    );
    setActiveItem(matchingItem?.path || null);
  }, [location.pathname, navItems]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden lg:flex lg:w-72 flex-col border-r border-slate-200 bg-white">
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <Link 
              to={basePath} 
              className="flex items-center space-x-2 font-bold text-xl text-primary"
            >
              <img 
                src="/logo.png" 
                alt="NITW ARC Logo" 
                className="h-8 w-auto" 
                onError={(e) => {
                  // Fallback if logo.png not available
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
              <span>NITW ARC</span>
            </Link>
          </div>
          <nav className="flex-1 overflow-y-auto p-3 pt-4">
            <div className="space-y-1.5">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    activeItem === item.path
                      ? "bg-primary text-primary-foreground"
                      : "text-slate-800 hover:bg-slate-100"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
          <div className="border-t border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-slate-500 capitalize truncate">
                    {userType}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="h-5 w-5 text-slate-500" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header + Sheet Sidebar */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center gap-4 border-b bg-white p-4 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex h-16 items-center border-b px-6">
              <Link 
                to={basePath} 
                className="flex items-center space-x-2 font-bold text-xl text-primary"
              >
                <img 
                  src="/logo.png" 
                  alt="NITW ARC Logo" 
                  className="h-8 w-auto" 
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
                <span>NITW ARC</span>
              </Link>
            </div>
            <nav className="flex flex-col gap-1.5 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    activeItem === item.path
                      ? "bg-primary text-primary-foreground"
                      : "text-slate-800 hover:bg-slate-100"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
              <Button
                variant="ghost"
                className="flex items-center justify-start px-3 mt-4"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex-1 flex items-center justify-between">
          <h1 className="text-lg font-semibold">{title}</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Link to={`${basePath}/profile`}>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main
        className={cn(
          "p-6 lg:p-8 pt-8 pb-20 min-h-screen",
          isMobile ? "" : "lg:ml-72"
        )}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-lg text-slate-600">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
