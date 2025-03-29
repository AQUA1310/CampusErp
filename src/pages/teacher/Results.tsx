
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
}

export default function TeacherResults() {
  const { subjects, minorResults } = useData();
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  const filteredMinorResults = selectedSubject === "all"
    ? minorResults
    : minorResults.filter(result => result.subjectId === selectedSubject);

  return (
    <DashboardLayout title="Results" subtitle="View and manage student results">
      <div className="mb-6">
        <Select onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Subject" />
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
      </div>

      <Card className="shadow-md">
        <CardHeader className="bg-blue-50 border-b border-blue-100 rounded-t-lg">
          <CardTitle className="text-blue-900">Minor Results</CardTitle>
          <CardDescription className="text-slate-600">
            View student minor exam results
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-50/50">
                <TableHead>Roll Number</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMinorResults.length > 0 ? (
                filteredMinorResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>{result.rollNumber || "24MAB0A41"}</TableCell>
                    <TableCell>{result.studentName || "V Dhruv"}</TableCell>
                    <TableCell>{result.subjectName}</TableCell>
                    <TableCell>{result.obtainedMarks}/{result.maxMarks}</TableCell>
                    <TableCell>{new Date(result.examDate).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No minor results found for the selected subject.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
