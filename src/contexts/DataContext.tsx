import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

// Types for our data
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
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  maxMarks: number;
  obtainedMarks: number;
  examDate: string;
  examType: "Minor1" | "Minor2";
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

// Create the context
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

  // Actions for students
  submitAssignment: (assignmentId: string, studentId: string, fileUrl: string) => void;
  sendMessage: (message: Omit<Message, "id" | "timestamp" | "read">) => void;
  markMessageAsRead: (messageId: string) => void;

  // Actions for teachers
  addAssignment: (assignment: Omit<Assignment, "id" | "createdAt" | "submissions">) => void;
  gradeSubmission: (submissionId: string, marks: number, feedback?: string) => void;
  markAttendance: (subjectId: string, date: string, studentAttendance: { studentId: string; present: boolean }[]) => void;
  addNotification: (notification: Omit<Notification, "id" | "createdAt">) => void;
}

// Initialize the context with default values
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

  submitAssignment: () => {},
  sendMessage: () => {},
  markMessageAsRead: () => {},

  addAssignment: () => {},
  gradeSubmission: () => {},
  markAttendance: () => {},
  addNotification: () => {},
});

// Mock data
const mockStudents: Student[] = [
  {
    id: "1",
    name: "V Dhruv",
    rollNumber: "24MAB0A41",
    email: "vd24mab0a41@student.nitw.ac.in",
    cgpa: 9.06,
    profile: {
      phoneNumber: "9876543210",
      address: "Hostel Block A, Room 123, NIT Warangal",
      dateOfBirth: "2002-05-15",
      gender: "Male",
      department: "Mathematics & Computing",
      year: 1,
      semester: 1,
      batch: "2024-2028",
    },
  },
  {
    id: "2",
    name: "Aaryaman Pratap Singh",
    rollNumber: "24MAB0A01",
    email: "aps24mab0a01@student.nitw.ac.in",
    cgpa: 9.21,
    profile: {
      phoneNumber: "9876543211",
      address: "Hostel Block B, Room 101, NIT Warangal",
      dateOfBirth: "2003-02-20",
      gender: "Male",
      department: "Mathematics & Computing",
      year: 1,
      semester: 1,
      batch: "2024-2028",
    },
  },
  {
    id: "3",
    name: "Aditya Sharma",
    rollNumber: "24MAB0A02",
    email: "as24mab0a02@student.nitw.ac.in",
    cgpa: 8.95,
    profile: {
      phoneNumber: "9876543212",
      address: "Hostel Block A, Room 105, NIT Warangal",
      dateOfBirth: "2003-04-10",
      gender: "Male",
      department: "Mathematics & Computing",
      year: 1,
      semester: 1,
      batch: "2024-2028",
    },
  },
  {
    id: "4",
    name: "Akshay Kumar",
    rollNumber: "24MAB0A03",
    email: "ak24mab0a03@student.nitw.ac.in",
    cgpa: 8.75,
    profile: {
      phoneNumber: "9876543213",
      address: "Hostel Block C, Room 210, NIT Warangal",
      dateOfBirth: "2002-11-22",
      gender: "Male",
      department: "Mathematics & Computing",
      year: 1,
      semester: 1,
      batch: "2024-2028",
    },
  },
  {
    id: "5",
    name: "Akula Tejaswini",
    rollNumber: "24MAB0A04",
    email: "at24mab0a04@student.nitw.ac.in",
    cgpa: 9.12,
    profile: {
      phoneNumber: "9876543214",
      address: "Hostel Block D, Room 115, NIT Warangal",
      dateOfBirth: "2003-08-17",
      gender: "Female",
      department: "Mathematics & Computing",
      year: 1,
      semester: 1,
      batch: "2024-2028",
    },
  },
  {
    id: "6",
    name: "Arpita Halwasia",
    rollNumber: "24MAB0A05",
    email: "ah24mab0a05@student.nitw.ac.in",
    cgpa: 8.89,
    profile: {
      phoneNumber: "9876543215",
      address: "Hostel Block D, Room 120, NIT Warangal",
      dateOfBirth: "2003-01-05",
      gender: "Female",
      department: "Mathematics & Computing",
      year: 1,
      semester: 1,
      batch: "2024-2028",
    },
  },
];

