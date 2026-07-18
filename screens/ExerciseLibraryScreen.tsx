import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import SafeScreen from "../components/SafeScreen";
import { useSavedExerciseCatalog } from "../hooks/useSavedExerciseCatalog";
import { COLORS, MUSCLE_GROUP_LABELS, SCREEN, withOpacity } from "../utils/Constants";
import { Exercise } from "../utils/types";
import Ionicons from "@expo/vector-icons/Ionicons";

const ExerciseLibraryScreen = () => {
  const navigation = useNavigation<any>();
  const { exercises, isLoading, refetch, isRefreshing } = useSavedExerciseCatalog();

  const navigateToCreatePage = () => {
    navigation.navigate(SCREEN.exerciseeditor, {});
  };

  const openExercise = (exercise: Exercise) => {
    navigation.navigate(SCREEN.exerciseeditor, { editingExercise: exercise });
  };

  return (
    <SafeScreen
      style={styles.container}
      scrollable={true}
      onRefresh={refetch}
      refreshing={isRefreshing}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Exercise Library</Text>
          <Text style={styles.subtitle}>
            {exercises.length} {exercises.length === 1 ? "exercise" : "exercises"} saved
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={navigateToCreatePage}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={19} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator color={COLORS.primary} size="large" />
        </View>
      ) : exercises.length > 0 ? (
        <View style={styles.listGroup}>
          {exercises.map((exercise, index) => {
            const isLastItem = index === exercises.length - 1;
            return (
              <TouchableOpacity
                key={exercise.id}
                style={[styles.listRow, !isLastItem && styles.listRowBorder]}
                onPress={() => openExercise(exercise)}
                activeOpacity={0.7}
              >
                <View style={styles.iconSquare}>
                  <Ionicons name="barbell-outline" size={17} color={COLORS.primary} />
                </View>
                <View style={styles.rowContent}>
                  <Text style={styles.rowTitle}>{exercise.name}</Text>
                  <Text style={styles.rowMeta}>
                    {MUSCLE_GROUP_LABELS[exercise.muscleGroup] ?? exercise.muscleGroup}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={14} color={COLORS.chevron} />
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No saved exercises yet</Text>
          <Text style={styles.emptySubtitle}>Tap + to add your first exercise.</Text>
        </View>
      )}
    </SafeScreen>
  );
};

export default ExerciseLibraryScreen;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 110,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  title: {
    fontSize: 22,
    fontWeight: "500",
    letterSpacing: -0.3,
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 12.5,
    color: withOpacity(COLORS.text, 0.5),
    marginTop: 2,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: withOpacity(COLORS.primary, 0.08),
    alignItems: "center",
    justifyContent: "center",
  },
  listGroup: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 18,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 15,
  },
  listRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: withOpacity(COLORS.text, 0.08),
  },
  iconSquare: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: withOpacity(COLORS.primary, 0.1),
    alignItems: "center",
    justifyContent: "center",
  },
  rowContent: {
    flex: 1,
    minWidth: 0,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  rowMeta: {
    fontSize: 11.5,
    color: withOpacity(COLORS.text, 0.5),
    marginTop: 2,
  },
  loadingState: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyState: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 24,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 12.5,
    color: withOpacity(COLORS.text, 0.5),
    textAlign: "center",
  },
});
