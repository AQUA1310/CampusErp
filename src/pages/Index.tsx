import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function Index() {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to appropriate dashboard
  if (isAuthenticated) {
    if (user?.type === "student") {
      return <Navigate to="/student-dashboard" />;
    } else if (user?.type === "teacher") {
      return <Navigate to="/teacher-dashboard" />;
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      toast.error("Invalid email or password");
      setIsSubmitting(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (profileError || !profile) {
      toast.error("Could not load profile");
      setIsSubmitting(false);
      return;
    }

    toast.success("Login successful!");
    navigate(profile.role === "student" ? "/student-dashboard" : "/teacher-dashboard");
    setIsSubmitting(false);
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
          <p className="text-primary-600">Mathematics Department, NIT Warangal</p>
        </div>

        <Card className="shadow-xl border-primary-100">
          <CardHeader className="bg-primary-50 border-b border-primary-100 rounded-t-lg">
            <CardTitle className="text-primary-800 text-xl text-center">Login</CardTitle>
            <CardDescription className="text-center text-primary-600">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="youremail@student.nitw.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-xs text-primary-600 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary-700" disabled={isSubmitting || authLoading}>
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
              <p className="text-sm text-center text-primary-600 mt-4">
                Don't have an account?{" "}
                <a href="/signup" className="underline font-medium">Sign up</a>
              </p>
            </CardContent>
          </form>
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