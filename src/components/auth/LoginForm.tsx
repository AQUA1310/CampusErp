
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Mock user credentials for demonstration
const STUDENT_CREDENTIALS = {
  email: "vd24mab0a41@student.nitw.ac.in",
  password: "Dhruv@22",
};

const TEACHER_CREDENTIALS = {
  email: "abenerji@nitw.ac.in",
  password: "Dhruv@22",
};

export default function LoginForm() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"student" | "teacher">("student");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call with timeout
    setTimeout(() => {
      if (userType === "student") {
        if (
          formData.email === STUDENT_CREDENTIALS.email &&
          formData.password === STUDENT_CREDENTIALS.password
        ) {
          // Set user in localStorage
          localStorage.setItem(
            "arcUser",
            JSON.stringify({
              type: "student",
              name: "Dhruv",
              rollNumber: "24MAB0A41",
              email: formData.email,
            })
          );
          toast.success("Login successful!");
          navigate("/student-dashboard");
        } else {
          toast.error("Invalid student credentials!");
        }
      } else {
        if (
          formData.email === TEACHER_CREDENTIALS.email &&
          formData.password === TEACHER_CREDENTIALS.password
        ) {
          // Set user in localStorage
          localStorage.setItem(
            "arcUser",
            JSON.stringify({
              type: "teacher",
              name: "A Benerji Babu",
              department: "Maths Dept",
              email: formData.email,
            })
          );
          toast.success("Login successful!");
          navigate("/teacher-dashboard");
        } else {
          toast.error("Invalid teacher credentials!");
        }
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs defaultValue="student" onValueChange={(value) => setUserType(value as "student" | "teacher")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="student">Student</TabsTrigger>
          <TabsTrigger value="teacher">Teacher</TabsTrigger>
        </TabsList>
        
        <TabsContent value="student">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Student Login</CardTitle>
              <CardDescription>
                Enter your credentials to access your student dashboard
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@student.nitw.ac.in"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button type="button" variant="link" className="px-0 font-normal h-auto">
                      Forgot password?
                    </Button>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-oliveGreen-600 hover:bg-oliveGreen-700" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="teacher">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Teacher Login</CardTitle>
              <CardDescription>
                Enter your credentials to access your teacher dashboard
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@nitw.ac.in"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button type="button" variant="link" className="px-0 font-normal h-auto">
                      Forgot password?
                    </Button>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-oliveGreen-600 hover:bg-oliveGreen-700" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
