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
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all fields",
      });
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
      Toast.show({
        type: "success",
        text1: "Login Success",
        text2: "Welcome back!",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: "Please check your credentials",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeScreen style={styles.container} scrollable={true}>
      <Text style={styles.title}>Stedfast</Text>
      <Text style={styles.subtitle}>Welcome Back</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
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
        <Text style={styles.rememberMeText}>Remember Me</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </SafeScreen>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    backgroundColor: COLORS.ascent,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.ascent,
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"center",
    marginBottom: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  checkmark: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  rememberMeText: {
    color: COLORS.primary,
    fontSize: 15,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkText: {
    color: COLORS.primary,
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
