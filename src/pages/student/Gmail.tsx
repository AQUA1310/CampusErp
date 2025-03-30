
import { useState } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Mail, 
  Inbox, 
  Send as SendIcon, 
  Star, 
  Trash, 
  Plus, 
  RefreshCw,
  Search,
  Archive,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

const mockEmails = [
  {
    id: "1",
    from: "abenerji@nitw.ac.in",
    fromName: "A Benerji Babu",
    to: "vd24mab0a41@student.nitw.ac.in",
    subject: "Assignment Submission Deadline",
    content: "Dear Dhruv,\n\nThis is a reminder that your Design Thinking assignment is due tomorrow. Please ensure timely submission.\n\nRegards,\nA Benerji Babu\nMathematics Department",
    date: "2023-11-05",
    read: true,
    folder: "inbox"
  },
  {
    id: "2",
    from: "dsacharya@nitw.ac.in",
    fromName: "D Srinivasacharya",
    to: "vd24mab0a41@student.nitw.ac.in",
    subject: "DMS Quiz Next Week",
    content: "Dear Students,\n\nThere will be a quiz on Discrete Mathematical Structures next Wednesday covering all topics we've discussed so far.\n\nBest,\nD. Srinivasacharya",
    date: "2023-11-03",
    read: false,
    folder: "inbox"
  },
  {
    id: "3",
    from: "registrar@nitw.ac.in",
    fromName: "Registrar, NIT Warangal",
    to: "vd24mab0a41@student.nitw.ac.in",
    subject: "Mid-semester Examination Schedule",
    content: "Dear Students,\n\nThe mid-semester examination schedule has been released. Please check the attached schedule and prepare accordingly.\n\nRegards,\nRegistrar\nNIT Warangal",
    date: "2023-11-01",
    read: true,
    folder: "inbox"
  },
  {
    id: "4",
    from: "vd24mab0a41@student.nitw.ac.in",
    fromName: "V Dhruv",
    to: "abenerji@nitw.ac.in",
    subject: "Request for Assignment Extension",
    content: "Dear Professor,\n\nI am writing to request a short extension on the upcoming Design Thinking assignment. I've been facing some technical difficulties with the project and would appreciate a couple more days to perfect it.\n\nThank you for your consideration.\n\nBest regards,\nV Dhruv\n24MAB0A41",
    date: "2023-11-04",
    read: true,
    folder: "sent"
  },
  {
    id: "5",
    from: "vd24mab0a41@student.nitw.ac.in",
    fromName: "V Dhruv",
    to: "studentsupport@nitw.ac.in",
    subject: "Query Regarding Scholarship",
    content: "Dear Student Support Team,\n\nI hope this email finds you well. I am writing to inquire about the status of my scholarship application submitted last month.\n\nCould you please provide me with an update?\n\nThank you.\n\nRegards,\nV Dhruv\n24MAB0A41",
    date: "2023-10-28",
    read: true,
    folder: "sent"
  }
];

