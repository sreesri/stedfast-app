import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import Ionicons from "@expo/vector-icons/Ionicons";
import SafeScreen from "../components/SafeScreen";
import { useSavedExerciseCatalog } from "../hooks/useSavedExerciseCatalog";
import { COLORS, MUSCLE_GROUP_LABELS, MUSCLE_GROUPS, withOpacity } from "../utils/Constants";
import { Exercise, MuscleGroup } from "../utils/types";

const ExerciseEditorScreen = ({ route, navigation }: any) => {
  const editingExercise = route.params?.editingExercise as Exercise | undefined;

  const { saveExercise, isSaving, removeExercise, isDeleting } = useSavedExerciseCatalog();

  const [name, setName] = useState(editingExercise?.name ?? "");
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>(
    editingExercise?.muscleGroup ?? "CHEST",
  );

  const handleSaveExercise = async () => {
    if (!name.trim()) {
      Toast.show({
        type: "error",
        text1: "Exercise name required",
        position: "bottom",
      });
      return;
    }

    await saveExercise({
      ...(editingExercise ? { id: editingExercise.id } : {}),
      name: name.trim(),
      muscleGroup,
    } as Exercise);

    navigation.goBack();
  };

  const handleDelete = async () => {
    if (editingExercise) {
      await removeExercise(editingExercise.id);
    }
    navigation.goBack();
  };

  return (
    <SafeScreen style={styles.container} scrollable={true}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={16} color={COLORS.navIcon} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>
            {editingExercise ? "Edit Exercise" : "Add Exercise"}
          </Text>
          <Text style={styles.subtitle}>
            Save an exercise to reuse in your workout logs
          </Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <Text style={styles.label}>Exercise Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Ex: Barbell Bench Press"
        placeholderTextColor={COLORS.inactive}
      />

      <Text style={styles.label}>Muscle Group</Text>
      <View style={styles.chipRow}>
        {MUSCLE_GROUPS.map((group) => {
          const isSelected = muscleGroup === group;
          return (
            <TouchableOpacity
              key={group}
              style={[styles.chip, isSelected && styles.activeChip]}
              onPress={() => setMuscleGroup(group as MuscleGroup)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, isSelected && styles.activeChipText]}>
                {MUSCLE_GROUP_LABELS[group]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.actionRow}>
        {editingExercise && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            disabled={isSaving || isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator color={COLORS.inactive} />
            ) : (
              <Text style={styles.deleteButtonText}>Delete Exercise</Text>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.saveButton, editingExercise && styles.saveButtonHalf]}
          onPress={handleSaveExercise}
          disabled={isSaving || isDeleting}
        >
          {isSaving ? (
            <ActivityIndicator color={COLORS.text} />
          ) : (
            <Text style={styles.saveButtonText}>
              {editingExercise ? "Update" : "Save Exercise"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
};

export default ExerciseEditorScreen;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 110,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 22,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: withOpacity(COLORS.text, 0.14),
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "500",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12.5,
    color: withOpacity(COLORS.text, 0.5),
    marginTop: 2,
  },
  headerSpacer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 10,
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
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
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
  saveButton: {
    width: "100%",
    height: 52,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  saveButtonText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "500",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  saveButtonHalf: {
    flex: 1,
    marginLeft: 8,
    marginTop: 0,
  },
  deleteButton: {
    flex: 1,
    height: 52,
    borderRadius: 8,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: withOpacity(COLORS.text, 0.14),
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  deleteButtonText: {
    color: COLORS.inactive,
    fontSize: 14,
    fontWeight: "500",
  },
});
