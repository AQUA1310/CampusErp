
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import LoginForm from "@/components/auth/LoginForm";

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.type === "student") {
        navigate("/student-dashboard");
      } else if (user?.type === "teacher") {
        navigate("/teacher-dashboard");
      }
    }
  }, [isAuthenticated, navigate, user]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-oliveGreen-50 to-oliveGreen-100">
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <div className="mb-6">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/e/ef/NIT_Warangal_logo.png" 
              alt="NIT Warangal Logo" 
              className="h-24 mx-auto"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-oliveGreen-900 mb-2">
            ARC Portal
          </h1>
          <h2 className="text-xl sm:text-2xl font-semibold text-oliveGreen-700 mb-2">
            Mathematics Department
          </h2>
          <p className="text-oliveGreen-600 max-w-md mx-auto">
            B.Tech Mathematics & Computing branch at NIT Warangal
          </p>
        </div>
        
        <div className="bg-white glass-morphism rounded-xl shadow-lg p-6 animate-scale-in">
          <LoginForm />
        </div>
        
        <div className="mt-8 text-center text-sm text-oliveGreen-600">
          <p>© {new Date().getFullYear()} NIT Warangal. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
