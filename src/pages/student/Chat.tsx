
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
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function StudentChat() {
  const { user } = useAuth();
  const { teachers, messages, sendMessage, markMessageAsRead } = useData();
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-select first teacher if none selected
  useEffect(() => {
    if (!selectedTeacher && teachers.length > 0) {
      // Auto-select A Benerji Babu as requested
      const benerjiTeacher = teachers.find(t => t.name === "A Benerji Babu");
      if (benerjiTeacher) {
        setSelectedTeacher(benerjiTeacher.id);
      } else {
        setSelectedTeacher(teachers[0].id);
      }
    }
  }, [teachers, selectedTeacher]);

  // Get selected teacher details
  const teacher = teachers.find(t => t.id === selectedTeacher);

  // Get relevant messages between the student and selected teacher
  const conversation = selectedTeacher
    ? messages.filter(
        msg =>
          (msg.senderId === user?.id && msg.receiverId === selectedTeacher) ||
          (msg.senderId === selectedTeacher && msg.receiverId === user?.id)
      )
    : [];

  // Sort messages by timestamp
  const sortedMessages = [...conversation].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Mark received messages as read when opening conversation
  useEffect(() => {
    if (selectedTeacher && user) {
      const unreadMessages = sortedMessages.filter(
        msg => msg.senderId === selectedTeacher && !msg.read
      );

      unreadMessages.forEach(msg => {
        markMessageAsRead(msg.id);
      });
    }
  }, [selectedTeacher, sortedMessages, user, markMessageAsRead]);

  // Scroll to bottom of messages when new messages come in
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sortedMessages]);

  // Send message handler
  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedTeacher || !user) return;

    sendMessage({
      senderId: user.id,
      senderName: user.name,
      senderType: "student",
      receiverId: selectedTeacher,
      receiverName: teacher?.name || "Teacher",
      receiverType: "teacher",
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

  // Count unread messages from a teacher
  const countUnreadMessages = (teacherId: string) => {
    return messages.filter(
      msg => msg.senderId === teacherId && msg.receiverId === user?.id && !msg.read
    ).length;
  };

  // Format timestamp to readable format
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <DashboardLayout title="Messages" subtitle="Chat with your teachers">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Teacher List */}
        <Card className="md:col-span-1 shadow-md">
          <CardHeader className="bg-primary/5">
            <CardTitle className="text-lg">Teachers</CardTitle>
            <CardDescription>Select a teacher to chat</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {teachers.map((teacher) => {
                const unreadCount = countUnreadMessages(teacher.id);
                
                return (
                  <div 
                    key={teacher.id}
                    className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors
                      ${selectedTeacher === teacher.id ? "bg-primary/5" : ""}
                    `}
                    onClick={() => setSelectedTeacher(teacher.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/20 text-primary-800">
                          {teacher.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-medium text-sm truncate">{teacher.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{teacher.department}</p>
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
          {selectedTeacher && teacher ? (
            <>
              <CardHeader className="bg-primary/5 px-4 py-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/20 text-primary-800">
                        {teacher.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{teacher.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {teacher.department}
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Clear Chat</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

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
                Select a Teacher
              </h3>
              <p>
                Choose a teacher from the list to start a conversation.
              </p>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
