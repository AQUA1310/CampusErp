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
  logout: () => { },
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
      // If profile is missing but user is logged in via Google Auth, attempt automatic creation
      const emailLower = session.user.email?.toLowerCase().trim() || "";
      const studentEmailRegex = /^([a-zA-Z]{2})((21|22|23|24)ma[a-zA-Z0-9]+)@student\.nitw\.ac\.in$/;
      const match = emailLower.match(studentEmailRegex);

      if (match) {
        const rollNumber = match[2].toUpperCase(); // e.g. "24MAB0A21"
        const name =
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          "Anonymous Student";
        const department = "Mathematics";

        // Auto-create profile row in database
        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: session.user.id,
            name: name,
            role: "student",
            roll_number: rollNumber,
            department: department
          })
          .select()
          .single();

        if (insertError) {
          console.error("Failed to automatically create student profile:", insertError);
          return null;
        }

        return {
          id: session.user.id,
          type: "student",
          name: newProfile.name,
          email: emailLower,
          rollNumber: newProfile.roll_number,
          department: newProfile.department
        };
      }

      console.error("Profile not found in database and email is unauthorized.");
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
          if (profile) {
            setUser(profile);
          } else {
            // Sign out invalid account
            await supabase.auth.signOut();
            setUser(null);
            toast.error("Access Denied: Only Mathematics department student emails or whitelisted faculty are allowed.");
          }
        }
      } catch (err) {
        console.error("Session sync failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // 2. Setup auth stream observer for instant layout adjustments on transitions
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const profile = await loadUserProfile(session);
        if (profile) {
          setUser(profile);
        } else {
          // Sign out invalid account
          await supabase.auth.signOut();
          setUser(null);
          toast.error("Access Denied: Only Mathematics department student emails or whitelisted faculty are allowed.");
        }
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