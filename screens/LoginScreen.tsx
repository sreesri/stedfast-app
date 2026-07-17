import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../utils/Constants";
import { useAuth } from "../context/AuthContext";
import Toast from "react-native-toast-message";
import SafeScreen from "../components/SafeScreen";

const REMEMBER_ME_KEY = "remember_me_credentials";

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    AsyncStorage.getItem(REMEMBER_ME_KEY).then((stored) => {
      if (stored) {
        const { email: savedEmail, password: savedPassword } = JSON.parse(stored);
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberMe(true);
      }
    });
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({ type: "error", text1: "Please fill in all fields" });
      return;
    }
    setLoading(true);
    try {
      await login({ email, password });
      if (rememberMe) {
        await AsyncStorage.setItem(REMEMBER_ME_KEY, JSON.stringify({ email, password }));
      } else {
        await AsyncStorage.removeItem(REMEMBER_ME_KEY);
      }
    } catch {
      Toast.show({ type: "error", text1: "Login failed", text2: "Check your credentials" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeScreen style={styles.container} scrollable={true}>
      <Text style={styles.title}>Stedfast</Text>
      <Text style={styles.subtitle}>Welcome back</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={COLORS.inactive}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={COLORS.inactive}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.rememberMe}
        onPress={() => setRememberMe(!rememberMe)}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
          {rememberMe && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.rememberMeText}>Remember me</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.text} />
        ) : (
          <Text style={styles.buttonText}>Log in</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")} activeOpacity={0.7}>
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </SafeScreen>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: "500",
    letterSpacing: -0.5,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(233,233,237,0.55)",
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 12,
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "bold",
  },
  rememberMeText: {
    color: "rgba(233,233,237,0.55)",
    fontSize: 14,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "500",
  },
  linkText: {
    color: COLORS.primary,
    textAlign: "center",
    fontSize: 14,
  },
});
