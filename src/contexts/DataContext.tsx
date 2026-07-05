import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

// --- Type Interfaces ---

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  cgpa: number;
  profile: {
    phoneNumber: string;
    address: string;
    dateOfBirth: string;
    gender: string;
    department: string;
    year: number;
    semester: number;
    batch: string;
    birthDate?: string;
  };
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
  subjects: Subject[];
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  credits: string;
  description?: string;
  semester: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  subjectName: string;
  dueDate: string;
  maxMarks: number;
  fileUrl?: string;
  createdAt: string;
  createdBy: string;
  submissions?: AssignmentSubmission[];
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  fileUrl: string;
  submittedAt: string;
  marks?: number;
  feedback?: string;
}

export interface Attendance {
  id: string;
  subjectId: string;
  subjectName: string;
  date: string;
  students: {
    studentId: string;
    rollNumber: string;
    name: string;
    present: boolean;
  }[];
}

export interface AttendanceSummary {
  studentId: string;
  rollNumber: string;
  subjects: {
    subjectId: string;
    subjectName: string;
    totalClasses: number;
    attended: number;
    percentage: number;
  }[];
  overall: {
    totalClasses: number;
    attended: number;
    percentage: number;
  };
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: "student" | "teacher";
  receiverId: string;
  receiverName: string;
  receiverType: "student" | "teacher";
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: "exam" | "event";
  date: string;
  createdAt: string;
  createdBy: string;
}

export interface TimeSlot {
  day: string;
  time: string;
  subject: string;
  location: string;
  faculty?: string;
}

export interface TimeTable {
  slots: TimeSlot[];
}

export interface ExamResult {
  subjectCode: string;
  subjectName: string;
  credit: number;
  grade: string;
  marks?: number;
}

export interface MinorResult {
  id?: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  maxMarks: number;
  obtainedMarks: number;
  examDate: string;
  examType: "Minor1" | "Minor2";
  studentId?: string;
  rollNumber?: string;
  studentName?: string;
  percentage?: number;
}

export interface SemesterGrade {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  grade: string;
  credit: number;
  semester: number;
}

export interface SemesterResult {
  studentId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  specialization: string;
  year: number;
  semester: number;
  academicYear: string;
  results: ExamResult[];
  sgpa: number;
  cgpa: number;
}

interface DataContextType {
  students: Student[];
  teachers: Teacher[];
  subjects: Subject[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  attendance: Attendance[];
  attendanceSummary: AttendanceSummary[];
  messages: Message[];
  notifications: Notification[];
  timetable: TimeTable;
  semesterResults: SemesterResult[];
  minorResults: MinorResult[];
  semesterGrades: SemesterGrade[];
  isLoadingAssignments: boolean;
  setSemesterGrades: (grades: SemesterGrade[]) => void;
  setMinorResults: (results: MinorResult[]) => void;
  submitAssignment: (assignmentId: string, studentId: string, fileUrl: string) => Promise<void>;
  sendMessage: (message: Omit<Message, "id" | "timestamp" | "read">) => void;
  markMessageAsRead: (messageId: string) => void;
  addAssignment: (assignment: Omit<Assignment, "id" | "createdAt" | "submissions">) => Promise<void>;
  gradeSubmission: (submissionId: string, marks: number, feedback?: string) => void;
  markAttendance: (subjectId: string, date: string, studentAttendance: { studentId: string; present: boolean }[]) => void;
  addNotification: (notification: Omit<Notification, "id" | "createdAt">) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// --- Mock Datasets ---

const mockStudents: Student[] = [
  {
    id: "1",
    name: "Demo Student One",
    rollNumber: "24DEMO001",
    email: "student1@example.edu",
    cgpa: 9.06,
    profile: {
      phoneNumber: "0000000001",
      address: "Demo Hostel, Room 101",
      dateOfBirth: "2003-05-15",
      gender: "Prefer not to say",
      department: "Mathematics & Computing",
      year: 1,
      semester: 2,
      batch: "2024-2028",
      birthDate: "15 May",
    },
  },
];

const mockTeachers: Teacher[] = [
  { id: "1", name: "Demo Teacher One", email: "teacher1@example.edu", department: "Maths Dept", subjects: [] }
];

const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "1",
    senderName: "Demo Student One",
    senderType: "student",
    receiverId: "1",
    receiverName: "Demo Teacher One",
    receiverType: "teacher",
    content: "Good afternoon, I had a question about the upcoming project deadline.",
    timestamp: "2024-11-05T14:30:00",
    read: false,
  },
];

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Mid-Semester Examinations",
    description: "The mid-semester examinations for all subjects will commence soon. The detailed schedule will be shared.",
    type: "exam",
    date: "2024-11-20",
    createdAt: "2024-11-01",
    createdBy: "1",
  },
];

const mockTimetable: TimeTable = {
  slots: [
    { day: "Monday", time: "8:00 - 8:55", subject: "DMS", location: "E104", faculty: "Demo Teacher One" },
  ],
};

