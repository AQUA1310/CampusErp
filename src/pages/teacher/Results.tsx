
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useData } from "@/contexts/DataContext";
import DashboardLayout from "@/components/shared/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  FileCheck, 
  Save,
  Check, 
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TeacherResults() {
  const { studentList } = useAuth();
  const { subjects, minorResults, semesterResults } = useData();
  const [activeTab, setActiveTab] = useState("minor");
  const [examType, setExamType] = useState<"Minor1" | "Minor2">("Minor1");
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.id || "");
  const [selectedSemester, setSelectedSemester] = useState("1");
  
  // Student results state
  const [studentMinorResults, setStudentMinorResults] = useState<{
    [studentId: string]: { mark: number; submitted: boolean };
  }>({});
  
  const [studentSemResults, setStudentSemResults] = useState<{
    [studentId: string]: { 
      [subjectId: string]: { 
        grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F'; 
        submitted: boolean 
      }
    };
  }>({});

  // Filter students based on roll number
  const mabStudents = studentList.filter(student => 
    student.rollNumber.startsWith('24MAB0A')
  ).sort((a, b) => a.rollNumber.localeCompare(b.rollNumber));
  
  // Get subject details
  const subjectDetails = subjects.find(s => s.id === selectedSubject);

  // Initialize student results when changing exam type or subject
  useEffect(() => {
    if (activeTab === "minor") {
      // Initialize student minor results 
      const newResults = { ...studentMinorResults };
      
      mabStudents.forEach(student => {
        // Check if we already have a result for this student
        const existingResult = minorResults.find(
          r => r.examType === examType && 
          r.subjectId === selectedSubject && 
          (student.id === r.studentId || student.rollNumber === r.rollNumber)
        );
        
        if (existingResult) {
          newResults[student.id] = {
            mark: existingResult.obtainedMarks,
            submitted: true
          };
        } else if (!newResults[student.id]) {
          newResults[student.id] = {
            mark: 0,
            submitted: false
          };
        }
      });
      
      setStudentMinorResults(newResults);
    } else {
      // Initialize student semester results
      const newResults = { ...studentSemResults };
      
      mabStudents.forEach(student => {
        if (!newResults[student.id]) {
          newResults[student.id] = {};
        }
        
        // For each subject, check if we have results
        subjects.forEach(subject => {
          const existingResult = semesterResults.find(
            r => r.semester.toString() === selectedSemester && 
            r.studentId === student.id
          );
          
          const subjectResult = existingResult?.results.find(
            sr => sr.subjectCode === subject.code
          );
          
          if (subjectResult) {
            newResults[student.id][subject.id] = {
              grade: subjectResult.grade as any,
              submitted: true
            };
          } else if (!newResults[student.id][subject.id]) {
            newResults[student.id][subject.id] = {
              grade: 'B',
              submitted: false
            };
          }
        });
      });
      
      setStudentSemResults(newResults);
    }
  }, [activeTab, examType, selectedSubject, selectedSemester, mabStudents, minorResults, semesterResults, subjects]);

  const handleMinorMarkChange = (studentId: string, mark: number) => {
    // Ensure mark is between 0 and 30
    const validMark = Math.min(Math.max(0, mark), 30);
    
    setStudentMinorResults(prev => ({
      ...prev,
      [studentId]: {
        mark: validMark,
        submitted: prev[studentId]?.submitted || false
      }
    }));
  };

  const handleGradeChange = (studentId: string, subjectId: string, grade: string) => {
    setStudentSemResults(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [subjectId]: {
          grade: grade as any,
          submitted: prev[studentId]?.[subjectId]?.submitted || false
        }
      }
    }));
  };

  const submitMinorResults = () => {
    // In a real app, we would submit to an API
    // For this demo, we'll just show a success message
    
    // Mark all results as submitted
    const updatedResults = { ...studentMinorResults };
    Object.keys(updatedResults).forEach(studentId => {
      updatedResults[studentId].submitted = true;
    });
    
    setStudentMinorResults(updatedResults);
    
    toast.success(`Successfully submitted ${examType} results for ${subjectDetails?.name}`);
  };

  const submitSemesterResults = () => {
    // In a real app, we would submit to an API
    // For this demo, we'll just show a success message
    
    // Mark all results as submitted
    const updatedResults = { ...studentSemResults };
    Object.keys(updatedResults).forEach(studentId => {
      Object.keys(updatedResults[studentId]).forEach(subjectId => {
        updatedResults[studentId][subjectId].submitted = true;
      });
    });
    
    setStudentSemResults(updatedResults);
    
    toast.success(`Successfully submitted Semester ${selectedSemester} results`);
  };

  return (
    <DashboardLayout title="Results Management" subtitle="Manage student examination results">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="minor">Minor Exams</TabsTrigger>
          <TabsTrigger value="endSem">End Semester</TabsTrigger>
        </TabsList>
        
        <TabsContent value="minor">
          <Card className="shadow-md">
            <CardHeader className="bg-slate-50 border-b">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <CardTitle>Minor Exam Results</CardTitle>
                  <CardDescription>
                    Enter and manage student minor exam results
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Select
                    value={examType}
                    onValueChange={(value) => setExamType(value as "Minor1" | "Minor2")}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Exam" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Minor1">Minor 1</SelectItem>
                      <SelectItem value="Minor2">Minor 2</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedSubject}
                    onValueChange={setSelectedSubject}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4">
                <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-blue-700">
                    Enter marks out of 30 for each student. The system will automatically normalize them to 15 marks for display in the student portal.
                  </AlertDescription>
                </Alert>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead className="w-[100px]">Roll No</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead className="text-center">Marks (out of 30)</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mabStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.rollNumber}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min="0"
                          max="30"
                          className="w-20 mx-auto text-center"
                          value={studentMinorResults[student.id]?.mark || 0}
                          onChange={(e) => handleMinorMarkChange(student.id, parseInt(e.target.value))}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        {studentMinorResults[student.id]?.submitted ? (
                          <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            <Check className="h-3 w-3 mr-1" />
                            Submitted
                          </div>
                        ) : (
                          <div className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-medium">
                            Draft
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-end p-4 bg-slate-50">
              <Button onClick={submitMinorResults} className="bg-primary">
                <Save className="h-4 w-4 mr-2" />
                Submit {examType} Results
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="endSem">
          <Card className="shadow-md">
            <CardHeader className="bg-slate-50 border-b">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <CardTitle>End Semester Results</CardTitle>
                  <CardDescription>
                    Enter and manage student semester results
                  </CardDescription>
                </div>
                <div>
                  <Select
                    value={selectedSemester}
                    onValueChange={setSelectedSemester}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Semester 1</SelectItem>
                      <SelectItem value="2">Semester 2</SelectItem>
                      <SelectItem value="3">Semester 3</SelectItem>
                      <SelectItem value="4">Semester 4</SelectItem>
                      <SelectItem value="5">Semester 5</SelectItem>
                      <SelectItem value="6">Semester 6</SelectItem>
                      <SelectItem value="7">Semester 7</SelectItem>
                      <SelectItem value="8">Semester 8</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4">
                <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-blue-700">
                    Enter grades for each subject. Valid grades are S, A, B, C, D, E, F.
                  </AlertDescription>
                </Alert>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead className="sticky left-0 bg-white z-10">Roll No</TableHead>
                      <TableHead className="sticky left-24 bg-white z-10">Student Name</TableHead>
                      {subjects.map((subject) => (
                        <TableHead key={subject.id} className="text-center">
                          <div className="w-28 text-xs">
                            {subject.name} <br />
                            <span className="text-muted-foreground">({subject.code})</span>
                          </div>
                        </TableHead>
                      ))}
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mabStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium sticky left-0 bg-white z-10">
                          {student.rollNumber}
                        </TableCell>
                        <TableCell className="sticky left-24 bg-white z-10">
                          {student.name}
                        </TableCell>
                        {subjects.map((subject) => (
                          <TableCell key={subject.id} className="text-center">
                            <Select
                              value={studentSemResults[student.id]?.[subject.id]?.grade || 'B'}
                              onValueChange={(value) => handleGradeChange(student.id, subject.id, value)}
                            >
                              <SelectTrigger className="w-16 mx-auto h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="S">S</SelectItem>
                                <SelectItem value="A">A</SelectItem>
                                <SelectItem value="B">B</SelectItem>
                                <SelectItem value="C">C</SelectItem>
                                <SelectItem value="D">D</SelectItem>
                                <SelectItem value="E">E</SelectItem>
                                <SelectItem value="F">F</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        ))}
                        <TableCell className="text-center">
                          {student.id in studentSemResults && 
                           Object.values(studentSemResults[student.id]).some(val => val.submitted) ? (
                            <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              <Check className="h-3 w-3 mr-1" />
                              Submitted
                            </div>
                          ) : (
                            <div className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-medium">
                              Draft
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end p-4 bg-slate-50">
              <Button onClick={submitSemesterResults} className="bg-primary">
                <FileCheck className="h-4 w-4 mr-2" />
                Submit Semester {selectedSemester} Results
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
