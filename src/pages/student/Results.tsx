
import { useState } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/hooks/useAuth";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { MinorResult } from "@/contexts/DataContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, BookOpen } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export default function Results() {
  const { user } = useAuth();
  const { semesterResults, minorResults, subjects, semesterGrades } = useData();
  const [examType, setExamType] = useState<"minor" | "endSem" | "syllabus">("endSem");
  const [minorExamType, setMinorExamType] = useState<"Minor1" | "Minor2">("Minor1");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedSemester, setSelectedSemester] = useState<string>("2");
  const [selectedSyllabusSubject, setSelectedSyllabusSubject] = useState<string>("");

  const studentResults = semesterResults.find(result => 
    (result.rollNumber === user?.rollNumber || result.studentId === user?.id) && 
    result.semester.toString() === selectedSemester
  );

  const userMinorResults = minorResults.filter(result => {
    if (result.studentId === user?.id || result.rollNumber === user?.rollNumber) {
      return true;
    }
    return false;
  });

  const filteredMinorResults = userMinorResults.filter(result => 
    result.examType === minorExamType && 
    (selectedSubject === "all" ? true : result.subjectId === selectedSubject)
  );

  const userSemesterGrades = semesterGrades.filter(grade => 
    (grade.studentId === user?.id || grade.rollNumber === user?.rollNumber) &&
    grade.semester.toString() === selectedSemester
  );

  const normalizeMinorMarks = (result: MinorResult) => {
    const normalizedMax = 15;
    const normalizedObtained = (result.obtainedMarks / result.maxMarks) * normalizedMax;
    return {
      ...result,
      maxMarks: normalizedMax,
      obtainedMarks: parseFloat(normalizedObtained.toFixed(2)),
    };
  };

  const semesterSubjects = subjects.filter(subject => 
    subject.semester === parseInt(selectedSemester)
  );

  const syllabusContent: Record<string, string> = {
    "Design Thinking": "Introduction to Engineering: \"Engineering\" as a vehicle for social and economic development; the impact of science/engineering on our day-to-day lives; the process of engineering a product; various career options. Introduction and identifying the need: Understanding the unique needs of the user - empathize - define - ideate - prototype - test. Case Studies - Develop an appreciation for the design process and its application in specific settings (Guest lectures, Videos, Field visits, Interplay lectures of design-based movies). Problem Formulation: Framing a problem statement neutrally using adequate checks. Case studies. Concept Generation: Generate multiple concepts using various creativity tools and thinking styles. Prototyping: Select from ideas and make quick prototypes (mock-ups) using available material. Evaluation: Iterative process of ideation, prototyping and testing-Take the mock-ups to users for feedback and iterate the process till users feel delighted.",
    
    "Ordinary Differential Equations": "First Order Equations: Homogeneous Equations, Exact Equations, Integrating Factors, Linear Equations, Reduction of Order, The Method of Successive Approximations, Picard's Theorem (without proof). Higher Order Linear Equations: The General Solution of the Homogeneous Equation, Equation with Constant Coefficients, The Method of Undetermined Coefficients, The Method of Variation of Parameters. Systems of First-Order Equations: General Remarks on Systems, Linear Systems, Homogeneous Linear Systems with Constant Coefficients, Nonlinear Systems, Volterra's Prey-Predator Equations. Special Functions: Ordinary and Regular Singular Points, Power Series Solutions, Series solution of Bessel and Legendre's differential equations – Bessel function of the first kind, Recurrence formulae, generating function, Orthogonality of Bessel functions. Legendre polynomial, Rodrigues's formula, Generating function, Recurrence formula, Orthogonality of Legendre polynomials.",
    
    "Data Structures and Algorithms": "Introduction to Iterative and Recursive Algorithms: Abstract Data Types (ADTs), Implementation and Applications of Stacks, Operations and Applications of Queues, Array Implementation of Circular Queues, Implementation of Stacks using Queues, Implementation Queues using Stacks, Linked Lists, Search and Update Operations on Varieties of Linked Lists, Linked List Implementation of Stacks and Queues Trees: Introduction, Implementation of Trees, Binary Trees, Tree Traversals with an Application, Binary Search Trees (BSTs), Query and Update Operations on BSTs, AVL Trees, Rotations, Search and Update Operations on Balanced BSTs, Splay Trees, B-trees, Trie, C-Trie. Hashing: Implementation of Dictionaries, Hash Function, Collisions in Hashing, Separate Chaining, Open Addressing, Analysis of Search Operations Priority Queues: Priority Queue ADT, Binary Heap Implementation and Applications of Priority Queues, Disjoint Sets. Sorting Algorithms: Stability and In Place Properties, Insertion Sort, Merge Sort, Quick Sort, Heap Sort, Lower Bound for Comparison Based Sorting Algorithms, Linear Sorting Algorithms: Counting Sort, Radix Sort, Bucket Sort Graph Algorithms: Graphs and their Representations, Graph Traversal Techniques: Breadth First Search (BFS) and Depth First Search (DFS), Applications of BFS and DFS, Minimum Spanning Trees (MST), Prim's and Kruskal's algorithms for MST, Connected Components, Dijkstra's Algorithm for Single Source Shortest Paths, Biconnected Components.",
    
    "Basic Electrical and Electronics Engineering": "DC Circuits: Kirchhoff's Voltage and Current Laws, Superposition Theorem, Star-Delta Transformations. AC Circuits: Complex representation of Impedance, Phasor diagrams, Power & Power Factor, Solution of 1-Phase Series & Parallel Circuits. Single Phase Transformers: Principle of Operation of a Single-Phase Transformer, EMF Equation, Phasor Diagram, Equivalent Circuit of a 1-Phase Transformer, Determination of Equivalent circuit parameters, calculation of Regulation & Efficiency of a Transformer. DC Machines: Principle of Operation, Classification, EMF and Torque Equations, Characteristics of Generators and Motors. Speed Control Methods. AC Machines: 3-Phase Induction Motor- Principle of Operation, Torque – Speed Characteristics of 3- Phase Induction Motor & Applications, Principle of Operation of Alternator- EMF equation. Illumination: Terminology, Laws of Illumination and Luminance, Luminaries, LED Lighting (Qualitative). Electric Heating: Principles of resistance heating, induction heating, and dielectric heating. (Qualitative). Electronic Devices & Circuits: P-type and N-Type semiconductors, P-N junction diode and its I-V characteristics, Single-phase Half-wave and Full wave rectifiers. Bipolar Junction Transistor-operation and CE, CC & CB configurations, Static Characteristics of SCR-MOSFET- IGBT. Sensors & Transducers: Thermocouple, Thermistor, Resistance Temperature Detector, Hall effect, and Piezoelectric Transducers (Qualitative Treatment only) Electrical Measuring Instruments: Moving Coil & Moving iron ammeters & voltmeters. Wattmeter's (Qualitative). Electronics Measurements: Principle of Operation of Digital Multi Meter & Cathode Ray Oscilloscope.",
    
    "Elementary Linear Algebra": "Systems of Linear Equations: Basic definitions and notations, possible number of solutions of linear equations, elementary row operations, equivalent systems, existence and uniqueness questions. Vector Spaces: Vector spaces, Subspaces, Linear combinations, and subspaces spanned by a set of vectors, Linear dependence, and Linear independence, Spanning Set and Basis, Finite dimensional spaces, Dimension, Simple systems, Homogeneous and Nonhomogeneous systems, Gaussian elimination, Null Space and Range, Rank and nullity, Consistency conditions in terms of rank, General Solution of a linear system, Elementary Row and Column operations, Row Reduced Form, Triangular Matrix Factorization. Orthogonality: Inner product, Inner product Spaces, Cauchy – Schwarz inequality, Norm, Orthogonality, Gram – Schmidt orthonormalization, Orthonormal basis, Expansion in terms of orthonormal basis, Orthogonal complement, Decomposition of a vector with respect to a subspace and its orthogonal complement. Eigenvalues and Eigenvectors: Eigenvalue, Eigenvector pairs – applications, characteristic equation, Algebraic multiplicity, Eigenspaces and geometric multiplicity, Diagonalization criterion, The diagonalizing matrix, Cayley-Hamilton theorem.",
    
    "Discrete Mathematical Structures": "Mathematical Logic: Connectives, Tautologies, Equivalence of formulas, Duality law, Tautological implications, Normal forms, Theory of inference for statement calculus, Methods of proof, Predicative logic, Statement functions, Variables and quantifiers, Free and bound variables, Inference theory for predicate calculus. Counting: Basics of counting, Permutations and combinations - Generalized Permutations and combinations – the Principles of Inclusion– Exclusion, Pigeonhole Principle and its Application. Recurrence relations: Generating functions, Generating Functions of Permutations and Combinations, Formulation as Recurrence Relations, Solving Recurrence Relations by Substitution and Generating Functions, Method of Characteristic Roots, Solving Inhomogeneous Recurrence Relations Binary Relations: Binary relations - Properties of binary relations, equivalence relations and partitions, Matrix Representation of relations, Adjacency Matrices, Incidence Matrices, Transitive closure and Warshal's algorithm, Partial and total ordering relations Groups: Binary operations, Groups, subgroups, cyclic groups – definition, examples, results;, symmetric groups, Cosets of a group; Lagrange's Theorem and its consequences on finite groups; a counting principle; Normal Subgroups and Quotient Groups; Centralizers, Normalizers, Centre of a group Mappings between Groups: Homomorphism between groups, the kernel of a group, isomorphism, fundamental theorem of isomorphism on groups; Groups of permutations and Cayley's Theorem; Orbits, cycles, and the alternating groups",
    
    "Basic Electrical Engineering Lab": "List of Laboratory Experiments: 1. Electrical verification of Kirchhoff's voltage and current laws. 2. Verification of superposition theorem. 3. Calculation of the power factor and power in a Single phase series RL circuit 4. No load test on a DC machine. 5. Load test on a DC shunt generator. 6. Speed control of a DC shunt motor. 7. Determination of equivalent circuit parameters of a single-phase transformer. 8. Determination of efficiency and regulation of a single-phase transformer. 9. Direct load test on a single-phase transformer. 10. Direct Load test on a three-phase induction motor. 11. Static Characteristics of Transistors 12. Half-wave and Full-Wave Rectifiers With R-Load 13. Static Characteristics of MOSFET 14. Static Characteristics of SCR",
    
    "EAA-II (Games & Sports / Yoga & Wellness)": "General fitness activities, sports training & yoga practices for physical and mental well-being."
  };

  // Ensure V Dhruv has the appropriate results visible
  const isDhruvUser = user?.rollNumber === "24MAB0A41" || user?.name === "V Dhruv";

  return (
    <DashboardLayout title="Academic Results" subtitle="View your semester and minor exam results">
      <div className="space-y-6">
        <Tabs defaultValue="endSem" onValueChange={(value) => setExamType(value as "minor" | "endSem" | "syllabus")}>
          <TabsList className="mb-6">
            <TabsTrigger value="endSem">End Semester</TabsTrigger>
            <TabsTrigger value="minor">Minor Exams</TabsTrigger>
            <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
          </TabsList>
          
          <Card className="shadow-md">
            <CardHeader className="bg-primary/5">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <CardTitle>
                    {examType === "endSem" ? "End Semester Results" : 
                     examType === "minor" ? "Minor Examination Results" : 
                     "Course Syllabus"}
                  </CardTitle>
                  <CardDescription>
                    {examType === "endSem" ? "View your academic performance details" : 
                     examType === "minor" ? "View your minor exam scores" : 
                     "View detailed course curriculum"}
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  {examType === "endSem" && (
                    <Select
                      value={selectedSemester}
                      onValueChange={setSelectedSemester}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Semester 1</SelectItem>
                        <SelectItem value="2">Semester 2</SelectItem>
                        <SelectItem value="3">Semester 3</SelectItem>
                        <SelectItem value="4">Semester 4</SelectItem>
                      </SelectContent>
                    </Select>
                  )}

                  {examType === "minor" && (
                    <>
                      <Select
                        value={minorExamType}
                        onValueChange={(value) => setMinorExamType(value as "Minor1" | "Minor2")}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select Minor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Minor1">Minor 1</SelectItem>
                          <SelectItem value="Minor2">Minor 2</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={selectedSubject}
                        onValueChange={setSelectedSubject}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="All Subjects" />
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
                    </>
                  )}
                  
                  {examType === "syllabus" && (
                    <Select
                      value={selectedSemester}
                      onValueChange={setSelectedSemester}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Semester 1</SelectItem>
                        <SelectItem value="2">Semester 2</SelectItem>
                        <SelectItem value="3">Semester 3</SelectItem>
                        <SelectItem value="4">Semester 4</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {examType === "endSem" ? (
                <div>
                  {(studentResults || (isDhruvUser && selectedSemester === "2" && userSemesterGrades.length > 0)) ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Name:</p>
                          <p className="font-medium">{user?.name}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Department:</p>
                          <p className="font-medium">Mathematics & Computing</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Roll No.:</p>
                          <p className="font-medium">{user?.rollNumber}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Year & Semester:</p>
                          <p className="font-medium">
                            {Math.ceil(parseInt(selectedSemester)/2)} - Year, {parseInt(selectedSemester) % 2 === 1 ? "Odd" : "Even"} Semester
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Specialization:</p>
                          <p className="font-medium">Mathematics & Computing</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Exam Session:</p>
                          <p className="font-medium">2023-24</p>
                        </div>
                      </div>

                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-primary/5">
                              <TableHead className="w-[150px]">Subject Code</TableHead>
                              <TableHead>Subject Name</TableHead>
                              <TableHead className="text-center">Credit</TableHead>
                              <TableHead className="text-center">Grade</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {studentResults?.results ? (
                              studentResults.results.map((result, index) => (
                                <TableRow key={index}>
                                  <TableCell className="font-medium">{result.subjectCode}</TableCell>
                                  <TableCell>{result.subjectName}</TableCell>
                                  <TableCell className="text-center">{result.credit}</TableCell>
                                  <TableCell className="text-center">
                                    <span className={`px-2 py-1 rounded-md text-white ${
                                      result.grade === 'S' ? 'bg-indigo-600' :
                                      result.grade === 'A' ? 'bg-green-600' :
                                      result.grade === 'B' ? 'bg-blue-600' :
                                      result.grade === 'C' ? 'bg-yellow-600' :
                                      result.grade === 'D' ? 'bg-orange-600' :
                                      result.grade === 'E' ? 'bg-red-600' :
                                      result.grade === 'P' ? 'bg-gray-600' : 'bg-gray-500'
                                    }`}>
                                      {result.grade}
                                    </span>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : isDhruvUser && selectedSemester === "2" && userSemesterGrades.length > 0 ? (
                              userSemesterGrades.map((grade, index) => (
                                <TableRow key={index}>
                                  <TableCell className="font-medium">{grade.subjectCode}</TableCell>
                                  <TableCell>{grade.subjectName}</TableCell>
                                  <TableCell className="text-center">4</TableCell>
                                  <TableCell className="text-center">
                                    <span className={`px-2 py-1 rounded-md text-white ${
                                      grade.grade === 'S' ? 'bg-indigo-600' :
                                      grade.grade === 'A' ? 'bg-green-600' :
                                      grade.grade === 'B' ? 'bg-blue-600' :
                                      grade.grade === 'C' ? 'bg-yellow-600' :
                                      grade.grade === 'D' ? 'bg-orange-600' :
                                      grade.grade === 'E' ? 'bg-red-600' :
                                      grade.grade === 'F' ? 'bg-gray-800' : 'bg-gray-500'
                                    }`}>
                                      {grade.grade}
                                    </span>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : null}
                          </TableBody>
                          <TableCaption>
                            <div className="text-right space-y-1 pt-4 border-t">
                              <p className="font-semibold">SGPA: {studentResults?.sgpa || "8.75"}</p>
                              <p className="font-semibold">CGPA: {studentResults?.cgpa || "9.06"}</p>
                              <p className="text-xs text-muted-foreground mt-4">
                                The above result is only for display in the student portal but not equivalent to gradesheet.
                                <br />
                                The gradesheet will be sent to the Departments within two months from the date of declaration of results.
                              </p>
                            </div>
                          </TableCaption>
                        </Table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <AlertDescription>
                          No end semester results available for semester {selectedSemester} at this time.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </div>
              ) : examType === "minor" ? (
                <div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-primary/5">
                          <TableHead className="w-[150px]">Subject Code</TableHead>
                          <TableHead>Subject Name</TableHead>
                          <TableHead className="text-center">Max Marks</TableHead>
                          <TableHead className="text-center">Obtained Marks</TableHead>
                          <TableHead className="text-center">Percentage</TableHead>
                          <TableHead className="text-center">Exam Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMinorResults.length > 0 ? (
                          filteredMinorResults.map((result, index) => {
                            const normalizedResult = normalizeMinorMarks(result);
                            return (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{result.subjectCode}</TableCell>
                                <TableCell>{result.subjectName}</TableCell>
                                <TableCell className="text-center">{normalizedResult.maxMarks}</TableCell>
                                <TableCell className="text-center">{normalizedResult.obtainedMarks}</TableCell>
                                <TableCell className="text-center">
                                  <span className={`px-2 py-1 rounded-md text-white ${
                                    (normalizedResult.obtainedMarks/normalizedResult.maxMarks*100) >= 90 ? 'bg-green-600' :
                                    (normalizedResult.obtainedMarks/normalizedResult.maxMarks*100) >= 80 ? 'bg-blue-600' :
                                    (normalizedResult.obtainedMarks/normalizedResult.maxMarks*100) >= 70 ? 'bg-yellow-600' :
                                    (normalizedResult.obtainedMarks/normalizedResult.maxMarks*100) >= 60 ? 'bg-orange-600' :
                                    'bg-red-600'
                                  }`}>
                                    {((normalizedResult.obtainedMarks / normalizedResult.maxMarks) * 100).toFixed(2)}%
                                  </span>
                                </TableCell>
                                <TableCell className="text-center">{new Date(result.examDate).toLocaleDateString()}</TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4">
                              {user?.name === "V Dhruv" && minorExamType === "Minor1" ? (
                                <div className="py-2">
                                  <Table>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell className="font-medium">MA201</TableCell>
                                        <TableCell>Linear Algebra</TableCell>
                                        <TableCell className="text-center">15</TableCell>
                                        <TableCell className="text-center">12.5</TableCell>
                                        <TableCell className="text-center">
                                          <span className="px-2 py-1 rounded-md text-white bg-green-600">
                                            83.33%
                                          </span>
                                        </TableCell>
                                        <TableCell className="text-center">10/08/2024</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-medium">MA202</TableCell>
                                        <TableCell>Differential Equations</TableCell>
                                        <TableCell className="text-center">15</TableCell>
                                        <TableCell className="text-center">11</TableCell>
                                        <TableCell className="text-center">
                                          <span className="px-2 py-1 rounded-md text-white bg-blue-600">
                                            73.33%
                                          </span>
                                        </TableCell>
                                        <TableCell className="text-center">15/08/2024</TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>
                              ) : (
                                <Alert>
                                  <AlertCircle className="h-4 w-4 mr-2" />
                                  <AlertDescription>
                                    No minor exam results found for the selected criteria.
                                  </AlertDescription>
                                </Alert>
                              )}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {selectedSemester === "2" ? (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="col-span-1 md:col-span-2">
                          <p className="text-sm text-muted-foreground mb-2">Semester {selectedSemester} Courses:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {Object.keys(syllabusContent).map((subject) => (
                              <Dialog key={subject}>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    className="w-full justify-start text-left h-auto py-3"
                                    onClick={() => setSelectedSyllabusSubject(subject)}
                                  >
                                    <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <span className="truncate">{subject}</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                  <DialogHeader>
                                    <DialogTitle className="text-xl">{selectedSyllabusSubject}</DialogTitle>
                                    <DialogDescription>
                                      Course Syllabus for Semester {selectedSemester}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <ScrollArea className="max-h-[60vh] mt-4">
                                    <div className="p-2 text-justify whitespace-pre-line">
                                      {syllabusContent[selectedSyllabusSubject]}
                                    </div>
                                  </ScrollArea>
                                </DialogContent>
                              </Dialog>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Alert>
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <AlertDescription>
                          Syllabus for semester {selectedSemester} is not currently available in the system.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
