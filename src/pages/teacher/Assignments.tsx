
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Eye, Check, Upload, FileText, Filter } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import DashboardLayout from "@/components/shared/DashboardLayout";

export default function TeacherAssignments() {
  const { assignments, submissions, subjects, addAssignment, gradeSubmission } = useData();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [assignmentData, setAssignmentData] = useState({
    title: "",
    description: "",
    subjectId: subjects[0]?.id || "",
    dueDate: "",
    maxMarks: 10,
  });
  const [reviewData, setReviewData] = useState({
    marks: 0,
    feedback: "",
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filterSubject, setFilterSubject] = useState<string>("all");

  const handleAssignmentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAssignmentSubmit = () => {
    if (!assignmentData.title || !assignmentData.subjectId || !assignmentData.dueDate) {
      toast.error("Please fill in required fields");
      return;
    }

    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    // Create a fake URL for the file
    const fileUrl = URL.createObjectURL(selectedFile);
    
    const subject = subjects.find((s) => s.id === assignmentData.subjectId);
    
    addAssignment({
      title: assignmentData.title,
      description: assignmentData.description,
      subjectId: assignmentData.subjectId,
      subjectName: subject?.name || "",
      dueDate: assignmentData.dueDate,
      maxMarks: assignmentData.maxMarks,
      fileUrl,
      createdBy: "1",
    });
    
    setIsUploadDialogOpen(false);
    setAssignmentData({
      title: "",
      description: "",
      subjectId: subjects[0]?.id || "",
      dueDate: "",
      maxMarks: 10,
    });
    setSelectedFile(null);
  };

  const handleReviewSubmit = () => {
    if (!selectedSubmission) return;
    
    if (reviewData.marks < 0 || reviewData.marks > selectedSubmission.assignment.maxMarks) {
      toast.error(`Marks should be between 0 and ${selectedSubmission.assignment.maxMarks}`);
      return;
    }
    
    gradeSubmission(selectedSubmission.id, reviewData.marks, reviewData.feedback);
    setIsReviewDialogOpen(false);
    setSelectedSubmission(null);
    setReviewData({ marks: 0, feedback: "" });
  };

  const openReviewDialog = (submission: any) => {
    const assignment = assignments.find(a => a.id === submission.assignmentId);
    setSelectedSubmission({ ...submission, assignment });
    setReviewData({
      marks: submission.marks || 0,
      feedback: submission.feedback || "",
    });
    setIsReviewDialogOpen(true);
  };

  const filteredAssignments = filterSubject === "all" 
    ? assignments 
    : assignments.filter(a => a.subjectId === filterSubject);

  const submissionsWithAssignments = submissions.map(sub => {
    const assignment = assignments.find(a => a.id === sub.assignmentId);
    return { ...sub, assignment };
  });

  return (
    <DashboardLayout title="Assignments" subtitle="Upload and manage student assignments">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsUploadDialogOpen(true)}
            className="bg-oliveGreen-600 hover:bg-oliveGreen-600"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload New Assignment
          </Button>
          
          <div className="flex items-center gap-2 ml-4">
            <Filter className="h-4 w-4 text-black" />
            <select
              value={filterSubject}
              onChange={e => setFilterSubject(e.target.value)}
              className="border rounded px-2 py-1 text-sm border-oliveGreen-200 focus:outline-none focus:ring-1 focus:ring-oliveGreen-400"
            >
              <option value="all">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <Tabs defaultValue="assignments" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger 
            value="assignments" 
            className="data-[state=active]:bg-oliveGreen-100 data-[state=active]:text-oliveGreen-900"
          >
            All Assignments
          </TabsTrigger>
          <TabsTrigger 
            value="submissions" 
            className="data-[state=active]:bg-oliveGreen-100 data-[state=active]:text-oliveGreen-900"
          >
            Student Submissions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="assignments" className="mt-0">
          <Card className="shadow-md">
            <CardHeader className="bg-oliveGreen-50 border-b border-oliveGreen-100 rounded-t-lg">
              <CardTitle className="text-oliveGreen-800">All Assignments</CardTitle>
              <CardDescription className="text-oliveGreen-600">
                Assignments created for students
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-oliveGreen-50/50">
                    <TableHead>Title</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Max Marks</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssignments.length > 0 ? (
                    filteredAssignments.map((assignment) => {
                      const submissionCount = assignment.submissions?.length || 0;
                      
                      return (
                        <TableRow key={assignment.id}>
                          <TableCell className="font-medium">{assignment.title}</TableCell>
                          <TableCell>{assignment.subjectName}</TableCell>
                          <TableCell>
                            <Badge variant={
                              new Date(assignment.dueDate) < new Date() 
                                ? "destructive" 
                                : "outline"
                            }>
                              {new Date(assignment.dueDate).toLocaleDateString()}
                            </Badge>
                          </TableCell>
                          <TableCell>{assignment.maxMarks}</TableCell>
                          <TableCell>
                            {submissionCount} / {6} students
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" className="mr-2">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No assignments found. Upload a new assignment to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="submissions" className="mt-0">
          <Card className="shadow-md">
            <CardHeader className="bg-oliveGreen-50 border-b border-oliveGreen-100 rounded-t-lg">
              <CardTitle className="text-oliveGreen-800">Student Submissions</CardTitle>
              <CardDescription className="text-oliveGreen-600">
                Review and grade assignment submissions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-oliveGreen-50/50">
                    <TableHead>Student</TableHead>
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Submitted Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissionsWithAssignments.length > 0 ? (
                    submissionsWithAssignments.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">{submission.studentName}</TableCell>
                        <TableCell>{submission.rollNumber}</TableCell>
                        <TableCell>{submission.assignment?.title}</TableCell>
                        <TableCell>{new Date(submission.submittedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {submission.marks !== undefined ? (
                            <Badge className="bg-success-100 text-success-700 hover:bg-success-200">
                              <Check className="h-3 w-3 mr-1" />
                              Graded: {submission.marks}/{submission.assignment?.maxMarks}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-warning-100 text-warning-700 border-warning-200">
                              Pending Review
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="mr-2">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openReviewDialog(submission)}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No submissions have been received yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upload Assignment Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload New Assignment</DialogTitle>
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
                value={assignmentData.title}
                onChange={(e) => setAssignmentData({ ...assignmentData, title: e.target.value })}
                placeholder="Enter assignment title"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject *
              </label>
              <select
                id="subject"
                value={assignmentData.subjectId}
                onChange={(e) => setAssignmentData({ ...assignmentData, subjectId: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={assignmentData.description}
                onChange={(e) => setAssignmentData({ ...assignmentData, description: e.target.value })}
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
                  value={assignmentData.dueDate}
                  onChange={(e) => setAssignmentData({ ...assignmentData, dueDate: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="maxMarks" className="text-sm font-medium">
                  Maximum Marks *
                </label>
                <Input
                  id="maxMarks"
                  type="number"
                  min="1"
                  value={assignmentData.maxMarks}
                  onChange={(e) => setAssignmentData({ ...assignmentData, maxMarks: parseInt(e.target.value) })}
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
                onChange={handleAssignmentFileChange}
              />
              {selectedFile && (
                <p className="text-xs text-oliveGreen-600">
                  Selected file: {selectedFile.name}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignmentSubmit} className="bg-black-600 hover:bg-black-700">
              Upload Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Submission Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Submission</DialogTitle>
            <DialogDescription>
              {selectedSubmission && (
                <>
                  Submission from {selectedSubmission.studentName} for {selectedSubmission.assignment?.title}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4 py-4">
              <div className="bg-oliveGreen-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Student:</span>
                  <span>{selectedSubmission.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Roll Number:</span>
                  <span>{selectedSubmission.rollNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Assignment:</span>
                  <span>{selectedSubmission.assignment?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Submitted On:</span>
                  <span>{new Date(selectedSubmission.submittedAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Max Marks:</span>
                  <span>{selectedSubmission.assignment?.maxMarks}</span>
                </div>
              </div>

              <div className="space-y-2 border-t pt-4">
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Submission
                </Button>
              </div>

              <div className="space-y-2 border-t pt-4">
                <label htmlFor="marks" className="block text-sm font-medium">
                  Marks (out of {selectedSubmission.assignment?.maxMarks})
                </label>
                <Input
                  id="marks"
                  type="number"
                  min="0"
                  max={selectedSubmission.assignment?.maxMarks}
                  value={reviewData.marks}
                  onChange={(e) => setReviewData({ ...reviewData, marks: parseInt(e.target.value) })}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="feedback" className="block text-sm font-medium">
                  Feedback
                </label>
                <Textarea
                  id="feedback"
                  rows={3}
                  value={reviewData.feedback}
                  onChange={(e) => setReviewData({ ...reviewData, feedback: e.target.value })}
                  placeholder="Provide feedback to the student..."
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReviewSubmit} className="bg-oliveGreen-600 hover:bg-oliveGreen-700">
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
