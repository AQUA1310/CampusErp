import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/shared/DashboardLayout";

export default function TeacherAssignments() {
  const { user } = useAuth();
  const { subjects, assignments, addAssignment } = useData();
  const [showModal, setShowModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [calendarValue, setCalendarValue] = useState<Date>();
  
  const formattedDate = calendarValue ? format(calendarValue, "yyyy-MM-dd") : "";
  
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    dueDate: formattedDate,
    subject: "",
    subjectId: "",
    maxMarks: ""
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setSelectedSubject(value);
    setFormValues(prev => ({ ...prev, subjectId: value, subject: subjects.find(s => s.id === value)?.name || "" }));
  };
  
  const handleAddAssignment = (data: any) => {
    const newAssignment: Assignment = {
      id: `assign-${Date.now()}`,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      subject: data.subject,
      subjectId: data.subjectId,
      subjectName: subjects.find(s => s.id === data.subjectId)?.name || data.subject,
      status: 'pending',
      teacherId: user?.id || '',
      maxMarks: parseInt(data.maxMarks, 10)
    };
    
    addAssignment(newAssignment);
    setShowModal(false);
    
    toast.success("Assignment added successfully");
  };

  return (
    <DashboardLayout title="Assignments" subtitle="Manage assignments for your students">
      <Card className="shadow-md">
        <CardHeader className="bg-navy-50 border-b border-navy-100 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-navy-800">Assignments</CardTitle>
              <CardDescription className="text-navy-600">
                Manage and create assignments for your students
              </CardDescription>
            </div>
            <Button onClick={() => setShowModal(true)} className="bg-primary text-white">
              Add Assignment
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
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
              {assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">{assignment.title}</TableCell>
                  <TableCell>{assignment.subjectName}</TableCell>
                  <TableCell>{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add Assignment Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Assignment</DialogTitle>
            <DialogDescription>
              Create a new assignment for your students
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input 
                type="text" 
                id="title" 
                name="title"
                value={formValues.title}
                onChange={handleInputChange}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formValues.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Subject
              </Label>
              <Select onValueChange={handleSelectChange} defaultValue={selectedSubject}>
                <SelectTrigger className="col-span-3">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !calendarValue && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {calendarValue ? format(calendarValue, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    selected={calendarValue}
                    onSelect={setCalendarValue}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maxMarks" className="text-right">
                Max Marks
              </Label>
              <Input 
                type="number" 
                id="maxMarks" 
                name="maxMarks"
                value={formValues.maxMarks}
                onChange={handleInputChange}
                className="col-span-3" 
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => handleAddAssignment(formValues)}
              className="bg-primary text-white"
            >
              Create Assignment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
