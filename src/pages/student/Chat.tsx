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
import { Send, User, MessageSquare, Clock, Building } from "lucide-react";

export default function Chat() {
  const { user } = useAuth();
  const {
    teachers,
    messages,
    sendMessage,
    markMessageAsRead,
  } = useData();
  const [message, setMessage] = useState("");
  const [activeChat, setActiveChat] = useState<string | null>(null);
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
    const contact = teachers.find((t) => t.id === contactId);
    
    if (contact) {
      const isCurrentlyViewing = activeChat === contactId;
      acc[contactId] = {
        contact: {
          id: contact.id,
          name: contact.name,
          email: contact.email,
          type: "teacher" as const,
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
  }, {} as Record<string, { contact: { id: string, name: string, email: string, type: "teacher" }, messages: typeof messages, unread: number }>);

  // Add all teachers as potential contacts even if no messages exist yet
  teachers.forEach(teacher => {
    if (!messagesByContact[teacher.id]) {
      messagesByContact[teacher.id] = {
        contact: {
          id: teacher.id,
          name: teacher.name,
          email: teacher.email,
          type: "teacher",
        },
        messages: [],
        unread: 0,
      };
    }
  });

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
      senderType: "student",
      receiverId: activeContact.id,
      receiverName: activeContact.name,
      receiverType: "teacher",
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

  return (
    <DashboardLayout title="Messages" subtitle="Chat with your teachers and academic advisors">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Contacts list */}
        <div className="md:col-span-1">
          <Card className="h-[calc(100vh-220px)] overflow-hidden shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50/70 pb-4 border-b">
              <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" /> Faculty Directory
              </CardTitle>
              <CardDescription>Select a professor to begin chatting</CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-full">
              <div className="h-[calc(100%-85px)] overflow-y-auto divide-y divide-slate-100">
                {Object.entries(messagesByContact).length > 0 ? (
                  Object.entries(messagesByContact).map(([contactId, { contact, messages, unread }]) => (
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
                          <Building className="h-3 w-3" /> {contact.email}
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
                    No faculty contacts loaded.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat window pane */}
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
                        <Clock className="h-3 w-3" /> {activeContact.email}
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
                      <p className="font-semibold text-sm text-slate-700">No previous message log</p>
                      <p className="text-xs text-slate-400 max-w-xs mt-0.5">
                        Send an initial query to open secure discussions with {activeContact.name}.
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
                <MessageSquare className="h-14 w-14 text-slate-200 mb-3" />
                <h3 className="font-bold text-base text-slate-700 mb-1">Select a Contact</h3>
                <p className="text-xs text-slate-400 max-w-xs">
                  Choose a teacher or faculty advisor from your directory side panel to open your communications portal.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}