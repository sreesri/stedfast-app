import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { doLogin, doSignup, setAuthToken, default as api } from "../utils/http";
import { CONFIG } from "../utils/config";

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
        const token = await SecureStore.getItemAsync(CONFIG.STORAGE_KEYS.USER_TOKEN);
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
      console.log("Attempting login for:", email);
      const response = await doLogin({ email, password });
      // response.token and response.userId are assumed based on plan
      const { token } = response;
      if (token) {
        console.log("Login successful, saving token...");
        await SecureStore.setItemAsync(CONFIG.STORAGE_KEYS.USER_TOKEN, token);
        setUserToken(token);
        setAuthToken(token);
        setIsLoggedIn(true);
        console.log("isLoggedIn set to true");
      } else {
        console.error("Login response did not contain a token");
        throw new Error("No token received");
      }
    } catch (e) {
      console.error("Failed to login or save login status:", e);
      throw e; // Re-throw so LoginScreen can catch and show error toast
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
      await SecureStore.deleteItemAsync(CONFIG.STORAGE_KEYS.USER_TOKEN);
      await AsyncStorage.removeItem(CONFIG.STORAGE_KEYS.USER_ID);
      setUserToken(null);
      setAuthToken(null);
      setIsLoggedIn(false);
    } catch (e) {
      console.error("Failed to remove login status", e);
    }
  };

  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
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
