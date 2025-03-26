
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrainCircuit, Send, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatBotProps {
  onClose: () => void;
}

export default function ChatBot({ onClose }: ChatBotProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
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
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
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
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, Math.random() * 1000 + 1000);
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between bg-oliveGreen-600 text-white p-3">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5" />
          <h3 className="font-semibold">AI Tutor</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-oliveGreen-700"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-oliveGreen-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            } mb-4`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === "user"
                  ? "bg-oliveGreen-600 text-white rounded-tr-none"
                  : "bg-white border border-oliveGreen-200 rounded-tl-none"
              }`}
            >
              {message.sender === "ai" && (
                <div className="flex items-center gap-2 mb-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-oliveGreen-200 text-oliveGreen-800 text-xs">
                      AI
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium text-oliveGreen-800">
                    AI Tutor
                  </span>
                </div>
              )}
              <p
                className={`text-sm ${
                  message.sender === "user" ? "text-white" : "text-oliveGreen-800"
                }`}
              >
                {message.content}
              </p>
              <div
                className={`text-xs mt-1 ${
                  message.sender === "user" ? "text-oliveGreen-200" : "text-oliveGreen-400"
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
            <div className="bg-white border border-oliveGreen-200 rounded-lg rounded-tl-none p-3 max-w-[80%]">
              <div className="flex items-center gap-2 mb-1">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-oliveGreen-200 text-oliveGreen-800 text-xs">
                    AI
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium text-oliveGreen-800">
                  AI Tutor
                </span>
              </div>
              <div className="flex space-x-1">
                <div className="h-2 w-2 rounded-full bg-oliveGreen-300 animate-pulse"></div>
                <div className="h-2 w-2 rounded-full bg-oliveGreen-400 animate-pulse delay-150"></div>
                <div className="h-2 w-2 rounded-full bg-oliveGreen-500 animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="border-t border-oliveGreen-200 p-4 bg-white"
      >
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your question here..."
            className="border-oliveGreen-200 focus-visible:ring-oliveGreen-500"
          />
          <Button
            type="submit"
            size="icon"
            className="bg-oliveGreen-600 hover:bg-oliveGreen-700"
            disabled={!inputValue.trim() || isTyping}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