const mockSubjects: Subject[] = [
  {
    id: "1",
    code: "MA1102",
    name: "Design Thinking",
    credits: "0-1-4 3",
    description: "Introduction to design thinking process, methods, and tools."
  },
  {
    id: "2",
    code: "MA1104",
    name: "Ordinary Differential Equations",
    credits: "3-0-0 3",
    description: "Study of equations containing derivatives of one or more unknown functions with respect to a single variable."
  },
  {
    id: "3",
    code: "MA1106",
    name: "Data Structures and Algorithms",
    credits: "3-0-2 4",
    description: "Fundamental data structures and algorithms for organizing, searching, and sorting data."
  },
  {
    id: "4",
    code: "EE1162",
    name: "Basic Electrical and Electronics Engineering",
    credits: "3-0-0 3",
    description: "Introduction to electrical and electronic components, circuits, and systems."
  },
  {
    id: "5",
    code: "MA1108",
    name: "Elementary Linear Algebra",
    credits: "3-0-0 3",
    description: "Study of vectors, vector spaces, linear transformations, and systems of linear equations."
  },
  {
    id: "6",
    code: "MA1110",
    name: "Discrete Mathematical Structures",
    credits: "3-0-0 3",
    description: "Mathematical structures that are fundamentally discrete rather than continuous."
  },
  {
    id: "7",
    code: "EE1164",
    name: "Basic Electrical Engineering Lab",
    credits: "0-1-2 2",
    description: "Practical laboratory work related to basic electrical engineering concepts."
  },
  {
    id: "8",
    code: "IC1102",
    name: "EAA-II (Games & Sports / Yoga & Wellness)",
    credits: "0-0-0 0",
    description: "Extra Academic Activity focusing on physical fitness and wellness."
  },
];

const mockTeachers: Teacher[] = [
  {
    id: "1",
    name: "A Benerji Babu",
    email: "abenerji@nitw.ac.in",
    department: "Maths Dept",
    subjects: mockSubjects,
  },
  {
    id: "2",
    name: "Satyanarayana Engu",
    email: "satyanarayana@nitw.ac.in",
    department: "Maths Dept",
    subjects: [mockSubjects[1]],
  },
  {
    id: "3",
    name: "Debashis Dutta",
    email: "debashis@nitw.ac.in",
    department: "Maths Dept",
    subjects: [mockSubjects[2]],
  },
  {
    id: "4",
    name: "B. L Narasimharaju",
    email: "narasimharaju@nitw.ac.in",
    department: "Electrical Dept",
    subjects: [mockSubjects[3], mockSubjects[6]],
  },
  {
    id: "5",
    name: "Jagannath Roy",
    email: "jagannath@nitw.ac.in",
    department: "Maths Dept",
    subjects: [mockSubjects[4]],
  },
  {
    id: "6",
    name: "D. Srinivasacharya",
    email: "srinivasacharya@nitw.ac.in",
    department: "Maths Dept",
    subjects: [mockSubjects[5]],
  },
];

const mockAssignments: Assignment[] = [
  {
    id: "1",
    title: "Design Thinking Project Proposal",
    description: "Prepare a project proposal for your Design Thinking course final project. Include problem statement, user research plan, and initial sketches.",
    subjectId: "1",
    subjectName: "Design Thinking",
    dueDate: "2023-11-15",
    maxMarks: 20,
    fileUrl: "https://example.com/assignments/dt_proposal.pdf",
    createdAt: "2023-10-25",
    createdBy: "1",
    submissions: [],
  },
  {
    id: "2",
    title: "ODE Assignment 1: First Order Equations",
    description: "Solve the given set of first-order ordinary differential equations using appropriate methods.",
    subjectId: "2",
    subjectName: "Ordinary Differential Equations",
    dueDate: "2023-11-10",
    maxMarks: 15,
    fileUrl: "https://example.com/assignments/ode_assignment1.pdf",
    createdAt: "2023-10-27",
    createdBy: "2",
    submissions: [],
  },
  {
    id: "3",
    title: "DSA Lab 1: Linked Lists Implementation",
    description: "Implement singly linked list, doubly linked list, and circular linked list in C/C++/Java. Include operations: insert, delete, search, and traverse.",
    subjectId: "3",
    subjectName: "Data Structures and Algorithms",
    dueDate: "2023-11-05",
    maxMarks: 25,
    fileUrl: "https://example.com/assignments/dsa_lab1.pdf",
    createdAt: "2023-10-20",
    createdBy: "3",
    submissions: [],
  },
];

