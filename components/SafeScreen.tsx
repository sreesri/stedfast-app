import React from "react";
import {
  StyleSheet,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  ScrollViewProps,
} from "react-native";
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../utils/Constants";

interface SafeScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: Edge[];
  statusBarStyle?: "auto" | "inverted" | "light" | "dark";
  backgroundColor?: string;
  scrollable?: boolean;
  keyboardOffset?: number;
  scrollViewProps?: ScrollViewProps;
}

const SafeScreen: React.FC<SafeScreenProps> = ({
  children,
  style,
  edges = ["top", "left", "right", "bottom"],
  statusBarStyle = "auto",
  backgroundColor = COLORS.background,
  scrollable = false,
  keyboardOffset = 0,
  scrollViewProps = {},
}) => {
  const ContentWrapper = scrollable ? ScrollView : View;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }]}
      edges={edges}
    >
      <StatusBar style={statusBarStyle} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={keyboardOffset}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ContentWrapper
            style={styles.content}
            {...(scrollable ? scrollViewProps : {})}
            contentContainerStyle={
              scrollable ? [styles.scrollContent, style] : undefined
            }
          >
            {scrollable ? (
              children
            ) : (
              <View style={[styles.content, style]}>{children}</View>
            )}
          </ContentWrapper>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SafeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
