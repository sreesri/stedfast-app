import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import SafeScreen from "../components/SafeScreen";
import { useWorkoutLogs } from "../hooks/useWorkoutLogs";
import { useSavedExerciseCatalog } from "../hooks/useSavedExerciseCatalog";
import { COLORS, MUSCLE_GROUP_LABELS, MUSCLE_GROUPS, SCREEN, withOpacity } from "../utils/Constants";
import { Exercise, MuscleGroup, StagedExerciseItem, WorkoutLog } from "../utils/types";

const WorkoutEditScreen = ({ route, navigation }: any) => {
  const editingLog = route.params?.editingLog as WorkoutLog | undefined;
  const { handleSave, handleDelete, isPending } = useWorkoutLogs();
  const { exercises, isLoading, isRefreshing, refetch } = useSavedExerciseCatalog();

  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [notes, setNotes] = useState("");
  const [stagedItems, setStagedItems] = useState<StagedExerciseItem[]>([]);

  useEffect(() => {
    if (editingLog) {
      setMuscleGroups(editingLog.muscleGroups ?? []);
      setNotes(editingLog.notes ?? "");
      setStagedItems(
        (editingLog.exercises ?? []).map((e) => ({
          id: e.exerciseId || e.id || `${e.name}`,
          name: e.name || "Exercise",
          muscleGroup: (e.muscleGroup ?? "FULL_BODY") as MuscleGroup,
          sets: e.sets || 1,
          reps: e.reps || 1,
        })),
      );
      return;
    }

    setMuscleGroups([]);
    setNotes("");
    setStagedItems([]);
  }, [editingLog]);

  const selectedIds = new Set(stagedItems.map((item) => item.id));

  const toggleMuscleGroup = (group: MuscleGroup) => {
    setMuscleGroups((current) =>
      current.includes(group)
        ? current.filter((g) => g !== group)
        : [...current, group],
    );
  };

  const toggleExercise = (exercise: Exercise) => {
    setStagedItems((current) => {
      const existing = current.find((item) => item.id === exercise.id);
      if (existing) {
        return current.filter((item) => item.id !== exercise.id);
      }

      return [
        ...current,
        {
          id: exercise.id,
          name: exercise.name,
          muscleGroup: exercise.muscleGroup,
          sets: 3,
          reps: 10,
        },
      ];
    });
  };

  const updateSets = (id: string, delta: number) => {
    setStagedItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, sets: Math.max(1, item.sets + delta) }
          : item,
      ),
    );
  };

  const updateReps = (id: string, delta: number) => {
    setStagedItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, reps: Math.max(1, item.reps + delta) }
          : item,
      ),
    );
  };

  const onSave = () => {
    handleSave(muscleGroups, notes, stagedItems, editingLog);
  };

  return (
    <SafeScreen style={styles.container} scrollable={true} onRefresh={refetch} refreshing={isRefreshing}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {editingLog ? "Edit Workout" : "Log New Workout"}
        </Text>
        <Text style={styles.subtitle}>
          {editingLog
            ? "Update today's targeted muscles and exercises"
            : "Pick what you're targeting and the exercises you did"}
        </Text>
      </View>

      <Text style={styles.label}>Muscles Targeted</Text>
      <View style={styles.chipRow}>
        {MUSCLE_GROUPS.map((group) => {
          const isSelected = muscleGroups.includes(group as MuscleGroup);
          return (
            <TouchableOpacity
              key={group}
              style={[styles.chip, isSelected && styles.activeChip]}
              onPress={() => toggleMuscleGroup(group as MuscleGroup)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, isSelected && styles.activeChipText]}>
                {MUSCLE_GROUP_LABELS[group]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.stagingCard}>
        <View style={styles.stagingHeader}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          <Text style={styles.totalCount}>{stagedItems.length} added</Text>
        </View>

        {stagedItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nothing added yet</Text>
            <Text style={styles.emptySubtitle}>
              Pick exercises below to build this workout.
            </Text>
          </View>
        ) : (
          stagedItems.map((item) => (
            <View key={item.id} style={styles.stagedItem}>
              <View style={styles.stagedItemDetails}>
                <Text style={styles.stagedItemName}>{item.name}</Text>
                <Text style={styles.stagedItemMeta}>
                  {MUSCLE_GROUP_LABELS[item.muscleGroup] ?? item.muscleGroup}
                </Text>
              </View>

              <View style={styles.stepperGroup}>
                <View style={styles.stepper}>
                  <Text style={styles.stepperLabel}>Sets</Text>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateSets(item.id, -1)}
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityValue}>{item.sets}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateSets(item.id, 1)}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.stepper}>
                  <Text style={styles.stepperLabel}>Reps</Text>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateReps(item.id, -1)}
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityValue}>{item.reps}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateReps(item.id, 1)}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))
        )}
      </View>

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={styles.input}
        value={notes}
        onChangeText={setNotes}
        placeholder="Optional notes about today's workout"
        placeholderTextColor={COLORS.inactive}
      />

      <View style={styles.catalogCard}>
        <View style={styles.catalogHeader}>
          <Text style={styles.sectionTitle}>Choose exercises</Text>
          <TouchableOpacity
            style={styles.newButton}
            onPress={() => navigation.navigate(SCREEN.exerciseeditor, {})}
          >
            <Text style={styles.newButtonText}>+ New exercise</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={COLORS.primary} />
          </View>
        ) : exercises.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No exercises available</Text>
            <Text style={styles.emptySubtitle}>
              Your saved exercises will show up here.
            </Text>
          </View>
        ) : (
          exercises.map((exercise) => {
            const isSelected = selectedIds.has(exercise.id);

            return (
              <TouchableOpacity
                key={exercise.id}
                style={styles.catalogItem}
                onPress={() => toggleExercise(exercise)}
                activeOpacity={0.8}
              >
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                  {isSelected && (
                    <Ionicons name="checkmark" size={15} color={COLORS.background} />
                  )}
                </View>

                <View style={styles.catalogItemDetails}>
                  <Text style={styles.catalogItemName}>{exercise.name}</Text>
                  <Text style={styles.catalogItemMeta}>
                    {MUSCLE_GROUP_LABELS[exercise.muscleGroup] ?? exercise.muscleGroup}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={onSave}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator color={COLORS.text} />
          ) : (
            <Text style={styles.saveButtonText}>
              {editingLog ? "Update Workout" : "Save Workout"}
            </Text>
          )}
        </TouchableOpacity>

        {editingLog && (
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => {
              handleDelete(editingLog);
              navigation.goBack();
            }}
            disabled={isPending}
          >
            <Text style={styles.deleteButtonText}>Delete Workout</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeScreen>
  );
};

export default WorkoutEditScreen;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 110,
  },
  header: {
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
  label: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
    marginBottom: 8,
    marginTop: 10,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: withOpacity(COLORS.text, 0.1),
  },
  activeChip: {
    backgroundColor: withOpacity(COLORS.primary, 0.14),
    borderColor: COLORS.accent700,
  },
  chipText: {
    fontSize: 12.5,
    color: COLORS.inactive,
  },
  activeChipText: {
    color: COLORS.accent300,
    fontWeight: "500",
  },
  stagingCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  stagingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  totalCount: {
    fontSize: 12.5,
    fontWeight: "500",
    color: COLORS.text,
    fontVariant: ["tabular-nums"],
  },
  emptyState: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: "dashed",
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  emptySubtitle: {
    fontSize: 12.5,
    color: withOpacity(COLORS.text, 0.5),
    marginTop: 6,
    textAlign: "center",
  },
  stagedItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 14,
    marginTop: 10,
  },
  stagedItemDetails: {
    flex: 1,
    paddingRight: 12,
  },
  stagedItemName: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  stagedItemMeta: {
    fontSize: 11.5,
    color: withOpacity(COLORS.text, 0.5),
    marginTop: 2,
  },
  stepperGroup: {
    flexDirection: "row",
    gap: 14,
  },
  stepper: {
    alignItems: "center",
  },
  stepperLabel: {
    fontSize: 10,
    color: withOpacity(COLORS.text, 0.4),
    marginBottom: 4,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: withOpacity(COLORS.primary, 0.14),
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "600",
  },
  quantityValue: {
    minWidth: 22,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.text,
  },
  input: {
    width: "100%",
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    fontSize: 15,
    marginBottom: 8,
  },
  catalogCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
  },
  catalogHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  newButton: {
    backgroundColor: withOpacity(COLORS.primary, 0.14),
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  newButtonText: {
    color: COLORS.accent300,
    fontSize: 12.5,
    fontWeight: "500",
  },
  loadingState: {
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  catalogItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 14,
    marginTop: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  catalogItemDetails: {
    flex: 1,
  },
  catalogItemName: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  catalogItemMeta: {
    fontSize: 11.5,
    color: withOpacity(COLORS.text, 0.5),
    marginTop: 2,
  },
  actions: {
    marginTop: 24,
    alignItems: "center",
  },
  button: {
    height: 52,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    width: "100%",
  },
  deleteButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.inactive,
    width: "100%",
  },
  saveButtonText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "500",
  },
  deleteButtonText: {
    color: COLORS.inactive,
    fontSize: 14,
    fontWeight: "500",
  },
});
