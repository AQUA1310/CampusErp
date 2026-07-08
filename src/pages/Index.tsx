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
              <div className="flex items-center w-full my-2">
                <div className="border-t border-slate-300 flex-grow"></div>
                <span className="mx-2 text-xs text-slate-500 uppercase">Or</span>
                <div className="border-t border-slate-300 flex-grow"></div>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2" 
                onClick={async () => {
                  setIsSubmitting(true);
                  const { error } = await supabase.auth.signInWithOAuth({
                    provider: "google",
                    options: {
                      redirectTo: `${window.location.origin}/`,
                    },
                  });
                  if (error) {
                    toast.error("Google login failed: " + error.message);
                  }
                  setIsSubmitting(false);
                }}
                disabled={isSubmitting || authLoading}
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
                Continue with Google (Students)
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