import { useEffect } from "react";
import { Navigate } from "react-router-dom";
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

  // 1. Handle Global Loading State cleanly
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50/20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  // 2. Guard Clause: Force back to login if unauthenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 3. Guard Clause: Cross-role protection (Instant declarative redirect)
  if (requiredUserType && user?.type !== requiredUserType) {
    if (user?.type === "student") {
      return <Navigate to="/student-dashboard" replace />;
    } else if (user?.type === "teacher") {
      return <Navigate to="/teacher-dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // 4. Authorized Access granted
  return <>{children}</>;
}