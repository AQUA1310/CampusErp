import { useState, useEffect } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { toast } from "sonner";
import { Submission } from "@/contexts/DataContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

export default function StudentAssignments() {
  const { user } = useAuth();
  const { assignments, submissions, addSubmission, deleteSubmission } = useData();
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    // You can add any initialization logic here
  }, []);

  const handleOpenSubmitDialog = (assignmentId: string) => {
    setSelectedAssignmentId(assignmentId);
    setSubmitDialogOpen(true);
  };

  const handleCloseSubmitDialog = () => {
    setSubmitDialogOpen(false);
    setSelectedAssignmentId(null);
    setSubmissionText("");
    setSubmissionFile(null);
  };

  const handleSubmitAssignment = (event: React.MouseEvent<HTMLButtonElement>, assignmentId: string) => {
    event.preventDefault();
    
    if (!submissionFile && !submissionText) {
      toast({
        title: "Error",
        description: "Please upload a file or enter text for your submission.",
        variant: "destructive"
      });
      return;
    }

    const newSubmission: Submission = {
      id: `sub-${Date.now()}`,
      assignmentId: assignmentId,
      studentId: user?.id || '',
      submissionDate: new Date().toISOString(),
      submissionText: submissionText,
      submissionFile: submissionFile ? submissionFile.name : null,
      status: 'submitted',
      marksObtained: 0,
      feedback: ''
    };

    addSubmission(newSubmission);
    handleCloseSubmitDialog();

    toast.success("Assignment submitted successfully");
  };

  const handleDeleteSubmission = (submissionId: string | null) => {
    if (submissionId) {
      deleteSubmission(submissionId);
      setDeleteDialogOpen(false);
      setSelectedSubmissionId(null);
      toast.success("Submission deleted successfully");
    }
  };

  const confirmDeleteSubmission = (submissionId: string) => {
    setSelectedSubmissionId(submissionId);
    setDeleteDialogOpen(true);
  };

  const getAssignmentStatus = (assignmentId: string) => {
    const submission = submissions.find(
      (sub) => sub.assignmentId === assignmentId && sub.studentId === user?.id
    );
    return submission ? "Submitted" : "Pending";
  };

  const getSubmission = (assignmentId: string) => {
    return submissions.find(
      (sub) => sub.assignmentId === assignmentId && sub.studentId === user?.id
    );
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const submissionStatus = getAssignmentStatus(assignment.id);
    if (activeTab === "pending") {
      return submissionStatus === "Pending";
    } else if (activeTab === "submitted") {
      return submissionStatus === "Submitted";
    }
    return true;
  });

  const sortedAssignments = filteredAssignments.sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  return (
    <DashboardLayout title="Assignments" subtitle="View and submit your assignments">
      <Card className="shadow-md">
        <CardHeader className="bg-navy-50 border-b border-navy-100 rounded-t-lg">
          <CardTitle className="text-navy-800">Assignments</CardTitle>
          <CardDescription className="text-navy-600">
            View and submit your assignments
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="pending" className="w-full">
            <TabsList>
              <TabsTrigger value="pending" onClick={() => setActiveTab("pending")}>Pending</TabsTrigger>
              <TabsTrigger value="submitted" onClick={() => setActiveTab("submitted")}>Submitted</TabsTrigger>
            </TabsList>
            <TabsContent value="pending" className="p-4">
              <Table>
                <TableHeader>
                  <TableRow className="bg-navy-50/50">
                    <TableHead>Title</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAssignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">{assignment.title}</TableCell>
                      <TableCell>{assignment.subjectName}</TableCell>
                      <TableCell>{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleOpenSubmitDialog(assignment.id)}>
                          Submit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="submitted" className="p-4">
              <Table>
                <TableHeader>
                  <TableRow className="bg-navy-50/50">
                    <TableHead>Title</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAssignments.map((assignment) => {
                    const submission = getSubmission(assignment.id);
                    return submission ? (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">{assignment.title}</TableCell>
                        <TableCell>{assignment.subjectName}</TableCell>
                        <TableCell>{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(submission.submissionDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="destructive" size="sm" onClick={() => confirmDeleteSubmission(submission.id)}>
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ) : null;
                  })}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Submit Dialog */}
      <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
            <DialogDescription>
              Upload your completed assignment or enter text below
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="submissionFile">Upload File (Optional)</Label>
              <Input id="submissionFile" type="file" onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="submissionText">Submission Text (Optional)</Label>
              <Textarea
                id="submissionText"
                placeholder="Enter your submission here..."
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={(e) => handleSubmitAssignment(e, selectedAssignmentId!)}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your submission. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDeleteSubmission(selectedSubmissionId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
