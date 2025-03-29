
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Send, 
  Search, 
  User, 
  Users, 
  Clock, 
  CheckCheck 
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useData } from "@/contexts/DataContext";
import DashboardLayout from "@/components/shared/DashboardLayout";

export default function StudentChat() {
  const { user } = useAuth();
  const { messages, teachers, students, sendMessage, markMessageAsRead } = useData();
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeChatTab, setActiveChatTab] = useState<"teachers" | "students">("teachers");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get all messages for the current student
  const myMessages = messages.filter(msg => 
    (msg.senderId === "1" || msg.receiverId === "1")
  );
  
  // Get unique contacts (teachers and students) from messages
  const teacherContacts = teachers.map(teacher => {
    const unreadCount = myMessages.filter(
      msg => msg.senderId === teacher.id && !msg.read
    ).length;
    
    const lastMessage = myMessages
      .filter(msg => 
        (msg.senderId === teacher.id && msg.receiverId === "1") || 
        (msg.senderId === "1" && msg.receiverId === teacher.id)
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    
    return {
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      type: "teacher",
      department: teacher.department,
      unreadCount,
      lastMessage,
      lastActivity: lastMessage ? new Date(lastMessage.timestamp).getTime() : 0
    };
  });
  
  const studentContacts = students
    .filter(student => student.id !== "1") // Exclude self
    .map(student => {
      const unreadCount = myMessages.filter(
        msg => msg.senderId === student.id && !msg.read
      ).length;
      
      const lastMessage = myMessages
        .filter(msg => 
          (msg.senderId === student.id && msg.receiverId === "1") || 
          (msg.senderId === "1" && msg.receiverId === student.id)
        )
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
      
      return {
        id: student.id,
        name: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
        type: "student",
        unreadCount,
        lastMessage,
        lastActivity: lastMessage ? new Date(lastMessage.timestamp).getTime() : 0
      };
    });
  
  // Filter contacts based on search term
  const filteredTeacherContacts = teacherContacts
    .filter(contact => 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.lastActivity - a.lastActivity);
  
  const filteredStudentContacts = studentContacts
    .filter(contact => 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.lastActivity - a.lastActivity);
  
  // Get conversation messages with selected contact
  const conversationMessages = selectedContact 
    ? myMessages
        .filter(msg => 
          (msg.senderId === selectedContact.id && msg.receiverId === "1") || 
          (msg.senderId === "1" && msg.receiverId === selectedContact.id)
        )
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    : [];
  
  // Mark unread messages as read
  useEffect(() => {
    if (selectedContact) {
      conversationMessages.forEach(msg => {
        if (msg.senderId === selectedContact.id && !msg.read) {
          markMessageAsRead(msg.id);
        }
      });
    }
  }, [selectedContact, conversationMessages]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages]);
  
  const handleContactSelect = (contact: any) => {
    setSelectedContact(contact);
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedContact || !user) return;
    
    sendMessage({
      senderId: "1",
      senderName: user.name,
      senderType: "student",
      receiverId: selectedContact.id,
      receiverName: selectedContact.name,
      receiverType: selectedContact.type,
      content: newMessage
    });
    
    setNewMessage("");
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <DashboardLayout title="Messages" subtitle="Chat with teachers and fellow students">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-13rem)]">
        {/* Contact List */}
        <Card className="shadow-md border border-oliveGreen-100 overflow-hidden md:col-span-1">
          <CardHeader className="bg-oliveGreen-50 border-b border-oliveGreen-100 space-y-2 px-4 py-3">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-oliveGreen-500" />
              <Input
                placeholder="Search contacts..."
                className="flex-1 h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex border rounded-md overflow-hidden">
              <button
                className={`flex-1 py-1 px-3 text-sm font-medium ${
                  activeChatTab === "teachers" 
                    ? "bg-oliveGreen-600 text-white" 
                    : "bg-oliveGreen-50 text-oliveGreen-600 hover:bg-oliveGreen-100"
                }`}
                onClick={() => setActiveChatTab("teachers")}
              >
                <User className="h-4 w-4 inline-block mr-1" />
                Teachers
              </button>
              <button
                className={`flex-1 py-1 px-3 text-sm font-medium ${
                  activeChatTab === "students" 
                    ? "bg-oliveGreen-600 text-white" 
                    : "bg-oliveGreen-50 text-oliveGreen-600 hover:bg-oliveGreen-100"
                }`}
                onClick={() => setActiveChatTab("students")}
              >
                <Users className="h-4 w-4 inline-block mr-1" />
                Students
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100vh-16rem)] overflow-y-auto">
            {activeChatTab === "teachers" ? (
              filteredTeacherContacts.length > 0 ? (
                <div className="divide-y divide-oliveGreen-100">
                  {filteredTeacherContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`p-3 hover:bg-oliveGreen-50 cursor-pointer transition-colors ${
                        selectedContact?.id === contact.id ? "bg-oliveGreen-50" : ""
                      }`}
                      onClick={() => handleContactSelect(contact)}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 border border-oliveGreen-200">
                          <AvatarFallback className="bg-oliveGreen-100 text-oliveGreen-800">
                            {getInitials(contact.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-oliveGreen-900 truncate">
                              Prof. {contact.name}
                            </p>
                            {contact.lastMessage && (
                              <span className="text-xs text-oliveGreen-500">
                                {formatTime(contact.lastMessage.timestamp)}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-oliveGreen-600 truncate">
                            {contact.department}
                          </p>
                          {contact.lastMessage && (
                            <p className="text-xs text-oliveGreen-500 truncate mt-1">
                              {contact.lastMessage.senderId === "1" && (
                                <span className="text-oliveGreen-400 mr-1">You:</span>
                              )}
                              {contact.lastMessage.content}
                            </p>
                          )}
                        </div>
                        {contact.unreadCount > 0 && (
                          <Badge className="bg-oliveGreen-600">
                            {contact.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <User className="h-12 w-12 text-oliveGreen-300 mb-2" />
                  <h3 className="font-medium text-oliveGreen-800">No Teachers Found</h3>
                  <p className="text-sm text-oliveGreen-600 mt-1">
                    {searchTerm 
                      ? "No teachers match your search" 
                      : "Start a conversation with a teacher"}
                  </p>
                </div>
              )
            ) : (
              filteredStudentContacts.length > 0 ? (
                <div className="divide-y divide-oliveGreen-100">
                  {filteredStudentContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`p-3 hover:bg-oliveGreen-50 cursor-pointer transition-colors ${
                        selectedContact?.id === contact.id ? "bg-oliveGreen-50" : ""
                      }`}
                      onClick={() => handleContactSelect(contact)}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 border border-oliveGreen-200">
                          <AvatarFallback className="bg-oliveGreen-100 text-oliveGreen-800">
                            {getInitials(contact.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-oliveGreen-900 truncate">
                              {contact.name}
                            </p>
                            {contact.lastMessage && (
                              <span className="text-xs text-oliveGreen-500">
                                {formatTime(contact.lastMessage.timestamp)}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-oliveGreen-600 truncate">
                            {contact.rollNumber}
                          </p>
                          {contact.lastMessage && (
                            <p className="text-xs text-oliveGreen-500 truncate mt-1">
                              {contact.lastMessage.senderId === "1" && (
                                <span className="text-oliveGreen-400 mr-1">You:</span>
                              )}
                              {contact.lastMessage.content}
                            </p>
                          )}
                        </div>
                        {contact.unreadCount > 0 && (
                          <Badge className="bg-oliveGreen-600">
                            {contact.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <Users className="h-12 w-12 text-oliveGreen-300 mb-2" />
                  <h3 className="font-medium text-oliveGreen-800">No Students Found</h3>
                  <p className="text-sm text-oliveGreen-600 mt-1">
                    {searchTerm 
                      ? "No students match your search" 
                      : "Start a conversation with a fellow student"}
                  </p>
                </div>
              )
            )}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="shadow-md border border-oliveGreen-100 overflow-hidden md:col-span-2 flex flex-col">
          {selectedContact ? (
            <>
              <CardHeader className="bg-oliveGreen-50 border-b border-oliveGreen-100 p-3 flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10 border border-oliveGreen-200">
                    <AvatarFallback className="bg-oliveGreen-100 text-oliveGreen-800">
                      {getInitials(selectedContact.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-oliveGreen-800 text-base">
                      {selectedContact.type === "teacher" ? "Prof. " : ""}{selectedContact.name}
                    </CardTitle>
                    <CardDescription className="text-oliveGreen-600 text-xs">
                      {selectedContact.type === "teacher" 
                        ? selectedContact.department 
                        : selectedContact.rollNumber}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-4 flex-grow overflow-y-auto flex flex-col space-y-3 h-[calc(100vh-24rem)]">
                {conversationMessages.length > 0 ? (
                  conversationMessages.map((msg) => {
                    const isMe = msg.senderId === "1";
                    
                    return (
                      <div 
                        key={msg.id} 
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[80%] ${isMe ? "order-2" : "order-1"}`}>
                          <div 
                            className={`py-2 px-3 rounded-lg ${
                              isMe 
                                ? "bg-oliveGreen-600 text-white rounded-br-none" 
                                : "bg-gray-100 text-gray-800 rounded-bl-none"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          </div>
                          <div className={`flex items-center text-xs mt-1 ${isMe ? "justify-end" : "justify-start"}`}>
                            <Clock className="h-3 w-3 mr-1 text-oliveGreen-400" />
                            <span className="text-oliveGreen-500">
                              {formatTime(msg.timestamp)}
                            </span>
                            {isMe && (
                              <CheckCheck className={`h-3 w-3 ml-1 ${msg.read ? "text-oliveGreen-600" : "text-oliveGreen-400"}`} />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center flex-grow text-center">
                    <div className="w-16 h-16 bg-oliveGreen-50 rounded-full flex items-center justify-center mb-4">
                      <Send className="h-8 w-8 text-oliveGreen-300" />
                    </div>
                    <h3 className="font-medium text-oliveGreen-800">No Messages Yet</h3>
                    <p className="text-sm text-oliveGreen-600 mt-1">
                      Send a message to start the conversation
                    </p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>
              
              <div className="border-t border-oliveGreen-100 p-3 bg-white">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    type="submit" 
                    className="bg-oliveGreen-600 hover:bg-oliveGreen-700"
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="w-24 h-24 bg-oliveGreen-50 rounded-full flex items-center justify-center mb-6">
                <Send className="h-12 w-12 text-oliveGreen-300" />
              </div>
              <h3 className="text-xl font-medium text-oliveGreen-800">Select a Contact</h3>
              <p className="text-oliveGreen-600 mt-2 max-w-md">
                Choose a teacher or student from the list to start a conversation
              </p>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
