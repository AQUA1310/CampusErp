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

// Fetches the profile row and builds our app's user object
async function loadUserProfile(session: Session): Promise<UserType> {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (error || !profile) return null;

  return {
    id: session.user.id,
    type: profile.role,
    name: profile.name,
    email: session.user.email ?? "",
    rollNumber: profile.roll_number ?? undefined,
    department: profile.department ?? undefined,
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's already a logged-in session (e.g. page refresh)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const profile = await loadUserProfile(session);
        setUser(profile);
      }
      setIsLoading(false);
    });

    // Listen for login/logout events anywhere in the app
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const profile = await loadUserProfile(session);
        setUser(profile);
      } else {
        setUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/");
    toast.info("Logged out successfully");
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