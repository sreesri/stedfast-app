import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { doLogin, doSignup, setAuthToken } from "../utils/http";

interface AuthContextData {
  isLoggedIn: boolean;
  isLoading: boolean;
  userToken: string | null;
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
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token !== null) {
          setUserToken(token);
          setAuthToken(token);
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
      // response.token and response.userId are assumed based on plan
      const { token } = response;
      if (token) {
        await AsyncStorage.setItem("userToken", token);
        setUserToken(token);
        setAuthToken(token);
        setIsLoggedIn(true);
      }
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
      await AsyncStorage.removeItem("userId");
      setUserToken(null);
      setAuthToken(null);
      setIsLoggedIn(false);
    } catch (e) {
      console.error("Failed to remove login status", e);
    }
  };

  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 403) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        userToken,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
