import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

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
  setSemesterGrades: (grades: SemesterGrade[]) => void;
  setMinorResults: (results: MinorResult[]) => void;

  submitAssignment: (assignmentId: string, studentId: string, fileUrl: string) => void;
  sendMessage: (message: Omit<Message, "id" | "timestamp" | "read">) => void;
  markMessageAsRead: (messageId: string) => void;

  addAssignment: (assignment: Omit<Assignment, "id" | "createdAt" | "submissions">) => void;
  gradeSubmission: (submissionId: string, marks: number, feedback?: string) => void;
  markAttendance: (subjectId: string, date: string, studentAttendance: { studentId: string; present: boolean }[]) => void;
  addNotification: (notification: Omit<Notification, "id" | "createdAt">) => void;
}

const DataContext = createContext<DataContextType>({
  students: [],
  teachers: [],
  subjects: [],
  assignments: [],
  submissions: [],
  attendance: [],
  attendanceSummary: [],
  messages: [],
  notifications: [],
  timetable: { slots: [] },
  semesterResults: [],
  minorResults: [],
  semesterGrades: [],
  setSemesterGrades: () => {},
  setMinorResults: () => {},

  submitAssignment: () => {},
  sendMessage: () => {},
  markMessageAsRead: () => {},

  addAssignment: () => {},
  gradeSubmission: () => {},
  markAttendance: () => {},
  addNotification: () => {},
});

// Demo/placeholder data — no real personal information
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
  {
    id: "2",
    name: "Demo Student Two",
    rollNumber: "24DEMO002",
    email: "student2@example.edu",
    cgpa: 9.21,
    profile: {
      phoneNumber: "0000000002",
      address: "Demo Hostel, Room 102",
      dateOfBirth: "2003-02-20",
      gender: "Prefer not to say",
      department: "Mathematics & Computing",
      year: 1,
      semester: 2,
      batch: "2024-2028",
      birthDate: "20 February",
    },
  },
  {
    id: "3",
    name: "Demo Student Three",
    rollNumber: "24DEMO003",
    email: "student3@example.edu",
    cgpa: 8.95,
    profile: {
      phoneNumber: "0000000003",
      address: "Demo Hostel, Room 103",
      dateOfBirth: "2003-04-10",
      gender: "Prefer not to say",
      department: "Mathematics & Computing",
      year: 1,
      semester: 2,
      batch: "2024-2028",
      birthDate: "10 April",
    },
  },
];

const mockSubjects: Subject[] = [
  { id: "1", code: "MA1102", name: "Design Thinking", credits: "0-1-4 3", description: "Introduction to design thinking process, methods, and tools.", semester: 2 },
  { id: "2", code: "MA1104", name: "Ordinary Differential Equations", credits: "3-0-0 3", description: "Study of equations containing derivatives of unknown functions.", semester: 2 },
  { id: "3", code: "MA1106", name: "Data Structures and Algorithms", credits: "3-0-2 4", description: "Fundamental data structures and algorithms for organizing, searching, and sorting data.", semester: 2 },
  { id: "4", code: "EE1162", name: "Basic Electrical and Electronics Engineering", credits: "3-0-0 3", description: "Introduction to electrical and electronic components, circuits, and systems.", semester: 2 },
  { id: "5", code: "MA1108", name: "Elementary Linear Algebra", credits: "3-0-0 3", description: "Study of vectors, vector spaces, linear transformations, and systems of linear equations.", semester: 2 },
  { id: "6", code: "MA1110", name: "Discrete Mathematical Structures", credits: "3-0-0 3", description: "Mathematical structures that are fundamentally discrete rather than continuous.", semester: 2 },
  { id: "7", code: "EE1164", name: "Basic Electrical Engineering Lab", credits: "0-1-2 2", description: "Practical laboratory work related to basic electrical engineering concepts.", semester: 2 },
  { id: "8", code: "IC1102", name: "EAA-II (Games & Sports / Yoga & Wellness)", credits: "0-0-0 0", description: "Extra Academic Activity focusing on physical fitness and wellness.", semester: 2 },
];

