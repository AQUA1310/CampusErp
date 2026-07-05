import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

type UserType = {
  id: string;
  type: "student" | "teacher";
  name: string;
  email: string;
  rollNumber?: string;
  department?: string;
} | null;

interface AuthContextType {
  user: UserType;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  logout: () => {},
  isAuthenticated: false,
  isLoading: true,
});

// Robust profile data loader with built-in error handling
async function loadUserProfile(session: Session): Promise<UserType> {
  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (error || !profile) {
      console.error("Profile load error:", error);
      return null;
    }

    return {
      id: session.user.id,
      type: profile.role, // Maps db 'role' string cleanly to client 'type'
      name: profile.name,
      email: session.user.email ?? "",
      rollNumber: profile.roll_number ?? undefined,
      department: profile.department ?? undefined,
    };
  } catch (err) {
    console.error("Unexpected error fetching profile:", err);
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Resolve active session on mount (covers deep links and page refreshes)
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const profile = await loadUserProfile(session);
          setUser(profile);
        }
      } catch (err) {
        console.error("Session sync failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // 2. Setup auth stream observer for instant layout adjustments on transitions
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const profile = await loadUserProfile(session);
        setUser(profile);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate("/");
      toast.info("Logged out successfully");
    } catch (err) {
      toast.error("Logout failed cleanly");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);