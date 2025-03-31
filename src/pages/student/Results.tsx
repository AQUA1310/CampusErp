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
import { Download } from "lucide-react";
import { SemesterResult, MinorResult } from "@/contexts/DataContext";

export default function Results() {
  const { user } = useAuth();
  const { finalResults, minorResults, subjects, downloadResult } = useData();
  const [examType, setExamType] = useState<"minor" | "endSem">("endSem");
  const [minorExamType, setMinorExamType] = useState<"Minor1" | "Minor2">("Minor1");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedSemester, setSelectedSemester] = useState<number>(1);

  const semesterData = {
    rollNumber: user?.rollNumber || '',
    name: user?.name || '',
    department: 'Mathematics',
    program: 'B.Tech',
    specialization: 'Applied Mathematics',
    academicYear: '2023-24'
  };

  const studentResults = finalResults.find(result => 
    (result.rollNumber === user?.rollNumber || result.studentId === user?.id) &&
    result.semester === selectedSemester
  );

  const filteredMinorResults = minorResults.filter(result => 
    result.examType === minorExamType && 
    (result.rollNumber === user?.rollNumber || result.studentId === user?.id) &&
    (selectedSubject === "all" ? true : result.subjectId === selectedSubject)
  );

  const normalizeMinorMarks = (result: MinorResult) => {
    const normalizedMax = 15;
    const normalizedObtained = (result.marks !== undefined) ? result.marks : 
      (result.obtainedMarks / result.maxMarks) * normalizedMax;
    return {
      ...result,
      maxMarks: normalizedMax,
      obtainedMarks: parseFloat(normalizedObtained.toFixed(2)),
    };
  };

  const handleDownloadResult = () => {
    if (user?.id) {
      downloadResult(user.id, selectedSemester);
    }
  };

  return (
    <DashboardLayout title="Academic Results" subtitle="View your semester and minor exam results">
      <div className="space-y-6">
        <Card className="shadow-md">
          <CardHeader className="bg-primary/5">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <CardTitle>Examination Results</CardTitle>
                <CardDescription>
                  View your academic performance details
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Select
                  value={examType}
                  onValueChange={(value) => setExamType(value as "minor" | "endSem")}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Exam Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="endSem">End Semester</SelectItem>
                    <SelectItem value="minor">Minor Exams</SelectItem>
                  </SelectContent>
                </Select>

                {examType === "endSem" && (
                  <Select
                    value={selectedSemester.toString()}
                    onValueChange={(value) => setSelectedSemester(parseInt(value))}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 8 }, (_, i) => i + 1).map((semester) => (
                        <SelectItem key={semester} value={semester.toString()}>
                          Semester {semester}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {examType === "minor" && (
                  <>
                    <Select
                      value={minorExamType}
                      onValueChange={(value) => setMinorExamType(value as "Minor1" | "Minor2")}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Minor" />
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
                        <SelectValue placeholder="All Subjects" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {examType === "endSem" ? (
              <div>
                {studentResults ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Name:</p>
                        <p className="font-medium">{studentResults.studentName}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Department:</p>
                        <p className="font-medium">{studentResults.department}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Roll No.:</p>
                        <p className="font-medium">{studentResults.rollNumber}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Year & Semester:</p>
                        <p className="font-medium">
                          {studentResults.year} - Year, {studentResults.semester === 1 ? "Odd" : "Even"} Semester
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Specialization:</p>
                        <p className="font-medium">{studentResults.specialization}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Exam Session:</p>
                        <p className="font-medium">{studentResults.academicYear}</p>
                      </div>
                    </div>

                    <div className="rounded-md border">
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
                          {studentResults.results.map((result, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{result.subjectCode}</TableCell>
                              <TableCell>{result.subjectName}</TableCell>
                              <TableCell className="text-center">{result.credit}</TableCell>
                              <TableCell className="text-center">
                                {result.grade ? (
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
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableCaption>
                          <div className="text-right space-y-1 pt-4 border-t">
                            <p className="font-semibold">SGPA: {studentResults.sgpa || '-'}</p>
                            <p className="font-semibold">CGPA: {studentResults.cgpa}</p>
                            <p className="text-xs text-muted-foreground mt-4">
                              The above result is only for display in the student portal but not equivalent to gradesheet.
                              <br />
                              The gradesheet will be sent to the Departments within two months from the date of declaration of results.
                            </p>
                          </div>
                        </TableCaption>
                      </Table>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        className="bg-primary text-white"
                        onClick={handleDownloadResult}
                      >
                        <Download className="mr-2 h-4 w-4" /> Download Result PDF
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {selectedSemester === 1 ? 
                        "No end semester results available at this time." : 
                        "Currently no data available for Semester " + selectedSemester}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-primary/5">
                        <TableHead className="w-[150px]">Subject Code</TableHead>
                        <TableHead>Subject Name</TableHead>
                        <TableHead className="text-center">Max Marks</TableHead>
                        <TableHead className="text-center">Obtained Marks</TableHead>
                        <TableHead className="text-center">Percentage</TableHead>
                        <TableHead className="text-center">Exam Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMinorResults.length > 0 ? (
                        filteredMinorResults.map((result, index) => {
                          const normalizedResult = normalizeMinorMarks(result);
                          return (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{result.subjectCode}</TableCell>
                              <TableCell>{result.subjectName}</TableCell>
                              <TableCell className="text-center">{normalizedResult.maxMarks}</TableCell>
                              <TableCell className="text-center">{normalizedResult.obtainedMarks}</TableCell>
                              <TableCell className="text-center">
                                <span className={`px-2 py-1 rounded-md text-white ${
                                  (normalizedResult.obtainedMarks/normalizedResult.maxMarks*100) >= 90 ? 'bg-green-600' :
                                  (normalizedResult.obtainedMarks/normalizedResult.maxMarks*100) >= 80 ? 'bg-blue-600' :
                                  (normalizedResult.obtainedMarks/normalizedResult.maxMarks*100) >= 70 ? 'bg-yellow-600' :
                                  (normalizedResult.obtainedMarks/normalizedResult.maxMarks*100) >= 60 ? 'bg-orange-600' :
                                  'bg-red-600'
                                }`}>
                                  {((normalizedResult.obtainedMarks / normalizedResult.maxMarks) * 100).toFixed(2)}%
                                </span>
                              </TableCell>
                              <TableCell className="text-center">{new Date(result.examDate).toLocaleDateString()}</TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4">
                            No minor exam results found for the selected criteria.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
