import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Student type
export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  email: string;
  course: string;
  year: number;
  cgpa?: number;
  profile?: {
    address?: string;
    phone?: string;
    phoneNumber?: string;
    parentName?: string;
    parentPhone?: string;
    bloodGroup?: string;
    dateOfBirth?: string;
    department?: string;
    year?: number;
    semester?: number;
    batch?: string;
  };
}

// Assignment type
export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  subject: string;
  subjectId?: string;
  subjectName?: string;
  maxMarks?: number;
  teacherId: string;
  studentId?: string;
  attachmentUrl?: string;
  fileUrl?: string;
  status: 'pending' | 'submitted' | 'graded';
  submissionUrl?: string;
  submissions?: AssignmentSubmission[];
  grade?: number;
  feedback?: string;
  createdBy?: string;
}

// Assignment Submission type
export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  submittedAt: string;
  fileUrl: string;
  marks?: number;
  feedback?: string;
  status: 'submitted' | 'graded';
}

// Attendance Record type
export interface AttendanceRecord {
  id: string;
  date: string;
  subject: string;
  subjectId?: string;
  subjectName?: string;
  status: 'present' | 'absent';
  studentId: string;
  studentIds?: string[];
  students?: {
    studentId: string;
    present: boolean;
  }[];
  teacherId: string;
}

// Message type
export interface Message {
  id: string;
  sender: string;
  senderId?: string;
  senderType: 'student' | 'teacher';
  senderName?: string;
  recipient: string;
  receiverId?: string;
  receiverType?: 'student' | 'teacher';
  receiverName?: string;
  content: string;
  timestamp: string;
  read: boolean;
}

// Result type
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

// Email type
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

// Subject type
export interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
  teacher: string;
  teacherId: string;
  semester: number;
}

// Semester Result type
export interface SemesterResult {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  semester: number;
  year: number;
  sgpa: number;
  cgpa: number;
  results: ExamResult[];
  department?: string;
  specialization?: string;
  academicYear?: string;
}

// Exam Result type
export interface ExamResult {
  subjectCode: string;
  subjectName: string;
  credit: number;
  grade: string;
}

// Minor Result type
export interface MinorResult {
  id: string;
  studentId: string;
  rollNumber: string;
  studentName: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  maxMarks: number;
  obtainedMarks: number;
  marks: number;
  examDate: string;
  examType: 'Minor1' | 'Minor2';
}

// Timetable type
export interface TimetableEntry {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  subjectCode: string;
  teacher: string;
  room: string;
  type: 'lecture' | 'lab' | 'tutorial';
}

// With slots property for compatibility
export const timetableWithSlots = {
  slots: [] as TimetableEntry[],
};

// Notification type
export interface Notification {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'assignment' | 'attendance' | 'result' | 'announcement' | 'other' | 'exam' | 'event';
  link?: string;
  date?: string;
  description?: string;
}

// Teacher type
export interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
  profile?: {
    designation: string;
    qualification: string;
    specialization: string;
    experience: number;
    phone?: string;
    officeHours?: string;
  };
}