const mockSubmissions: AssignmentSubmission[] = [
  {
    id: "1",
    assignmentId: "1",
    studentId: "1",
    studentName: "V Dhruv",
    rollNumber: "24MAB0A41",
    fileUrl: "https://example.com/submissions/dt_proposal_dhruv.pdf",
    submittedAt: "2023-11-14",
    marks: 18,
    feedback: "Excellent proposal with clear problem statement. Research plan could be more detailed.",
  },
  {
    id: "2",
    assignmentId: "2",
    studentId: "1",
    studentName: "V Dhruv",
    rollNumber: "24MAB0A41",
    fileUrl: "https://example.com/submissions/ode_assignment1_dhruv.pdf",
    submittedAt: "2023-11-09",
  },
];

const mockAttendance: Attendance[] = [
  {
    id: "1",
    subjectId: "1",
    subjectName: "Design Thinking",
    date: "2023-10-27",
    students: [
      {
        studentId: "1",
        rollNumber: "24MAB0A41",
        name: "V Dhruv",
        present: true,
      },
      {
        studentId: "2",
        rollNumber: "24MAB0A01",
        name: "Aaryaman Pratap Singh",
        present: true,
      },
      {
        studentId: "3",
        rollNumber: "24MAB0A02",
        name: "Aditya Sharma",
        present: false,
      },
    ],
  },
  {
    id: "2",
    subjectId: "1",
    subjectName: "Design Thinking",
    date: "2023-11-03",
    students: [
      {
        studentId: "1",
        rollNumber: "24MAB0A41",
        name: "V Dhruv",
        present: true,
      },
      {
        studentId: "2",
        rollNumber: "24MAB0A01",
        name: "Aaryaman Pratap Singh",
        present: true,
      },
      {
        studentId: "3",
        rollNumber: "24MAB0A02",
        name: "Aditya Sharma",
        present: true,
      },
    ],
  },
  {
    id: "3",
    subjectId: "2",
    subjectName: "Ordinary Differential Equations",
    date: "2023-10-26",
    students: [
      {
        studentId: "1",
        rollNumber: "24MAB0A41",
        name: "V Dhruv",
        present: true,
      },
      {
        studentId: "2",
        rollNumber: "24MAB0A01",
        name: "Aaryaman Pratap Singh",
        present: false,
      },
      {
        studentId: "3",
        rollNumber: "24MAB0A02",
        name: "Aditya Sharma",
        present: true,
      },
    ],
  },
];

const mockAttendanceSummary: AttendanceSummary[] = [
  {
    studentId: "1",
    rollNumber: "24MAB0A41",
    subjects: [
      {
        subjectId: "1",
        subjectName: "Design Thinking",
        totalClasses: 8,
        attended: 7,
        percentage: 87.5,
      },
      {
        subjectId: "2",
        subjectName: "Ordinary Differential Equations",
        totalClasses: 10,
        attended: 9,
        percentage: 90,
      },
      {
        subjectId: "3",
        subjectName: "Data Structures and Algorithms",
        totalClasses: 12,
        attended: 10,
        percentage: 83.33,
      },
      {
        subjectId: "4",
        subjectName: "Basic Electrical and Electronics Engineering",
        totalClasses: 9,
        attended: 8,
        percentage: 88.89,
      },
      {
        subjectId: "5",
        subjectName: "Elementary Linear Algebra",
        totalClasses: 10,
        attended: 9,
        percentage: 90,
      },
      {
        subjectId: "6",
        subjectName: "Discrete Mathematical Structures",
        totalClasses: 11,
        attended: 9,
        percentage: 81.82,
      },
      {
        subjectId: "7",
        subjectName: "Basic Electrical Engineering Lab",
        totalClasses: 5,
        attended: 4,
        percentage: 80,
      },
      {
        subjectId: "8",
        subjectName: "EAA-II (Games & Sports / Yoga & Wellness)",
        totalClasses: 6,
        attended: 4,
        percentage: 66.67,
      },
    ],
    overall: {
      totalClasses: 71,
      attended: 60,
      percentage: 84.51,
    },
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "1",
    senderName: "V Dhruv",
    senderType: "student",
    receiverId: "1",
    receiverName: "A Benerji Babu",
    receiverType: "teacher",
    content: "Good afternoon Professor, I had a question regarding the upcoming Design Thinking project deadline. Would it be possible to get a one-day extension?",
    timestamp: "2023-11-05T14:30:00",
    read: false,
  },
  {
    id: "2",
    senderId: "1",
    senderName: "A Benerji Babu",
    senderType: "teacher",
    receiverId: "1",
    receiverName: "V Dhruv",
    receiverType: "student",
    content: "Hello Dhruv, I'll consider your request. Can you please explain why you need the extension?",
    timestamp: "2023-11-05T15:45:00",
    read: true,
  },
];

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Mid-Semester Examinations",
    description: "The mid-semester examinations for all subjects will commence from November 20, 2023. The detailed schedule will be shared soon.",
    type: "exam",
    date: "2023-11-20",
    createdAt: "2023-11-01",
    createdBy: "1",
  },
  {
    id: "2",
    title: "Department Technical Fest",
    description: "The Mathematics Department Technical Fest 'MathGenius 2023' will be held on December 10-11, 2023. All students are encouraged to participate.",
    type: "event",
    date: "2023-12-10",
    createdAt: "2023-11-02",
    createdBy: "1",
  },
];

