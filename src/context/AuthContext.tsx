
import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  preferences: {
    dietary: string[];
    allergies: string[];
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
  requestOTP: (phone: string) => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on initial load
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("foodplannery_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // Mock functions for authentication - to be replaced with real implementation
  const requestOTP = async (phone: string) => {
    // This would be an API call to your backend
    console.log("Requesting OTP for phone:", phone);
    return Promise.resolve();
  };

  const login = async (phone: string, otp: string) => {
    try {
      // This would verify the OTP with your backend
      console.log("Verifying OTP:", otp, "for phone:", phone);
      
      // Mock successful authentication
      const mockUser: User = {
        id: "user-" + Date.now(),
        phone,
        name: null,
        email: null,
        preferences: {
          dietary: [],
          allergies: [],
        },
      };
      
      // Store user in local storage for persistence
      localStorage.setItem("foodplannery_user", JSON.stringify(mockUser));
      setUser(mockUser);
      
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("foodplannery_user");
    setUser(null);
  };

  const updateUserProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      localStorage.setItem("foodplannery_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        requestOTP,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
