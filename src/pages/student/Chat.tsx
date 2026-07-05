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
import { Send, User, MessageSquare } from "lucide-react";

export default function Chat() {
  const { user, teacherList = [] } = useAuth();
  const { messages = [], sendMessage, markMessageAsRead } = useData();
  const [message, setMessage] = useState("");
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter messages that involve the current user (Defensively check if messages exist)
  const userMessages = (messages || []).filter(
    (msg) => msg?.senderId === user?.id || msg?.receiverId === user?.id
  );

  // Get unique contacts from messages
  const userContacts = [
    ...new Set([
      ...userMessages
        .filter((msg) => msg?.senderId !== user?.id)
        .map((msg) => msg?.senderId),
      ...userMessages
        .filter((msg) => msg?.receiverId !== user?.id)
        .map((msg) => msg?.receiverId),
    ]),
  ].filter(Boolean); // Clear any undefined/null entries

  // Group messages by contact
  const messagesByContact = userContacts.reduce((acc, contactId) => {
    if (!contactId) return acc;

    const contactMessages = userMessages.filter(
      (msg) =>
        (msg?.senderId === contactId && msg?.receiverId === user?.id) ||
        (msg?.senderId === user?.id && msg?.receiverId === contactId)
    );
    const contact = (teacherList || []).find((t) => t?.id === contactId);
    
    if (contact) {
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
          (msg) => msg?.receiverId === user?.id && !msg?.read
        ).length,
      };
    }
    
    return acc;
  }, {} as Record<string, { contact: { id: string, name: string, email: string, type: "teacher" }, messages: typeof messages, unread: number }>);

  // Defensively use safe navigation or loop execution checks to avoid the runtime error
  if (teacherList && Array.isArray(teacherList)) {
    teacherList.forEach(teacher => {
      if (teacher && teacher.id && !messagesByContact[teacher.id]) {
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
  }

  // Get active contact details safely
  const activeContact = activeChat ? messagesByContact[activeChat]?.contact : null;
  const activeMessages = activeChat ? messagesByContact[activeChat]?.messages || [] : [];

  // Mark messages as read when viewing a conversation
  useEffect(() => {
    if (activeChat && activeMessages.length > 0 && typeof markMessageAsRead === "function") {
      const unreadMessages = activeMessages.filter(
        (msg) => msg?.receiverId === user?.id && !msg?.read
      );
      unreadMessages.forEach((msg) => {
        if (msg?.id) markMessageAsRead(msg.id);
      });
    }
  }, [activeChat, activeMessages, user?.id, markMessageAsRead]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  const handleSendMessage = () => {
    if (!message.trim() || !activeChat || !activeContact || typeof sendMessage !== "function") return;

    sendMessage({
      senderId: user?.id || "",
      senderName: user?.name || "",
      senderType: "student",
      receiverId: activeContact.id,
      receiverName: activeContact.name,
      receiverType: "teacher",
      content: message,
    });

    setMessage("");
  };

  const getNameInitials = (name: string) => {
    if (!name) return "??";
    const nameParts = name.trim().split(' ');
    return nameParts.length > 1 
      ? `${nameParts[0][0]}${nameParts[1][0]}` 
      : name.slice(0, 2).toUpperCase();
  };

  return (
    <DashboardLayout title="Messages" subtitle="Chat with your teachers and academic advisors">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contacts list */}
        <div className="md:col-span-1">
          <Card className="h-[calc(100vh-200px)] overflow-hidden">
            <CardHeader className="bg-slate-50">
              <CardTitle className="text-lg">Contacts</CardTitle>
              <CardDescription>Your teachers and advisors</CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-full">
              <div className="h-[calc(100%-80px)] overflow-y-auto pb-12">
                {Object.entries(messagesByContact).length > 0 ? (
                  <div className="divide-y">
                    {Object.entries(messagesByContact).map(([contactId, { contact, messages: contactMsgs, unread }]) => (
                      <button
                        key={contactId}
                        className={`w-full text-left p-3 hover:bg-slate-50 transition-colors ${
                          activeChat === contactId ? "bg-slate-100" : ""
                        }`}
                        onClick={() => setActiveChat(contactId)}
                      >
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3 bg-primary text-white">
                            <AvatarFallback>{getNameInitials(contact?.name)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <p className="font-medium truncate text-slate-900">{contact?.name}</p>
                              {unread > 0 && (
                                <Badge className="ml-2 bg-primary">{unread}</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {contact?.email}
                            </p>
                            {contactMsgs && contactMsgs.length > 0 && (
                              <p className="text-sm text-muted-foreground truncate mt-1">
                                {contactMsgs[contactMsgs.length - 1]?.content?.substring(0, 30)}
                                {contactMsgs[contactMsgs.length - 1]?.content?.length > 30 && "..."}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-muted-foreground">
                    No contacts found.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat window pane */}
        <div className="md:col-span-2">
          <Card className="h-[calc(100vh-200px)] flex flex-col">
            {activeContact ? (
              <>
                <CardHeader className="bg-slate-50 pb-3 flex-shrink-0">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3 bg-primary text-white">
                      <AvatarFallback>{getNameInitials(activeContact.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{activeContact.name}</CardTitle>
                      <CardDescription>{activeContact.email}</CardDescription>
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
                          className={`max-w-[75%] rounded-lg p-3 shadow-sm ${
                            msg.senderId === user?.id
                              ? "bg-primary text-white rounded-tr-none"
                              : "bg-slate-100 text-slate-900 rounded-tl-none"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                          <p
                            className={`text-[10px] mt-1 text-right ${
                              msg.senderId === user?.id
                                ? "text-primary-foreground/70"
                                : "text-slate-400"
                            }`}
                          >
                            {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            }) : ""}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <User className="h-12 w-12 text-muted-foreground mb-2 opacity-50" />
                      <p className="font-medium text-slate-700">No messages yet</p>
                      <p className="text-sm text-muted-foreground max-w-xs">
                        Send a secure message to initiate a dialogue with {activeContact.name}.
                      </p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </CardContent>
                <div className="p-3 border-t bg-slate-50 flex items-end gap-2">
                  <Textarea
                    placeholder={`Message ${activeContact.name}...`}
                    className="min-h-[60px] resize-none bg-white focus-visible:ring-primary"
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
                    className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 flex-shrink-0"
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <MessageSquare className="h-16 w-16 text-muted-foreground mb-4 opacity-30 text-primary" />
                <h3 className="font-medium text-lg text-slate-800 mb-1">Select a Contact</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
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