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
import { Calendar } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import DashboardLayout from "@/components/shared/DashboardLayout";

export default function TeacherResults() {
  const { subjects, minorResults, finalResults } = useData();
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  const filteredMinorResults = selectedSubject === "all"
    ? minorResults
    : minorResults.filter(result => result.subjectId === selectedSubject);

  const filteredFinalResults = selectedSubject === "all"
    ? finalResults
    : finalResults.filter(result => result.subjectId === selectedSubject);

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
        <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-lg">
          <CardTitle className="text-slate-800">Minor Results</CardTitle>
          <CardDescription className="text-slate-600">
            View student minor exam results
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead>Roll Number</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMinorResults.length > 0 ? (
                filteredMinorResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>
                      {('rollNumber' in result) ? result.rollNumber : 
                       ('studentId' in result) ? `Student ${result.studentId}` : 'Unknown'}
                    </TableCell>
                    <TableCell>{result.subjectName}</TableCell>
                    <TableCell>{result.marks}</TableCell>
                    <TableCell>{new Date(result.examDate).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    No minor results found for the selected subject.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="shadow-md mt-8">
        <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-lg">
          <CardTitle className="text-slate-800">Final Results</CardTitle>
          <CardDescription className="text-slate-600">
            View student final exam results
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead>Roll Number</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFinalResults.length > 0 ? (
                filteredFinalResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>
                      {('rollNumber' in result) ? result.rollNumber : 
                       ('studentId' in result) ? `Student ${result.studentId}` : 'Unknown'}
                    </TableCell>
                    <TableCell>{result.subjectName}</TableCell>
                    <TableCell>{result.marks}</TableCell>
                    <TableCell>{new Date(result.examDate).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    No final results found for the selected subject.
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
