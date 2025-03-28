
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { 
  Bell, 
  LogOut, 
  Mail, 
  Calendar, 
  BookOpen, 
  BarChart, 
  UserCircle, 
  Settings, 
  Home 
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isStudent = user?.type === "student";
  const isTeacher = user?.type === "teacher";

  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-primary-50">
      {/* Header */}
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/f0db7aa5-f112-4e07-b137-5f66d3368625.png" 
              alt="NIT Warangal" 
              className="h-10"
            />
            <div>
              <h1 className="text-lg font-semibold">ARC Portal</h1>
              <p className="text-xs text-primary-200">Mathematics Department</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="text-white hover:bg-primary-500">
              <Bell size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-primary-500">
              <Mail size={20} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-primary-500"
              onClick={logout}
            >
              <LogOut size={20} />
            </Button>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary-400 flex items-center justify-center">
                <span className="text-sm font-medium">
                  {user?.name?.charAt(0) || "U"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-16 md:w-60 bg-white shadow-md flex flex-col">
          <div className="p-4 border-b border-gray-200 hidden md:block">
            <h2 className="font-semibold text-primary-800">
              {isStudent ? "Student Portal" : "Teacher Portal"}
            </h2>
          </div>
          
          <nav className="flex-1 py-4">
            <ul className="space-y-1">
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-primary-700 hover:bg-primary-100 hover:text-primary-800"
                  onClick={() => navigateTo(isStudent ? "/student-dashboard" : "/teacher-dashboard")}
                >
                  <Home className="h-5 w-5 mr-2" />
                  <span className="hidden md:inline">Dashboard</span>
                </Button>
              </li>
              
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-primary-700 hover:bg-primary-100 hover:text-primary-800"
                  onClick={() => navigateTo(isStudent ? "/student-dashboard/assignments" : "/teacher-dashboard/assignments")}
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  <span className="hidden md:inline">Assignments</span>
                </Button>
              </li>
              
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-primary-700 hover:bg-primary-100 hover:text-primary-800"
                  onClick={() => navigateTo(isStudent ? "/student-dashboard/attendance" : "/teacher-dashboard/attendance")}
                >
                  <BarChart className="h-5 w-5 mr-2" />
                  <span className="hidden md:inline">Attendance</span>
                </Button>
              </li>
              
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-primary-700 hover:bg-primary-100 hover:text-primary-800"
                  onClick={() => navigateTo(isStudent ? "/student-dashboard/timetable" : "/teacher-dashboard/subjects")}
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  <span className="hidden md:inline">
                    {isStudent ? "Timetable" : "Subjects"}
                  </span>
                </Button>
              </li>
              
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-primary-700 hover:bg-primary-100 hover:text-primary-800"
                  onClick={() => navigateTo(isStudent ? "/student-dashboard/profile" : "/teacher-dashboard/students")}
                >
                  <UserCircle className="h-5 w-5 mr-2" />
                  <span className="hidden md:inline">
                    {isStudent ? "Profile" : "Students"}
                  </span>
                </Button>
              </li>
              
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-primary-700 hover:bg-primary-100 hover:text-primary-800"
                  onClick={() => navigateTo(isStudent ? "/student-dashboard/chat" : "/teacher-dashboard/chat")}
                >
                  <Mail className="h-5 w-5 mr-2" />
                  <span className="hidden md:inline">Messages</span>
                </Button>
              </li>
              
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-primary-700 hover:bg-primary-100 hover:text-primary-800"
                  onClick={() => navigateTo(isStudent ? "/student-dashboard/settings" : "/teacher-dashboard/settings")}
                >
                  <Settings className="h-5 w-5 mr-2" />
                  <span className="hidden md:inline">Settings</span>
                </Button>
              </li>
            </ul>
          </nav>
        </aside>
        
        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-primary-900">{title}</h1>
            {subtitle && (
              <p className="text-primary-600 mt-1">{subtitle}</p>
            )}
          </div>
          
          {children}
        </main>
      </div>
    </div>
  );
}
