
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: "student" | "teacher";
}

export default function ProtectedRoute({ 
  children, 
  requiredUserType 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate("/");
        return;
      }

      if (requiredUserType && user?.type !== requiredUserType) {
        if (user?.type === "student") {
          navigate("/student-dashboard");
        } else if (user?.type === "teacher") {
          navigate("/teacher-dashboard");
        } else {
          navigate("/");
        }
      }
    }
  }, [isAuthenticated, isLoading, navigate, requiredUserType, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-oliveGreen-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredUserType && user?.type !== requiredUserType) {
    return null;
  }

  return <>{children}</>;
}
