import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { AuthProvider } from "./context/AuthContext";
import { FastingProvider } from "./context/FastingContext";
import { RootNavigator } from "./navigation/RootNavigator";
import { LimitProvider } from "./context/LimitContext";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FastingProvider>
          <LimitProvider>
            <RootNavigator />
            <Toast />
          </LimitProvider>
        </FastingProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
