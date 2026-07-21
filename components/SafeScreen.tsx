import React from "react";
import {
  StyleSheet,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  ScrollViewProps,
  RefreshControl,
} from "react-native";
// Using gesture-handler's ScrollView (rather than the plain React Native one)
// gives us proper nested-scroll arbitration: a scrollable child (e.g. the
// TimePicker wheels) can claim vertical drags for itself, so it no longer
// fights this screen's pull-to-refresh gesture.
import { ScrollView } from "react-native-gesture-handler";
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
  onRefresh?: () => void;
  refreshing?: boolean;
}

const SafeScreen: React.FC<SafeScreenProps> = ({
  children,
  style,
  edges = ["top", "left", "right", "bottom"],
  statusBarStyle = "light",
  backgroundColor = COLORS.background,
  scrollable = false,
  keyboardOffset = 0,
  scrollViewProps = {},
  onRefresh,
  refreshing = false,
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
            {...(scrollable && onRefresh
              ? {
                  refreshControl: (
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      tintColor={COLORS.primary}
                      colors={[COLORS.primary]}
                    />
                  ),
                }
              : {})}
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