const mockTeachers: Teacher[] = [
  { id: "1", name: "Demo Teacher One", email: "teacher1@example.edu", department: "Maths Dept", subjects: mockSubjects },
  { id: "2", name: "Demo Teacher Two", email: "teacher2@example.edu", department: "Maths Dept", subjects: [mockSubjects[1]] },
  { id: "3", name: "Demo Teacher Three", email: "teacher3@example.edu", department: "Maths Dept", subjects: [mockSubjects[2]] },
  { id: "4", name: "Demo Teacher Four", email: "teacher4@example.edu", department: "Electrical Dept", subjects: [mockSubjects[3], mockSubjects[6]] },
];

const mockAssignments: Assignment[] = [
  {
    id: "1",
    title: "Design Thinking Project Proposal",
    description: "Prepare a project proposal for your Design Thinking course final project.",
    subjectId: "1",
    subjectName: "Design Thinking",
    dueDate: "2024-11-15",
    maxMarks: 20,
    fileUrl: "https://example.com/assignments/dt_proposal.pdf",
    createdAt: "2024-10-25",
    createdBy: "1",
    submissions: [],
  },
  {
    id: "2",
    title: "ODE Assignment 1: First Order Equations",
    description: "Solve the given set of first-order ordinary differential equations.",
    subjectId: "2",
    subjectName: "Ordinary Differential Equations",
    dueDate: "2024-11-10",
    maxMarks: 15,
    fileUrl: "https://example.com/assignments/ode_assignment1.pdf",
    createdAt: "2024-10-27",
    createdBy: "2",
    submissions: [],
  },
];

const mockSubmissions: AssignmentSubmission[] = [
  {
    id: "1",
    assignmentId: "1",
    studentId: "1",
    studentName: "Demo Student One",
    rollNumber: "24DEMO001",
    fileUrl: "https://example.com/submissions/dt_proposal_demo.pdf",
    submittedAt: "2024-11-14",
    marks: 18,
    feedback: "Excellent proposal with a clear problem statement.",
  },
];

const mockAttendance: Attendance[] = [
  {
    id: "1",
    subjectId: "1",
    subjectName: "Design Thinking",
    date: "2024-10-27",
    students: [
      { studentId: "1", rollNumber: "24DEMO001", name: "Demo Student One", present: true },
      { studentId: "2", rollNumber: "24DEMO002", name: "Demo Student Two", present: true },
      { studentId: "3", rollNumber: "24DEMO003", name: "Demo Student Three", present: false },
    ],
  },
];

const mockAttendanceSummary: AttendanceSummary[] = [
  {
    studentId: "1",
    rollNumber: "24DEMO001",
    subjects: [
      { subjectId: "1", subjectName: "Design Thinking", totalClasses: 8, attended: 7, percentage: 87.5 },
      { subjectId: "2", subjectName: "Ordinary Differential Equations", totalClasses: 10, attended: 9, percentage: 90 },
    ],
    overall: { totalClasses: 18, attended: 16, percentage: 88.89 },
  },
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
    { day: "Monday", time: "2:00 - 2:55", subject: "ODE", location: "E104", faculty: "Demo Teacher Two" },
    { day: "Tuesday", time: "8:00 - 8:55", subject: "DMS", location: "E104", faculty: "Demo Teacher One" },
    { day: "Wednesday", time: "10:00 - 10:55", subject: "DSA", location: "E104", faculty: "Demo Teacher Three" },
  ],
};

const mockSemesterResults: SemesterResult[] = [
  {
    studentId: "1",
    studentName: "Demo Student One",
    rollNumber: "24DEMO001",
    department: "Department of Mathematics",
    specialization: "Mathematics and Computing",
    year: 1,
    semester: 1,
    academicYear: "2024-2025",
    results: [
      { subjectCode: "BT1161", subjectName: "Biology for Engineers", credit: 2, grade: "B" },
      { subjectCode: "MA1101", subjectName: "Calculus", credit: 3, grade: "A" },
      { subjectCode: "PH1161", subjectName: "Engineering Physics", credit: 4, grade: "S" },
    ],
    sgpa: 9.06,
    cgpa: 9.06,
  },
];

