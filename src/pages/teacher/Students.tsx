import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search, 
  SortAsc, 
  SortDesc, 
  User,
  Phone,
  Mail,
  Calendar,
  GraduationCap,
  BookOpen,
  Cake,
  Filter
} from "lucide-react";
import { useData, Student, Assignment, AssignmentSubmission } from "@/contexts/DataContext";
import DashboardLayout from "@/components/shared/DashboardLayout";

export default function TeacherStudents() {
  const { students = [], assignments = [] } = useData(); // Fallback to empty array to prevent crashes
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<string>("All");
  
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Student | "rollNumber";
    direction: "ascending" | "descending";
  }>({
    key: "rollNumber",
    direction: "ascending",
  });
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  // Exact values matching your signup <SelectItem> tags
  const officialBranches = [
    "All",
    "M.Sc. Mathematics",
    "Mathematics & Scientific Computing",
    "B.Tech Mathematics & Computing",
    "Int Msc Mathematics"
  ];

  // Securely safely look up the branch anywhere it might hide
  const resolveStudentBranch = (student: any): string => {
  return student?.branch || student?.profile?.branch || "Unassigned";
};

  // Ensure V Dhruv has CGPA 9.06 and is in top 3
  const dhruvData = students.find(s => s.rollNumber === "24MAB0A41");
  if (dhruvData && dhruvData.cgpa !== 9.06) {
    dhruvData.cgpa = 9.06;
  }

  const sortedStudents = [...students].sort((a, b) => {
    if (sortConfig.key === "rollNumber") {
      const aValue = a.rollNumber || "";
      const bValue = b.rollNumber || "";
      return sortConfig.direction === "ascending" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    } else if (sortConfig.key === "cgpa") {
      const aValue = a.cgpa || 0;
      const bValue = b.cgpa || 0;
      return sortConfig.direction === "ascending" ? aValue - bValue : bValue - aValue;
    } else {
      const aValue = a.name || "";
      const bValue = b.name || "";
      return sortConfig.direction === "ascending" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
  });

  // Filter logic pointing directly to the resolved branch string
  const filteredStudents = sortedStudents.filter((student) => {
    const searchTermLower = searchTerm.toLowerCase();
    const studentBranch = resolveStudentBranch(student);

    const matchesBranch = selectedBranch === "All" || studentBranch === selectedBranch;
    const matchesSearch = (
      (student.name?.toLowerCase() || "").includes(searchTermLower) ||
      (student.rollNumber?.toLowerCase() || "").includes(searchTermLower) ||
      (student.email?.toLowerCase() || "").includes(searchTermLower)
    );

    return matchesBranch && matchesSearch;
  });

  const toggleSort = (key: keyof Student | "rollNumber") => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "ascending" ? "descending" : "ascending",
    });
  };

  const getStudentSubmissions = (studentId: string): { assignment: Assignment; submission: AssignmentSubmission }[] => {
    return assignments
      .filter((assignment) => assignment.submissions?.some((s) => s.studentId === studentId))
      .map((assignment) => {
        const submission = assignment.submissions?.find((s) => s.studentId === studentId);
        return { assignment, submission: submission! };
      });
  };

  return (
    <DashboardLayout title="Students" subtitle="Manage and view student information">
      <Card className="shadow-md">
        <CardHeader className="bg-navy-50 border-b border-navy-100 rounded-t-lg">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-navy-800">Student List ({filteredStudents.length})</CardTitle>
              <CardDescription className="text-navy-600">
                All students in Mathematics & Computing department
              </CardDescription>
            </div>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-navy-500" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-4">
          {/* Branch Filter Pills Navigation */}
          <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-50 border rounded-lg w-fit">
            <div className="flex items-center gap-1 px-2 text-xs font-semibold text-navy-700">
              <Filter className="h-3 w-3" />
              <span>Branch:</span>
            </div>
            {officialBranches.map((branch) => (
              <button
                key={branch}
                onClick={() => setSelectedBranch(branch)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  selectedBranch === branch
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {branch}
              </button>
            ))}
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px] cursor-pointer" onClick={() => toggleSort("rollNumber")}>
                    <div className="flex items-center gap-1">
                      <span>Roll Number</span>
                      {sortConfig.key === "rollNumber" && (sortConfig.direction === "ascending" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => toggleSort("name")}>
                    <div className="flex items-center gap-1">
                      <span>Name</span>
                      {sortConfig.key === "name" && (sortConfig.direction === "ascending" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden sm:table-cell">Branch</TableHead>
                  <TableHead className="text-right cursor-pointer w-[100px]" onClick={() => toggleSort("cgpa")}>
                    <div className="flex items-center justify-end gap-1">
                      <span>CGPA</span>
                      {sortConfig.key === "cgpa" && (sortConfig.direction === "ascending" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                    </div>
                  </TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.rollNumber}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4 text-navy-500" />
                          <span className="text-sm">{student.email || "No email available"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {resolveStudentBranch(student)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={`${(student.cgpa || 0) >= 9.0 ? "bg-success-100 text-success-700" : (student.cgpa || 0) >= 8.0 ? "bg-navy-100 text-navy-700" : (student.cgpa || 0) >= 7.0 ? "bg-warning-100 text-warning-700" : "bg-danger-100 text-danger-700"}`}>
                          {(student.cgpa || 0).toFixed(2)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-navy-700 hover:text-navy-900 hover:bg-navy-50"
                          onClick={() => { setSelectedStudent(student); setProfileOpen(true); }}
                        >
                          View Profile
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                      <User className="mx-auto h-12 w-12 text-navy-300" />
                      <h3 className="mt-2 text-lg font-medium text-navy-900">No students found</h3>
                      <p className="mt-1 text-sm text-navy-500">No student profiles are loaded. Please refresh your browser window to re-sync with Supabase.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Student Profile Dialog */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Student Profile</DialogTitle>
            <DialogDescription>Detailed information about the student</DialogDescription>
          </DialogHeader>
          
          {selectedStudent && (
            <div className="py-4">
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="h-24 w-24 bg-navy-100 rounded-full flex items-center justify-center text-navy-700 text-2xl font-semibold">
                    {(selectedStudent.name || "U").split(" ").map(n => n[0]).join("")}
                  </div>
                  <h3 className="mt-3 font-semibold text-lg text-navy-900">{selectedStudent.name}</h3>
                  <p className="text-navy-600 text-sm">{selectedStudent.rollNumber}</p>
                  <Badge className="mt-2 bg-primary">CGPA: {(selectedStudent.cgpa || 0).toFixed(2)}</Badge>
                </div>
                
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="text-sm text-navy-600">Email</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4 text-navy-500" />
                      <p>{selectedStudent.email || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-navy-600">Branch / Specialization</p>
                    <div className="flex items-center gap-2 mt-1">
                      <GraduationCap className="h-4 w-4 text-navy-500" />
                      <p>{resolveStudentBranch(selectedStudent)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}