const mockTimetable: TimeTable = {
  slots: [
    { day: "Monday", time: "8:00 - 8:55", subject: "DMS", location: "E104", faculty: "D. Srinivasacharya" },
    { day: "Monday", time: "9:00 - 12:00", subject: "BEE LAB", location: "Electrical Dept", faculty: "B. L Narasimharaju" },
    { day: "Monday", time: "1:00 - 1:55", subject: "DMS", location: "E104", faculty: "D. Srinivasacharya" },
    { day: "Monday", time: "2:00 - 2:55", subject: "ODE", location: "E104", faculty: "Satyanarayana Engu" },
    { day: "Monday", time: "3:05 - 4:00", subject: "ELA", location: "A315", faculty: "Jagannath Roy" },
    
    { day: "Tuesday", time: "8:00 - 8:55", subject: "DMS", location: "E104", faculty: "D. Srinivasacharya" },
    { day: "Tuesday", time: "1:00 - 1:55", subject: "BEEE", location: "E104", faculty: "B. L Narasimharaju" },
    { day: "Tuesday", time: "2:00 - 2:55", subject: "ODE", location: "E104", faculty: "Satyanarayana Engu" },
    { day: "Tuesday", time: "3:05 - 4:00", subject: "ELA", location: "A315", faculty: "Jagannath Roy" },
    
    { day: "Wednesday", time: "8:00 - 8:55", subject: "GSYW", location: "Stadium", faculty: "" },
    { day: "Wednesday", time: "9:00 - 9:55", subject: "DMS", location: "E104", faculty: "D. Srinivasacharya" },
    { day: "Wednesday", time: "10:00 - 10:55", subject: "DSA", location: "E104", faculty: "Debashis Dutta" },
    { day: "Wednesday", time: "11:05 - 12:00", subject: "BEEE", location: "E104", faculty: "B. L Narasimharaju" },
    { day: "Wednesday", time: "1:00 - 1:55", subject: "ODE", location: "E104", faculty: "Satyanarayana Engu" },
    
    { day: "Thursday", time: "8:00 - 8:55", subject: "GSYW", location: "Stadium", faculty: "" },
    { day: "Thursday", time: "9:00 - 9:55", subject: "BEEE", location: "E104", faculty: "B. L Narasimharaju" },
    { day: "Thursday", time: "10:00 - 10:55", subject: "DMS", location: "E104", faculty: "D. Srinivasacharya" },
    { day: "Thursday", time: "11:05 - 12:00", subject: "DSA", location: "E104", faculty: "Debashis Dutta" },
    { day: "Thursday", time: "12:05 - 1:00", subject: "BEEE", location: "E104", faculty: "B. L Narasimharaju" },
    
    { day: "Friday", time: "8:00 - 8:55", subject: "GSYW", location: "Stadium", faculty: "" },
    { day: "Friday", time: "9:00 - 9:55", subject: "ELA", location: "A315", faculty: "Jagannath Roy" },
    { day: "Friday", time: "10:00 - 10:55", subject: "BEEE", location: "E104", faculty: "B. L Narasimharaju" },
    { day: "Friday", time: "11:05 - 12:00", subject: "DMS", location: "E104", faculty: "D. Srinivasacharya" },
    { day: "Friday", time: "12:05 - 1:00", subject: "DSA", location: "E104", faculty: "Debashis Dutta" },
    { day: "Friday", time: "2:00 - 6:00", subject: "DT", location: "Computation Lab", faculty: "A Benerji Babu" },
  ],
};

