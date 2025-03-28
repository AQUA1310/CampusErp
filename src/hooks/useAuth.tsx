
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Define the student list
const studentList = [
  { id: "1", rollNumber: "24MAB0A01", name: "Aaryaman Pratap Singh", email: "aps24mab0a01@student.nitw.ac.in" },
  { id: "2", rollNumber: "24MAB0A02", name: "Aditya Sharma", email: "as24mab0a02@student.nitw.ac.in" },
  { id: "3", rollNumber: "24MAB0A03", name: "Akshay Kumar", email: "ak24mab0a03@student.nitw.ac.in" },
  { id: "4", rollNumber: "24MAB0A04", name: "Akula Tejaswini", email: "at24mab0a04@student.nitw.ac.in" },
  { id: "5", rollNumber: "24MAB0A05", name: "Arpita Halwasia", email: "ah24mab0a05@student.nitw.ac.in" },
  { id: "6", rollNumber: "24MAB0A06", name: "Bhingradiya Daksh", email: "bd24mab0a06@student.nitw.ac.in" },
  { id: "7", rollNumber: "24MAB0A07", name: "Boddupalli Jahnavi", email: "bj24mab0a07@student.nitw.ac.in" },
  { id: "8", rollNumber: "24MAB0A08", name: "Erupula Pragnesh", email: "ep24mab0a08@student.nitw.ac.in" },
  { id: "9", rollNumber: "24MAB0A09", name: "Ganji Satwika", email: "gs24mab0a09@student.nitw.ac.in" },
  { id: "10", rollNumber: "24MAB0A10", name: "H Sahas", email: "hs24mab0a10@student.nitw.ac.in" },
  { id: "11", rollNumber: "24MAB0A11", name: "Hariom Shilpkar", email: "hs24mab0a11@student.nitw.ac.in" },
  { id: "12", rollNumber: "24MAB0A12", name: "Hasini Sai D", email: "hsd24mab0a12@student.nitw.ac.in" },
  { id: "13", rollNumber: "24MAB0A13", name: "Johann S Martin", email: "jsm24mab0a13@student.nitw.ac.in" },
  { id: "14", rollNumber: "24MAB0A14", name: "KGG Naik", email: "kggn24mab0a14@student.nitw.ac.in" },
  { id: "15", rollNumber: "24MAB0A15", name: "Limbani Jeel", email: "lj24mab0a15@student.nitw.ac.in" },
  { id: "17", rollNumber: "24MAB0A17", name: "M SaiKiran", email: "ms24mab0a17@student.nitw.ac.in" },
  { id: "18", rollNumber: "24MAB0A18", name: "Mitrajit Ghorui", email: "mg24mab0a18@student.nitw.ac.in" },
  { id: "19", rollNumber: "24MAB0A19", name: "Mohammad Saad Ansari", email: "msa24mab0a19@student.nitw.ac.in" },
  { id: "20", rollNumber: "24MAB0A20", name: "Ishan Nepal", email: "in24mab0a20@student.nitw.ac.in" },
  { id: "21", rollNumber: "24MAB0A21", name: "Pansuriya Zeel", email: "pz24mab0a21@student.nitw.ac.in" },
  { id: "22", rollNumber: "24MAB0A22", name: "P Kshetragna Sharma", email: "pks24mab0a22@student.nitw.ac.in" },
  { id: "23", rollNumber: "24MAB0A23", name: "Putnala Prabhav", email: "pp24mab0a23@student.nitw.ac.in" },
  { id: "24", rollNumber: "24MAB0A24", name: "Boss !", email: "boss24mab0a24@student.nitw.ac.in" },
  { id: "25", rollNumber: "24MAB0A25", name: "Ragula Thirumal", email: "rt24mab0a25@student.nitw.ac.in" },
  { id: "26", rollNumber: "24MAB0A26", name: "Rasesh Kumar Sahu", email: "rks24mab0a26@student.nitw.ac.in" },
  { id: "27", rollNumber: "24MAB0A27", name: "Rohan Chinta", email: "rc24mab0a27@student.nitw.ac.in" },
  { id: "28", rollNumber: "24MAB0A28", name: "Rohit Manoj Nair", email: "rmn24mab0a28@student.nitw.ac.in" },
  { id: "29", rollNumber: "24MAB0A29", name: "Roy Harwani", email: "rh24mab0a29@student.nitw.ac.in" },
  { id: "30", rollNumber: "24MAB0A30", name: "S Vageesh", email: "sv24mab0a30@student.nitw.ac.in" },
  { id: "31", rollNumber: "24MAB0A31", name: "Saisrihan Yadalla", email: "sy24mab0a31@student.nitw.ac.in" },
  { id: "32", rollNumber: "24MAB0A32", name: "S Mohan Reddy", email: "smr24mab0a32@student.nitw.ac.in" },
  { id: "33", rollNumber: "24MAB0A33", name: "Shaik Abdul", email: "sa24mab0a33@student.nitw.ac.in" },
  { id: "34", rollNumber: "24MAB0A34", name: "Shaif Arif", email: "sa24mab0a34@student.nitw.ac.in" },
  { id: "35", rollNumber: "24MAB0A35", name: "Shambhavi Dhange", email: "sd24mab0a35@student.nitw.ac.in" },
  { id: "36", rollNumber: "24MAB0A36", name: "Srirangam Sri Sahaj", email: "sss24mab0a36@student.nitw.ac.in" },
  { id: "37", rollNumber: "24MAB0A37", name: "Yashaswini Sudharshan", email: "ys24mab0a37@student.nitw.ac.in" },
  { id: "38", rollNumber: "24MAB0A38", name: "Sumedha K", email: "sk24mab0a38@student.nitw.ac.in" },
  { id: "39", rollNumber: "24MAB0A39", name: "Thaduru Sreshta", email: "ts24mab0a39@student.nitw.ac.in" },
  { id: "40", rollNumber: "24MAB0A40", name: "Trupti Aggarwal", email: "ta24mab0a40@student.nitw.ac.in" },
  { id: "41", rollNumber: "24MAB0A41", name: "V Dhruv", email: "vd24mab0a41@student.nitw.ac.in" },
  { id: "42", rollNumber: "24MAB0A42", name: "V Vamshi", email: "vv24mab0a42@student.nitw.ac.in" },
  { id: "43", rollNumber: "24MAB0A43", name: "V Prashanth", email: "vp24mab0a43@student.nitw.ac.in" },
  { id: "44", rollNumber: "24MAB0A44", name: "V Neha", email: "vn24mab0a44@student.nitw.ac.in" },
  { id: "45", rollNumber: "24MAB0A45", name: "W Aryan", email: "wa24mab0a45@student.nitw.ac.in" },
];

