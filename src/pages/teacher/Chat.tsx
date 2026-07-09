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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, User, Search, UserRound, Clock, Bookmark } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function TeacherChat() {
  const { user } = useAuth();
  const {
    students,
    messages,
    sendMessage,
    markMessageAsRead,
  } = useData();
  const [message, setMessage] = useState("");
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter messages that involve the current user
  const userMessages = messages.filter(
    (msg) => msg.senderId === user?.id || msg.receiverId === user?.id
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
    const contact = students.find((s) => s.id === contactId);
    
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
  students.forEach(student => {
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
      content: message.trim(),
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Contacts list */}
        <div className="md:col-span-1">
          <Card className="h-[calc(100vh-220px)] overflow-hidden shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50/70 pb-3 border-b">
              <div className="flex justify-between items-center mb-2">
                <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-primary" /> Active Students
                </CardTitle>
                {totalUnread > 0 && (
                  <Badge className="bg-primary px-2 py-0.5 rounded-full text-xs font-semibold">{totalUnread} new</Badge>
                )}
              </div>
              <div className="relative mt-1">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <Input
                  placeholder="Search by name or roll no..."
                  className="pl-8 bg-white h-9 border-slate-200 focus-visible:ring-primary text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0 h-full">
              <div className="h-[calc(100%-110px)] overflow-y-auto divide-y divide-slate-100">
                {filteredContacts.length > 0 ? (
                  filteredContacts.map(([contactId, { contact, messages, unread }]) => (
                    <button
                      key={contactId}
                      className={`w-full text-left p-4 hover:bg-slate-50/80 transition-colors flex items-start gap-3 ${
                        activeChat === contactId ? "bg-slate-100/70 border-r-4 border-primary" : ""
                      }`}
                      onClick={() => setActiveChat(contactId)}
                    >
                      <Avatar className="h-10 w-10 bg-primary text-white shadow-sm flex-shrink-0">
                        <AvatarFallback className="text-xs font-bold">{getNameInitials(contact.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <p className="font-semibold text-sm truncate text-slate-900">{contact.name}</p>
                          {unread > 0 && (
                            <Badge className="ml-2 bg-primary px-1.5 py-0.5 text-[11px] font-bold rounded-full">{unread}</Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                          <Bookmark className="h-3 w-3" /> {contact.rollNumber} • {contact.email}
                        </p>
                        {messages.length > 0 && (
                          <p className="text-xs text-slate-500 truncate mt-1.5 bg-slate-50 p-1.5 rounded border border-dashed border-slate-100">
                            {messages[messages.length - 1].content}
                          </p>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-6 text-center text-muted-foreground text-sm">
                    No matching student profiles found.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat area */}
        <div className="md:col-span-2">
          <Card className="h-[calc(100vh-220px)] flex flex-col shadow-md border-slate-200 overflow-hidden">
            {activeContact ? (
              <>
                <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 bg-primary text-white shadow-sm">
                      <AvatarFallback className="text-xs font-bold">{getNameInitials(activeContact.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 leading-tight">{activeContact.name}</h4>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" /> {activeContact.rollNumber} • {activeContact.email}
                      </p>
                    </div>
                  </div>
                </div>

                <CardContent className="flex-1 overflow-y-auto p-4 flex flex-col space-y-3 bg-slate-50/40">
                  {activeMessages.length > 0 ? (
                    activeMessages.map((msg) => {
                      const isMe = msg.senderId === user?.id;
                      return (
                        <div key={msg.id} className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
                          <div className={`flex flex-col max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
                            <div className={`rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm break-words ${
                              isMe 
                                ? "bg-primary text-white rounded-tr-none" 
                                : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                            }`}>
                              <p className="whitespace-pre-wrap">{msg.content}</p>
                            </div>
                            <span className="text-[10px] text-slate-400 mt-1 px-1">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                      <User className="h-12 w-12 text-slate-300 mb-2" />
                      <p className="font-semibold text-sm text-slate-700">No message history</p>
                      <p className="text-xs text-slate-400 max-w-xs mt-0.5">
                        Send a message to initiate communication with {activeContact.name}.
                      </p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </CardContent>

                <div className="p-3 border-t bg-white flex items-end gap-2 shadow-inner">
                  <Textarea
                    placeholder={`Message ${activeContact.name}...`}
                    className="min-h-[50px] max-h-[120px] resize-none bg-slate-50/50 border-slate-200 focus-visible:ring-primary text-sm rounded-xl py-2.5"
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
                    className="h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 flex-shrink-0 shadow-sm"
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-50/20">
                <User className="h-14 w-14 text-slate-200 mb-3" />
                <h3 className="font-bold text-base text-slate-700 mb-1">Select a Student</h3>
                <p className="text-xs text-slate-400 max-w-xs">
                  Choose a student candidate from the roster map list to view their thread records.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}