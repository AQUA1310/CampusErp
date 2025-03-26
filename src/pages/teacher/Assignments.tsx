
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
import { 
  Badge,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Download, 
  Upload, 
  FileUp, 
  Clock, 
  Calendar, 
  FileText,
  Plus
} from "lucide-react";
import { useData, Assignment, AssignmentSubmission } from "@/contexts/DataContext";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { toast } from "sonner";

export default function TeacherAssignments() {
  const { assignments, subjects, students, gradeSubmission, addAssignment } = useData();
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [marks, setMarks] = useState<number>(0);
  const [feedback, setFeedback] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    subjectId: subjects[0]?.id || "",
    dueDate: "",
    maxMarks: 10,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleGradeSubmit = () => {
    if (!selectedSubmission) return;
    
    gradeSubmission(selectedSubmission.id, marks, feedback);
    setGradeDialogOpen(false);
    setSelectedSubmission(null);
    setMarks(0);
    setFeedback("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAssignmentCreate = () => {
    if (!newAssignment.title || !newAssignment.subjectId || !newAssignment.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    // Create a fake URL for the file
    const fileUrl = URL.createObjectURL(selectedFile);
    
    const subject = subjects.find((s) => s.id === newAssignment.subjectId);
    
    addAssignment({
      title: newAssignment.title,
      description: newAssignment.description,
      subjectId: newAssignment.subjectId,
      subjectName: subject?.name || "",
      dueDate: newAssignment.dueDate,
      maxMarks: newAssignment.maxMarks,
      fileUrl,
      createdBy: "1",
    });
    
    setCreateDialogOpen(false);
    setNewAssignment({
      title: "",
      description: "",
      subjectId: subjects[0]?.id || "",
      dueDate: "",
      maxMarks: 10,
    });
    setSelectedFile(null);
  };

  const handleDownload = (url: string) => {
    // In a real app, this would download the file
    window.open(url, "_blank");
    toast.success("File download started");
  };

  const handleSubmissionView = (submission: AssignmentSubmission, assignment: Assignment) => {
    setSelectedSubmission(submission);
    setSelectedAssignment(assignment);
    setMarks(submission.marks || 0);
    setFeedback(submission.feedback || "");
    setGradeDialogOpen(true);
  };

  const getPendingSubmissions = () => {
    return assignments
      .filter((a) => a.submissions && a.submissions.length > 0)
      .map((assignment) => {
        return {
          assignment,
          pendingSubmissions: assignment.submissions?.filter((s) => s.marks === undefined) || [],
        };
      })
      .filter((item) => item.pendingSubmissions.length > 0);
  };

  const getGradedSubmissions = () => {
    return assignments
      .filter((a) => a.submissions && a.submissions.length > 0)
      .map((assignment) => {
        return {
          assignment,
          gradedSubmissions: assignment.submissions?.filter((s) => s.marks !== undefined) || [],
        };
      })
      .filter((item) => item.gradedSubmissions.length > 0);
  };

  return (
    <DashboardLayout title="Assignments" subtitle="Manage student assignments">
      <div className="flex justify-end mb-6">
        <Button 
          className="flex items-center gap-2 bg-oliveGreen-600 hover:bg-oliveGreen-700"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Create Assignment</span>
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-oliveGreen-100 data-[state=active]:text-oliveGreen-900"
          >
            All Assignments
          </TabsTrigger>
          <TabsTrigger 
            value="pending" 
            className="data-[state=active]:bg-oliveGreen-100 data-[state=active]:text-oliveGreen-900"
          >
            Pending Review
          </TabsTrigger>
          <TabsTrigger 
            value="graded" 
            className="data-[state=active]:bg-oliveGreen-100 data-[state=active]:text-oliveGreen-900"
          >
            Graded
          </TabsTrigger>
        </TabsList>

        {/* All Assignments */}
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 gap-6">
            {assignments.length > 0 ? (
              assignments.map((assignment) => {
                const submissionCount = assignment.submissions?.length || 0;
                const pendingCount = assignment.submissions?.filter(s => s.marks === undefined).length || 0;
                const gradedCount = assignment.submissions?.filter(s => s.marks !== undefined).length || 0;
                
                return (
                  <Card key={assignment.id} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-oliveGreen-900">{assignment.title}</CardTitle>
                          <CardDescription className="text-oliveGreen-600">
                            {assignment.subjectName}
                          </CardDescription>
                        </div>
                        <Badge variant={
                          new Date(assignment.dueDate) < new Date() 
                            ? "destructive" 
                            : new Date(assignment.dueDate) < new Date(new Date().setDate(new Date().getDate() + 3))
                            ? "secondary"
                            : "outline"
                        }>
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-oliveGreen-600 mb-4">{assignment.description}</p>
                      
                      <div className="flex flex-wrap gap-3 text-sm text-oliveGreen-700 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Created: {new Date(assignment.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Max marks: {assignment.maxMarks}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div className="bg-oliveGreen-50 p-3 rounded-lg text-center">
                          <p className="text-xs text-oliveGreen-600">Total Students</p>
                          <p className="text-xl font-semibold text-oliveGreen-900">{students.length}</p>
                        </div>
                        <div className="bg-oliveGreen-50 p-3 rounded-lg text-center">
                          <p className="text-xs text-oliveGreen-600">Submissions</p>
                          <p className="text-xl font-semibold text-oliveGreen-900">
                            {submissionCount} 
                            <span className="text-sm text-oliveGreen-600 ml-1">
                              ({Math.round((submissionCount / students.length) * 100) || 0}%)
                            </span>
                          </p>
                        </div>
                        <div className="bg-oliveGreen-50 p-3 rounded-lg text-center">
                          <p className="text-xs text-oliveGreen-600">Pending Review</p>
                          <p className="text-xl font-semibold text-oliveGreen-900">{pendingCount}</p>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Student</TableHead>
                              <TableHead>Submitted</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {assignment.submissions && assignment.submissions.length > 0 ? (
                              assignment.submissions.map((submission) => (
                                <TableRow key={submission.id}>
                                  <TableCell className="font-medium">
                                    {submission.studentName} <span className="text-xs text-oliveGreen-500 ml-1">({submission.rollNumber})</span>
                                  </TableCell>
                                  <TableCell>{new Date(submission.submittedAt).toLocaleDateString()}</TableCell>
                                  <TableCell>
                                    {submission.marks !== undefined ? (
                                      <Badge className="bg-success-100 text-success-700 hover:bg-success-200">
                                        Graded: {submission.marks}/{assignment.maxMarks}
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline" className="bg-warning-100 text-warning-700 hover:bg-warning-200">
                                        Pending Review
                                      </Badge>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-oliveGreen-700 border-oliveGreen-200"
                                        onClick={() => handleDownload(submission.fileUrl)}
                                      >
                                        <Download className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        className="bg-oliveGreen-600 hover:bg-oliveGreen-700"
                                        onClick={() => handleSubmissionView(submission, assignment)}
                                      >
                                        {submission.marks !== undefined ? "View" : "Grade"}
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                                  No submissions yet
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-oliveGreen-700 border-oliveGreen-200"
                          onClick={() => handleDownload(assignment.fileUrl || "")}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          <span>Download Assignment</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-oliveGreen-300" />
                <h3 className="mt-4 text-lg font-medium text-oliveGreen-900">No Assignments</h3>
                <p className="mt-2 text-oliveGreen-600">
                  You haven't created any assignments yet
                </p>
                <Button 
                  className="mt-4 bg-oliveGreen-600 hover:bg-oliveGreen-700"
                  onClick={() => setCreateDialogOpen(true)}
                >
                  Create Assignment
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Pending Review */}
        <TabsContent value="pending" className="mt-0">
          <div className="grid grid-cols-1 gap-6">
            {getPendingSubmissions().length > 0 ? (
              getPendingSubmissions().map(({assignment, pendingSubmissions}) => (
                <Card key={assignment.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-oliveGreen-900">{assignment.title}</CardTitle>
                        <CardDescription className="text-oliveGreen-600">
                          {assignment.subjectName}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">
                        {pendingSubmissions.length} pending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Submitted</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pendingSubmissions.map((submission) => (
                            <TableRow key={submission.id}>
                              <TableCell className="font-medium">
                                {submission.studentName} <span className="text-xs text-oliveGreen-500 ml-1">({submission.rollNumber})</span>
                              </TableCell>
                              <TableCell>{new Date(submission.submittedAt).toLocaleDateString()}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-oliveGreen-700 border-oliveGreen-200"
                                    onClick={() => handleDownload(submission.fileUrl)}
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="bg-oliveGreen-600 hover:bg-oliveGreen-700"
                                    onClick={() => handleSubmissionView(submission, assignment)}
                                  >
                                    Grade
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <FileUp className="mx-auto h-12 w-12 text-oliveGreen-300" />
                <h3 className="mt-4 text-lg font-medium text-oliveGreen-900">No Pending Submissions</h3>
                <p className="mt-2 text-oliveGreen-600">
                  All submissions have been graded
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Graded */}
        <TabsContent value="graded" className="mt-0">
          <div className="grid grid-cols-1 gap-6">
            {getGradedSubmissions().length > 0 ? (
              getGradedSubmissions().map(({assignment, gradedSubmissions}) => (
                <Card key={assignment.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-oliveGreen-900">{assignment.title}</CardTitle>
                        <CardDescription className="text-oliveGreen-600">
                          {assignment.subjectName}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-success-100 text-success-700">
                        {gradedSubmissions.length} graded
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Submitted</TableHead>
                            <TableHead>Marks</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {gradedSubmissions.map((submission) => (
                            <TableRow key={submission.id}>
                              <TableCell className="font-medium">
                                {submission.studentName} <span className="text-xs text-oliveGreen-500 ml-1">({submission.rollNumber})</span>
                              </TableCell>
                              <TableCell>{new Date(submission.submittedAt).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Badge className={`
                                  ${(submission.marks || 0) >= (assignment.maxMarks * 0.7)
                                    ? "bg-success-100 text-success-700" 
                                    : (submission.marks || 0) >= (assignment.maxMarks * 0.4)
                                    ? "bg-warning-100 text-warning-700"
                                    : "bg-danger-100 text-danger-700"
                                  }
                                `}>
                                  {submission.marks}/{assignment.maxMarks}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-oliveGreen-700 border-oliveGreen-200"
                                    onClick={() => handleDownload(submission.fileUrl)}
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="bg-oliveGreen-600 hover:bg-oliveGreen-700"
                                    onClick={() => handleSubmissionView(submission, assignment)}
                                  >
                                    View
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-oliveGreen-300" />
                <h3 className="mt-4 text-lg font-medium text-oliveGreen-900">No Graded Submissions</h3>
                <p className="mt-2 text-oliveGreen-600">
                  No submissions have been graded yet
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Grade Submission Dialog */}
      <Dialog open={gradeDialogOpen} onOpenChange={setGradeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedSubmission?.marks !== undefined ? "View Submission" : "Grade Submission"}
            </DialogTitle>
            <DialogDescription>
              {selectedSubmission?.marks !== undefined 
                ? "Review the graded submission" 
                : "Grade the student's submission"
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Assignment</p>
              <p>{selectedAssignment?.title}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Student</p>
              <p>{selectedSubmission?.studentName} ({selectedSubmission?.rollNumber})</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Submitted on</p>
              <p>{selectedSubmission && new Date(selectedSubmission.submittedAt).toLocaleString()}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="marks" className="text-sm font-medium leading-none">
                  Marks (out of {selectedAssignment?.maxMarks})
                </label>
                {selectedSubmission?.marks !== undefined && (
                  <Badge className={`
                    ${(selectedSubmission.marks) >= ((selectedAssignment?.maxMarks || 10) * 0.7)
                      ? "bg-success-100 text-success-700" 
                      : (selectedSubmission.marks) >= ((selectedAssignment?.maxMarks || 10) * 0.4)
                      ? "bg-warning-100 text-warning-700"
                      : "bg-danger-100 text-danger-700"
                    }
                  `}>
                    {selectedSubmission.marks}/{selectedAssignment?.maxMarks}
                  </Badge>
                )}
              </div>
              <Input
                id="marks"
                type="number"
                min="0"
                max={selectedAssignment?.maxMarks}
                value={marks}
                onChange={(e) => setMarks(parseInt(e.target.value))}
                disabled={selectedSubmission?.marks !== undefined}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="feedback" className="text-sm font-medium leading-none">
                Feedback
              </label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide feedback to the student"
                disabled={selectedSubmission?.marks !== undefined}
              />
            </div>
            
            <div className="flex items-center gap-2 pt-2">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => handleDownload(selectedSubmission?.fileUrl || "")}
              >
                <Download className="h-4 w-4 mr-2" />
                <span>Download Submission</span>
              </Button>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setGradeDialogOpen(false)}>
              {selectedSubmission?.marks !== undefined ? "Close" : "Cancel"}
            </Button>
            {selectedSubmission?.marks === undefined && (
              <Button onClick={handleGradeSubmit} className="bg-oliveGreen-600 hover:bg-oliveGreen-700">
                Submit Grade
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Assignment Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
            <DialogDescription>
              Create and upload a new assignment for students
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Assignment Title *
              </label>
              <Input
                id="title"
                value={newAssignment.title}
                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                placeholder="Enter assignment title"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject *
              </label>
              <Select
                value={newAssignment.subjectId}
                onValueChange={(value) => setNewAssignment({ ...newAssignment, subjectId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
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
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={newAssignment.description}
                onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                placeholder="Enter assignment description"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="dueDate" className="text-sm font-medium">
                  Due Date *
                </label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newAssignment.dueDate}
                  onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="maxMarks" className="text-sm font-medium">
                  Maximum Marks
                </label>
                <Input
                  id="maxMarks"
                  type="number"
                  min="1"
                  value={newAssignment.maxMarks}
                  onChange={(e) => setNewAssignment({ ...newAssignment, maxMarks: parseInt(e.target.value) })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="file" className="text-sm font-medium">
                Assignment File *
              </label>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
              />
              {selectedFile && (
                <p className="text-xs text-oliveGreen-600">
                  Selected file: {selectedFile.name}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignmentCreate} className="bg-oliveGreen-600 hover:bg-oliveGreen-700">
              Create Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
