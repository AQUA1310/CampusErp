
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/shared/DashboardLayout";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, User, Search, Edit, Mail, Phone } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Student } from "@/contexts/DataContext";

// Student schema for validation
const studentSchema = z.object({
  rollNumber: z.string().min(1, "Roll number is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  course: z.string().min(1, "Course is required"),
  year: z.coerce.number().min(1, "Year must be at least 1").max(5, "Year must be at most 5"),
});

export default function TeacherStudents() {
  const { students, addStudent, updateStudent } = useData();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      rollNumber: "",
      name: "",
      email: "",
      course: "",
      year: 1,
    },
  });

  const editForm = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      rollNumber: "",
      name: "",
      email: "",
      course: "",
      year: 1,
    },
  });

  useEffect(() => {
    if (selectedStudent) {
      editForm.reset({
        rollNumber: selectedStudent.rollNumber,
        name: selectedStudent.name,
        email: selectedStudent.email,
        course: selectedStudent.course,
        year: selectedStudent.year,
      });
    }
  }, [selectedStudent, editForm]);

  const handleAddStudent = (data: z.infer<typeof studentSchema>) => {
    // Create a new student object with required fields
    const newStudent: Student = {
      id: `student-${Date.now()}`,
      rollNumber: data.rollNumber,
      name: data.name,
      email: data.email,
      course: data.course,
      year: data.year
    };
    
    addStudent(newStudent);
    setOpen(false);
    form.reset();
    toast.success("Student added successfully");
  };

  const handleEditStudent = (data: z.infer<typeof studentSchema>) => {
    if (selectedStudent) {
      // Convert form data to appropriate types
      const updatedData: Partial<Student> = {
        rollNumber: data.rollNumber,
        name: data.name,
        email: data.email,
        course: data.course,
        year: data.year
      };
      
      updateStudent(selectedStudent.id, updatedData);
      setEditOpen(false);
      toast.success("Student updated successfully");
    }
  };

  const viewStudent = (student: typeof students[0]) => {
    setSelectedStudent(student);
  };

  const editStudent = (student: typeof students[0]) => {
    setSelectedStudent(student);
    setEditOpen(true);
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout title="Students" subtitle="Manage student profiles and data">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search students..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setOpen(true)}>Add Student</Button>
      </div>

      <Card className="shadow-md">
        <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-lg">
          <CardTitle className="text-slate-800">Students</CardTitle>
          <CardDescription className="text-slate-600">
            View and manage student information
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead>Roll Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Year</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.rollNumber}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.course}</TableCell>
                    <TableCell>{student.year}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => viewStudent(student)}
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editStudent(student)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No students found matching your search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Student Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Fill in the student details to add them to the system.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddStudent)} className="space-y-4">
              <FormField
                control={form.control}
                name="rollNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roll Number</FormLabel>
                    <FormControl>
                      <Input placeholder="24XXB0A00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="student@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <FormControl>
                      <Input placeholder="Mathematics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Add Student</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>
              Update student information.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditStudent)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="rollNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roll Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Update Student</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Student Details Sheet */}
      {selectedStudent && (
        <Sheet open={!!selectedStudent && !editOpen} onOpenChange={(open) => !open && setSelectedStudent(null)}>
          <SheetContent className="w-full sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Student Profile</SheetTitle>
              <SheetDescription>
                Detailed information about {selectedStudent.name}
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-10rem)] pr-4 mt-6">
              <div className="flex flex-col items-center mb-6">
                <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <User className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold">{selectedStudent.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedStudent.rollNumber}</p>
              </div>

              <Tabs defaultValue="basic-info" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="basic-info" className="flex-1">
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger value="academic" className="flex-1">
                    Academic
                  </TabsTrigger>
                  <TabsTrigger value="contact" className="flex-1">
                    Contact
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic-info" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3 rounded-md">
                      <p className="text-xs text-slate-500">Roll Number</p>
                      <p className="font-medium">{selectedStudent.rollNumber}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-md">
                      <p className="text-xs text-slate-500">Email</p>
                      <p className="font-medium break-all">{selectedStudent.email}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-md">
                      <p className="text-xs text-slate-500">Course</p>
                      <p className="font-medium">{selectedStudent.course}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-md">
                      <p className="text-xs text-slate-500">Year</p>
                      <p className="font-medium">{selectedStudent.year}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-md">
                      <p className="text-xs text-slate-500">CGPA</p>
                      <p className="font-medium">{selectedStudent.cgpa || "N/A"}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-md">
                      <p className="text-xs text-slate-500">Date of Birth</p>
                      <p className="font-medium">
                        {selectedStudent.profile?.dateOfBirth || "N/A"}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-md">
                      <p className="text-xs text-slate-500">Blood Group</p>
                      <p className="font-medium">
                        {selectedStudent.profile?.bloodGroup || "N/A"}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="academic" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3 rounded-md">
                      <p className="text-xs text-slate-500">Department</p>
                      <p className="font-medium">
                        {selectedStudent.profile?.department || "N/A"}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-md">
                      <p className="text-xs text-slate-500">Academic Info</p>
                      <p className="font-medium">
                        {selectedStudent.profile?.year || "N/A"} Year,{" "}
                        {selectedStudent.profile?.semester || "N/A"} Semester,{" "}
                        {selectedStudent.profile?.batch || "N/A"} Batch
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-slate-50 p-3 rounded-md flex items-center">
                      <Phone className="h-4 w-4 text-slate-400 mr-2" />
                      <div>
                        <p className="text-xs text-slate-500">Phone</p>
                        <p className="font-medium">
                          {selectedStudent.profile?.phone || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-md flex items-center">
                      <Mail className="h-4 w-4 text-slate-400 mr-2" />
                      <div>
                        <p className="text-xs text-slate-500">Email</p>
                        <p className="font-medium">{selectedStudent.email}</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-md">
                      <p className="text-xs text-slate-500">Address</p>
                      <p className="font-medium">
                        {selectedStudent.profile?.address || "N/A"}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-md">
                      <p className="text-xs text-slate-500">Parent's Name</p>
                      <p className="font-medium">
                        {selectedStudent.profile?.parentName || "N/A"}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-md">
                      <p className="text-xs text-slate-500">Parent's Phone</p>
                      <p className="font-medium">
                        {selectedStudent.profile?.parentPhone || "N/A"}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex justify-end">
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => setSelectedStudent(null)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setEditOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      )}
    </DashboardLayout>
  );
}
