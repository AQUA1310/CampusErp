
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrainCircuit, Send, X, User, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useData } from "@/contexts/DataContext";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai" | "teacher" | "student";
  senderName?: string;
  timestamp: Date;
}

interface ChatBotProps {
  onClose: () => void;
}

export default function ChatBot({ onClose }: ChatBotProps) {
  const { user } = useAuth();
  const { messages: appMessages, students, teachers, sendMessage } = useData();
  const [activeTab, setActiveTab] = useState<string>("ai");
  const [selectedRecipient, setSelectedRecipient] = useState<string>("");
  const [aiMessages, setAiMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: `Hello ${user?.name || "there"}! I'm your AI tutor. How can I help you with your studies today?`,
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages, appMessages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    if (activeTab === "ai") {
      // Add user message to AI chat
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        content: inputValue,
        sender: "user",
        timestamp: new Date(),
      };
      setAiMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setIsTyping(true);

      // Simulate AI response delay (1-2 seconds)
      setTimeout(() => {
        const aiResponse = generateAIResponse(inputValue);
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          content: aiResponse,
          sender: "ai",
          timestamp: new Date(),
        };
        setAiMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
      }, Math.random() * 1000 + 1000);
    } else if (activeTab === "teachers" && selectedRecipient) {
      // Create message object for teacher
      const messageObj = {
        sender: user?.id || "",
        senderType: (user?.type || "student") as "student" | "teacher",
        senderName: user?.name || "",
        recipient: selectedRecipient,
        receiverId: selectedRecipient,
        receiverType: "teacher" as const,
        content: inputValue
      };
      
      // Send message to teacher
      sendMessage(messageObj);
      setInputValue("");
    } else if (activeTab === "students" && selectedRecipient) {
      // Create message object for student
      const messageObj = {
        sender: user?.id || "",
        senderType: (user?.type || "student") as "student" | "teacher",
        senderName: user?.name || "",
        recipient: selectedRecipient,
        receiverId: selectedRecipient,
        receiverType: "student" as const,
        content: inputValue
      };
      
      // Send message to student
      sendMessage(messageObj);
      setInputValue("");
    }
  };

  const generateAIResponse = (userInput: string): string => {
    // Simple rule-based responses for demonstration
    const userQuery = userInput.toLowerCase();
    
    if (userQuery.includes("differential") || userQuery.includes("ode")) {
      return "Ordinary Differential Equations (ODEs) are equations that contain derivatives of a function with respect to one variable. The order of an ODE is determined by the highest derivative present. For first-order ODEs, methods like separation of variables and integrating factors are commonly used. Would you like me to explain a specific concept or solving method?";
    }
    
    if (userQuery.includes("linear algebra")) {
      return "Linear Algebra involves the study of vectors, vector spaces, linear transformations, and systems of linear equations. Key concepts include matrices, determinants, eigenvalues, and eigenvectors. These mathematical tools are fundamental in various fields like computer graphics, quantum mechanics, and machine learning. Is there a specific topic within linear algebra you're struggling with?";
    }
    
    if (userQuery.includes("algorithm") || userQuery.includes("data structure")) {
      return "Data Structures and Algorithms are fundamental to computer science. Data structures like arrays, linked lists, trees, and graphs organize data efficiently, while algorithms provide step-by-step procedures to solve problems. The efficiency of algorithms is often measured using Big O notation. Would you like to explore a specific data structure or algorithm?";
    }
    
    if (userQuery.includes("electrical") || userQuery.includes("electronics")) {
      return "Basic Electrical and Electronics Engineering covers fundamental concepts of electric circuits, electronic devices, and systems. Topics include circuit analysis (using Ohm's law, Kirchhoff's laws), semiconductor devices, operational amplifiers, and digital logic circuits. Is there a specific concept or problem you need help with?";
    }
    
    if (userQuery.includes("discrete") || userQuery.includes("mathematical structures")) {
      return "Discrete Mathematical Structures deals with mathematical objects that are distinct and separable. It includes topics like set theory, logic, combinatorics, graph theory, and algebraic structures. These concepts provide the mathematical foundation for computer science and information theory. Would you like to explore a specific topic in more detail?";
    }
    
    if (userQuery.includes("design thinking")) {
      return "Design Thinking is a human-centered approach to innovation and problem-solving. It involves five key phases: Empathize (understand user needs), Define (articulate the problem), Ideate (generate creative solutions), Prototype (create simplified versions of solutions), and Test (evaluate and refine). This iterative process focuses on developing solutions that meet user needs while being technically feasible and economically viable. Would you like to know more about a specific phase?";
    }
    
    if (userQuery.includes("mid") && userQuery.includes("exam") || userQuery.includes("examination")) {
      return "The mid-semester examinations will start from November 20, 2023. Make sure to check your course outlines for the topics that will be covered. I'd recommend creating a study schedule, focusing on understanding concepts rather than memorizing, and practicing with past papers if available. Is there a specific subject you're concerned about?";
    }
    
    if (userQuery.includes("hello") || userQuery.includes("hi") || userQuery.includes("hey")) {
      return `Hello! I'm your AI tutor for the Mathematics & Computing program. I can help explain concepts, solve problems, or provide study tips. What would you like assistance with today?`;
    }
    
    return "That's an interesting question. I can help you understand mathematical and computing concepts, explain technical topics, solve problems, or provide study tips. Could you provide more details about what you're looking to learn?";
  };

  // Filter messages for the selected recipient
  const getMessagesForRecipient = (recipientId: string) => {
    return appMessages.filter(
      (msg) => 
        (msg.sender === user?.id && msg.receiverId === recipientId) || 
        (msg.sender === recipientId && msg.receiverId === user?.id)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between bg-primary text-white p-3">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5" />
          <h3 className="font-semibold">ARC Chat</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-primary-700"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-3 m-2">
          <TabsTrigger value="ai" className="flex items-center gap-1">
            <BrainCircuit className="h-4 w-4" /> AI Tutor
          </TabsTrigger>
          <TabsTrigger value="teachers" className="flex items-center gap-1">
            <User className="h-4 w-4" /> Teachers
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center gap-1">
            <Users className="h-4 w-4" /> Students
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="flex-1 flex flex-col mb-0 mt-0">
          <div className="flex-1 overflow-y-auto p-4 bg-navy-50">
            {aiMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                } mb-4`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-primary text-white rounded-tr-none"
                      : "bg-white border border-navy-200 rounded-tl-none"
                  }`}
                >
                  {message.sender === "ai" && (
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-navy-200 text-navy-800 text-xs">
                          AI
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-navy-800">
                        AI Tutor
                      </span>
                    </div>
                  )}
                  <p
                    className={`text-sm ${
                      message.sender === "user" ? "text-white" : "text-navy-800"
                    }`}
                  >
                    {message.content}
                  </p>
                  <div
                    className={`text-xs mt-1 ${
                      message.sender === "user" ? "text-navy-200" : "text-navy-400"
                    } text-right`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-white border border-navy-200 rounded-lg rounded-tl-none p-3 max-w-[80%]">
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-navy-200 text-navy-800 text-xs">
                        AI
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-navy-800">
                      AI Tutor
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-navy-300 animate-pulse"></div>
                    <div className="h-2 w-2 rounded-full bg-navy-400 animate-pulse delay-150"></div>
                    <div className="h-2 w-2 rounded-full bg-navy-500 animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSendMessage}
            className="border-t border-navy-200 p-4 bg-white"
          >
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your question here..."
                className="border-navy-200 focus-visible:ring-primary"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!inputValue.trim() || isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="teachers" className="flex-1 flex flex-col mb-0 mt-0">
          <div className="border-b border-navy-200">
            <select
              className="w-full p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              value={selectedRecipient}
              onChange={(e) => setSelectedRecipient(e.target.value)}
            >
              <option value="">Select a teacher...</option>
              {teachers?.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} ({teacher.department})
                </option>
              ))}
            </select>
          </div>

          {selectedRecipient ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 bg-navy-50">
                {getMessagesForRecipient(selectedRecipient).map((message, index) => {
                  const isFromUser = message.sender === user?.id;
                  const senderName = isFromUser 
                    ? "You" 
                    : teachers?.find(t => t.id === message.sender)?.name || "Teacher";

                  return (
                    <div
                      key={message.id || index}
                      className={`flex ${isFromUser ? "justify-end" : "justify-start"} mb-4`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          isFromUser
                            ? "bg-primary text-white rounded-tr-none"
                            : "bg-white border border-navy-200 rounded-tl-none"
                        }`}
                      >
                        {!isFromUser && (
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback className="bg-navy-200 text-navy-800 text-xs">
                                {senderName.split(' ').map(word => word[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium text-navy-800">
                              {senderName}
                            </span>
                          </div>
                        )}
                        <p
                          className={`text-sm ${
                            isFromUser ? "text-white" : "text-navy-800"
                          }`}
                        >
                          {message.content}
                        </p>
                        <div
                          className={`text-xs mt-1 ${
                            isFromUser ? "text-navy-200" : "text-navy-400"
                          } text-right`}
                        >
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form
                onSubmit={handleSendMessage}
                className="border-t border-navy-200 p-4 bg-white"
              >
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message here..."
                    className="border-navy-200 focus-visible:ring-primary"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!inputValue.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <User className="h-12 w-12 text-navy-300 mx-auto" />
                <p className="mt-2 text-navy-600">Select a teacher to start chatting</p>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="students" className="flex-1 flex flex-col mb-0 mt-0">
          <div className="border-b border-navy-200">
            <select
              className="w-full p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              value={selectedRecipient}
              onChange={(e) => setSelectedRecipient(e.target.value)}
            >
              <option value="">Select a student...</option>
              {students?.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.rollNumber} - {student.name}
                </option>
              ))}
            </select>
          </div>

          {selectedRecipient ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 bg-navy-50">
                {getMessagesForRecipient(selectedRecipient).map((message, index) => {
                  const isFromUser = message.sender === user?.id;
                  const senderName = isFromUser 
                    ? "You" 
                    : students?.find(s => s.id === message.sender)?.name || "Student";

                  return (
                    <div
                      key={message.id || index}
                      className={`flex ${isFromUser ? "justify-end" : "justify-start"} mb-4`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          isFromUser
                            ? "bg-primary text-white rounded-tr-none"
                            : "bg-white border border-navy-200 rounded-tl-none"
                        }`}
                      >
                        {!isFromUser && (
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback className="bg-navy-200 text-navy-800 text-xs">
                                {senderName.split(' ').map(word => word[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium text-navy-800">
                              {senderName}
                            </span>
                          </div>
                        )}
                        <p
                          className={`text-sm ${
                            isFromUser ? "text-white" : "text-navy-800"
                          }`}
                        >
                          {message.content}
                        </p>
                        <div
                          className={`text-xs mt-1 ${
                            isFromUser ? "text-navy-200" : "text-navy-400"
                          } text-right`}
                        >
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form
                onSubmit={handleSendMessage}
                className="border-t border-navy-200 p-4 bg-white"
              >
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message here..."
                    className="border-navy-200 focus-visible:ring-primary"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!inputValue.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <Users className="h-12 w-12 text-navy-300 mx-auto" />
                <p className="mt-2 text-navy-600">Select a student to start chatting</p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
