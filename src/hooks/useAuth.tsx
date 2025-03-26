
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type UserType = {
  type: "student" | "teacher";
  name: string;
  email: string;
  rollNumber?: string;
  department?: string;
} | null;

interface AuthContextType {
  user: UserType;
  login: (email: string, password: string, type: "student" | "teacher") => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("arcUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, type: "student" | "teacher"): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call with a timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        // Hardcoded credentials for demo
        if (type === "student" && email === "vd24mab0a41@student.nitw.ac.in" && password === "Dhruv@22") {
          const studentUser = {
            type: "student" as const,
            name: "V Dhruv",
            email: "vd24mab0a41@student.nitw.ac.in",
            rollNumber: "24MAB0A41",
            department: "Mathematics & Computing"
          };
          
          setUser(studentUser);
          localStorage.setItem("arcUser", JSON.stringify(studentUser));
          setIsLoading(false);
          toast.success("Login successful!");
          navigate("/student-dashboard");
          resolve(true);
        } 
        else if (type === "teacher" && email === "abenerji@nitw.ac.in" && password === "Dhruv@22") {
          const teacherUser = {
            type: "teacher" as const,
            name: "A Benerji Babu",
            email: "abenerji@nitw.ac.in",
            department: "Maths Dept"
          };
          
          setUser(teacherUser);
          localStorage.setItem("arcUser", JSON.stringify(teacherUser));
          setIsLoading(false);
          toast.success("Login successful!");
          navigate("/teacher-dashboard");
          resolve(true);
        } 
        else {
          setIsLoading(false);
          toast.error("Invalid email or password");
          resolve(false);
        }
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem("arcUser");
    setUser(null);
    navigate("/");
    toast.info("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
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
