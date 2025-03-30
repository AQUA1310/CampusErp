
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  email: string;
  course: string;
  year: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  subject: string;
  attachmentUrl?: string;
  status: 'pending' | 'submitted' | 'graded';
  submissionUrl?: string;
  grade?: number;
  feedback?: string;
  teacherId: string;
  studentId?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  subject: string;
  status: 'present' | 'absent';
  studentId: string;
  teacherId: string;
}

export interface Message {
  id: string;
  sender: string;
  senderType: 'student' | 'teacher';
  recipient: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Result {
  id: string;
  studentId: string;
  subject: string;
  examType: string;
  marks: number;
  totalMarks: number;
  grade: string;
  teacherId: string;
  date: string;
}

export interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  recipients: string[];
  subject: string;
  content: string;
  timestamp: string;
  read: boolean;
  starred: boolean;
  attachments?: { name: string; url: string }[];
  folder: 'inbox' | 'sent' | 'drafts' | 'trash' | 'spam';
}

interface DataContextType {
  students: Student[];
  assignments: Assignment[];
  attendance: AttendanceRecord[];
  messages: Message[];
  results: Result[];
  emails: Email[];
  addStudent: (student: Student) => void;
  updateStudent: (studentId: string, data: Partial<Student>) => void;
  removeStudent: (studentId: string) => void;
  addAssignment: (assignment: Assignment) => void;
  updateAssignment: (assignmentId: string, data: Partial<Assignment>) => void;
  removeAssignment: (assignmentId: string) => void;
  addAttendanceRecord: (record: AttendanceRecord) => void;
  updateAttendanceRecord: (recordId: string, data: Partial<AttendanceRecord>) => void;
  removeAttendanceRecord: (recordId: string) => void;
  addAttendanceRecords: (records: AttendanceRecord[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, data: Partial<Message>) => void;
  removeMessage: (messageId: string) => void;
  addResult: (result: Result) => void;
  updateResult: (resultId: string, data: Partial<Result>) => void;
  removeResult: (resultId: string) => void;
  addEmail: (email: Email) => void;
  updateEmail: (emailId: string, data: Partial<Email>) => void;
  removeEmail: (emailId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Complete list of students
const initialStudents: Student[] = [
  { id: "1", rollNumber: "24MAB0A01", name: "Aaryaman Pratap Singh", email: "aaryaman@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "2", rollNumber: "24MAB0A02", name: "Aditya Sharma", email: "aditya@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "3", rollNumber: "24MAB0A03", name: "Akshay Kumar", email: "akshay@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "4", rollNumber: "24MAB0A04", name: "Akula Tejaswini", email: "akula@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "5", rollNumber: "24MAB0A05", name: "Arpita Halwasia", email: "arpita@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "6", rollNumber: "24MAB0A06", name: "Bhingradiya Daksh", email: "bhingradiya@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "7", rollNumber: "24MAB0A07", name: "Boddupalli Jahnavi", email: "boddupalli@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "8", rollNumber: "24MAB0A08", name: "Erupula Pragnesh", email: "erupula@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "9", rollNumber: "24MAB0A09", name: "Ganji Satwika", email: "ganji@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "10", rollNumber: "24MAB0A10", name: "H Sahas", email: "hsahas@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "11", rollNumber: "24MAB0A11", name: "Hariom Shilpkar", email: "hariom@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "12", rollNumber: "24MAB0A12", name: "Hasini Sai D", email: "hasini@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "13", rollNumber: "24MAB0A13", name: "Johann S Martin", email: "johann@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "14", rollNumber: "24MAB0A14", name: "KGG Naik", email: "kgg@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "15", rollNumber: "24MAB0A15", name: "Limbani Jeel", email: "limbani@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "16", rollNumber: "24MAB0A16", name: "-", email: "-", course: "Mathematics", year: 1 },
  { id: "17", rollNumber: "24MAB0A17", name: "M SaiKiran", email: "msaikiran@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "18", rollNumber: "24MAB0A18", name: "Mitrajit Ghorui", email: "mitrajit@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "19", rollNumber: "24MAB0A19", name: "Mohammad Saad Ansari", email: "mohammad@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "20", rollNumber: "24MAB0A20", name: "Ishan Nepal", email: "ishan@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "21", rollNumber: "24MAB0A21", name: "Pansuriya Zeel", email: "pansuriya@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "22", rollNumber: "24MAB0A22", name: "P Kshetragna Sharma", email: "pkshetragna@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "23", rollNumber: "24MAB0A23", name: "Putnala Prabhav", email: "putnala@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "24", rollNumber: "24MAB0A24", name: "Raghu Shaarav", email: "raghu@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "25", rollNumber: "24MAB0A25", name: "Ragula Thirumal", email: "ragula@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "26", rollNumber: "24MAB0A26", name: "Rasesh Kumar Sahu", email: "rasesh@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "27", rollNumber: "24MAB0A27", name: "Rohan Chinta", email: "rohan@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "28", rollNumber: "24MAB0A28", name: "Rohit Manoj Nair", email: "rohit@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "29", rollNumber: "24MAB0A29", name: "Roy Harwani", email: "roy@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "30", rollNumber: "24MAB0A30", name: "S Vageesh", email: "svageesh@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "31", rollNumber: "24MAB0A31", name: "Saisrihan Yadalla", email: "saisrihan@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "32", rollNumber: "24MAB0A32", name: "S Mohan Reddy", email: "smohan@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "33", rollNumber: "24MAB0A33", name: "Shaik Abdul", email: "shaik@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "34", rollNumber: "24MAB0A34", name: "Shaif Arif", email: "shaif@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "35", rollNumber: "24MAB0A35", name: "Shambhavi Dhange", email: "shambhavi@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "36", rollNumber: "24MAB0A36", name: "Srirangam Sri Sahaj", email: "srirangam@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "37", rollNumber: "24MAB0A37", name: "Yashaswini Sudharshan", email: "yashaswini@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "38", rollNumber: "24MAB0A38", name: "Sumedha K", email: "sumedha@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "39", rollNumber: "24MAB0A39", name: "Thaduru Sreshta", email: "thaduru@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "40", rollNumber: "24MAB0A40", name: "Trupti Aggarwal", email: "trupti@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "41", rollNumber: "24MAB0A41", name: "V Dhruv", email: "vd24mab0a41@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "42", rollNumber: "24MAB0A42", name: "V Vamshi", email: "vvamshi@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "43", rollNumber: "24MAB0A43", name: "V Prashanth", email: "vprashanth@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "44", rollNumber: "24MAB0A44", name: "V Neha", email: "vneha@student.nitw.ac.in", course: "Mathematics", year: 1 },
  { id: "45", rollNumber: "24MAB0A45", name: "W Aryan", email: "waryan@student.nitw.ac.in", course: "Mathematics", year: 1 },
];

// Sample assignments
const initialAssignments: Assignment[] = [
  {
    id: "1",
    title: "Differential Equations Problem Set",
    description: "Complete problems 1-10 from Chapter 3 of the textbook.",
    dueDate: "2023-10-15",
    subject: "Differential Equations",
    status: "pending",
    teacherId: "tchr-1"
  },
  {
    id: "2",
    title: "Linear Algebra Project",
    description: "Research paper on applications of linear algebra in computer graphics.",
    dueDate: "2023-10-20",
    subject: "Linear Algebra",
    status: "pending",
    teacherId: "tchr-1"
  },
  {
    id: "3",
    title: "Calculus Quiz Preparation",
    description: "Review limits, derivatives, and integrals for upcoming quiz.",
    dueDate: "2023-10-10",
    subject: "Calculus",
    status: "pending",
    teacherId: "tchr-1"
  }
];

// Sample attendance records
const generateAttendanceRecords = () => {
  const records: AttendanceRecord[] = [];
  const subjects = ["Calculus", "Linear Algebra", "Differential Equations", "Statistics"];
  const startDate = new Date(2023, 8, 1); // September 1, 2023
  const endDate = new Date(2023, 9, 20); // October 20, 2023
  
  // Generate mock attendance records for V Dhruv
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    if (date.getDay() !== 0 && date.getDay() !== 6) { // Skip weekends
      subjects.forEach(subject => {
        // Random attendance (80% chance of being present)
        const status = Math.random() > 0.2 ? 'present' : 'absent';
        records.push({
          id: `att-${date.toISOString()}-${subject}-41`,
          date: date.toISOString().split('T')[0],
          subject,
          status,
          studentId: "41",
          teacherId: "tchr-1"
        });
      });
    }
  }
  
  return records;
};

// Sample messages
const initialMessages: Message[] = [
  {
    id: "msg1",
    sender: "tchr-1",
    senderType: "teacher",
    recipient: "41",
    content: "Please submit your Calculus assignment by tomorrow.",
    timestamp: new Date(2023, 9, 10, 14, 30).toISOString(),
    read: true
  },
  {
    id: "msg2",
    sender: "41",
    senderType: "student",
    recipient: "tchr-1",
    content: "I have completed the assignment and will submit it today.",
    timestamp: new Date(2023, 9, 10, 15, 45).toISOString(),
    read: false
  },
  {
    id: "msg3",
    sender: "tchr-1",
    senderType: "teacher",
    recipient: "41",
    content: "Great! Looking forward to reviewing it.",
    timestamp: new Date(2023, 9, 10, 16, 20).toISOString(),
    read: false
  }
];

// Sample results
const initialResults: Result[] = [
  {
    id: "res1",
    studentId: "41",
    subject: "Calculus",
    examType: "Mid-term",
    marks: 85,
    totalMarks: 100,
    grade: "A",
    teacherId: "tchr-1",
    date: "2023-09-15"
  },
  {
    id: "res2",
    studentId: "41",
    subject: "Linear Algebra",
    examType: "Quiz",
    marks: 18,
    totalMarks: 20,
    grade: "A+",
    teacherId: "tchr-1",
    date: "2023-09-20"
  },
  {
    id: "res3",
    studentId: "41",
    subject: "Differential Equations",
    examType: "Assignment",
    marks: 28,
    totalMarks: 30,
    grade: "A",
    teacherId: "tchr-1",
    date: "2023-09-25"
  }
];

// Sample emails
const initialEmails: Email[] = [
  {
    id: "email1",
    sender: "Mathematics Department",
    senderEmail: "math-dept@nitw.ac.in",
    recipients: ["vd24mab0a41@student.nitw.ac.in"],
    subject: "Welcome to the Mathematics Department",
    content: "Dear V Dhruv,\n\nWelcome to the Mathematics Department at NIT Warangal. We are excited to have you join us for the new academic year.\n\nRegards,\nMathematics Department",
    timestamp: new Date(2023, 8, 1, 9, 0).toISOString(),
    read: true,
    starred: false,
    folder: "inbox"
  },
  {
    id: "email2",
    sender: "V Dhruv",
    senderEmail: "vd24mab0a41@student.nitw.ac.in",
    recipients: ["abenerji@nitw.ac.in"],
    subject: "Request for appointment",
    content: "Dear Professor Benerji,\n\nI would like to schedule an appointment to discuss my research interests in mathematics. Would you be available this week?\n\nBest regards,\nV Dhruv",
    timestamp: new Date(2023, 9, 5, 14, 30).toISOString(),
    read: true,
    starred: true,
    folder: "sent"
  },
  {
    id: "email3",
    sender: "A Benerji",
    senderEmail: "abenerji@nitw.ac.in",
    recipients: ["vd24mab0a41@student.nitw.ac.in"],
    subject: "Re: Request for appointment",
    content: "Dear Dhruv,\n\nI would be available on Thursday at 2 PM. Please come to my office.\n\nRegards,\nProf. A Benerji",
    timestamp: new Date(2023, 9, 6, 10, 15).toISOString(),
    read: false,
    starred: false,
    folder: "inbox"
  },
  {
    id: "email4",
    sender: "Library",
    senderEmail: "library@nitw.ac.in",
    recipients: ["vd24mab0a41@student.nitw.ac.in"],
    subject: "Library Book Due",
    content: "Dear Student,\n\nThis is a reminder that you have a library book due tomorrow. Please return it on time to avoid fines.\n\nRegards,\nLibrary Department",
    timestamp: new Date(2023, 9, 8, 11, 45).toISOString(),
    read: false,
    starred: false,
    folder: "inbox"
  },
  // Teacher emails
  {
    id: "email5",
    sender: "Academic Affairs",
    senderEmail: "academics@nitw.ac.in",
    recipients: ["abenerji@nitw.ac.in"],
    subject: "Faculty Meeting Agenda",
    content: "Dear Faculty Members,\n\nPlease find attached the agenda for our upcoming faculty meeting on Friday.\n\nRegards,\nDean of Academic Affairs",
    timestamp: new Date(2023, 9, 7, 16, 30).toISOString(),
    read: true,
    starred: false,
    folder: "inbox",
    attachments: [{ name: "agenda.pdf", url: "#" }]
  },
  {
    id: "email6",
    sender: "A Benerji",
    senderEmail: "abenerji@nitw.ac.in",
    recipients: ["hod-math@nitw.ac.in"],
    subject: "Research Paper Submission",
    content: "Dear HOD,\n\nI'm pleased to inform you that our research paper on advanced calculus methods has been accepted for publication.\n\nBest regards,\nA Benerji",
    timestamp: new Date(2023, 9, 3, 13, 20).toISOString(),
    read: true,
    starred: true,
    folder: "sent"
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(generateAttendanceRecords());
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [results, setResults] = useState<Result[]>(initialResults);
  const [emails, setEmails] = useState<Email[]>(initialEmails);

  // Load data from localStorage on initial render if available
  useEffect(() => {
    try {
      const storedStudents = localStorage.getItem('students');
      const storedAssignments = localStorage.getItem('assignments');
      const storedAttendance = localStorage.getItem('attendance');
      const storedMessages = localStorage.getItem('messages');
      const storedResults = localStorage.getItem('results');
      const storedEmails = localStorage.getItem('emails');

      if (storedStudents) setStudents(JSON.parse(storedStudents));
      if (storedAssignments) setAssignments(JSON.parse(storedAssignments));
      if (storedAttendance) setAttendance(JSON.parse(storedAttendance));
      if (storedMessages) setMessages(JSON.parse(storedMessages));
      if (storedResults) setResults(JSON.parse(storedResults));
      if (storedEmails) setEmails(JSON.parse(storedEmails));
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('students', JSON.stringify(students));
      localStorage.setItem('assignments', JSON.stringify(assignments));
      localStorage.setItem('attendance', JSON.stringify(attendance));
      localStorage.setItem('messages', JSON.stringify(messages));
      localStorage.setItem('results', JSON.stringify(results));
      localStorage.setItem('emails', JSON.stringify(emails));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [students, assignments, attendance, messages, results, emails]);

  // Student operations
  const addStudent = (student: Student) => {
    setStudents(prev => [...prev, student]);
  };

  const updateStudent = (studentId: string, data: Partial<Student>) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId ? { ...student, ...data } : student
    ));
  };

  const removeStudent = (studentId: string) => {
    setStudents(prev => prev.filter(student => student.id !== studentId));
  };

  // Assignment operations
  const addAssignment = (assignment: Assignment) => {
    setAssignments(prev => [...prev, assignment]);
  };

  const updateAssignment = (assignmentId: string, data: Partial<Assignment>) => {
    setAssignments(prev => prev.map(assignment => 
      assignment.id === assignmentId ? { ...assignment, ...data } : assignment
    ));
  };

  const removeAssignment = (assignmentId: string) => {
    setAssignments(prev => prev.filter(assignment => assignment.id !== assignmentId));
  };

  // Attendance operations
  const addAttendanceRecord = (record: AttendanceRecord) => {
    setAttendance(prev => [...prev, record]);
  };

  const addAttendanceRecords = (records: AttendanceRecord[]) => {
    setAttendance(prev => [...prev, ...records]);
  };

  const updateAttendanceRecord = (recordId: string, data: Partial<AttendanceRecord>) => {
    setAttendance(prev => prev.map(record => 
      record.id === recordId ? { ...record, ...data } : record
    ));
  };

  const removeAttendanceRecord = (recordId: string) => {
    setAttendance(prev => prev.filter(record => record.id !== recordId));
  };

  // Message operations
  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const updateMessage = (messageId: string, data: Partial<Message>) => {
    setMessages(prev => prev.map(message => 
      message.id === messageId ? { ...message, ...data } : message
    ));
  };

  const removeMessage = (messageId: string) => {
    setMessages(prev => prev.filter(message => message.id !== messageId));
  };

  // Result operations
  const addResult = (result: Result) => {
    setResults(prev => [...prev, result]);
  };

  const updateResult = (resultId: string, data: Partial<Result>) => {
    setResults(prev => prev.map(result => 
      result.id === resultId ? { ...result, ...data } : result
    ));
  };

  const removeResult = (resultId: string) => {
    setResults(prev => prev.filter(result => result.id !== resultId));
  };

  // Email operations
  const addEmail = (email: Email) => {
    setEmails(prev => [...prev, email]);
  };

  const updateEmail = (emailId: string, data: Partial<Email>) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { ...email, ...data } : email
    ));
  };

  const removeEmail = (emailId: string) => {
    setEmails(prev => prev.filter(email => email.id !== emailId));
  };

  return (
    <DataContext.Provider value={{
      students,
      assignments,
      attendance,
      messages,
      results,
      emails,
      addStudent,
      updateStudent,
      removeStudent,
      addAssignment,
      updateAssignment,
      removeAssignment,
      addAttendanceRecord,
      updateAttendanceRecord,
      removeAttendanceRecord,
      addAttendanceRecords,
      addMessage,
      updateMessage,
      removeMessage,
      addResult,
      updateResult,
      removeResult,
      addEmail,
      updateEmail,
      removeEmail
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
