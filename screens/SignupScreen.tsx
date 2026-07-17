import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { COLORS, SCREEN } from "../utils/Constants";
import { useAuth } from "../context/AuthContext";
import Toast from "react-native-toast-message";
import SafeScreen from "../components/SafeScreen";

const SignupScreen = ({ navigation }: any) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Toast.show({ type: "error", text1: "Please fill in all fields" });
      return;
    }
    setLoading(true);
    try {
      await signup({ name, email, password });
      navigation.navigate(SCREEN.login);
    } catch {
      Toast.show({ type: "error", text1: "Signup failed", text2: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeScreen style={styles.container} scrollable={true}>
      <Text style={styles.title}>Stedfast</Text>
      <Text style={styles.subtitle}>Create your account</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor={COLORS.inactive}
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />

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
        style={styles.button}
        onPress={handleSignup}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.text} />
        ) : (
          <Text style={styles.buttonText}>Sign up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")} activeOpacity={0.7}>
        <Text style={styles.linkText}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </SafeScreen>
  );
};

export default SignupScreen;

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
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
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
