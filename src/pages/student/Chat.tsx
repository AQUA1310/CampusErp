
import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Send, UserCircle, Users } from "lucide-react";
import { useData, Message } from "@/contexts/DataContext";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { toast } from "sonner";

export default function StudentChat() {
  const { user } = useAuth();
  const { teachers, students, messages, sendMessage, markMessageAsRead } = useData();
  const [messageText, setMessageText] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"teachers" | "students">("teachers");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedTeacher, selectedStudent]);

  // Mark messages as read when selecting a conversation
  useEffect(() => {
    if (selectedTeacher) {
      const unreadMessages = messages.filter(
        (msg) =>
          msg.senderId === selectedTeacher &&
          msg.receiverId === "1" &&
          !msg.read
      );
      
      unreadMessages.forEach((msg) => markMessageAsRead(msg.id));
    }
    
    if (selectedStudent) {
      const unreadMessages = messages.filter(
        (msg) =>
          msg.senderId === selectedStudent &&
          msg.receiverId === "1" &&
          !msg.read
      );
      
      unreadMessages.forEach((msg) => markMessageAsRead(msg.id));
    }
  }, [selectedTeacher, selectedStudent, messages, markMessageAsRead]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim()) return;
    
    if (activeTab === "teachers" && selectedTeacher) {
      const teacher = teachers.find((t) => t.id === selectedTeacher);
      if (!teacher) return;
      
      sendMessage({
        senderId: "1",
        senderName: user?.name || "Student",
        senderType: "student",
        receiverId: selectedTeacher,
        receiverName: teacher.name,
        receiverType: "teacher",
        content: messageText,
      });
    } else if (activeTab === "students" && selectedStudent) {
      const student = students.find((s) => s.id === selectedStudent);
      if (!student) return;
      
      sendMessage({
        senderId: "1",
        senderName: user?.name || "Student",
        senderType: "student",
        receiverId: selectedStudent,
        receiverName: student.name,
        receiverType: "student",
        content: messageText,
      });
    } else {
      toast.error("Please select a recipient first");
      return;
    }
    
    setMessageText("");
  };

  const getConversationMessages = () => {
    if (activeTab === "teachers" && selectedTeacher) {
      return messages.filter(
        (msg) =>
          (msg.senderId === "1" && msg.receiverId === selectedTeacher) ||
          (msg.senderId === selectedTeacher && msg.receiverId === "1")
      ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    } else if (activeTab === "students" && selectedStudent) {
      return messages.filter(
        (msg) =>
          (msg.senderId === "1" && msg.receiverId === selectedStudent) ||
          (msg.senderId === selectedStudent && msg.receiverId === "1")
      ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }
    return [];
  };

  const getUnreadMessageCount = (contactId: string, contactType: "teacher" | "student") => {
    return messages.filter(
      (msg) =>
        msg.senderId === contactId &&
        msg.receiverId === "1" &&
        !msg.read &&
        (contactType === "teacher" ? msg.senderType === "teacher" : msg.senderType === "student")
    ).length;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <DashboardLayout title="Messages" subtitle="Chat with teachers and classmates">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-13rem)]">
        {/* Contacts List */}
        <Card className="shadow-md md:col-span-1 border border-oliveGreen-100 flex flex-col h-full">
          <CardHeader className="pb-3 bg-oliveGreen-50 border-b border-oliveGreen-100 rounded-t-lg flex-shrink-0">
            <CardTitle className="text-oliveGreen-800">Contacts</CardTitle>
            <CardDescription className="text-oliveGreen-600">
              Select a contact to start chatting
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 flex-1 flex flex-col overflow-hidden">
            <Tabs
              defaultValue="teachers"
              className="flex-1 flex flex-col"
              onValueChange={(value) => {
                setActiveTab(value as "teachers" | "students");
                setSelectedTeacher(null);
                setSelectedStudent(null);
              }}
            >
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="teachers" className="flex gap-2 items-center">
                  <UserCircle className="h-4 w-4" />
                  <span>Teachers</span>
                </TabsTrigger>
                <TabsTrigger value="students" className="flex gap-2 items-center">
                  <Users className="h-4 w-4" />
                  <span>Students</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="teachers" className="flex-1 overflow-hidden flex flex-col mt-0">
                <div className="space-y-1 overflow-y-auto flex-1 pr-1">
                  {teachers.map((teacher) => {
                    const unreadCount = getUnreadMessageCount(teacher.id, "teacher");
                    
                    return (
                      <div
                        key={teacher.id}
                        className={`
                          flex items-center gap-3 p-2 rounded-lg cursor-pointer
                          ${selectedTeacher === teacher.id 
                            ? "bg-oliveGreen-100" 
                            : "hover:bg-oliveGreen-50"}
                        `}
                        onClick={() => setSelectedTeacher(teacher.id)}
                      >
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-oliveGreen-200 text-oliveGreen-800">
                            {teacher.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-oliveGreen-900 truncate">
                              Prof. {teacher.name}
                            </h4>
                            {unreadCount > 0 && (
                              <Badge className="bg-oliveGreen-600 ml-2">
                                {unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-oliveGreen-600">
                            {teacher.department}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
              
              <TabsContent value="students" className="flex-1 overflow-hidden flex flex-col mt-0">
                <div className="space-y-1 overflow-y-auto flex-1 pr-1">
                  {students
                    .filter((student) => student.id !== "1") // Don't show current user
                    .map((student) => {
                      const unreadCount = getUnreadMessageCount(student.id, "student");
                      
                      return (
                        <div
                          key={student.id}
                          className={`
                            flex items-center gap-3 p-2 rounded-lg cursor-pointer
                            ${selectedStudent === student.id 
                              ? "bg-oliveGreen-100" 
                              : "hover:bg-oliveGreen-50"}
                          `}
                          onClick={() => setSelectedStudent(student.id)}
                        >
                          <Avatar>
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback className="bg-oliveGreen-100 text-oliveGreen-800">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium text-oliveGreen-900 truncate">
                                {student.name}
                              </h4>
                              {unreadCount > 0 && (
                                <Badge className="bg-oliveGreen-600 ml-2">
                                  {unreadCount}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-oliveGreen-600">
                              {student.rollNumber}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="shadow-md md:col-span-2 border border-oliveGreen-100 flex flex-col h-full">
          <CardHeader className="pb-3 bg-oliveGreen-50 border-b border-oliveGreen-100 rounded-t-lg flex-shrink-0">
            {activeTab === "teachers" && selectedTeacher ? (
              <>
                <CardTitle className="text-oliveGreen-800">
                  {teachers.find((t) => t.id === selectedTeacher)?.name || "Teacher"}
                </CardTitle>
                <CardDescription className="text-oliveGreen-600">
                  {teachers.find((t) => t.id === selectedTeacher)?.department || ""}
                </CardDescription>
              </>
            ) : activeTab === "students" && selectedStudent ? (
              <>
                <CardTitle className="text-oliveGreen-800">
                  {students.find((s) => s.id === selectedStudent)?.name || "Student"}
                </CardTitle>
                <CardDescription className="text-oliveGreen-600">
                  {students.find((s) => s.id === selectedStudent)?.rollNumber || ""}
                </CardDescription>
              </>
            ) : (
              <>
                <CardTitle className="text-oliveGreen-800">Chat</CardTitle>
                <CardDescription className="text-oliveGreen-600">
                  Select a contact to start chatting
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
            {(selectedTeacher || selectedStudent) ? (
              <>
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4">
                  {getConversationMessages().length > 0 ? (
                    getConversationMessages().map((message: Message) => (
                      <div
                        key={message.id}
                        className={`flex mb-4 ${
                          message.senderId === "1" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.senderId === "1"
                              ? "bg-oliveGreen-600 text-white"
                              : "bg-gray-100"
                          }`}
                        >
                          <p>{message.content}</p>
                          <div
                            className={`text-right text-xs mt-1 ${
                              message.senderId === "1"
                                ? "text-oliveGreen-200"
                                : "text-gray-500"
                            }`}
                          >
                            {formatTimestamp(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <p>No messages yet</p>
                        <p className="text-sm">Send a message to start the conversation</p>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      className="bg-oliveGreen-600 hover:bg-oliveGreen-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto text-oliveGreen-300" />
                  <h3 className="mt-4 text-xl font-medium text-oliveGreen-700">
                    Select a contact
                  </h3>
                  <p className="mt-2">
                    Choose a teacher or student to start a conversation
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