// Define teacher list
const teacherList = [
  { id: "1", name: "A Benerji Babu", email: "abenerji@nitw.ac.in", department: "Maths Dept" },
  { id: "2", name: "Satyanarayana Engu", email: "satya@nitw.ac.in", department: "Maths Dept" },
  { id: "3", name: "Debashis Dutta", email: "ddutta@nitw.ac.in", department: "Maths Dept" },
  { id: "4", name: "B L Narasimharaju", email: "blnraju@nitw.ac.in", department: "Electrical Dept" },
  { id: "5", name: "Jagannath Roy", email: "jroy@nitw.ac.in", department: "Maths Dept" },
  { id: "6", name: "D Srinivasacharya", email: "dsacharya@nitw.ac.in", department: "Maths Dept" },
];

type UserType = {
  type: "student" | "teacher";
  id: string;
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
  studentList: typeof studentList;
  teacherList: typeof teacherList;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
  isLoading: true,
  studentList: [],
  teacherList: [],
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
        if (type === "student") {
          const student = studentList.find(s => s.email.toLowerCase() === email.toLowerCase());
          if (student && password === "Dhruv@22") {
            const studentUser = {
              type: "student" as const,
              id: student.id,
              name: student.name,
              email: student.email,
              rollNumber: student.rollNumber,
              department: "Mathematics & Computing"
            };
            
            setUser(studentUser);
            localStorage.setItem("arcUser", JSON.stringify(studentUser));
            setIsLoading(false);
            toast.success("Login successful!");
            navigate("/student-dashboard");
            resolve(true);
          } else {
            setIsLoading(false);
            toast.error("Invalid email or password");
            resolve(false);
          }
        } 
        else if (type === "teacher") {
          const teacher = teacherList.find(t => t.email.toLowerCase() === email.toLowerCase());
          if (teacher && password === "Dhruv@22") {
            const teacherUser = {
              type: "teacher" as const,
              id: teacher.id,
              name: teacher.name,
              email: teacher.email,
              department: teacher.department
            };
            
            setUser(teacherUser);
            localStorage.setItem("arcUser", JSON.stringify(teacherUser));
            setIsLoading(false);
            toast.success("Login successful!");
            navigate("/teacher-dashboard");
            resolve(true);
          } else {
            setIsLoading(false);
            toast.error("Invalid email or password");
            resolve(false);
          }
        } else {
          setIsLoading(false);
          toast.error("Invalid user type");
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
        studentList,
        teacherList,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
