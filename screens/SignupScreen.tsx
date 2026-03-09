import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { COLORS, SCREEN } from "../utils/Constants";
import { useAuth } from "../context/AuthContext";
import Toast from "react-native-toast-message";

const SignupScreen = ({ navigation }: any) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all fields",
      });
      return;
    }

    setLoading(true);
    try {
      await signup({ name, email, password });
      Toast.show({
        type: "success",
        text1: "Signup Success",
        text2: "Account created successfully!",
      });
      navigation.navigate(SCREEN.login);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Signup Failed",
        text2: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stedfast</Text>
      <Text style={styles.subtitle}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
        autoCapitalize="none"
      />

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
        style={styles.button}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
