
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Upload, CheckCircle, Clock, AlertCircle, FileText } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/shared/DashboardLayout";

export default function StudentAssignments() {
  const { user } = useAuth();
  const { assignments, submissions, submitAssignment } = useData();
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const openSubmitDialog = (assignment: any) => {
    setSelectedAssignment(assignment);
    setSelectedFile(null);
    setIsSubmitDialogOpen(true);
  };
  
  const handleSubmit = () => {
    if (!selectedFile || !selectedAssignment || !user) {
      toast.error("Please select a file to upload");
      return;
    }
    
    // Create a fake URL for the file
    const fileUrl = URL.createObjectURL(selectedFile);
    
    submitAssignment(selectedAssignment.id, "1", fileUrl);
    setIsSubmitDialogOpen(false);
    setSelectedAssignment(null);
    setSelectedFile(null);
  };
  
  const getSubmissionForAssignment = (assignmentId: string) => {
    return submissions.find(sub => 
      sub.assignmentId === assignmentId && sub.studentId === "1"
    );
  };
  
  const pendingAssignments = assignments.filter(
    assignment => !getSubmissionForAssignment(assignment.id)
  );
  
  const submittedAssignments = assignments.filter(
    assignment => getSubmissionForAssignment(assignment.id)
  );
  
  const isPastDue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };
  
  return (
    <DashboardLayout title="Assignments" subtitle="View and submit your assignments">
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger 
            value="pending" 
            className="data-[state=active]:bg-oliveGreen-100 data-[state=active]:text-oliveGreen-900"
          >
            Pending
          </TabsTrigger>
          <TabsTrigger 
            value="submitted" 
            className="data-[state=active]:bg-oliveGreen-100 data-[state=active]:text-oliveGreen-900"
          >
            Submitted
          </TabsTrigger>
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-oliveGreen-100 data-[state=active]:text-oliveGreen-900"
          >
            All Assignments
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-0">
          <Card className="shadow-md">
            <CardHeader className="bg-oliveGreen-50 border-b border-oliveGreen-100 rounded-t-lg">
              <CardTitle className="text-oliveGreen-800">Pending Assignments</CardTitle>
              <CardDescription className="text-oliveGreen-600">
                Assignments that require your submission
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {pendingAssignments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-oliveGreen-50/50">
                      <TableHead>Title</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Max Marks</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingAssignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">{assignment.title}</TableCell>
                        <TableCell>{assignment.subjectName}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Badge 
                              variant={isPastDue(assignment.dueDate) ? "destructive" : "outline"}
                              className="flex items-center gap-1"
                            >
                              {isPastDue(assignment.dueDate) ? (
                                <AlertCircle className="h-3 w-3" />
                              ) : (
                                <Clock className="h-3 w-3" />
                              )}
                              {new Date(assignment.dueDate).toLocaleDateString()}
                            </Badge>
                            
                            {isPastDue(assignment.dueDate) && (
                              <span className="text-xs text-danger-500 ml-2">Overdue</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{assignment.maxMarks}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mr-2"
                            onClick={() => window.open(assignment.fileUrl)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          <Button 
                            size="sm"
                            className="bg-black hover:bg-black"
                            onClick={() => openSubmitDialog(assignment)}
                          >
                            <Upload className="h-4 w-4 mr-1" />
                            Submit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-12 text-center">
                  <CheckCircle className="h-12 w-12 text-success-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-oliveGreen-800">
                    All caught up!
                  </h3>
                  <p className="text-oliveGreen-600 mt-2">
                    You've submitted all your assignments.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="submitted" className="mt-0">
          <Card className="shadow-md">
            <CardHeader className="bg-oliveGreen-50 border-b border-oliveGreen-100 rounded-t-lg">
              <CardTitle className="text-oliveGreen-800">Submitted Assignments</CardTitle>
              <CardDescription className="text-oliveGreen-600">
                Assignments you have already submitted
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {submittedAssignments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-oliveGreen-50/50">
                      <TableHead>Title</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Submitted On</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submittedAssignments.map((assignment) => {
                      const submission = getSubmissionForAssignment(assignment.id);
                      
                      return (
                        <TableRow key={assignment.id}>
                          <TableCell className="font-medium">{assignment.title}</TableCell>
                          <TableCell>{assignment.subjectName}</TableCell>
                          <TableCell>
                            {submission && new Date(submission.submittedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {submission?.marks !== undefined ? (
                              <Badge className="bg-success-100 text-success-700 hover:bg-success-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Graded: {submission.marks}/{assignment.maxMarks}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-oliveGreen-50 text-oliveGreen-700">
                                Submitted
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mr-2"
                              onClick={() => window.open(assignment.fileUrl)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Assignment
                            </Button>
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(submission?.fileUrl)}
                              disabled={!submission}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              My Submission
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-12 text-center">
                  <AlertCircle className="h-12 w-12 text-warning-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-oliveGreen-800">
                    No submissions yet
                  </h3>
                  <p className="text-oliveGreen-600 mt-2">
                    You haven't submitted any assignments yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="all" className="mt-0">
          <Card className="shadow-md">
            <CardHeader className="bg-oliveGreen-50 border-b border-oliveGreen-100 rounded-t-lg">
              <CardTitle className="text-oliveGreen-800">All Assignments</CardTitle>
              <CardDescription className="text-oliveGreen-600">
                Complete list of all assignments
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-oliveGreen-50/50">
                    <TableHead>Title</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.length > 0 ? (
                    assignments.map((assignment) => {
                      const submission = getSubmissionForAssignment(assignment.id);
                      const isSubmitted = !!submission;
                      
                      return (
                        <TableRow key={assignment.id}>
                          <TableCell className="font-medium">{assignment.title}</TableCell>
                          <TableCell>{assignment.subjectName}</TableCell>
                          <TableCell>
                            <Badge variant={
                              isPastDue(assignment.dueDate) && !isSubmitted 
                                ? "destructive" 
                                : "outline"
                            }>
                              {new Date(assignment.dueDate).toLocaleDateString()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {isSubmitted ? (
                              submission.marks !== undefined ? (
                                <Badge className="bg-success-100 text-success-700 hover:bg-success-200">
                                  Graded: {submission.marks}/{assignment.maxMarks}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-oliveGreen-50 text-oliveGreen-700">
                                  Submitted
                                </Badge>
                              )
                            ) : (
                              <Badge variant="outline" className="bg-warning-50 text-warning-700">
                                Pending
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mr-2"
                              onClick={() => window.open(assignment.fileUrl)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                            {isSubmitted ? (
                              <Button 
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(submission.fileUrl)}
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                View Submission
                              </Button>
                            ) : (
                              <Button 
                                size="sm"
                                className="bg-oliveGreen-600 hover:bg-oliveGreen-700"
                                onClick={() => openSubmitDialog(assignment)}
                              >
                                <Upload className="h-4 w-4 mr-1" />
                                Submit
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No assignments have been assigned yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Submit Assignment Dialog */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
            <DialogDescription>
              {selectedAssignment && (
                <>
                  {selectedAssignment.title} - {selectedAssignment.subjectName}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedAssignment && (
              <div className="bg-oliveGreen-600 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Due Date:</span>
                  <span className={`${
                    isPastDue(selectedAssignment.dueDate) ? "text-danger-600" : ""
                  }`}>
                    {new Date(selectedAssignment.dueDate).toLocaleDateString()}
                    {isPastDue(selectedAssignment.dueDate) && " (Overdue)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Max Marks:</span>
                  <span>{selectedAssignment.maxMarks}</span>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => selectedAssignment && window.open(selectedAssignment.fileUrl)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Assignment
              </Button>
            </div>
            
            <div className="space-y-2 border-t pt-4">
              <label htmlFor="file" className="block text-sm font-medium">
                Upload Your Submission *
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
            <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-black hover:black">
              Submit Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
