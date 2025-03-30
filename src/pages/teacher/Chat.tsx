
import { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/hooks/useAuth";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Send, 
  UserCircle,
  MoreVertical,
  Download,
  File
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function TeacherChat() {
  const { user } = useAuth();
  const { students, messages, submissions, sendMessage, markMessageAsRead } = useData();
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-select Dhruv if available when component loads
  useEffect(() => {
    if (!selectedStudent && students.length > 0) {
      const dhruv = students.find(s => s.name === "V Dhruv");
      if (dhruv) {
        setSelectedStudent(dhruv.id);
      } else {
        setSelectedStudent(students[0].id);
      }
    }
  }, [students, selectedStudent]);

  // Get selected student details
  const student = students.find(s => s.id === selectedStudent);

  // Get relevant messages between the teacher and selected student
  const conversation = selectedStudent && user
    ? messages.filter(
        msg =>
          (msg.senderId === user.id && msg.receiverId === selectedStudent) ||
          (msg.senderId === selectedStudent && msg.receiverId === user.id)
      )
    : [];

  // Sort messages by timestamp
  const sortedMessages = [...conversation].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Get student's submissions
  const studentSubmissions = selectedStudent 
    ? submissions.filter(sub => sub.studentId === selectedStudent)
    : [];

  // Mark received messages as read when opening conversation
  useEffect(() => {
    if (selectedStudent && user) {
      const unreadMessages = sortedMessages.filter(
        msg => msg.senderId === selectedStudent && !msg.read
      );

      unreadMessages.forEach(msg => {
        markMessageAsRead(msg.id);
      });
    }
  }, [selectedStudent, sortedMessages, user, markMessageAsRead]);

  // Scroll to bottom of messages when new messages come in
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sortedMessages]);

  // Send message handler
  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedStudent || !user) return;

    sendMessage({
      senderId: user.id,
      senderName: user.name,
      senderType: "teacher",
      receiverId: selectedStudent,
      receiverName: student?.name || "Student",
      receiverType: "student",
      content: messageText,
    });

    setMessageText("");
  };

  // Handle key press for sending message
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Count unread messages from a student
  const countUnreadMessages = (studentId: string) => {
    if (!user) return 0;
    
    return messages.filter(
      msg => msg.senderId === studentId && msg.receiverId === user.id && !msg.read
    ).length;
  };

  // Format timestamp to readable format
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle assignment download
  const handleDownloadAssignment = (submissionId: string, fileName: string) => {
    // In a real app, this would initiate a download for the actual file
    // For this demo, we'll create a fake download link
    const link = document.createElement('a');
    link.href = '#';
    link.setAttribute('download', fileName);
    link.click();
    
    toast.success(`Downloading assignment: ${fileName}`);
  };

  return (
    <DashboardLayout title="Messages" subtitle="Chat with your students">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Student List */}
        <Card className="md:col-span-1 shadow-md">
          <CardHeader className="bg-primary/5">
            <CardTitle className="text-lg">Students</CardTitle>
            <CardDescription>Select a student to chat</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y max-h-[60vh] overflow-y-auto">
              {students.map((student) => {
                const unreadCount = countUnreadMessages(student.id);
                
                return (
                  <div 
                    key={student.id}
                    className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors
                      ${selectedStudent === student.id ? "bg-primary/5" : ""}
                    `}
                    onClick={() => setSelectedStudent(student.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/20 text-primary-800">
                          {student.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-medium text-sm truncate">{student.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{student.rollNumber}</p>
                      </div>
                      {unreadCount > 0 && (
                        <span className="bg-primary text-white text-xs font-medium px-2 py-0.5 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="md:col-span-3 shadow-md flex flex-col h-[70vh]">
          {selectedStudent && student ? (
            <>
              <CardHeader className="bg-primary/5 px-4 py-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/20 text-primary-800">
                        {student.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{student.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {student.rollNumber} • {student.profile?.department || "Student"}
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white">
                      <DropdownMenuLabel>Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Clear Chat</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              {studentSubmissions.length > 0 && (
                <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-700">Submitted Assignments</p>
                    <span className="text-xs text-blue-500">{studentSubmissions.length} submissions</span>
                  </div>
                  <div className="mt-2 space-y-2">
                    {studentSubmissions.map(submission => {
                      const assignmentName = submission.assignmentId ? 
                        "Assignment " + submission.assignmentId :
                        "Untitled Assignment";
                      const fileName = `${student.rollNumber}_${assignmentName}.pdf`;
                      
                      return (
                        <div key={submission.id} className="flex items-center justify-between bg-white p-2 rounded-md border border-blue-100">
                          <div className="flex items-center gap-2">
                            <File className="h-4 w-4 text-blue-500" />
                            <div>
                              <p className="text-sm font-medium">{assignmentName}</p>
                              <p className="text-xs text-gray-500">Submitted: {new Date(submission.submittedAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-primary border-primary hover:bg-primary/10"
                            onClick={() => handleDownloadAssignment(submission.id, fileName)}
                          >
                            <Download className="h-3.5 w-3.5 mr-1" />
                            Download
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {sortedMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                    <UserCircle className="h-16 w-16 text-muted-foreground/50 mb-2" />
                    <p>No messages yet</p>
                    <p className="text-sm">Send a message to start the conversation</p>
                  </div>
                ) : (
                  sortedMessages.map((msg, index) => {
                    const isCurrentUser = msg.senderId === user?.id;
                    const isFirstMessageOfDay = index === 0 || 
                      new Date(msg.timestamp).toDateString() !== 
                      new Date(sortedMessages[index - 1].timestamp).toDateString();
                    
                    return (
                      <div key={msg.id}>
                        {isFirstMessageOfDay && (
                          <div className="flex justify-center my-4">
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-md">
                              {new Date(msg.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        <div
                          className={`flex ${
                            isCurrentUser ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                              isCurrentUser
                                ? "bg-primary text-white rounded-br-none"
                                : "bg-gray-100 text-gray-800 rounded-bl-none"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <div
                              className={`text-xs mt-1 ${
                                isCurrentUser ? "text-primary-100" : "text-gray-500"
                              }`}
                            >
                              {formatTime(msg.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </CardContent>

              <div className="p-3 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center text-muted-foreground">
              <UserCircle className="h-20 w-20 text-muted-foreground/30 mb-4" />
              <h3 className="font-medium text-lg text-primary-900 mb-2">
                Select a Student
              </h3>
              <p>
                Choose a student from the list to start a conversation.
              </p>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