const mockSemesterGrades: SemesterGrade[] = [
  {
    id: "sg1",
    studentId: "1",
    studentName: "Demo Student One",
    rollNumber: "24DEMO001",
    subjectId: "1",
    subjectName: "Design Thinking",
    subjectCode: "MA1102",
    grade: "A",
    credit: 4,
    semester: 2,
  },
];

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const { user } = useAuth();
  
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [semesterResults, setSemesterResults] = useState<SemesterResult[]>([]);
  const [minorResults, setMinorResults] = useState<MinorResult[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [isLoadingAssignments, setIsLoadingAssignments] = useState<boolean>(true);

  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary[]>([]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [timetable] = useState<TimeTable>(mockTimetable);
  const [semesterGrades, setSemesterGrades] = useState<SemesterGrade[]>(mockSemesterGrades);

  // 1. Fetch Subjects Safely
  useEffect(() => {
    const fetchSubjects = async () => {
      const { data, error } = await supabase.from("subjects").select("*");
      if (error) {
        console.error("Failed to fetch subjects:", error);
        return;
      }
      if (data) {
        const mapped: Subject[] = data.map((row) => ({
          id: String(row.id),
          code: String(row.code || ""),
          name: String(row.name || ""),
          credits: String(row.credits || ""),
          description: row.description || undefined,
          semester: Number(row.semester || 1),
        }));
        setSubjects(mapped);
      }
    };
    fetchSubjects();
  }, []);

  // 2. Fetch Assignments Safely (Resolving Database snake_case fields)
  useEffect(() => {
    const fetchLiveAssignments = async () => {
      try {
        setIsLoadingAssignments(true);
        const { data, error } = await supabase
          .from("assignments")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data) {
          const mapped: Assignment[] = data.map((row) => ({
            id: String(row.id),
            title: String(row.title || ""),
            description: String(row.description || ""),
            subjectId: String(row.subject_id || ""),
            subjectName: String(row.subject_name || ""),
            dueDate: String(row.due_date || ""),
            maxMarks: Number(row.max_marks || 0),
            fileUrl: row.file_url || undefined,
            createdAt: String(row.created_at || ""),
            createdBy: String(row.created_by || ""),
            submissions: [],
          }));
          setAssignments(mapped);
        }
      } catch (err) {
        console.error("Failed parsing database assignment rows:", err);
      } finally {
        setIsLoadingAssignments(false);
      }
    };

    fetchLiveAssignments();
  }, []);

  // 3. Fetch Semester Results Safely
  useEffect(() => {
    const fetchSemesterResults = async () => {
      if (!user) {
        setSemesterResults([]);
        return;
      }

      const { data, error } = await supabase
        .from("semester_results")
        .select("*, exam_results(*)")
        .eq("student_id", user.id);

      if (error) {
        console.error("Failed to fetch semester results:", error);
        return;
      }

      if (data) {
        const mapped: SemesterResult[] = data.map((row) => ({
          studentId: String(user.id),
          studentName: String(user.name || ""),
          rollNumber: String(user.rollNumber || ""),
          department: String(user.department || ""),
          specialization: String(user.department || ""),
          year: 1,
          semester: Number(row.semester || 1),
          academicYear: String(row.academic_year || ""),
          sgpa: Number(row.sgpa || 0),
          cgpa: Number(row.cgpa || 0),
          results: Array.isArray(row.exam_results) 
            ? row.exam_results.map((er) => ({
                subjectCode: String(er.subject_code || ""),
                subjectName: String(er.subject_name || ""),
                credit: Number(er.credit || 0),
                grade: String(er.grade || ""),
              }))
            : [],
        }));
        setSemesterResults(mapped);
      }
    };

    fetchSemesterResults();
  }, [user]);

  // 4. Fetch Minor Exam Results Safely
  useEffect(() => {
    const fetchMinorResults = async () => {
      if (!user) {
        setMinorResults([]);
        return;
      }

      const { data, error } = await supabase
        .from("minor_results")
        .select(`
          id,
          subject_id,
          max_marks,
          obtained_marks,
          exam_date,
          exam_type,
          subjects (code, name)
        `)
        .eq("student_id", user.id);

      if (error) {
        console.error("Failed to fetch minor results:", error);
        return;
      }

      if (data) {
        const mapped: MinorResult[] = data.map((row: any) => ({
          id: String(row.id),
          subjectId: String(row.subject_id || ""),
          subjectCode: String(row.subjects?.code || ""),
          subjectName: String(row.subjects?.name || ""),
          maxMarks: Number(row.max_marks || 0),
          obtainedMarks: Number(row.obtained_marks || 0),
          examDate: String(row.exam_date || ""),
          examType: row.exam_type === "Minor2" ? "Minor2" : "Minor1",
          studentId: String(user.id),
          rollNumber: String(user.rollNumber || ""),
          studentName: String(user.name || ""),
          percentage: row.max_marks ? (Number(row.obtained_marks) / Number(row.max_marks)) * 100 : 0,
        }));
        setMinorResults(mapped);
      }
    };

    fetchMinorResults();
  }, [user]);

  // --- Handlers ---

  const submitAssignment = async (assignmentId: string, studentId: string, fileUrl: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;
    const assignment = assignments.find((a) => a.id === assignmentId);
    if (!assignment) return;

    const newSubmission: AssignmentSubmission = {
      id: `s-${submissions.length + 1}`,
      assignmentId,
      studentId,
      studentName: student.name,
      rollNumber: student.rollNumber,
      fileUrl,
      submittedAt: new Date().toISOString(),
    };

    setSubmissions((prev) => [...prev, newSubmission]);
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId ? { ...a, submissions: [...(a.submissions || []), newSubmission] } : a
      )
    );
    toast.success("Assignment response uploaded successfully!");
  };

  const sendMessage = (message: Omit<Message, "id" | "timestamp" | "read">) => {
    const newMessage: Message = {
      ...message,
      id: `m-${messages.length + 1}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => [...prev, newMessage]);
    toast.success("Message sent successfully!");
  };

  const markMessageAsRead = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg))
    );
  };

  const addAssignment = async (assignment: Omit<Assignment, "id" | "createdAt" | "submissions">) => {
    try {
      const targetPayload = {
        title: assignment.title,
        description: assignment.description,
        subject_id: assignment.subjectId,
        subject_name: assignment.subjectName,
        due_date: assignment.dueDate,
        max_marks: assignment.maxMarks,
        file_url: assignment.fileUrl,
        created_by: user?.id || "Teacher-MVP",
      };

      const { data, error } = await supabase
        .from("assignments")
        .insert([targetPayload])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        const createdRow = data[0];
        const instantiatedObject: Assignment = {
          id: String(createdRow.id),
          title: String(createdRow.title || ""),
          description: String(createdRow.description || ""),
          subjectId: String(createdRow.subject_id || ""),
          subjectName: String(createdRow.subject_name || ""),
          dueDate: String(createdRow.due_date || ""),
          maxMarks: Number(createdRow.max_marks || 0),
          fileUrl: createdRow.file_url || undefined,
          createdAt: String(createdRow.created_at || ""),
          createdBy: String(createdRow.created_by || ""),
          submissions: [],
        };

        setAssignments((prev) => [instantiatedObject, ...prev]);
        toast.success("Assignment link posted and synced safely with Database!");
      }
    } catch (err) {
      console.error("Failed publishing assignment to server:", err);
      toast.error("Database connection refused. Could not save post.");
    }
  };

  const gradeSubmission = (submissionId: string, marks: number, feedback?: string) => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === submissionId ? { ...sub, marks, feedback } : sub))
    );
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.submissions?.some((s) => s.id === submissionId)) {
          return {
            ...a,
            submissions: a.submissions.map((s) =>
              s.id === submissionId ? { ...s, marks, feedback } : s
            ),
          };
        }
        return a;
      })
    );
    toast.success("Submission graded successfully!");
  };

  const markAttendance = (
    subjectId: string,
    date: string,
    studentAttendance: { studentId: string; present: boolean }[]
  ) => {
    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject) return;

    const attendanceRecords = studentAttendance.map((record) => {
      const student = students.find((s) => s.id === record.studentId);
      return student
        ? { studentId: record.studentId, rollNumber: student.rollNumber, name: student.name, present: record.present }
        : { studentId: record.studentId, rollNumber: "Unknown", name: "Unknown", present: record.present };
    });

    const existingIndex = attendance.findIndex((a) => a.subjectId === subjectId && a.date === date);
    if (existingIndex !== -1) {
      setAttendance((prev) => {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], students: attendanceRecords };
        return updated;
      });
    } else {
      setAttendance((prev) => [
        ...prev,
        { id: `att-${prev.length + 1}`, subjectId, subjectName: subject.name, date, students: attendanceRecords },
      ]);
    }
    toast.success("Attendance marked successfully!");
  };

  const addNotification = (notification: Omit<Notification, "id" | "createdAt">) => {
    setNotifications((prev) => [
      ...prev,
      { ...notification, id: `n-${prev.length + 1}`, createdAt: new Date().toISOString() },
    ]);
    toast.success("Notification added successfully!");
  };

  return (
    <DataContext.Provider
      value={{
        students,
        teachers,
        subjects,
        assignments,
        submissions,
        attendance,
        attendanceSummary,
        messages,
        notifications,
        timetable,
        semesterResults,
        minorResults,
        semesterGrades,
        isLoadingAssignments,
        setMinorResults,
        setSemesterGrades,
        submitAssignment,
        sendMessage,
        markMessageAsRead,
        addAssignment,
        gradeSubmission,
        markAttendance,
        addNotification,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};