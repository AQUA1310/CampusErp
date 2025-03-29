
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useData } from "@/contexts/DataContext";
import DashboardLayout from "@/components/shared/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  User,
  Search,
  UserRound
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function TeacherChat() {
  const { user, studentList } = useAuth();
  const { messages, sendMessage, markMessageAsRead } = useData();
  const [message, setMessage] = useState("");
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter messages that involve the current user
  const userMessages = messages.filter(
    (msg) =>
      (msg.senderId === user?.id || msg.receiverId === user?.id)
  );

  // Get unique contacts from messages
  const userContacts = [
    ...new Set([
      ...userMessages
        .filter((msg) => msg.senderId !== user?.id)
        .map((msg) => msg.senderId),
      ...userMessages
        .filter((msg) => msg.receiverId !== user?.id)
        .map((msg) => msg.receiverId),
    ]),
  ];

  // Group messages by contact
  const messagesByContact = userContacts.reduce((acc, contactId) => {
    const contactMessages = userMessages.filter(
      (msg) =>
        (msg.senderId === contactId && msg.receiverId === user?.id) ||
        (msg.senderId === user?.id && msg.receiverId === contactId)
    );
    const contact = studentList.find((s) => s.id === contactId);
    
    if (contact) {
      acc[contactId] = {
        contact: {
          id: contact.id,
          name: contact.name,
          email: contact.email,
          rollNumber: contact.rollNumber,
          type: "student" as const,
        },
        messages: contactMessages.sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        ),
        unread: contactMessages.filter(
          (msg) => msg.receiverId === user?.id && !msg.read
        ).length,
      };
    }
    
    return acc;
  }, {} as Record<string, { 
    contact: { id: string, name: string, email: string, rollNumber: string, type: "student" }, 
    messages: typeof messages, 
    unread: number 
  }>);

  // Add all students as potential contacts even if no messages exist yet
  studentList.forEach(student => {
    if (!messagesByContact[student.id]) {
      messagesByContact[student.id] = {
        contact: {
          id: student.id,
          name: student.name,
          email: student.email,
          rollNumber: student.rollNumber,
          type: "student",
        },
        messages: [],
        unread: 0,
      };
    }
  });

  // Filter contacts by search query
  const filteredContacts = Object.entries(messagesByContact).filter(
    ([_, { contact }]) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        contact.name.toLowerCase().includes(query) ||
        contact.rollNumber.toLowerCase().includes(query)
      );
    }
  );

  // Get active contact details
  const activeContact = activeChat ? messagesByContact[activeChat]?.contact : null;
  const activeMessages = activeChat ? messagesByContact[activeChat]?.messages : [];

  // Mark messages as read when viewing a conversation
  useEffect(() => {
    if (activeChat) {
      const unreadMessages = activeMessages.filter(
        (msg) => msg.receiverId === user?.id && !msg.read
      );
      unreadMessages.forEach((msg) => {
        markMessageAsRead(msg.id);
      });
    }
  }, [activeChat, activeMessages, user?.id, markMessageAsRead]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  const handleSendMessage = () => {
    if (!message.trim() || !activeChat || !activeContact) return;

    sendMessage({
      senderId: user?.id || "",
      senderName: user?.name || "",
      senderType: "teacher",
      receiverId: activeContact.id,
      receiverName: activeContact.name,
      receiverType: "student",
      content: message,
    });

    setMessage("");
  };

  const getNameInitials = (name: string) => {
    const nameParts = name.split(' ');
    return nameParts.length > 1 
      ? `${nameParts[0][0]}${nameParts[1][0]}` 
      : name.slice(0, 2).toUpperCase();
  };

  // Count total unread messages
  const totalUnread = Object.values(messagesByContact).reduce(
    (sum, { unread }) => sum + unread,
    0
  );

  return (
    <DashboardLayout title="Messages" subtitle="Chat with your students">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contacts list */}
        <div className="md:col-span-1">
          <Card className="h-[calc(100vh-200px)] overflow-hidden">
            <CardHeader className="bg-slate-50 pb-3">
              <div className="flex justify-between items-center mb-2">
                <CardTitle className="text-lg">Students</CardTitle>
                {totalUnread > 0 && (
                  <Badge className="bg-primary">{totalUnread} unread</Badge>
                )}
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or roll no..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[calc(100%-90px)] overflow-y-auto">
                {filteredContacts.length > 0 ? (
                  <div className="divide-y">
                    {filteredContacts.map(([contactId, { contact, messages, unread }]) => (
                      <button
                        key={contactId}
                        className={`w-full text-left p-3 hover:bg-slate-50 transition-colors ${
                          activeChat === contactId ? "bg-slate-100" : ""
                        }`}
                        onClick={() => setActiveChat(contactId)}
                      >
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3 bg-primary">
                            <AvatarFallback>{getNameInitials(contact.name)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <p className="font-medium truncate">{contact.name}</p>
                              {unread > 0 && (
                                <Badge className="ml-2 bg-primary">{unread}</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {contact.rollNumber}
                            </p>
                            {messages.length > 0 && (
                              <p className="text-sm text-muted-foreground truncate mt-1">
                                {messages[messages.length - 1].content.substring(0, 30)}
                                {messages[messages.length - 1].content.length > 30 && "..."}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-muted-foreground">
                    No students found matching "{searchQuery}".
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat area */}
        <div className="md:col-span-2">
          <Card className="h-[calc(100vh-200px)] flex flex-col">
            {activeContact ? (
              <>
                <CardHeader className="bg-slate-50 pb-3 flex-shrink-0">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3 bg-primary">
                      <AvatarFallback>{getNameInitials(activeContact.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{activeContact.name}</CardTitle>
                      <CardDescription>{activeContact.rollNumber} • {activeContact.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4">
                  {activeMessages.length > 0 ? (
                    activeMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.senderId === user?.id ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] rounded-lg p-3 ${
                            msg.senderId === user?.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-slate-100 text-slate-900"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.senderId === user?.id
                                ? "text-primary-foreground/70"
                                : "text-slate-500"
                            }`}
                          >
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <UserRound className="h-12 w-12 text-muted-foreground mb-2" />
                      <p className="font-medium">No messages yet</p>
                      <p className="text-sm text-muted-foreground">
                        Send a message to start a conversation with {activeContact.name}
                      </p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </CardContent>
                <div className="p-3 border-t bg-slate-50 flex items-end gap-2">
                  <Textarea
                    placeholder={`Message ${activeContact.name}...`}
                    className="min-h-[60px] resize-none bg-white"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    size="icon"
                    className="h-10 w-10 rounded-full bg-primary text-primary-foreground"
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <User className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-2">Select a Student</h3>
                <p className="text-muted-foreground mb-4">
                  Choose a student from the list to start a conversation
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
