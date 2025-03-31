
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

type UserType = 'student' | 'teacher';

interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  rollNumber?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, userType: UserType) => Promise<void>;
  logout: () => void;
  studentList?: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Check for existing session on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string, userType: UserType): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Mock login delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let mockUser: User;
      
      if (userType === 'student') {
        // Simulate student login
        if (email === 'vd24mab0a41@student.nitw.ac.in' && password === 'Dhruv@22') {
          mockUser = {
            id: '41',
            name: 'V Dhruv',
            email: 'vd24mab0a41@student.nitw.ac.in',
            type: 'student',
            rollNumber: '24MAB0A41'
          };
        } else {
          throw new Error('Invalid credentials');
        }
      } else {
        // Simulate teacher login
        if (email === 'abenerji@nitw.ac.in' && password === 'Dhruv@22') {
          mockUser = {
            id: 'tchr-1',
            name: 'A Benerji',
            email: 'abenerji@nitw.ac.in',
            type: 'teacher',
            department: 'Mathematics'
          };
        } else {
          throw new Error('Invalid credentials');
        }
      }
      
      // Set user in state and localStorage
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Redirect to the appropriate dashboard
      if (userType === 'student') {
        navigate('/student-dashboard');
      } else {
        navigate('/teacher-dashboard');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Authentication failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout,
      studentList: [
        { id: '41', name: 'V Dhruv', email: 'vd24mab0a41@student.nitw.ac.in', type: 'student', rollNumber: '24MAB0A41' }
      ]
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
