
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

export default function Index() {
  const { isAuthenticated, user, login, isLoading } = useAuth();
  const [studentEmail, setStudentEmail] = useState("vd24mab0a41@student.nitw.ac.in");
  const [studentPassword, setStudentPassword] = useState("Dhruv@22");
  const [teacherEmail, setTeacherEmail] = useState("abenerji@nitw.ac.in");
  const [teacherPassword, setTeacherPassword] = useState("Dhruv@22");
  
  // If already authenticated, redirect to appropriate dashboard
  if (isAuthenticated) {
    if (user?.type === "student") {
      return <Navigate to="/student-dashboard" />;
    } else if (user?.type === "teacher") {
      return <Navigate to="/teacher-dashboard" />;
    }
  }

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(studentEmail, studentPassword, "student");
  };

  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(teacherEmail, teacherPassword, "teacher");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white">
      <div className="container max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/f0db7aa5-f112-4e07-b137-5f66d3368625.png" 
              alt="NIT Warangal" 
              className="h-28"
            />
          </div>
          <h1 className="text-3xl font-bold text-primary-800">ARC Portal</h1>
          <p className="text-primary-600">
            Mathematics Department, NIT Warangal
          </p>
        </div>

        <Card className="shadow-xl border-primary-100">
          <CardHeader className="bg-primary-50 border-b border-primary-100 rounded-t-lg">
            <CardTitle className="text-primary-800 text-xl text-center">Login</CardTitle>
            <CardDescription className="text-center text-primary-600">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="student" className="w-full">
              <TabsList className="w-full rounded-none grid grid-cols-2">
                <TabsTrigger value="student" className="data-[state=active]:bg-primary-100 data-[state=active]:text-primary-900">
                  Student
                </TabsTrigger>
                <TabsTrigger value="teacher" className="data-[state=active]:bg-primary-100 data-[state=active]:text-primary-900">
                  Teacher
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="student" className="p-6 space-y-4">
                <form onSubmit={handleStudentLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-email">Email</Label>
                    <Input 
                      id="student-email" 
                      type="email" 
                      placeholder="youremail@student.nitw.ac.in" 
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="student-password">Password</Label>
                      <a href="#" className="text-xs text-primary-600 hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <Input 
                      id="student-password" 
                      type="password" 
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="teacher" className="p-6 space-y-4">
                <form onSubmit={handleTeacherLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="teacher-email">Email</Label>
                    <Input 
                      id="teacher-email" 
                      type="email" 
                      placeholder="youremail@nitw.ac.in" 
                      value={teacherEmail}
                      onChange={(e) => setTeacherEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="teacher-password">Password</Label>
                      <a href="#" className="text-xs text-primary-600 hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <Input 
                      id="teacher-password" 
                      type="password" 
                      value={teacherPassword}
                      onChange={(e) => setTeacherPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="bg-primary-50 border-t border-primary-100 rounded-b-lg py-3">
            <p className="text-xs text-center w-full text-primary-600">
              © 2023 NIT Warangal, Mathematics Department. All rights reserved.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
