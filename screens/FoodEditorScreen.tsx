import React, { useEffect, useMemo, useState } from "react";
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
import { useSavedFoodCatalog } from "../hooks/useSavedFoodCatalog";
import { COLORS, withOpacity } from "../utils/Constants";
import { Dish, Meal } from "../utils/types";

type SelectedDish = Dish & { quantity: number };

const FoodEditorScreen = ({ route, navigation }: any) => {
  const entityType = route.params?.entityType as "dish" | "meal";
  const editingDish = route.params?.editingDish as Dish | undefined;
  const editingMeal = route.params?.editingMeal as Meal | undefined;
  
  const { dishes, saveDish, saveMeal, isSaving, removeDish, removeMeal, isDeleting, refetch, isRefreshing } = useSavedFoodCatalog();

  const [dishName, setDishName] = useState(editingDish?.name ?? "");
  const [calories, setCalories] = useState(
    editingDish ? String(editingDish.calories) : "",
  );
  const [protein, setProtein] = useState(
    editingDish ? String(editingDish.protein) : "",
  );
  const [carbs, setCarbs] = useState(editingDish ? String(editingDish.carbs) : "");
  const [fat, setFat] = useState(editingDish ? String(editingDish.fat) : "");
  const [mealName, setMealName] = useState(editingMeal?.name ?? "");
  const [selectedDishes, setSelectedDishes] = useState<SelectedDish[]>([]);

  useEffect(() => {
    if (entityType !== "meal" || !editingMeal) {
      return;
    }

    const preselectedDishes = editingMeal.dishes
      .map((mealDish) => {
        const dish = dishes.find((item) => item.id === mealDish.dishId);
        if (!dish) {
          return null;
        }

        return {
          ...dish,
          quantity: mealDish.quantity,
        };
      })
      .filter((item): item is SelectedDish => item !== null);

    setSelectedDishes(preselectedDishes);
  }, [dishes, editingMeal, entityType]);

  const selectedDishIds = new Set(selectedDishes.map((dish) => dish.id));
  const mealTotals = useMemo(
    () =>
      selectedDishes.reduce(
        (totals, dish) => ({
          calories: totals.calories + dish.calories * dish.quantity,
          protein: totals.protein + dish.protein * dish.quantity,
          carbs: totals.carbs + dish.carbs * dish.quantity,
          fat: totals.fat + dish.fat * dish.quantity,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 },
      ),
    [selectedDishes],
  );

  const toggleDishSelection = (dish: Dish) => {
    setSelectedDishes((current) => {
      const existing = current.find((item) => item.id === dish.id);
      if (existing) {
        return current.filter((item) => item.id !== dish.id);
      }

      return [...current, { ...dish, quantity: 1 }];
    });
  };

  const updateDishQuantity = (dishId: string, delta: number) => {
    setSelectedDishes((current) =>
      current.flatMap((dish) => {
        if (dish.id !== dishId) {
          return [dish];
        }

        const quantity = dish.quantity + delta;
        if (quantity <= 0) {
          return [];
        }

        return [{ ...dish, quantity }];
      }),
    );
  };

  const handleSaveDish = async () => {
    if (!dishName.trim()) {
      Toast.show({
        type: "error",
        text1: "Dish name required",
        position: "bottom",
      });
      return;
    }

    await saveDish({
      ...(editingDish ? { id: editingDish.id } : {}),
      name: dishName.trim(),
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
    });

    navigation.goBack();
  };

  const handleSaveMeal = async () => {
    if (!mealName.trim()) {
      Toast.show({
        type: "error",
        text1: "Meal name required",
        position: "bottom",
      });
      return;
    }

    if (selectedDishes.length === 0) {
      Toast.show({
        type: "error",
        text1: "Select at least one dish",
        position: "bottom",
      });
      return;
    }

    await saveMeal({
      ...(editingMeal ? { id: editingMeal.id } : {}),
      name: mealName.trim(),
      calories: mealTotals.calories,
      protein: mealTotals.protein,
      carbs: mealTotals.carbs,
      fat: mealTotals.fat,
      dishes: selectedDishes.map((dish) => ({
        dishId: dish.id,
        quantity: dish.quantity,
      })),
    });

    navigation.goBack();
  };

  const handleDelete = async () => {
    if (entityType === "dish" && editingDish) {
      await removeDish(editingDish.id);
    } else if (entityType === "meal" && editingMeal) {
      await removeMeal(editingMeal.id);
    }
    navigation.goBack();
  };

  return (
    <SafeScreen style={styles.container} scrollable={true} onRefresh={refetch} refreshing={isRefreshing}>
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
            {entityType === "dish"
              ? editingDish
                ? "Edit Dish"
                : "Add Dish"
              : editingMeal
                ? "Edit Meal"
                : "Add Meal"}
          </Text>
          <Text style={styles.subtitle}>
            {entityType === "dish"
              ? "Log calories and macros for this dish"
              : "Combine saved dishes into a reusable meal"}
          </Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {entityType === "dish" ? (
        <>
          <Text style={styles.label}>Dish Name</Text>
          <TextInput
            style={styles.input}
            value={dishName}
            onChangeText={setDishName}
            placeholder="Ex: Cottage Cheese Bowl"
            placeholderTextColor={COLORS.inactive}
          />

          <Text style={styles.label}>Calories</Text>
          <TextInput
            style={styles.input}
            value={calories}
            onChangeText={setCalories}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor={COLORS.inactive}
          />

          <Text style={styles.label}>Protein</Text>
          <TextInput
            style={styles.input}
            value={protein}
            onChangeText={setProtein}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor={COLORS.inactive}
          />

          <Text style={styles.label}>Carbs</Text>
          <TextInput
            style={styles.input}
            value={carbs}
            onChangeText={setCarbs}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor={COLORS.inactive}
          />

          <Text style={styles.label}>Fat</Text>
          <TextInput
            style={styles.input}
            value={fat}
            onChangeText={setFat}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor={COLORS.inactive}
          />
        </>
      ) : (
        <>
          <Text style={styles.label}>Meal Name</Text>
          <TextInput
            style={styles.input}
            value={mealName}
            onChangeText={setMealName}
            placeholder="Ex: Post Workout Lunch"
            placeholderTextColor={COLORS.inactive}
          />

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Selected dishes</Text>
            {selectedDishes.length === 0 ? (
              <Text style={styles.summaryEmpty}>
                Select dishes below to build this meal.
              </Text>
            ) : (
              selectedDishes.map((dish) => (
                <View key={dish.id} style={styles.selectedDishRow}>
                  <View style={styles.selectedDishInfo}>
                    <Text style={styles.selectedDishName}>{dish.name}</Text>
                    <Text style={styles.selectedDishMeta}>
                      {dish.calories} kcal • {dish.protein}P • {dish.carbs}C •{" "}
                      {dish.fat}F
                    </Text>
                  </View>

                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateDishQuantity(dish.id, -1)}
                    >
                      <Text style={styles.quantityText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityValue}>{dish.quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateDishQuantity(dish.id, 1)}
                    >
                      <Text style={styles.quantityText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}

            <Text style={styles.totalText}>
              Total: {mealTotals.calories} kcal • {mealTotals.protein}P •{" "}
              {mealTotals.carbs}C • {mealTotals.fat}F
            </Text>
          </View>

          <Text style={styles.label}>Saved Dishes</Text>
          {dishes.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.summaryEmpty}>
                Add a few dishes first, then come back to build meals.
              </Text>
            </View>
          ) : (
            dishes.map((dish) => {
              const isSelected = selectedDishIds.has(dish.id);
              return (
                <TouchableOpacity
                  key={dish.id}
                  style={styles.catalogItem}
                  onPress={() => toggleDishSelection(dish)}
                  activeOpacity={0.85}
                >
                  <View
                    style={[
                      styles.checkbox,
                      isSelected && styles.checkboxSelected,
                    ]}
                  >
                    {isSelected ? (
                      <Ionicons name="checkmark" size={14} color={COLORS.background} />
                    ) : null}
                  </View>
                  <View style={styles.catalogItemInfo}>
                    <Text style={styles.catalogItemName}>{dish.name}</Text>
                    <Text style={styles.catalogItemMeta}>
                      {dish.calories} kcal • {dish.protein}P • {dish.carbs}C •{" "}
                      {dish.fat}F
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </>
      )}

      <View style={styles.actionRow}>
        {(editingDish || editingMeal) && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            disabled={isSaving || isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator color={COLORS.inactive} />
            ) : (
              <Text style={styles.deleteButtonText}>Delete {entityType === "dish" ? "Dish" : "Meal"}</Text>
            )}
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.saveButton, (editingDish || editingMeal) && styles.saveButtonHalf]}
          onPress={entityType === "dish" ? handleSaveDish : handleSaveMeal}
          disabled={isSaving || isDeleting}
        >
          {isSaving ? (
            <ActivityIndicator color={COLORS.text} />
          ) : (
            <Text style={styles.saveButtonText}>
              {entityType === "dish"
                ? editingDish
                  ? "Update"
                  : "Save Dish"
                : editingMeal
                  ? "Update"
                  : "Save Meal"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
};

export default FoodEditorScreen;

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
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 10,
  },
  summaryEmpty: {
    color: withOpacity(COLORS.text, 0.5),
    fontSize: 12.5,
  },
  selectedDishRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  selectedDishInfo: {
    flex: 1,
    paddingRight: 10,
  },
  selectedDishName: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  selectedDishMeta: {
    marginTop: 2,
    fontSize: 11.5,
    color: withOpacity(COLORS.text, 0.5),
    fontVariant: ["tabular-nums"],
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: withOpacity(COLORS.primary, 0.14),
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
  quantityValue: {
    minWidth: 24,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  totalText: {
    marginTop: 4,
    fontSize: 12.5,
    fontWeight: "500",
    color: COLORS.text,
    fontVariant: ["tabular-nums"],
  },
  emptyState: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 18,
  },
  catalogItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
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
  catalogItemInfo: {
    flex: 1,
  },
  catalogItemName: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  catalogItemMeta: {
    marginTop: 2,
    fontSize: 11.5,
    color: withOpacity(COLORS.text, 0.5),
    fontVariant: ["tabular-nums"],
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
