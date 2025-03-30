
import { useState } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/hooks/useAuth";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download,
  Save,
  GraduationCap,
  FileDigit,
  Check
} from "lucide-react";
import { ExamResult, MinorResult } from "@/contexts/DataContext";

export default function TeacherResults() {
  const { students, subjects, finalResults, minorResults, submitGrades, submitMinorMarks } = useData();
  const [markType, setMarkType] = useState<"minor" | "endSem">("minor");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<number>(2);
  const [minorExamType, setMinorExamType] = useState<"Minor1" | "Minor2">("Minor1");
  const [minorMarks, setMinorMarks] = useState<number | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Get student based on selection
  const student = students.find(s => s.id === selectedStudent);
  
  // Find result for selected student and semester
  const studentResult = finalResults.find(result => 
    result.studentId === selectedStudent && 
    result.semester === selectedSemester
  );
  
  // Get current subject for minor exam
  const subject = subjects.find(s => s.id === selectedSubject);
  
  // Get existing minor result if available
  const existingMinorResult = minorResults.find(r => 
    r.studentId === selectedStudent && 
    r.subjectId === selectedSubject && 
    r.examType === minorExamType
  );
  
  // Track grades for end semester results
  const [grades, setGrades] = useState<Record<string, string>>({});
  
  // Initialize grades from existing results
  useState(() => {
    if (studentResult) {
      const initialGrades: Record<string, string> = {};
      studentResult.results.forEach(result => {
        initialGrades[result.subjectCode] = result.grade;
      });
      setGrades(initialGrades);
    }
  });
  
  // Handle grade change
  const handleGradeChange = (subjectCode: string, grade: string) => {
    setGrades(prev => ({
      ...prev,
      [subjectCode]: grade
    }));
  };
  
  // Handle submit grades
  const handleSubmitGrades = () => {
    if (!student || !studentResult) return;
    
    const updatedResults: ExamResult[] = studentResult.results.map(result => ({
      ...result,
      grade: grades[result.subjectCode] || result.grade
    }));
    
    submitGrades(student.id, selectedSemester, updatedResults);
    setSuccessMessage("Grades submitted successfully!");
    
    // Clear success message after a delay
    setTimeout(() => setSuccessMessage(null), 3000);
  };
  
  // Handle submit minor marks
  const handleSubmitMinorMarks = () => {
    if (!student || !subject || minorMarks === undefined) return;
    
    const minorResult: Omit<MinorResult, "id"> = {
      studentId: student.id,
      rollNumber: student.rollNumber,
      studentName: student.name,
      subjectId: subject.id,
      subjectCode: subject.code,
      subjectName: subject.name,
      maxMarks: 30, // assuming max marks is 30
      obtainedMarks: minorMarks * 2, // converting from 15 to 30 for storage
      examDate: new Date().toISOString(),
      examType: minorExamType,
      marks: minorMarks
    };
    
    submitMinorMarks(minorResult);
    setSuccessMessage(`${minorExamType} marks submitted successfully!`);
    setMinorMarks(undefined);
    
    // Clear success message after a delay
    setTimeout(() => setSuccessMessage(null), 3000);
  };
  
  // Available grades
  const gradeOptions = ["S", "A", "B", "C", "D", "E", "F", "P"];

  return (
    <DashboardLayout title="Mark Entry" subtitle="Enter student marks and grades">
      <Tabs defaultValue="minor" onValueChange={(value) => setMarkType(value as "minor" | "endSem")}>
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="minor" className="flex items-center gap-2">
            <FileDigit className="h-4 w-4" />
            Minor Marks
          </TabsTrigger>
          <TabsTrigger value="endSem" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            End Semester Grades
          </TabsTrigger>
        </TabsList>

        {/* Minor Marks Entry Tab */}
        <TabsContent value="minor">
          <Card className="shadow-md">
            <CardHeader className="bg-primary/5">
              <CardTitle>Minor Examination Marks Entry</CardTitle>
              <CardDescription>
                Enter marks for Minor 1 and Minor 2 examinations (out of 15)
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student">Select Student</Label>
                  <Select
                    value={selectedStudent}
                    onValueChange={setSelectedStudent}
                  >
                    <SelectTrigger id="student">
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.rollNumber} - {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Select Subject</Label>
                  <Select
                    value={selectedSubject}
                    onValueChange={setSelectedSubject}
                  >
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.code} - {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minorType">Exam Type</Label>
                  <Select
                    value={minorExamType}
                    onValueChange={(value) => setMinorExamType(value as "Minor1" | "Minor2")}
                  >
                    <SelectTrigger id="minorType">
                      <SelectValue placeholder="Select exam type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Minor1">Minor 1</SelectItem>
                      <SelectItem value="Minor2">Minor 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border rounded-md p-4 bg-muted/10">
                {selectedStudent && selectedSubject ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Student:</p>
                        <p className="font-medium">{student?.name} ({student?.rollNumber})</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Subject:</p>
                        <p className="font-medium">{subject?.name} ({subject?.code})</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="marks">Marks (out of 15)</Label>
                      <div className="flex gap-4 items-end">
                        <div className="flex-1">
                          <Input
                            id="marks"
                            type="number"
                            min="0"
                            max="15"
                            step="0.5"
                            placeholder="Enter marks"
                            value={minorMarks !== undefined ? minorMarks : existingMinorResult?.marks || ''}
                            onChange={(e) => {
                              const value = e.target.value ? parseFloat(e.target.value) : undefined;
                              setMinorMarks(value);
                            }}
                          />
                        </div>
                        <div className="flex-none">
                          <Button 
                            onClick={handleSubmitMinorMarks}
                            disabled={minorMarks === undefined}
                            className="bg-primary"
                          >
                            <Save className="mr-2 h-4 w-4" />
                            Save Marks
                          </Button>
                        </div>
                      </div>
                      {existingMinorResult && (
                        <p className="text-sm text-blue-600">
                          Current saved marks: {existingMinorResult.marks || 
                          (existingMinorResult.obtainedMarks / existingMinorResult.maxMarks * 15).toFixed(1)}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-center py-4 text-muted-foreground">
                    Please select a student and subject to enter marks
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* End Semester Grades Entry Tab */}
        <TabsContent value="endSem">
          <Card className="shadow-md">
            <CardHeader className="bg-primary/5">
              <CardTitle>End Semester Grade Entry</CardTitle>
              <CardDescription>
                Enter grades for end semester examination
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentEndSem">Select Student</Label>
                  <Select
                    value={selectedStudent}
                    onValueChange={setSelectedStudent}
                  >
                    <SelectTrigger id="studentEndSem">
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.rollNumber} - {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="semester">Select Semester</Label>
                  <Select
                    value={selectedSemester.toString()}
                    onValueChange={(value) => setSelectedSemester(parseInt(value))}
                  >
                    <SelectTrigger id="semester">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 8 }, (_, i) => i + 1).map((semester) => (
                        <SelectItem 
                          key={semester} 
                          value={semester.toString()}
                          disabled={semester === 1} // Disable semester 1 as it's already done
                        >
                          Semester {semester} {semester === 1 ? "(Completed)" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedStudent && studentResult ? (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-primary/5">
                        <TableHead className="w-[150px]">Subject Code</TableHead>
                        <TableHead>Subject Name</TableHead>
                        <TableHead className="text-center">Credit</TableHead>
                        <TableHead className="text-center">Grade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentResult.results.map((result, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{result.subjectCode}</TableCell>
                          <TableCell>{result.subjectName}</TableCell>
                          <TableCell className="text-center">{result.credit}</TableCell>
                          <TableCell>
                            <div className="flex justify-center">
                              {selectedSemester === 1 ? (
                                <span className={`px-2 py-1 rounded-md text-white ${
                                  result.grade === 'S' ? 'bg-indigo-600' :
                                  result.grade === 'A' ? 'bg-green-600' :
                                  result.grade === 'B' ? 'bg-blue-600' :
                                  result.grade === 'C' ? 'bg-yellow-600' :
                                  result.grade === 'D' ? 'bg-orange-600' :
                                  result.grade === 'E' ? 'bg-red-600' :
                                  result.grade === 'P' ? 'bg-gray-600' : 'bg-gray-500'
                                }`}>
                                  {result.grade}
                                </span>
                              ) : (
                                <Select
                                  value={grades[result.subjectCode] || ""}
                                  onValueChange={(value) => handleGradeChange(result.subjectCode, value)}
                                >
                                  <SelectTrigger className="w-[100px]">
                                    <SelectValue placeholder="Grade" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {gradeOptions.map((grade) => (
                                      <SelectItem key={grade} value={grade}>
                                        {grade}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {selectedSemester !== 1 && (
                    <div className="p-4 bg-muted/10 border-t flex justify-end">
                      <Button 
                        onClick={handleSubmitGrades}
                        className="bg-primary"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Submit Grades
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 border rounded-md">
                  <p className="text-muted-foreground">
                    {!selectedStudent 
                      ? "Please select a student to view and enter grades" 
                      : "No results available for the selected student and semester"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Success Message */}
      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded shadow-md flex items-center">
          <Check className="h-5 w-5 mr-2" />
          {successMessage}
        </div>
      )}
    </DashboardLayout>
  );
}
