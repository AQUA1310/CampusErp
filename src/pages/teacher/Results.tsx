
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/contexts/DataContext";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FileEdit, Save, BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define types for better type safety
interface Student {
  id: string;
  rollNumber: string;
  name: string;
}

interface MinorResult {
  id: string;
  studentId: string;
  rollNumber: string;
  studentName: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  examDate: string;
  maxMarks: number;
  obtainedMarks: number;
  percentage: number;
  examType?: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  semester: number;
}

interface SemesterGrade {
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

export default function TeacherResults() {
  const { subjects, minorResults, students, semesterGrades, setSemesterGrades, setMinorResults } = useData();
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [examType, setExamType] = useState<"minor" | "endSem">("minor");
  const [minorExamType, setMinorExamType] = useState<"Minor1" | "Minor2">("Minor1");
  const [selectedSemester, setSelectedSemester] = useState<number>(2);
  const [editingStudent, setEditingStudent] = useState<string | null>(null);
  
  const semesterSubjects = subjects.filter(subject => subject.semester === selectedSemester);
  
  const form = useForm({
    defaultValues: {
      marks: {} as Record<string, number>,
      grades: {} as Record<string, string>
    }
  });

  const filteredMinorResults = selectedSubject === "all"
    ? minorResults.filter(result => result.examType === minorExamType)
    : minorResults.filter(result => result.subjectId === selectedSubject && result.examType === minorExamType);

  const filteredSemesterGrades = selectedSubject === "all"
    ? semesterGrades.filter(grade => grade.semester === selectedSemester)
    : semesterGrades.filter(grade => grade.subjectId === selectedSubject && grade.semester === selectedSemester);

  const handleSaveMinorMarks = (studentId: string, subjectId: string, marks: number) => {
    // Find the existing result or create a new one
    const existingResultIndex = minorResults.findIndex(
      r => r.studentId === studentId && r.subjectId === subjectId && r.examType === minorExamType
    );
    
    const student = students.find(s => s.id === studentId);
    const subject = subjects.find(s => s.id === subjectId);
    
    if (!student || !subject) return;
    
    const newResult: MinorResult = {
      id: existingResultIndex >= 0 ? minorResults[existingResultIndex].id : `minor-${Date.now()}`,
      studentId,
      rollNumber: student.rollNumber,
      studentName: student.name,
      subjectId,
      subjectName: subject.name,
      subjectCode: subject.code || "MA" + (Math.floor(Math.random() * 100) + 100),
      examDate: new Date().toISOString(),
      maxMarks: 15,
      obtainedMarks: marks,
      percentage: (marks / 15) * 100,
      examType: minorExamType
    };
    
    if (existingResultIndex >= 0) {
      // Update existing result
      const updatedResults = [...minorResults];
      updatedResults[existingResultIndex] = newResult;
      setMinorResults(updatedResults);
    } else {
      // Add new result
      setMinorResults([...minorResults, newResult]);
    }
    
    toast.success(`Saved ${minorExamType} marks for ${student.name} in ${subject.name}`);
    setEditingStudent(null);
  };

  const handleSaveSemesterGrade = (studentId: string, subjectId: string, grade: string) => {
    // Find the existing grade or create a new one
    const existingGradeIndex = semesterGrades.findIndex(
      g => g.studentId === studentId && g.subjectId === subjectId && g.semester === selectedSemester
    );
    
    const student = students.find(s => s.id === studentId);
    const subject = subjects.find(s => s.id === subjectId);
    
    if (!student || !subject) return;
    
    const newGrade: SemesterGrade = {
      id: existingGradeIndex >= 0 ? semesterGrades[existingGradeIndex].id : `grade-${Date.now()}`,
      studentId,
      studentName: student.name,
      rollNumber: student.rollNumber,
      subjectId,
      subjectName: subject.name,
      subjectCode: subject.code || "MA" + (Math.floor(Math.random() * 100) + 100),
      grade,
      credit: 4,
      semester: selectedSemester
    };
    
    if (existingGradeIndex >= 0) {
      // Update existing grade
      const updatedGrades = [...semesterGrades];
      updatedGrades[existingGradeIndex] = newGrade;
      setSemesterGrades(updatedGrades);
    } else {
      // Add new grade
      setSemesterGrades([...semesterGrades, newGrade]);
    }
    
    toast.success(`Saved semester grade for ${student.name} in ${subject.name}`);
    setEditingStudent(null);
  };

  const getStudentMarks = (studentId: string, subjectId: string): number | undefined => {
    const result = minorResults.find(
      r => r.studentId === studentId && r.subjectId === subjectId && r.examType === minorExamType
    );
    return result?.obtainedMarks;
  };

  const getStudentGrade = (studentId: string, subjectId: string): string | undefined => {
    const grade = semesterGrades.find(
      g => g.studentId === studentId && g.subjectId === subjectId && g.semester === selectedSemester
    );
    return grade?.grade;
  };

  const isCurrentSemester = selectedSemester === 2;
  const isPastSemester = selectedSemester < 2;
  const isFutureSemester = selectedSemester > 2;

  return (
    <DashboardLayout title="Results" subtitle="View and manage student results">
      <Tabs defaultValue="minor" onValueChange={(value) => setExamType(value as "minor" | "endSem")} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="minor">Minor Exams</TabsTrigger>
          <TabsTrigger value="endSem">End Sem Exams</TabsTrigger>
        </TabsList>
        
        <div className="flex flex-wrap gap-3 mb-6">
          {examType === "minor" && (
            <>
              <Select value={minorExamType} onValueChange={(value) => setMinorExamType(value as "Minor1" | "Minor2")}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Minor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Minor1">Minor 1</SelectItem>
                  <SelectItem value="Minor2">Minor 2</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
          
          <Select 
            value={selectedSemester.toString()} 
            onValueChange={(value) => setSelectedSemester(parseInt(value))}
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
          
          {(isCurrentSemester || isPastSemester) && (
            <Select 
              value={selectedSubject} 
              onValueChange={setSelectedSubject}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Filter by Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {semesterSubjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        {isFutureSemester && (
          <div className="rounded-md bg-amber-50 p-6 text-center text-amber-700 border border-amber-200">
            <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-60" />
            <h3 className="text-lg font-semibold mb-1">Semester {selectedSemester} has not started yet</h3>
            <p>Results will be available once the semester begins.</p>
          </div>
        )}
        
        {isPastSemester && (
          <Card className="shadow-md">
            <CardHeader className="bg-blue-50 border-b border-blue-100 rounded-t-lg">
              <CardTitle className="text-blue-900">Semester {selectedSemester} Results (Completed)</CardTitle>
              <CardDescription className="text-slate-600">
                End semester results for the previous semester
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-50/50">
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-center">Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSemesterGrades.length > 0 ? (
                    filteredSemesterGrades.map((grade) => (
                      <TableRow key={grade.id}>
                        <TableCell>{grade.rollNumber}</TableCell>
                        <TableCell>{grade.studentName}</TableCell>
                        <TableCell>{grade.subjectName}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={`
                            ${grade.grade === 'S' ? 'bg-indigo-600' :
                              grade.grade === 'A' ? 'bg-green-600' :
                              grade.grade === 'B' ? 'bg-blue-600' :
                              grade.grade === 'C' ? 'bg-yellow-600' :
                              grade.grade === 'D' ? 'bg-orange-600' :
                              grade.grade === 'E' ? 'bg-red-600' :
                              'bg-gray-600'}
                          `}>
                            {grade.grade}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                        No results found for the selected criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
        
        {isCurrentSemester && examType === "minor" && (
          <Card className="shadow-md">
            <CardHeader className="bg-blue-50 border-b border-blue-100 rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-blue-900">{minorExamType} Results</CardTitle>
                  <CardDescription className="text-slate-600">
                    View and update student minor exam results
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-50/50">
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-center">Marks (Out of 15)</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.length > 0 ? (
                    students.map((student) => (
                      semesterSubjects.map((subject) => (
                        (selectedSubject === "all" || selectedSubject === subject.id) && (
                          <TableRow key={`${student.id}-${subject.id}`}>
                            <TableCell>{student.rollNumber}</TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{subject.name}</TableCell>
                            <TableCell className="text-center">
                              {editingStudent === `${student.id}-${subject.id}` ? (
                                <div className="flex items-center justify-center space-x-2">
                                  <Input
                                    type="number"
                                    min="0"
                                    max="15"
                                    className="w-20 text-center"
                                    defaultValue={getStudentMarks(student.id, subject.id) || 0}
                                    onChange={(e) => {
                                      const value = Math.min(15, Math.max(0, parseInt(e.target.value) || 0));
                                      form.setValue(`marks.${student.id}.${subject.id}`, value);
                                    }}
                                  />
                                  <Button 
                                    size="sm" 
                                    onClick={() => {
                                      const marks = form.getValues(`marks.${student.id}.${subject.id}`) || 0;
                                      handleSaveMinorMarks(student.id, subject.id, marks);
                                    }}
                                  >
                                    <Save className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <Badge className={`
                                  ${getStudentMarks(student.id, subject.id) !== undefined ? 
                                    ((getStudentMarks(student.id, subject.id)! / 15) >= 0.7 
                                      ? 'bg-green-600' 
                                      : (getStudentMarks(student.id, subject.id)! / 15) >= 0.4 
                                      ? 'bg-yellow-600' 
                                      : 'bg-red-600') : 
                                    'bg-gray-400'}
                                `}>
                                  {getStudentMarks(student.id, subject.id) !== undefined ? 
                                    `${getStudentMarks(student.id, subject.id)}/15` : 
                                    "Not graded"}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingStudent(
                                  editingStudent === `${student.id}-${subject.id}` ? 
                                    null : 
                                    `${student.id}-${subject.id}`
                                )}
                              >
                                <FileEdit className="h-4 w-4 mr-2" />
                                {editingStudent === `${student.id}-${subject.id}` ? "Cancel" : "Edit"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      ))
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No students found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
        
        {isCurrentSemester && examType === "endSem" && (
          <Card className="shadow-md">
            <CardHeader className="bg-blue-50 border-b border-blue-100 rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-blue-900">End Semester Grades</CardTitle>
                  <CardDescription className="text-slate-600">
                    Assign end semester grades to students
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-50/50">
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-center">Grade</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.length > 0 ? (
                    students.map((student) => (
                      semesterSubjects.map((subject) => (
                        (selectedSubject === "all" || selectedSubject === subject.id) && (
                          <TableRow key={`${student.id}-${subject.id}`}>
                            <TableCell>{student.rollNumber}</TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{subject.name}</TableCell>
                            <TableCell className="text-center">
                              {editingStudent === `${student.id}-${subject.id}` ? (
                                <div className="flex items-center justify-center space-x-2">
                                  <Select
                                    defaultValue={getStudentGrade(student.id, subject.id) || ""}
                                    onValueChange={(value) => {
                                      form.setValue(`grades.${student.id}.${subject.id}`, value);
                                    }}
                                  >
                                    <SelectTrigger className="w-24">
                                      <SelectValue placeholder="Grade" />
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
                                  <Button 
                                    size="sm" 
                                    onClick={() => {
                                      const grade = form.getValues(`grades.${student.id}.${subject.id}`);
                                      if (grade) {
                                        handleSaveSemesterGrade(student.id, subject.id, grade);
                                      }
                                    }}
                                  >
                                    <Save className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <Badge className={`
                                  ${getStudentGrade(student.id, subject.id) === 'S' ? 'bg-indigo-600' :
                                    getStudentGrade(student.id, subject.id) === 'A' ? 'bg-green-600' :
                                    getStudentGrade(student.id, subject.id) === 'B' ? 'bg-blue-600' :
                                    getStudentGrade(student.id, subject.id) === 'C' ? 'bg-yellow-600' :
                                    getStudentGrade(student.id, subject.id) === 'D' ? 'bg-orange-600' :
                                    getStudentGrade(student.id, subject.id) === 'E' ? 'bg-red-600' :
                                    getStudentGrade(student.id, subject.id) === 'F' ? 'bg-gray-800' :
                                    'bg-gray-400'}
                                `}>
                                  {getStudentGrade(student.id, subject.id) || "Not graded"}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingStudent(
                                  editingStudent === `${student.id}-${subject.id}` ? 
                                    null : 
                                    `${student.id}-${subject.id}`
                                )}
                              >
                                <FileEdit className="h-4 w-4 mr-2" />
                                {editingStudent === `${student.id}-${subject.id}` ? "Cancel" : "Edit"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      ))
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No students found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </Tabs>
    </DashboardLayout>
  );
}
