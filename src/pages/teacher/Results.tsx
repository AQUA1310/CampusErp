import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { 
  useData, 
  Student, 
  Subject, 
  MinorResult as DataContextMinorResult,
  SemesterGrade as DataContextSemesterGrade
} from "@/contexts/DataContext";
import DashboardLayout from "@/components/shared/DashboardLayout";

interface MinorResultForm {
  subjectId: string;
  studentId: string;
  examType: "Minor1" | "Minor2";
  maxMarks: number;
  obtainedMarks: number;
  examDate: string;
}

interface SemesterGradeForm {
  subjectId: string;
  studentId: string;
  grade: string;
  semester: number;
}

export default function TeacherResults() {
  const { students, subjects, minorResults, semesterGrades, setMinorResults, setSemesterGrades } = useData();
  const [activeTab, setActiveTab] = useState("view");
  const [minorForm, setMinorForm] = useState<MinorResultForm>({
    subjectId: "",
    studentId: "",
    examType: "Minor1",
    maxMarks: 30,
    obtainedMarks: 0,
    examDate: ""
  });
  const [gradeForm, setGradeForm] = useState<SemesterGradeForm>({
    subjectId: "",
    studentId: "",
    grade: "",
    semester: 0
  });

  const handleMinorFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMinorForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleGradeFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGradeForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleMinorFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!minorForm.subjectId || !minorForm.studentId || !minorForm.examDate || minorForm.obtainedMarks < 0) {
      toast.error("Please fill all required fields with valid values");
      return;
    }
    
    const student = students.find(s => s.id === minorForm.studentId);
    const subject = subjects.find(s => s.id === minorForm.subjectId);
    
    if (!student || !subject) {
      toast.error("Invalid student or subject");
      return;
    }
    
    const newResult: DataContextMinorResult = {
      id: `m-${Date.now().toString()}`,
      subjectId: minorForm.subjectId,
      subjectCode: subject.code,
      subjectName: subject.name,
      maxMarks: minorForm.maxMarks,
      obtainedMarks: minorForm.obtainedMarks,
      examDate: minorForm.examDate,
      examType: minorForm.examType as "Minor1" | "Minor2",
      studentId: student.id,
      rollNumber: student.rollNumber,
      studentName: student.name,
      percentage: (minorForm.obtainedMarks / minorForm.maxMarks) * 100
    };
    
    // Check if the result already exists
    const existingResultIndex = minorResults.findIndex(
      r => r.studentId === newResult.studentId && 
      r.subjectId === newResult.subjectId && 
      r.examType === newResult.examType
    );
    
    if (existingResultIndex !== -1) {
      // Update existing result
      const updatedResults = [...minorResults];
      updatedResults[existingResultIndex] = newResult;
      setMinorResults(updatedResults);
      toast.success("Minor result updated successfully");
    } else {
      // Add new result
      setMinorResults([...minorResults, newResult]);
      toast.success("Minor result added successfully");
    }
    
    // Reset form
    setMinorForm({
      subjectId: "",
      studentId: "",
      examType: "Minor1",
      maxMarks: 30,
      obtainedMarks: 0,
      examDate: ""
    });
    
    setActiveTab("view");
  };

  const handleGradeFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!gradeForm.subjectId || !gradeForm.studentId || !gradeForm.grade || gradeForm.semester <= 0) {
      toast.error("Please fill all required fields with valid values");
      return;
    }
    
    const student = students.find(s => s.id === gradeForm.studentId);
    const subject = subjects.find(s => s.id === gradeForm.subjectId);
    
    if (!student || !subject) {
      toast.error("Invalid student or subject");
      return;
    }
    
    const newGrade: DataContextSemesterGrade = {
      id: `sg-${Date.now().toString()}`,
      studentId: student.id,
      studentName: student.name,
      rollNumber: student.rollNumber,
      subjectId: subject.id,
      subjectName: subject.name,
      subjectCode: subject.code,
      grade: gradeForm.grade,
      credit: parseInt(subject.credits.split(" ")[1]), // Fix type issue by explicitly parsing to number
      semester: gradeForm.semester
    };
    
    // Check if the grade already exists
    const existingGradeIndex = semesterGrades.findIndex(
      g => g.studentId === newGrade.studentId && 
      g.subjectId === newGrade.subjectId && 
      g.semester === newGrade.semester
    );
    
    if (existingGradeIndex !== -1) {
      // Update existing grade
      const updatedGrades = [...semesterGrades];
      updatedGrades[existingGradeIndex] = newGrade;
      setSemesterGrades(updatedGrades);
      toast.success("Grade updated successfully");
    } else {
      // Add new grade
      setSemesterGrades([...semesterGrades, newGrade]);
      toast.success("Grade added successfully");
    }
    
    // Reset form
    setGradeForm({
      subjectId: "",
      studentId: "",
      grade: "",
      semester: 0
    });
    
    setActiveTab("view");
  };

  const getSubjectsForSemester = (semesterNumber: number) => {
    return subjects.filter(subject => subject.semester === semesterNumber);
  };

  return (
    <DashboardLayout title="Results" subtitle="Manage and view student results">
      <Card className="shadow-md">
        <CardHeader className="bg-navy-50 border-b border-navy-100 rounded-t-lg">
          <CardTitle className="text-navy-800">Results Management</CardTitle>
          <CardDescription className="text-navy-600">
            Manage minor results and semester grades for students
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="view">View Results</TabsTrigger>
              <TabsTrigger value="addMinor">Add Minor Result</TabsTrigger>
              <TabsTrigger value="addGrade">Add Semester Grade</TabsTrigger>
            </TabsList>
            
            <TabsContent value="view" className="mt-4">
              <h3 className="text-lg font-medium text-navy-900 mb-4">
                Existing Results
              </h3>
              
              {/* Minor Results Table */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-navy-700 mb-2">
                  Minor Results
                </h4>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Exam Type</TableHead>
                        <TableHead>Marks Obtained</TableHead>
                        <TableHead>Max Marks</TableHead>
                        <TableHead>Exam Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {minorResults.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell>{result.studentName}</TableCell>
                          <TableCell>{result.subjectName}</TableCell>
                          <TableCell>{result.examType}</TableCell>
                          <TableCell>{result.obtainedMarks}</TableCell>
                          <TableCell>{result.maxMarks}</TableCell>
                          <TableCell>{new Date(result.examDate).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              {/* Semester Grades Table */}
              <div>
                <h4 className="text-md font-medium text-navy-700 mb-2">
                  Semester Grades
                </h4>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Semester</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {semesterGrades.map((grade) => (
                        <TableRow key={grade.id}>
                          <TableCell>{grade.studentName}</TableCell>
                          <TableCell>{grade.subjectName}</TableCell>
                          <TableCell>{grade.grade}</TableCell>
                          <TableCell>{grade.semester}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="addMinor" className="mt-4">
              <h3 className="text-lg font-medium text-navy-900 mb-4">
                Add Minor Result
              </h3>
              
              <form onSubmit={handleMinorFormSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="studentId">Student</Label>
                  <Select onValueChange={(value) => setMinorForm(prevState => ({ ...prevState, studentId: value }))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>{student.name} ({student.rollNumber})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="subjectId">Subject</Label>
                  <Select onValueChange={(value) => setMinorForm(prevState => ({ ...prevState, subjectId: value }))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>{subject.name} ({subject.code})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="examType">Exam Type</Label>
                  <Select onValueChange={(value) => setMinorForm(prevState => ({ ...prevState, examType: value as "Minor1" | "Minor2" }))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select exam type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Minor1">Minor 1</SelectItem>
                      <SelectItem value="Minor2">Minor 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="maxMarks">Max Marks</Label>
                  <Input 
                    type="number" 
                    name="maxMarks" 
                    id="maxMarks" 
                    value={minorForm.maxMarks.toString()}
                    onChange={handleMinorFormChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="obtainedMarks">Obtained Marks</Label>
                  <Input 
                    type="number" 
                    name="obtainedMarks" 
                    id="obtainedMarks" 
                    value={minorForm.obtainedMarks.toString()}
                    onChange={handleMinorFormChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="examDate">Exam Date</Label>
                  <Input 
                    type="date" 
                    name="examDate" 
                    id="examDate" 
                    value={minorForm.examDate}
                    onChange={handleMinorFormChange}
                  />
                </div>
                
                <Button type="submit">Add Minor Result</Button>
              </form>
            </TabsContent>
            
            <TabsContent value="addGrade" className="mt-4">
              <h3 className="text-lg font-medium text-navy-900 mb-4">
                Add Semester Grade
              </h3>
              
              <form onSubmit={handleGradeFormSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="studentId">Student</Label>
                  <Select onValueChange={(value) => setGradeForm(prevState => ({ ...prevState, studentId: value }))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>{student.name} ({student.rollNumber})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="subjectId">Subject</Label>
                  <Select onValueChange={(value) => setGradeForm(prevState => ({ ...prevState, subjectId: value }))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>{subject.name} ({subject.code})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="grade">Grade</Label>
                  <Select onValueChange={(value) => setGradeForm(prevState => ({ ...prevState, grade: value }))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a grade" />
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
                </div>
                
                <div>
                  <Label htmlFor="semester">Semester</Label>
                  <Input 
                    type="number" 
                    name="semester" 
                    id="semester" 
                    value={gradeForm.semester.toString()}
                    onChange={handleGradeFormChange}
                  />
                </div>
                
                <Button type="submit">Add Semester Grade</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
