import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doLogin, doSignup } from "../utils/http";

interface AuthContextData {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (credentials: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkLoginStatus = async () => {
      try {
        const value = await AsyncStorage.getItem("userToken");
        if (value !== null) {
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.error("Failed to load login status", e);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const response = await doLogin({ email, password });
      await AsyncStorage.setItem("userToken", "dummy-token");
      setIsLoggedIn(true);
    } catch (e) {
      console.error("Failed to save login status", e);
    }
  };

  const signup = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await doSignup({ name, email, password });
    } catch (e) {
      console.error("Failed to save login status", e);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      setIsLoggedIn(false);
    } catch (e) {
      console.error("Failed to remove login status", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isLoading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