const mockSemesterResults: SemesterResult[] = [
  {
    studentId: "1",
    studentName: "Vaghela Dhruv Sudhirbhai",
    rollNumber: "24MAB0A41",
    department: "Department of Mathematics [MATHS]",
    specialization: "Mathematics and Computing [MC2024]",
    year: 1,
    semester: 1,
    academicYear: "2024-2025",
    results: [
      {
        subjectCode: "BT1161",
        subjectName: "Biology for Engineers",
        credit: 2,
        grade: "B"
      },
      {
        subjectCode: "MA1101",
        subjectName: "Calculus",
        credit: 3,
        grade: "A"
      },
      {
        subjectCode: "PH1161",
        subjectName: "Engineering Physics",
        credit: 4,
        grade: "S"
      },
      {
        subjectCode: "HS1161",
        subjectName: "English for Technical Communication",
        credit: 3,
        grade: "B"
      },
      {
        subjectCode: "IC1101",
        subjectName: "Extra Academic Activity - I",
        credit: 0,
        grade: "P"
      },
      {
        subjectCode: "MA1103",
        subjectName: "Programming and Data Structures",
        credit: 3,
        grade: "A"
      },
      {
        subjectCode: "MA1105",
        subjectName: "Programming and Data Structures Lab",
        credit: 2,
        grade: "S"
      }
    ],
    sgpa: 9.06,
    cgpa: 9.06
  }
];

const mockMinorResults: MinorResult[] = [
  {
    subjectId: "1",
    subjectCode: "MA1102",
    subjectName: "Design Thinking",
    maxMarks: 30,
    obtainedMarks: 26,
    examDate: "2023-09-15",
    examType: "Minor1"
  },
  {
    subjectId: "2",
    subjectCode: "MA1104",
    subjectName: "Ordinary Differential Equations",
    maxMarks: 30,
    obtainedMarks: 28,
    examDate: "2023-09-16",
    examType: "Minor1"
  },
  {
    subjectId: "3",
    subjectCode: "MA1106",
    subjectName: "Data Structures and Algorithms",
    maxMarks: 30,
    obtainedMarks: 25,
    examDate: "2023-09-17",
    examType: "Minor1"
  },
  {
    subjectId: "4",
    subjectCode: "EE1162",
    subjectName: "Basic Electrical and Electronics Engineering",
    maxMarks: 30,
    obtainedMarks: 24,
    examDate: "2023-09-18",
    examType: "Minor1"
  },
  {
    subjectId: "1",
    subjectCode: "MA1102",
    subjectName: "Design Thinking",
    maxMarks: 30,
    obtainedMarks: 28,
    examDate: "2023-10-20",
    examType: "Minor2"
  },
  {
    subjectId: "2",
    subjectCode: "MA1104",
    subjectName: "Ordinary Differential Equations",
    maxMarks: 30,
    obtainedMarks: 29,
    examDate: "2023-10-21",
    examType: "Minor2"
  },
  {
    subjectId: "3",
    subjectCode: "MA1106",
    subjectName: "Data Structures and Algorithms",
    maxMarks: 30,
    obtainedMarks: 27,
    examDate: "2023-10-22",
    examType: "Minor2"
  },
  {
    subjectId: "4",
    subjectCode: "EE1162",
    subjectName: "Basic Electrical and Electronics Engineering",
    maxMarks: 30,
    obtainedMarks: 26,
    examDate: "2023-10-23",
    examType: "Minor2"
  }
];

