import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import {
  getWorkoutLogs,
  createWorkoutLog,
  updateWorkoutLog,
  deleteWorkoutLog,
} from "../utils/http";
import { MuscleGroup, StagedExerciseItem, WorkoutLog } from "../utils/types";

export const useWorkoutLogs = (date?: string) => {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();

  const resolvedDate = date ?? new Date().toISOString().split("T")[0];

  const { data: workoutLogsData, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["workoutLogs", resolvedDate],
    queryFn: () => getWorkoutLogs(resolvedDate),
  });

  const workoutLogs = Array.isArray(workoutLogsData) ? workoutLogsData : [];

  const createWorkoutMutation = useMutation({
    mutationFn: createWorkoutLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workoutLogs"] });
      Toast.show({ type: "success", text1: "Workout saved", position: "bottom" });
      navigation.goBack();
    },
    onError: (error) => {
      console.error("Failed to save workout:", error);
      Toast.show({
        type: "error",
        text1: "Save failed",
        text2: "Could not save your workout. Please try again.",
        position: "bottom",
      });
    },
  });

  const updateWorkoutMutation = useMutation({
    mutationFn: updateWorkoutLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workoutLogs"] });
      Toast.show({ type: "success", text1: "Workout updated", position: "bottom" });
      navigation.goBack();
    },
    onError: (error) => {
      console.error("Failed to update workout:", error);
      Toast.show({
        type: "error",
        text1: "Update failed",
        text2: "Could not update your workout. Please try again.",
        position: "bottom",
      });
    },
  });

  const deleteWorkoutMutation = useMutation({
    mutationFn: deleteWorkoutLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workoutLogs"] });
      Toast.show({ type: "success", text1: "Workout deleted", position: "bottom" });
    },
    onError: (error) => {
      console.error("Failed to delete workout:", error);
      Toast.show({
        type: "error",
        text1: "Delete failed",
        text2: "Could not delete your workout. Please try again.",
        position: "bottom",
      });
    },
  });

  const handleSave = async (
    muscleGroups: MuscleGroup[],
    notes: string,
    stagedItems: StagedExerciseItem[],
    editingLog?: WorkoutLog | null,
  ) => {
    if (!muscleGroups.length) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please select at least one muscle group.",
        position: "bottom",
      });
      return;
    }

    if (!stagedItems.length) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please add at least one exercise.",
        position: "bottom",
      });
      return;
    }

    const exercises = stagedItems.map((item) => ({
      exerciseId: item.id,
      name: item.name,
      muscleGroup: item.muscleGroup,
      sets: item.sets,
      reps: item.reps,
    }));

    const payload = {
      logDate: editingLog?.logDate ?? resolvedDate,
      muscleGroups,
      notes,
      exercises,
    };

    if (editingLog) {
      await updateWorkoutMutation.mutateAsync({ ...payload, id: editingLog.id });
    } else {
      await createWorkoutMutation.mutateAsync(payload);
    }
  };

  const handleDelete = (editingLog: WorkoutLog) => {
    deleteWorkoutMutation.mutate(editingLog.id);
  };

  return {
    workoutLogs,
    isLoading,
    refetch,
    isRefreshing: isRefetching,
    handleSave,
    handleDelete,
    isPending:
      createWorkoutMutation.isPending ||
      updateWorkoutMutation.isPending ||
      deleteWorkoutMutation.isPending,
  };
};
