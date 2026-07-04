import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupForm() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rollNumber: "",
    department: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Step 1: Create the auth user (handles password securely)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (authError || !authData.user) {
      toast.error(authError?.message || "Signup failed");
      setIsLoading(false);
      return;
    }

    // Step 2: Create matching profile row with role/name/etc
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      name: formData.name,
      role: role,
      roll_number: role === "student" ? formData.rollNumber : null,
      department: formData.department,
    });

    if (profileError) {
      toast.error("Account created, but profile setup failed: " + profileError.message);
      setIsLoading(false);
      return;
    }

    toast.success("Account created! Please log in.");
    navigate("/");
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs defaultValue="student" onValueChange={(v) => setRole(v as "student" | "teacher")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="student">Student</TabsTrigger>
          <TabsTrigger value="teacher">Teacher</TabsTrigger>
        </TabsList>
        <TabsContent value={role}>
          <Card>
            <CardHeader>
              <CardTitle>Create {role === "student" ? "Student" : "Teacher"} Account</CardTitle>
              <CardDescription>Sign up to get started</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" required value={formData.name} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required minLength={6} value={formData.password} onChange={handleChange} />
                </div>
                {role === "student" && (
                  <div className="space-y-2">
                    <Label htmlFor="rollNumber">Roll Number</Label>
                    <Input id="rollNumber" name="rollNumber" required value={formData.rollNumber} onChange={handleChange} />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" name="department" required value={formData.department} onChange={handleChange} />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}