// Attendance Summary type
export interface AttendanceSummary {
  studentId: string;
  rollNumber: string;
  studentName: string;
  subjectId: string;
  subjectName: string;
  totalClasses: number;
  present: number;
  absent: number;
  percentage: number;
  lastUpdated: string;
  subjects?: {
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

interface DataContextType {
  students: Student[];
  assignments: Assignment[];
  attendance: AttendanceRecord[];
  messages: Message[];
  results: Result[];
  emails: Email[];
  subjects: Subject[];
  finalResults: SemesterResult[];
  minorResults: MinorResult[];
  timetable: TimetableEntry[];
  notifications: Notification[];
  attendanceSummary: AttendanceSummary[];
  teachers: Teacher[];
  submissions: AssignmentSubmission[];

  // Functions for students
  addStudent: (student: Student) => void;
  updateStudent: (studentId: string, data: Partial<Student>) => void;
  removeStudent: (studentId: string) => void;
  
  // Functions for assignments
  addAssignment: (assignment: Assignment) => void;
  updateAssignment: (assignmentId: string, data: Partial<Assignment>) => void;
  removeAssignment: (assignmentId: string) => void;
  submitAssignment: (submission: Omit<AssignmentSubmission, 'id'>) => void;
  gradeSubmission: (submissionId: string, marks: number, feedback: string) => void;
  
  // Functions for attendance
  addAttendanceRecord: (record: AttendanceRecord) => void;
  updateAttendanceRecord: (recordId: string, data: Partial<AttendanceRecord>) => void;
  removeAttendanceRecord: (recordId: string) => void;
  addAttendanceRecords: (records: AttendanceRecord[]) => void;
  markAttendance: (subjectId: string, date: string, students: { studentId: string; present: boolean }[]) => void;
  exportAttendance: (subjectId: string) => void;
  
  // Functions for messages
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, data: Partial<Message>) => void;
  removeMessage: (messageId: string) => void;
  sendMessage: (message: Omit<Message, 'id' | 'read' | 'timestamp'>) => void;
  markMessageAsRead: (messageId: string) => void;
  
  // Functions for results
  addResult: (result: Result) => void;
  updateResult: (resultId: string, data: Partial<Result>) => void;
  removeResult: (resultId: string) => void;
  submitGrades: (studentId: string, semester: number, results: ExamResult[]) => void;
  submitMinorMarks: (result: Omit<MinorResult, 'id'>) => void;
  downloadResult: (studentId: string, semester: number) => void;
  
  // Functions for emails
  addEmail: (email: Email) => void;
  updateEmail: (emailId: string, data: Partial<Email>) => void;
  removeEmail: (emailId: string) => void;
  
  // Functions for notifications
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
  updateNotification: (notificationId: string, data: Partial<Notification>) => void;
  removeNotification: (notificationId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Complete list of students
const initialStudents: Student[] = [
  { id: "1", rollNumber: "24MAB0A01", name: "Aaryaman Pratap Singh", email: "aaryaman@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 8.5 },
  { id: "2", rollNumber: "24MAB0A02", name: "Aditya Sharma", email: "aditya@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 8.2 },
  { id: "3", rollNumber: "24MAB0A03", name: "Akshay Kumar", email: "akshay@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 7.9 },
  { id: "4", rollNumber: "24MAB0A04", name: "Akula Tejaswini", email: "akula@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 8.7 },
  { id: "5", rollNumber: "24MAB0A05", name: "Arpita Halwasia", email: "arpita@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 9.1 },
  { id: "6", rollNumber: "24MAB0A06", name: "Bhingradiya Daksh", email: "bhingradiya@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 8.4 },
  { id: "7", rollNumber: "24MAB0A07", name: "Boddupalli Jahnavi", email: "boddupalli@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 8.0 },
  { id: "8", rollNumber: "24MAB0A08", name: "Erupula Pragnesh", email: "erupula@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 7.8 },
  { id: "9", rollNumber: "24MAB0A09", name: "Ganji Satwika", email: "ganji@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 8.6 },
  { id: "10", rollNumber: "24MAB0A10", name: "H Sahas", email: "hsahas@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 7.7 },
  { id: "11", rollNumber: "24MAB0A11", name: "Hariom Shilpkar", email: "hariom@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 8.3 },
  { id: "12", rollNumber: "24MAB0A12", name: "Hasini Sai D", email: "hasini@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 9.0 },
  { id: "13", rollNumber: "24MAB0A13", name: "Johann S Martin", email: "johann@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 8.8 },
  { id: "14", rollNumber: "24MAB0A14", name: "KGG Naik", email: "kgg@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 7.5 },
  { id: "15", rollNumber: "24MAB0A15", name: "Limbani Jeel", email: "limbani@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 8.1 },
  { id: "16", rollNumber: "24MAB0A16", name: "-", email: "-", course: "Mathematics", year: 1, cgpa: 0.0 },
  { id: "17", rollNumber: "24MAB0A17", name: "M SaiKiran", email: "msaikiran@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 7.9 },
  { id: "18", rollNumber: "24MAB0A18", name: "Mitrajit Ghorui", email: "mitrajit@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 8.4 },
  { id: "19", rollNumber: "24MAB0A19", name: "Mohammad Saad Ansari", email: "mohammad@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 8.2 },
  { id: "20", rollNumber: "24MAB0A20", name: "Ishan Nepal", email: "ishan@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 8.6 },
  { id: "21", rollNumber: "24MAB0A21", name: "Pansuriya Zeel", email: "pansuriya@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 7.8 },
  { id: "22", rollNumber: "24MAB0A22", name: "P Kshetragna Sharma", email: "pkshetragna@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 8.3 },
  { id: "23", rollNumber: "24MAB0A23", name: "Putnala Prabhav", email: "putnala@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 8.7 },
  { id: "24", rollNumber: "24MAB0A24", name: "Raghu Shaarav", email: "raghu@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 9.2 },
  { id: "25", rollNumber: "24MAB0A25", name: "Ragula Thirumal", email: "ragula@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 8.0 },
  { id: "26", rollNumber: "24MAB0A26", name: "Rasesh Kumar Sahu", email: "rasesh@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 7.9 },
  { id: "27", rollNumber: "24MAB0A27", name: "Rohan Chinta", email: "rohan@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 8.6 },
  { id: "28", rollNumber: "24MAB0A28", name: "Rohit Manoj Nair", email: "rohit@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 8.1 },
  { id: "29", rollNumber: "24MAB0A29", name: "Roy Harwani", email: "roy@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 8.3 },
  { id: "30", rollNumber: "24MAB0A30", name: "S Vageesh", email: "svageesh@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 8.9 },
  { id: "31", rollNumber: "24MAB0A31", name: "Saisrihan Yadalla", email: "saisrihan@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 7.7 },
  { id: "32", rollNumber: "24MAB0A32", name: "S Mohan Reddy", email: "smohan@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 8.5 },
  { id: "33", rollNumber: "24MAB0A33", name: "Shaik Abdul", email: "shaik@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 7.6 },
  { id: "34", rollNumber: "24MAB0A34", name: "Shaif Arif", email: "shaif@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 8.4 },
  { id: "35", rollNumber: "24MAB0A35", name: "Shambhavi Dhange", email: "shambhavi@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 9.3 },
  { id: "36", rollNumber: "24MAB0A36", name: "Srirangam Sri Sahaj", email: "srirangam@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 8.2 },
  { id: "37", rollNumber: "24MAB0A37", name: "Yashaswini Sudharshan", email: "yashaswini@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 8.8 },
  { id: "38", rollNumber: "24MAB0A38", name: "Sumedha K", email: "sumedha@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 9.1 },
  { id: "39", rollNumber: "24MAB0A39", name: "Thaduru Sreshta", email: "thaduru@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 8.3 },
  { id: "40", rollNumber: "24MAB0A40", name: "Trupti Aggarwal", email: "trupti@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 8.9 },
  { id: "41", rollNumber: "24MAB0A41", name: "V Dhruv", email: "vd24mab0a41@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 9.5, profile: { dateOfBirth: "2004-02-15", bloodGroup: "O+", phone: "9876543210" } },
  { id: "42", rollNumber: "24MAB0A42", name: "V Vamshi", email: "vvamshi@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 8.7 },
  { id: "43", rollNumber: "24MAB0A43", name: "V Prashanth", email: "vprashanth@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 8.4 },
  { id: "44", rollNumber: "24MAB0A44", name: "V Neha", email: "vneha@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 9.0 },
  { id: "45", rollNumber: "24MAB0A45", name: "W Aryan", email: "waryan@student.nitw.ac.in", course: "Mathematics", year: 1, cgpa: 8.2 },
];

// Sample teachers
const initialTeachers: Teacher[] = [
  {
    id: "tchr-1",
    name: "A Benerji",
    email: "abenerji@nitw.ac.in",
    department: "Mathematics",
    profile: {
      designation: "Associate Professor",
      qualification: "Ph.D.",
      specialization: "Linear Algebra and Differential Equations",
      experience: 12,
      officeHours: "Mon, Wed 2-4 PM"
    }
  },
  {
    id: "tchr-2",
    name: "Ramesh Kumar",
    email: "rameshk@nitw.ac.in",
    department: "Mathematics",
    profile: {
      designation: "Professor",
      qualification: "Ph.D.",
      specialization: "Numerical Methods",
      experience: 18,
      officeHours: "Tue, Thu 10-12 AM"
    }
  },
  {
    id: "tchr-3",
    name: "Priya Sharma",
    email: "priyas@nitw.ac.in",
    department: "Mathematics",
    profile: {
      designation: "Assistant Professor",
      qualification: "Ph.D.",
      specialization: "Statistics and Probability",
      experience: 5,
      officeHours: "Fri 1-3 PM"
    }
  }
];

// Sample subjects
const initialSubjects: Subject[] = [
  {
    id: "sub-1",
    code: "MATH101",
    name: "Calculus",
    credits: 4,
    teacher: "A Benerji",
    teacherId: "tchr-1",
    semester: 1
  },
  {
    id: "sub-2",
    code: "MATH102",
    name: "Linear Algebra",
    credits: 4,
    teacher: "Ramesh Kumar",
    teacherId: "tchr-2",
    semester: 1
  },
  {
    id: "sub-3",
    code: "MATH103",
    name: "Differential Equations",
    credits: 3,
    teacher: "A Benerji",
    teacherId: "tchr-1",
    semester: 1
  },
  {
    id: "sub-4",
    code: "MATH104",
    name: "Statistics",
    credits: 3,
    teacher: "Priya Sharma",
    teacherId: "tchr-3",
    semester: 1
  }
];

// Sample assignments
const initialAssignments: Assignment[] = [
  {
    id: "1",
    title: "Differential Equations Problem Set",
    description: "Complete problems 1-10 from Chapter 3 of the textbook.",
    dueDate: "2023-10-15",
    subject: "Differential Equations",
    subjectId: "sub-3",
    subjectName: "Differential Equations",
    status: "pending",
    teacherId: "tchr-1",
    maxMarks: 20,
    fileUrl: "/path/to/assignment1.pdf"
  },
  {
    id: "2",
    title: "Linear Algebra Project",
    description: "Research paper on applications of linear algebra in computer graphics.",
    dueDate: "2023-10-20",
    subject: "Linear Algebra",
    subjectId: "sub-2",
    subjectName: "Linear Algebra",
    status: "pending",
    teacherId: "tchr-2",
    maxMarks: 30,
    fileUrl: "/path/to/assignment2.pdf"
  },
  {
    id: "3",
    title: "Calculus Quiz Preparation",
    description: "Review limits, derivatives, and integrals for upcoming quiz.",
    dueDate: "2023-10-10",
    subject: "Calculus",
    subjectId: "sub-1",
    subjectName: "Calculus",
    status: "pending",
    teacherId: "tchr-1",
    maxMarks: 15,
    fileUrl: "/path/to/assignment3.pdf"
  }
];

// Sample submissions
const initialSubmissions: AssignmentSubmission[] = [
  {
    id: "sub-1",
    assignmentId: "1",
    studentId: "41",
    studentName: "V Dhruv",
    rollNumber: "24MAB0A41",
    submittedAt: "2023-10-14T15:30:00Z",
    fileUrl: "/path/to/submission1.pdf",
    status: "submitted"
  },
  {
    id: "sub-2",
    assignmentId: "2",
    studentId: "41",
    studentName: "V Dhruv",
    rollNumber: "24MAB0A41",
    submittedAt: "2023-10-18T10:45:00Z",
    fileUrl: "/path/to/submission2.pdf",
    status: "submitted"
  }
];

// Sample attendance records
const generateAttendanceRecords = () => {
  const records: AttendanceRecord[] = [];
  const subjects = initialSubjects;
  const startDate = new Date(2023, 8, 1); // September 1, 2023
  const endDate = new Date(2023, 9, 20); // October 20, 2023
  
  // Generate mock attendance records for V Dhruv
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    if (date.getDay() !== 0 && date.getDay() !== 6) { // Skip weekends
      subjects.forEach(subject => {
        // Random attendance (80% chance of being present)
        const status = Math.random() > 0.2 ? 'present' : 'absent';
        records.push({
          id: `att-${date.toISOString()}-${subject.id}-41`,
          date: date.toISOString().split('T')[0],
          subject: subject.name,
          subjectId: subject.id,
          subjectName: subject.name,
          status,
          studentId: "41",
          teacherId: subject.teacherId
        });
      });
    }
  }
  
  return records;
};

// Sample timetable
const initialTimetable: TimetableEntry[] = [
  {
    id: "tt-1",
    day: "Monday",
    startTime: "09:00",
    endTime: "10:00",
    subject: "Calculus",
    subjectCode: "MATH101",
    teacher: "A Benerji",
    room: "LH-1",
    type: "lecture"
  },
  {
    id: "tt-2",
    day: "Monday",
    startTime: "10:00",
    endTime: "11:00",
    subject: "Linear Algebra",
    subjectCode: "MATH102",
    teacher: "Ramesh Kumar",
    room: "LH-2",
    type: "lecture"
  },
  {
    id: "tt-3",
    day: "Monday",
    startTime: "11:15",
    endTime: "12:15",
    subject: "Differential Equations",
    subjectCode: "MATH103",
    teacher: "A Benerji",
    room: "LH-3",
    type: "lecture"
  },
  {
    id: "tt-4",
    day: "Monday",
    startTime: "14:00",
    endTime: "16:00",
    subject: "Linear Algebra",
    subjectCode: "MATH102",
    teacher: "Ramesh Kumar",
    room: "Lab-1",
    type: "lab"
  },
  {
    id: "tt-5",
    day: "Tuesday",
    startTime: "09:00",
    endTime: "10:00",
    subject: "Statistics",
    subjectCode: "MATH104",
    teacher: "Priya Sharma",
    room: "LH-1",
    type: "lecture"
  },
  {
    id: "tt-6",
    day: "Tuesday",
    startTime: "10:00",
    endTime: "11:00",
    subject: "Calculus",
    subjectCode: "MATH101",
    teacher: "A Benerji",
    room: "LH-2",
    type: "lecture"
  },
  {
    id: "tt-7",
    day: "Tuesday",
    startTime: "11:15",
    endTime: "12:15",
    subject: "Linear Algebra",
    subjectCode: "MATH102",
    teacher: "Ramesh Kumar",
    room: "LH-3",
    type: "lecture"
  },
  {
    id: "tt-8",
    day: "Tuesday",
    startTime: "14:00",
    endTime: "16:00",
    subject: "Calculus",
    subjectCode: "MATH101",
    teacher: "A Benerji",
    room: "Lab-2",
    type: "lab"
  },
  {
    id: "tt-9",
    day: "Wednesday",
    startTime: "09:00",
    endTime: "10:00",
    subject: "Differential Equations",
    subjectCode: "MATH103",
    teacher: "A Benerji",
    room: "LH-1",
    type: "lecture"
  },
  {
    id: "tt-10",
    day: "Wednesday",
    startTime: "10:00",
    endTime: "11:00",
    subject: "Statistics",
    subjectCode: "MATH104",
    teacher: "Priya Sharma",
    room: "LH-2",
    type: "lecture"
  },
  {
    id: "tt-11",
    day: "Wednesday",
    startTime: "11:15",
    endTime: "12:15",
    subject: "Calculus",
    subjectCode: "MATH101",
    teacher: "A Benerji",
    room: "LH-3",
    type: "lecture"
  },
  {
    id: "tt-12",
    day: "Wednesday",
    startTime: "14:00",
    endTime: "16:00",
    subject: "Statistics",
    subjectCode: "MATH104",
    teacher: "Priya Sharma",
    room: "Lab-3",
    type: "lab"
  },
  {
    id: "tt-13",
    day: "Thursday",
    startTime: "09:00",
    endTime: "10:00",
    subject: "Linear Algebra",
    subjectCode: "MATH102",
    teacher: "Ramesh Kumar",
    room: "LH-1",
    type: "lecture"
  },
  {
    id: "tt-14",
    day: "Thursday",
    startTime: "10:00",
    endTime: "11:00",
    subject: "Differential Equations",
    subjectCode: "MATH103",
    teacher: "A Benerji",
    room: "LH-2",
    type: "lecture"
  },
  {
    id: "tt-15",
    day: "Thursday",
    startTime: "11:15",
    endTime: "12:15",
    subject: "Statistics",
    subjectCode: "MATH104",
    teacher: "Priya Sharma",
    room: "LH-3",
    type: "lecture"
  },
  {
    id: "tt-16",
    day: "Thursday",
    startTime: "14:00",
    endTime: "16:00",
    subject: "Differential Equations",
    subjectCode: "MATH103",
    teacher: "A Benerji",
    room: "Lab-1",
    type: "lab"
  },
  {
    id: "tt-17",
    day: "Friday",
    startTime: "09:00",
    endTime: "10:00",
    subject: "Calculus",
    subjectCode: "MATH101",
    teacher: "A Benerji",
    room: "LH-1",
    type: "lecture"
  },
  {
    id: "tt-18",
    day: "Friday",
    startTime: "10:00",
    endTime: "11:00",
    subject: "Linear Algebra",
    subjectCode: "MATH102",
    teacher: "Ramesh Kumar",
    room: "LH-2",
    type: "lecture"
  },
  {
    id: "tt-19",
    day: "Friday",
    startTime: "11:15",
    endTime: "12:15",
    subject: "Differential Equations",
    subjectCode: "MATH103",
    teacher: "A Benerji",
    room: "LH-3",
    type: "lecture"
  },
  {
    id: "tt-20",
    day: "Friday",
    startTime: "14:00",
    endTime: "16:00",
    subject: "Calculus",
    subjectCode: "MATH101",
    teacher: "A Benerji",
    room: "LH-1",
    type: "tutorial"
  }
];

// Sample attendance summary
const generateAttendanceSummary = () => {
  const summary: AttendanceSummary[] = [];
  
  initialSubjects.forEach(subject => {
    const totalClasses = 20;
    const present = Math.floor(Math.random() * 5) + 15; // Random between 15-20
    const absent = totalClasses - present;
    const percentage = (present / totalClasses) * 100;
    
    // Create summary for each subject
    const subjectSummary: AttendanceSummary = {
      studentId: "41",
      rollNumber: "24MAB0A41",
      studentName: "V Dhruv",
      subjectId: subject.id,
      subjectName: subject.name,
      totalClasses,
      present,
      absent,
      percentage,
      lastUpdated: new Date().toISOString(),
      subjects: [
        {
          subjectId: subject.id,
          subjectName: subject.name,
          totalClasses,
          attended: present,
          percentage
        }
      ],
      overall: {
        totalClasses,
        attended: present,
        percentage
      }
    };
    
    summary.push(subjectSummary);
  });
  
  return summary;
};

// Sample messages
const initialMessages: Message[] = [
  {
    id: "msg1",
    sender: "tchr-1",
    senderId: "tchr-1",
    senderType: "teacher",
    senderName: "A Benerji",
    recipient: "41",
    receiverId: "41",
    receiverType: "student",
    content: "Please submit your Calculus assignment by tomorrow.",
    timestamp: new Date(2023, 9, 10, 14, 30).toISOString(),
    read: true
  },
  {
    id: "msg2",
    sender: "41",
    senderId: "41",
    senderType: "student",
    senderName: "V Dhruv",
    recipient: "tchr-1",
    receiverId: "tchr-1",
    receiverType: "teacher",
    content: "I have completed the assignment and will submit it today.",
    timestamp: new Date(2023, 9, 10, 15, 45).toISOString(),
    read: false
  },
  {
    id: "msg3",
    sender: "tchr-1",
    senderId: "tchr-1",
    senderType: "teacher",
    senderName: "A Benerji",
    recipient: "41",
    receiverId: "41",
    receiverType: "student",
    content: "Great! Looking forward to reviewing it.",
    timestamp: new Date(2023, 9, 10, 16, 20).toISOString(),
    read: false
  }
];

// Sample notifications
const initialNotifications: Notification[] = [
  {
    id: "notif1",
    title: "Assignment Due",
    content: "Calculus Quiz Preparation is due tomorrow",
    timestamp: new Date(2023, 9, 9, 10, 0).toISOString(),
    read: false,
    type: "assignment",
    link: "/student-dashboard/assignments"
  },
  {
    id: "notif2",
    title: "New Message",
    content: "You have a new message from Prof. A Benerji",
    timestamp: new Date(2023, 9, 10, 14, 30).toISOString(),
    read: true,
    type: "other",
    link: "/student-dashboard/chat"
  },
  {
    id: "notif3",
    title: "Attendance Alert",
    content: "Your attendance in Differential Equations is below 75%",
    timestamp: new Date(2023, 9, 5, 9, 15).toISOString(),
    read: false,
    type: "attendance",
    link: "/student-dashboard/attendance"
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
    teacherId: "tchr-2",
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

// Sample semester results
const initialSemesterResults: SemesterResult[] = [
  {
    id: "sem-res-1",
    studentId: "41",
    studentName: "V Dhruv",
    rollNumber: "24MAB0A41",
    semester: 1,
    year: 1,
    sgpa: 9.2,
    cgpa: 9.2,
    results: [
      {
        subjectCode: "MATH101",
        subjectName: "Calculus",
        credit: 4,
        grade: "A"
      },
      {
        subjectCode: "MATH102",
        subjectName: "Linear Algebra",
        credit: 4,
        grade: "A+"
      },
      {
        subjectCode: "MATH103",
        subjectName: "Differential Equations",
        credit: 3,
        grade: "A"
      },
      {
        subjectCode: "MATH104",
        subjectName: "Statistics",
        credit: 3,
        grade: "A"
      }
    ]
  },
  {
    id: "sem-res-2",
    studentId: "41",
    studentName: "V Dhruv",
    rollNumber: "24MAB0A41",
    semester: 2,
    year: 1,
    sgpa: 9.5,
    cgpa: 9.35,
    results: [
      {
        subjectCode: "MATH201",
        subjectName: "Advanced Calculus",
        credit: 4,
        grade: "A+"
      },
      {
        subjectCode: "MATH202",
        subjectName: "Real Analysis",
        credit: 4,
        grade: "A"
      },
      {
        subjectCode: "MATH203",
        subjectName: "Complex Analysis",
        credit: 3,
        grade: "A+"
      },
      {
        subjectCode: "MATH204",
        subjectName: "Probability Theory",
        credit: 3,
        grade: "A"
      }
    ]
  }
];

// Sample minor results
const initialMinorResults: MinorResult[] = [
  {
    id: "minor-1",
    studentId: "41",
    rollNumber: "24MAB0A41",
    studentName: "V Dhruv",
    subjectId: "sub-1",
    subjectCode: "MATH101",
    subjectName: "Calculus",
    maxMarks: 30,
    obtainedMarks: 25,
    marks: 12.5,
    examDate: "2023-09-10",
    examType: "Minor1"
  },
  {
    id: "minor-2",
    studentId: "41",
    rollNumber: "24MAB0A41",
    studentName: "V Dhruv",
    subjectId: "sub-2",
    subjectCode: "MATH102",
    subjectName: "Linear Algebra",
    maxMarks: 30,
    obtainedMarks: 28,
    marks: 14,
    examDate: "2023-09-12",
    examType: "Minor1"
  },
  {
    id: "minor-3",
    studentId: "41",
    rollNumber: "24MAB0A41",
    studentName: "V Dhruv",
    subjectId: "sub-3",
    subjectCode: "MATH103",
    subjectName: "Differential Equations",
    maxMarks: 30,
    obtainedMarks: 24,
    marks: 12,
    examDate: "2023-09-14",
    examType: "Minor1"
  },
  {
    id: "minor-4",
    studentId: "41",
    rollNumber: "24MAB0A41",
    studentName: "V Dhruv",
    subjectId: "sub-4",
    subjectCode: "MATH104",
    subjectName: "Statistics",
    maxMarks: 30,
    obtainedMarks: 27,
    marks: 13.5,
    examDate: "2023-09-16",
    examType: "Minor1"
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
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [finalResults, setFinalResults] = useState<SemesterResult[]>(initialSemesterResults);
  const [minorResults, setMinorResults] = useState<MinorResult[]>(initialMinorResults);
  const [timetable, setTimetable] = useState<TimetableEntry[]>(initialTimetable);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary[]>(generateAttendanceSummary());
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(initialSubmissions);

  // Load data from localStorage on initial render if available
  useEffect(() => {
    try {
      const storedStudents = localStorage.getItem('students');
      const storedAssignments = localStorage.getItem('assignments');
      const storedAttendance = localStorage.getItem('attendance');
      const storedMessages = localStorage.getItem('messages');
      const storedResults = localStorage.getItem('results');
      const storedEmails = localStorage.getItem('emails');
      const storedSubjects = localStorage.getItem('subjects');
      const storedFinalResults = localStorage.getItem('finalResults');
      const storedMinorResults = localStorage.getItem('minorResults');
      const storedTimetable = localStorage.getItem('timetable');
      const storedNotifications = localStorage.getItem('notifications');
      const storedAttendanceSummary = localStorage.getItem('attendanceSummary');
      const storedTeachers = localStorage.getItem('teachers');
      const storedSubmissions = localStorage.getItem('submissions');

      if (storedStudents) setStudents(JSON.parse(storedStudents));
      if (storedAssignments) setAssignments(JSON.parse(storedAssignments));
      if (storedAttendance) setAttendance(JSON.parse(storedAttendance));
      if (storedMessages) setMessages(JSON.parse(storedMessages));
      if (storedResults) setResults(JSON.parse(storedResults));
      if (storedEmails) setEmails(JSON.parse(storedEmails));
      if (storedSubjects) setSubjects(JSON.parse(storedSubjects));
      if (storedFinalResults) setFinalResults(JSON.parse(storedFinalResults));
      if (storedMinorResults) setMinorResults(JSON.parse(storedMinorResults));
      if (storedTimetable) setTimetable(JSON.parse(storedTimetable));
      if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
      if (storedAttendanceSummary) setAttendanceSummary(JSON.parse(storedAttendanceSummary));
      if (storedTeachers) setTeachers(JSON.parse(storedTeachers));
      if (storedSubmissions) setSubmissions(JSON.parse(storedSubmissions));
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
      localStorage.setItem('subjects', JSON.stringify(subjects));
      localStorage.setItem('finalResults', JSON.stringify(finalResults));
      localStorage.setItem('minorResults', JSON.stringify(minorResults));
      localStorage.setItem('timetable', JSON.stringify(timetable));
      localStorage.setItem('notifications', JSON.stringify(notifications));
      localStorage.setItem('attendanceSummary', JSON.stringify(attendanceSummary));
      localStorage.setItem('teachers', JSON.stringify(teachers));
      localStorage.setItem('submissions', JSON.stringify(submissions));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [students, assignments, attendance, messages, results, emails, subjects, finalResults, minorResults, timetable, notifications, attendanceSummary, teachers, submissions]);

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
    setAssignments(prev => [...prev, { ...assignment, id: `assign-${Date.now()}`, status: 'pending' }]);
  };

  const updateAssignment = (assignmentId: string, data: Partial<Assignment>) => {
    setAssignments(prev => prev.map(assignment => 
      assignment.id === assignmentId ? { ...assignment, ...data } : assignment
    ));
  };

  const removeAssignment = (assignmentId: string) => {
    setAssignments(prev => prev.filter(assignment => assignment.id !== assignmentId));
  };

  // Submission operations
  const submitAssignment = (submission: Omit<AssignmentSubmission, 'id'>) => {
    const newSubmission: AssignmentSubmission = {
      ...submission,
      id: `sub-${Date.now()}`,
      status: 'submitted'
    };
    setSubmissions(prev => [...prev, newSubmission]);
    
    // Update the assignment status for the student
    updateAssignment(submission.assignmentId, { status: 'submitted', studentId: submission.studentId });
  };

  const gradeSubmission = (submissionId: string, marks: number, feedback: string) => {
    setSubmissions(prev => prev.map(submission => 
      submission.id === submissionId ? { ...submission, marks, feedback, status: 'graded' } : submission
    ));
    
    // Find the submission to update the corresponding assignment
    const submission = submissions.find(sub => sub.id === submissionId);
    if (submission) {
      updateAssignment(submission.assignmentId, { status: 'graded', grade: marks, feedback });
    }
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

  const markAttendance = (subjectId: string, date: string, students: { studentId: string; present: boolean }[]) => {
    const subject = subjects.find(s => s.id === subjectId);
    
    if (!subject) return;
    
    // Remove existing records for this date and subject
    const filteredAttendance = attendance.filter(record => 
      !(record.date === date && record.subjectId === subjectId)
    );
    
    // Add new records for each student
    const newRecords: AttendanceRecord[] = students.map(student => ({
      id: `att-${date}-${subjectId}-${student.studentId}`,
      date,
      subject: subject.name,
      subjectId,
      subjectName: subject.name,
      studentId: student.studentId,
      status: student.present ? 'present' : 'absent',
      students: [student], // Keep the students array for backward compatibility
      teacherId: subject.teacherId
    }));
    
    setAttendance([...filteredAttendance, ...newRecords]);
    
    // Update attendance summary
    updateAttendanceSummary(subjectId);
  };

  const updateAttendanceSummary = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    
    if (!subject) return;
    
    // Calculate summary for each student
    const summaries = students.map(student => {
      const studentAttendance = attendance.filter(record => 
        record.studentId === student.id && record.subjectId === subjectId
      );
      
      const totalClasses = studentAttendance.length;
      const present = studentAttendance.filter(record => record.status === 'present').length;
      const absent = totalClasses - present;
      const percentage = totalClasses > 0 ? (present / totalClasses) * 100 : 0;
      
      return {
        studentId: student.id,
        rollNumber: student.rollNumber,
        studentName: student.name,
        subjectId,
        subjectName: subject.name,
        totalClasses,
        present,
        absent,
        percentage,
        lastUpdated: new Date().toISOString(),
        subjects: [
          {
            subjectId,
            subjectName: subject.name,
            totalClasses,
            attended: present,
            percentage
          }
        ],
        overall: {
          totalClasses,
          attended: present,
          percentage
        }
      } as AttendanceSummary;
    });
    
    // Replace existing summary for this subject
    const filteredSummary = attendanceSummary.filter(s => s.subjectId !== subjectId);
    setAttendanceSummary([...filteredSummary, ...summaries]);
  };

  const exportAttendance = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    
    if (!subject) return;
    
    // In a real application, this would generate and download an Excel file
    // For now, we'll just log the data
    console.log(`Exporting attendance for ${subject.name} (${subject.code})`);
    
    const subjectAttendance = attendance.filter(record => record.subjectId === subjectId);
    console.log('Attendance records:', subjectAttendance);
    
    // Create a mock data structure for the Excel file
    const excelData: any[] = [];
    
    // In a real application, we would use a library like xlsx to create and download the file
    alert(`Attendance data for ${subject.name} has been exported.`);
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

  const sendMessage = (messageData: Omit<Message, 'id' | 'read' | 'timestamp'>) => {
    const newMessage: Message = {
      ...messageData,
      id: `msg-${Date.now()}`,
      read: false,
      timestamp: new Date().toISOString()
    };
    
    addMessage(newMessage);
    
    // Add a notification for the recipient
    if (user?.id !== messageData.receiverId) {
      addNotification({
        title: "New Message",
        content: `You have a new message from ${messageData.senderName || messageData.sender}`,
        type: "other",
        link: `/${messageData.receiverType}-dashboard/chat`
      });
    }
  };

  const markMessageAsRead = (messageId: string) => {
    updateMessage(messageId, { read: true });
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

  const submitGrades = (studentId: string, semester: number, results: ExamResult[]) => {
    // Check if result already exists
    const existingResult = finalResults.find(r => r.studentId === studentId && r.semester === semester);
    
    if (existingResult) {
      // Update existing result
      setFinalResults(prev => prev.map(result => 
        (result.studentId === studentId && result.semester === semester)
          ? { ...result, results }
          : result
      ));
    } else {
      // Calculate SGPA (simplified)
      const totalCredits = results.reduce((sum, r) => sum + r.credit, 0);
      const totalGradePoints = results.reduce((sum, r) => {
        const gradePoint = r.grade === 'S' ? 10 :
                          r.grade === 'A+' ? 9 :
                          r.grade === 'A' ? 8 :
                          r.grade === 'B+' ? 7 :
                          r.grade === 'B' ? 6 :
                          r.grade === 'C' ? 5 :
                          r.grade === 'D' ? 4 :
                          r.grade === 'E' ? 3 : 0;
        return sum + (gradePoint * r.credit);
      }, 0);
      
      const sgpa = totalGradePoints / totalCredits;
      
      // Get student details
      const student = students.find(s => s.id === studentId);
      
      if (!student) return;
      
      // Create new result
      const newResult: SemesterResult = {
        id: `sem-res-${Date.now()}`,
        studentId,
        studentName: student.name,
        rollNumber: student.rollNumber,
        semester,
        year: Math.ceil(semester / 2),
        sgpa,
        cgpa: sgpa, // Simplified, should calculate based on previous semesters
        results
      };
      
      setFinalResults(prev => [...prev, newResult]);
    }
    
    // Add a notification for the student
    addNotification({
      title: "Grades Published",
      content: `Your grades for Semester ${semester} have been published`,
      type: "result",
      link: "/student-dashboard/results"
    });
  };

  const submitMinorMarks = (result: Omit<MinorResult, 'id'>) => {
    // Check if result already exists
    const existingResult = minorResults.find(r => 
      r.studentId === result.studentId && 
      r.subjectId === result.subjectId && 
      r.examType === result.examType
    );
    
    if (existingResult) {
      // Update existing result
      setMinorResults(prev => prev.map(r => 
        (r.studentId === result.studentId && r.subjectId === result.subjectId && r.examType === result.examType)
          ? { ...r, ...result }
          : r
      ));
    } else {
      // Create new result
      const newResult: MinorResult = {
        ...result,
        id: `minor-${Date.now()}`
      };
      
      setMinorResults(prev => [...prev, newResult]);
    }
    
    // Add a notification for the student
    addNotification({
      title: "Minor Marks Published",
      content: `Your ${result.examType} marks for ${result.subjectName} have been published`,
      type: "result",
      link: "/student-dashboard/results"
    });
  };

  const downloadResult = (studentId: string, semester: number) => {
    // In a real application, this would generate and download a PDF file
    // For now, we'll just log the data
    const result = finalResults.find(r => r.studentId === studentId && r.semester === semester);
    
    if (!result) return;
    
    console.log(`Downloading result for ${result.studentName} (${result.rollNumber}), Semester ${semester}`);
    console.log('Result data:', result);
    
    // In a real application, we would use a library like jspdf to create and download the file
    alert(`Result for Semester ${semester} has been downloaded.`);
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

  // Notification operations
  const addNotification = (notificationData: Omit<Notification, 'id' | 'read' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `notif-${Date.now()}`,
      read: false,
      timestamp: new Date().toISOString()
    };
    
    setNotifications(prev => [...prev, newNotification]);
  };

  const updateNotification = (notificationId: string, data: Partial<Notification>) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId ? { ...notification, ...data } : notification
    ));
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  };

  return (
    <DataContext.Provider value={{
      students,
      assignments,
      attendance,
      messages,
      results,
      emails,
      subjects,
      finalResults,
      minorResults,
      timetable,
      notifications,
      attendanceSummary,
      teachers,
      submissions,
      addStudent,
      updateStudent,
      removeStudent,
      addAssignment,
      updateAssignment,
      removeAssignment,
      submitAssignment,
      gradeSubmission,
      addAttendanceRecord,
      updateAttendanceRecord,
      removeAttendanceRecord,
      addAttendanceRecords,
      markAttendance,
      exportAttendance,
      addMessage,
      updateMessage,
      removeMessage,
      sendMessage,
      markMessageAsRead,
      addResult,
      updateResult,
      removeResult,
      submitGrades,
      submitMinorMarks,
      downloadResult,
      addEmail,
      updateEmail,
      removeEmail,
      addNotification,
      updateNotification,
      removeNotification
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