const mockMinorResults: MinorResult[] = [
  {
    id: "m1",
    subjectId: "1",
    subjectCode: "MA1102",
    subjectName: "Design Thinking",
    maxMarks: 30,
    obtainedMarks: 26,
    examDate: "2024-09-15",
    examType: "Minor1",
    studentId: "1",
    rollNumber: "24DEMO001",
    studentName: "Demo Student One",
    percentage: 86.67,
  },
  {
    id: "m2",
    subjectId: "2",
    subjectCode: "MA1104",
    subjectName: "Ordinary Differential Equations",
    maxMarks: 30,
    obtainedMarks: 28,
    examDate: "2024-09-16",
    examType: "Minor1",
    studentId: "1",
    rollNumber: "24DEMO001",
    studentName: "Demo Student One",
    percentage: 93.33,
  },
];

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
  {
    id: "sg2",
    studentId: "1",
    studentName: "Demo Student One",
    rollNumber: "24DEMO001",
    subjectId: "2",
    subjectName: "Ordinary Differential Equations",
    subjectCode: "MA1104",
    grade: "S",
    credit: 4,
    semester: 2,
  },
];

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(mockSubmissions);
  const [attendance, setAttendance] = useState<Attendance[]>(mockAttendance);
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary[]>(mockAttendanceSummary);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [timetable] = useState<TimeTable>(mockTimetable);
  const [semesterResults] = useState<SemesterResult[]>(mockSemesterResults);
  const [minorResults, setMinorResults] = useState<MinorResult[]>(mockMinorResults);
  const [semesterGrades, setSemesterGrades] = useState<SemesterGrade[]>(mockSemesterGrades);

  const submitAssignment = (assignmentId: string, studentId: string, fileUrl: string) => {
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

    setSubmissions([...submissions, newSubmission]);
    setAssignments(assignments.map((a) =>
      a.id === assignmentId ? { ...a, submissions: [...(a.submissions || []), newSubmission] } : a
    ));
    toast.success("Assignment submitted successfully!");
  };

  const sendMessage = (message: Omit<Message, "id" | "timestamp" | "read">) => {
    const newMessage: Message = { ...message, id: `m-${messages.length + 1}`, timestamp: new Date().toISOString(), read: false };
    setMessages([...messages, newMessage]);
    toast.success("Message sent successfully!");
  };

  const markMessageAsRead = (messageId: string) => {
    setMessages(messages.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg)));
  };

  const addAssignment = (assignment: Omit<Assignment, "id" | "createdAt" | "submissions">) => {
    const newAssignment: Assignment = { ...assignment, id: `a-${assignments.length + 1}`, createdAt: new Date().toISOString(), submissions: [] };
    setAssignments([...assignments, newAssignment]);
    toast.success("Assignment created successfully!");
  };

  const gradeSubmission = (submissionId: string, marks: number, feedback?: string) => {
    setSubmissions(submissions.map((sub) => (sub.id === submissionId ? { ...sub, marks, feedback } : sub)));
    setAssignments(assignments.map((a) => {
      if (a.submissions?.some((s) => s.id === submissionId)) {
        return { ...a, submissions: a.submissions.map((s) => (s.id === submissionId ? { ...s, marks, feedback } : s)) };
      }
      return a;
    }));
    toast.success("Submission graded successfully!");
  };

  const markAttendance = (subjectId: string, date: string, studentAttendance: { studentId: string; present: boolean }[]) => {
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
      const updated = [...attendance];
      updated[existingIndex] = { ...updated[existingIndex], students: attendanceRecords };
      setAttendance(updated);
    } else {
      setAttendance([...attendance, { id: `att-${attendance.length + 1}`, subjectId, subjectName: subject.name, date, students: attendanceRecords }]);
    }
    toast.success("Attendance marked successfully!");
  };

  const addNotification = (notification: Omit<Notification, "id" | "createdAt">) => {
    setNotifications([...notifications, { ...notification, id: `n-${notifications.length + 1}`, createdAt: new Date().toISOString() }]);
    toast.success("Notification added successfully!");
  };

  return (
    <DataContext.Provider
      value={{
        students, teachers, subjects, assignments, submissions, attendance,
        attendanceSummary, messages, notifications, timetable, semesterResults,
        minorResults, semesterGrades, setMinorResults, setSemesterGrades,
        submitAssignment, sendMessage, markMessageAsRead, addAssignment,
        gradeSubmission, markAttendance, addNotification,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);