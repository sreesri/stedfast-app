import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { AuthProvider } from "./context/AuthContext";
import { BaseProvider } from "./context/BaseContext";
import { RootNavigator } from "./navigation/RootNavigator";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BaseProvider>
          <RootNavigator />
          <Toast />
        </BaseProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
