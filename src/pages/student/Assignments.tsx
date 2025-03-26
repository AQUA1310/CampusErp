
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileUp, Download, Calendar, Clock, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useData, Assignment } from "@/contexts/DataContext";
import { toast } from "sonner";
import DashboardLayout from "@/components/shared/DashboardLayout";

export default function StudentAssignments() {
  const { assignments, submitAssignment } = useData();
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [comments, setComments] = useState("");

  const pendingAssignments = assignments.filter(
    (a) => !a.submissions?.some((s) => s.studentId === "1")
  );

  const submittedAssignments = assignments.filter(
    (a) => a.submissions?.some((s) => s.studentId === "1")
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!selectedAssignment || !selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    // Create a fake URL for the file
    const fileUrl = URL.createObjectURL(selectedFile);
    
    submitAssignment(selectedAssignment.id, "1", fileUrl);
    setUploadDialogOpen(false);
    setSelectedAssignment(null);
    setSelectedFile(null);
    setComments("");
  };

  const handleUploadClick = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setUploadDialogOpen(true);
  };

  const handleDownload = (assignment: Assignment) => {
    // In a real app, this would download the file
    window.open(assignment.fileUrl, "_blank");
    toast.success("File download started");
  };

  const renderAssignmentCard = (assignment: Assignment, isSubmitted: boolean) => {
    const submission = assignment.submissions?.find((s) => s.studentId === "1");
    const isPastDue = new Date(assignment.dueDate) < new Date();
    const isAlmostDue = new Date(assignment.dueDate) < new Date(new Date().setDate(new Date().getDate() + 3));
    
    return (
      <Card key={assignment.id} className="shadow-sm hover:shadow-md transition-shadow border border-gray-200">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg text-oliveGreen-900">{assignment.title}</CardTitle>
              <CardDescription className="text-oliveGreen-600">
                {assignment.subjectName}
              </CardDescription>
            </div>
            <Badge variant={
              isPastDue 
                ? "destructive" 
                : isAlmostDue
                ? "secondary"
                : "outline"
            }>
              Due: {new Date(assignment.dueDate).toLocaleDateString()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">{assignment.description}</p>
          
          <div className="flex flex-wrap gap-2 text-sm text-oliveGreen-700 mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Posted: {new Date(assignment.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Max marks: {assignment.maxMarks}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => handleDownload(assignment)}
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </Button>
            
            {!isSubmitted ? (
              <Button
                size="sm"
                className="flex items-center gap-1 bg-oliveGreen-600 hover:bg-oliveGreen-700"
                onClick={() => handleUploadClick(assignment)}
              >
                <FileUp className="h-4 w-4" />
                <span>Submit</span>
              </Button>
            ) : (
              <div className="flex flex-col gap-1">
                <div className="text-xs text-gray-500">
                  Submitted: {new Date(submission?.submittedAt || "").toLocaleDateString()}
                </div>
                {submission?.marks !== undefined && (
                  <Badge className="bg-oliveGreen-600">
                    Score: {submission.marks}/{assignment.maxMarks}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout title="Assignments" subtitle="Manage your coursework">
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="pending" className="data-[state=active]:bg-oliveGreen-100 data-[state=active]:text-oliveGreen-900">
            Pending
          </TabsTrigger>
          <TabsTrigger value="submitted" className="data-[state=active]:bg-oliveGreen-100 data-[state=active]:text-oliveGreen-900">
            Submitted
          </TabsTrigger>
          <TabsTrigger value="all" className="data-[state=active]:bg-oliveGreen-100 data-[state=active]:text-oliveGreen-900">
            All
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-0">
          <div className="grid gap-4">
            {pendingAssignments.length > 0 ? (
              pendingAssignments.map((assignment) => renderAssignmentCard(assignment, false))
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-oliveGreen-300" />
                <h3 className="mt-2 text-lg font-medium text-oliveGreen-900">No pending assignments</h3>
                <p className="mt-1 text-sm text-oliveGreen-500">You're all caught up!</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="submitted" className="mt-0">
          <div className="grid gap-4">
            {submittedAssignments.length > 0 ? (
              submittedAssignments.map((assignment) => renderAssignmentCard(assignment, true))
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-oliveGreen-300" />
                <h3 className="mt-2 text-lg font-medium text-oliveGreen-900">No submitted assignments</h3>
                <p className="mt-1 text-sm text-oliveGreen-500">You haven't submitted any assignments yet.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid gap-4">
            {assignments.length > 0 ? (
              assignments.map((assignment) => {
                const isSubmitted = assignment.submissions?.some((s) => s.studentId === "1");
                return renderAssignmentCard(assignment, isSubmitted);
              })
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-oliveGreen-300" />
                <h3 className="mt-2 text-lg font-medium text-oliveGreen-900">No assignments</h3>
                <p className="mt-1 text-sm text-oliveGreen-500">There are no assignments yet.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
            <DialogDescription>
              Upload your completed assignment for {selectedAssignment?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="file" className="text-sm font-medium leading-none">
                Assignment File
              </label>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.zip"
              />
              {selectedFile && (
                <p className="text-xs text-oliveGreen-600">
                  Selected file: {selectedFile.name}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="comments" className="text-sm font-medium leading-none">
                Comments (Optional)
              </label>
              <Textarea
                id="comments"
                placeholder="Add any comments for your instructor"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-oliveGreen-600 hover:bg-oliveGreen-700">
              Submit Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
