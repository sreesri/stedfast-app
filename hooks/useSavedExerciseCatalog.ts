import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import {
  createExercise,
  getExerciseLibrary,
  updateExercise,
  deleteExercise,
} from "../utils/http";
import { Exercise } from "../utils/types";

export const useSavedExerciseCatalog = () => {
  const queryClient = useQueryClient();

  const exercisesQuery = useQuery({
    queryKey: ["savedExercise", "exercises"],
    queryFn: getExerciseLibrary,
  });

  const invalidateCatalog = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["savedExercise", "exercises"] }),
      queryClient.invalidateQueries({ queryKey: ["exerciseSelection", "exercises"] }),
    ]);
  };

  const createExerciseMutation = useMutation({
    mutationFn: createExercise,
    onSuccess: async () => {
      await invalidateCatalog();
      Toast.show({ type: "success", text1: "Exercise saved", position: "bottom" });
    },
  });

  const updateExerciseMutation = useMutation({
    mutationFn: updateExercise,
    onSuccess: async () => {
      await invalidateCatalog();
      Toast.show({ type: "success", text1: "Exercise updated", position: "bottom" });
    },
  });

  const deleteExerciseMutation = useMutation({
    mutationFn: deleteExercise,
    onSuccess: async () => {
      await invalidateCatalog();
      Toast.show({ type: "success", text1: "Exercise deleted", position: "bottom" });
    },
  });

  const saveExercise = async (exercise: Exercise | Omit<Exercise, "id">) => {
    if ("id" in exercise) {
      return updateExerciseMutation.mutateAsync(exercise as Exercise & { id: string });
    }

    return createExerciseMutation.mutateAsync(exercise);
  };

  return {
    exercises: exercisesQuery.data ?? [],
    isLoading: exercisesQuery.isLoading,
    isRefreshing: exercisesQuery.isRefetching,
    refetch: exercisesQuery.refetch,
    isSaving: createExerciseMutation.isPending || updateExerciseMutation.isPending,
    isDeleting: deleteExerciseMutation.isPending,
    saveExercise,
    removeExercise: async (id: string) => deleteExerciseMutation.mutateAsync(id),
  };
};