// DataProvider component
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
  const [minorResults] = useState<MinorResult[]>(mockMinorResults);

  // Actions for students
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
    
    // Update assignment submissions
    const updatedAssignments = assignments.map((a) => {
      if (a.id === assignmentId) {
        return {
          ...a,
          submissions: [...(a.submissions || []), newSubmission],
        };
      }
      return a;
    });
    
    setAssignments(updatedAssignments);
    toast.success("Assignment submitted successfully!");
  };

  const sendMessage = (message: Omit<Message, "id" | "timestamp" | "read">) => {
    const newMessage: Message = {
      ...message,
      id: `m-${messages.length + 1}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages([...messages, newMessage]);
    toast.success("Message sent successfully!");
  };

  const markMessageAsRead = (messageId: string) => {
    setMessages(
      messages.map((msg) =>
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    );
  };

  // Actions for teachers
  const addAssignment = (assignment: Omit<Assignment, "id" | "createdAt" | "submissions">) => {
    const newAssignment: Assignment = {
      ...assignment,
      id: `a-${assignments.length + 1}`,
      createdAt: new Date().toISOString(),
      submissions: [],
    };

    setAssignments([...assignments, newAssignment]);
    toast.success("Assignment created successfully!");
  };

  const gradeSubmission = (submissionId: string, marks: number, feedback?: string) => {
    const updatedSubmissions = submissions.map((sub) =>
      sub.id === submissionId ? { ...sub, marks, feedback } : sub
    );
    setSubmissions(updatedSubmissions);

    // Also update the submissions inside the assignments
    const updatedAssignments = assignments.map((a) => {
      if (a.submissions?.some((s) => s.id === submissionId)) {
        return {
          ...a,
          submissions: a.submissions.map((s) =>
            s.id === submissionId ? { ...s, marks, feedback } : s
          ),
        };
      }
      return a;
    });

    setAssignments(updatedAssignments);
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
      if (!student) {
        return {
          studentId: record.studentId,
          rollNumber: "Unknown",
          name: "Unknown",
          present: record.present,
        };
      }
      return {
        studentId: record.studentId,
        rollNumber: student.rollNumber,
        name: student.name,
        present: record.present,
      };
    });

    const existingAttendanceIndex = attendance.findIndex(
      (a) => a.subjectId === subjectId && a.date === date
    );

    if (existingAttendanceIndex !== -1) {
      // Update existing attendance
      const updatedAttendance = [...attendance];
      updatedAttendance[existingAttendanceIndex] = {
        ...updatedAttendance[existingAttendanceIndex],
        students: attendanceRecords,
      };
      setAttendance(updatedAttendance);
    } else {
      // Add new attendance
      const newAttendance: Attendance = {
        id: `att-${attendance.length + 1}`,
        subjectId,
        subjectName: subject.name,
        date,
        students: attendanceRecords,
      };
      setAttendance([...attendance, newAttendance]);
    }

    // Update attendance summary for each student
    const updatedSummaries = [...attendanceSummary];
    studentAttendance.forEach((record) => {
      const studentSummaryIndex = updatedSummaries.findIndex(
        (s) => s.studentId === record.studentId
      );

      if (studentSummaryIndex !== -1) {
        const studentSummary = updatedSummaries[studentSummaryIndex];
        const subjectSummaryIndex = studentSummary.subjects.findIndex(
          (s) => s.subjectId === subjectId
        );

        if (subjectSummaryIndex !== -1) {
          const subjectSummary = studentSummary.subjects[subjectSummaryIndex];
          const totalClasses = subjectSummary.totalClasses + 1;
          const attended = record.present
            ? subjectSummary.attended + 1
            : subjectSummary.attended;
          const percentage = (attended / totalClasses) * 100;

          studentSummary.subjects[subjectSummaryIndex] = {
            ...subjectSummary,
            totalClasses,
            attended,
            percentage,
          };

          // Update overall attendance
          const overallTotalClasses = studentSummary.overall.totalClasses + 1;
          const overallAttended = record.present
            ? studentSummary.overall.attended + 1
            : studentSummary.overall.attended;
          const overallPercentage = (overallAttended / overallTotalClasses) * 100;

          studentSummary.overall = {
            totalClasses: overallTotalClasses,
            attended: overallAttended,
            percentage: overallPercentage,
          };
        }
      }
    });

    setAttendanceSummary(updatedSummaries);
    toast.success("Attendance marked successfully!");
  };

  const addNotification = (notification: Omit<Notification, "id" | "createdAt">) => {
    const newNotification: Notification = {
      ...notification,
      id: `n-${notifications.length + 1}`,
      createdAt: new Date().toISOString(),
    };

    setNotifications([...notifications, newNotification]);
    toast.success("Notification added successfully!");
  };

  // Sort students by roll number (for display in UI)
  useEffect(() => {
    setStudents((prev) => 
      [...prev].sort((a, b) => a.rollNumber.localeCompare(b.rollNumber))
    );
  }, []);

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

// Hook to use the data context
export const useData = () => useContext(DataContext);