export default function StudentGmail() {
  const { user } = useAuth();
  const [emails, setEmails] = useState(mockEmails);
  const [currentTab, setCurrentTab] = useState("inbox");
  const [selectedEmail, setSelectedEmail] = useState<typeof mockEmails[0] | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [newEmail, setNewEmail] = useState({
    to: "",
    subject: "",
    content: ""
  });
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEmails = emails.filter(email => {
    if (currentTab === "inbox") {
      return email.folder === "inbox" && 
        (email.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
         email.fromName.toLowerCase().includes(searchQuery.toLowerCase()));
    } else if (currentTab === "sent") {
      return email.folder === "sent" && 
        (email.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
         email.to.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return false;
  });

  const unreadCount = emails.filter(email => email.folder === "inbox" && !email.read).length;

  const handleSend = () => {
    if (!newEmail.to || !newEmail.subject || !newEmail.content) {
      toast.error("Please fill all the fields");
      return;
    }

    const sentEmail = {
      id: `${emails.length + 1}`,
      from: user?.email || "",
      fromName: user?.name || "",
      to: newEmail.to,
      subject: newEmail.subject,
      content: newEmail.content,
      date: new Date().toISOString().slice(0, 10),
      read: true,
      folder: "sent"
    };

    setEmails([sentEmail, ...emails]);
    setNewEmail({ to: "", subject: "", content: "" });
    setIsComposing(false);
    toast.success("Email sent successfully");
  };

  const markAsRead = (id: string) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, read: true } : email
    ));
  };

  const viewEmail = (email: typeof mockEmails[0]) => {
    setSelectedEmail(email);
    if (!email.read && email.folder === "inbox") {
      markAsRead(email.id);
    }
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    setSelectedEmail(null);
  };

  return (
    <DashboardLayout title="Email" subtitle="Manage your emails">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="md:col-span-1 shadow-md">
          <CardContent className="p-4">
            <Dialog open={isComposing} onOpenChange={setIsComposing}>
              <DialogTrigger asChild>
                <Button className="w-full mb-4 bg-primary text-white">
                  <Plus className="mr-2 h-4 w-4" /> Compose
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Compose Email</DialogTitle>
                  <DialogDescription>
                    Create a new email to send
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 my-4">
                  <div>
                    <Input 
                      placeholder="To" 
                      value={newEmail.to}
                      onChange={(e) => setNewEmail({...newEmail, to: e.target.value})}
                    />
                  </div>
                  <div>
                    <Input 
                      placeholder="Subject" 
                      value={newEmail.subject}
                      onChange={(e) => setNewEmail({...newEmail, subject: e.target.value})}
                    />
                  </div>
                  <div>
                    <Textarea 
                      placeholder="Message" 
                      className="min-h-[200px]"
                      value={newEmail.content}
                      onChange={(e) => setNewEmail({...newEmail, content: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsComposing(false)}>Cancel</Button>
                  <Button onClick={handleSend}>Send</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Tabs defaultValue="inbox" value={currentTab} onValueChange={handleTabChange}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="inbox" className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Inbox className="mr-2 h-4 w-4" /> Inbox
                  </div>
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-primary text-white">
                      {unreadCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="sent">
                  <SendIcon className="mr-2 h-4 w-4" /> Sent
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <Star className="mr-2 h-4 w-4" /> Starred
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <AlertCircle className="mr-2 h-4 w-4" /> Important
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Archive className="mr-2 h-4 w-4" /> Archived
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Trash className="mr-2 h-4 w-4" /> Trash
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main content */}
        <Card className="md:col-span-3 shadow-md">
          <CardHeader className="bg-primary/5 px-4 py-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                {currentTab === "inbox" ? "Inbox" : "Sent Items"}
              </CardTitle>
              <CardDescription>
                {currentTab === "inbox" ? 
                  `${filteredEmails.length} emails, ${unreadCount} unread` : 
                  `${filteredEmails.length} sent emails`
                }
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search emails" 
                  className="pl-8 w-full md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="ghost" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {selectedEmail ? (
              <div className="p-4">
                <Button variant="outline" size="sm" onClick={() => setSelectedEmail(null)} className="mb-4">
                  Back to {currentTab}
                </Button>
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold">{selectedEmail.subject}</h2>
                    <div className="flex items-start mt-2 justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {selectedEmail.folder === "inbox" ? selectedEmail.fromName.charAt(0) : selectedEmail.to.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {selectedEmail.folder === "inbox" ? selectedEmail.fromName : `To: ${selectedEmail.to}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {selectedEmail.folder === "inbox" ? selectedEmail.from : `Sent on ${selectedEmail.date}`}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedEmail.date}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="whitespace-pre-line min-h-[300px]">
                    {selectedEmail.content}
                  </div>
                  {selectedEmail.folder === "inbox" && (
                    <div className="pt-4">
                      <Button onClick={() => {
                        setIsComposing(true);
                        setNewEmail({
                          to: selectedEmail.from,
                          subject: `Re: ${selectedEmail.subject}`,
                          content: `\n\n\nOn ${selectedEmail.date}, ${selectedEmail.fromName} wrote:\n\n${selectedEmail.content}`
                        });
                      }}>
                        Reply
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/5">
                    <TableHead className="w-[200px]">
                      {currentTab === "inbox" ? "From" : "To"}
                    </TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-right w-[100px]">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmails.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        No emails found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEmails.map((email) => (
                      <TableRow 
                        key={email.id}
                        className={`cursor-pointer ${!email.read && email.folder === "inbox" ? "font-medium bg-primary/5" : ""}`}
                        onClick={() => viewEmail(email)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {currentTab === "inbox" ? email.fromName.charAt(0) : email.to.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="truncate max-w-[150px]">
                              {currentTab === "inbox" ? email.fromName : email.to}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="truncate max-w-[300px]">{email.subject}</TableCell>
                        <TableCell className="text-right text-muted-foreground text-sm">{email.date}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
