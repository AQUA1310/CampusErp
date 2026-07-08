import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ALLOWED_TEACHERS = [
  "benerji@nitw.ac.in",
  "satyanarayana@nitw.ac.in",
  "jagannath@nitw.ac.in",
  "dutta@nitw.ac.in",
  "srinivas@nitw.ac.in"
];

export default function SignupForm() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rollNumber: "",
    branch: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    if (error) {
      toast.error("Google sign up failed: " + error.message);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const emailLower = formData.email.toLowerCase().trim();

    // Step 0A: Validate Student Email ID structure and department code
    if (role === "student") {
      const studentEmailRegex = /^[a-zA-Z]{2}(21|22|23|24)ma[a-zA-Z0-9]+@student\.nitw\.ac\.in$/;
      if (!studentEmailRegex.test(emailLower)) {
        toast.error("Invalid student email ID. Must be a Mathematics Department email (e.g. pz24mab0a21@student.nitw.ac.in).");
        setIsLoading(false);
        return;
      }

      // Step 0B: Check for duplicate roll numbers
      const { data: existingRoll, error: rollCheckError } = await supabase
        .from("profiles")
        .select("id")
        .eq("roll_number", formData.rollNumber.trim().toUpperCase())
        .maybeSingle();

      if (rollCheckError) {
        console.error("Roll check database error:", rollCheckError);
      }

      if (existingRoll) {
        toast.error("A student account with this Roll Number already exists!");
        setIsLoading(false);
        return;
      }
    }

    // Step 0C: Validate Teacher against the whitelisted array
    if (role === "teacher") {
      if (!ALLOWED_TEACHERS.includes(emailLower)) {
        toast.error("This email is not authorized for Mathematics faculty registration.");
        setIsLoading(false);
        return;
      }
    }

    // Step 1: Create the auth user (handles password securely)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: emailLower,
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
      roll_number: role === "student" ? formData.rollNumber.trim().toUpperCase() : null,
      department: role === "student" ? formData.branch || "Mathematics" : "Mathematics",
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
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="rollNumber">Roll Number</Label>
                      <Input id="rollNumber" name="rollNumber" required value={formData.rollNumber} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="branch">Branch</Label>
                      <Select onValueChange={(value) => setFormData({ ...formData, branch: value })} required>
                        <SelectTrigger id="branch">
                          <SelectValue placeholder="Select your branch" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M.Sc. Mathematics">M.Sc. Mathematics</SelectItem>
                          <SelectItem value="Mathematics & Scientific Computing">Mathematics & Scientific Computing</SelectItem>
                          <SelectItem value="B.Tech Mathematics & Computing">B.Tech Mathematics & Computing</SelectItem>
                          <SelectItem value="Int Msc Mathematics">Int Msc Mathematics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>
                {role === "student" && (
                  <>
                    <div className="flex items-center w-full my-2">
                      <div className="border-t border-slate-300 flex-grow"></div>
                      <span className="mx-2 text-xs text-slate-500 uppercase">Or</span>
                      <div className="border-t border-slate-300 flex-grow"></div>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2" 
                      onClick={handleGoogleSignup}
                      disabled={isLoading}
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      Continue with Google
                    </Button>
                  </>
                )}
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}