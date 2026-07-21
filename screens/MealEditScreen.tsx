import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RadioGroup, { RadioButtonProps } from "react-native-radio-buttons-group";
import Ionicons from "@expo/vector-icons/Ionicons";
import SafeScreen from "../components/SafeScreen";
import TimePicker from "../components/TimePicker";
import { useMealLogs } from "../hooks/useMealLogs";
import { useMealSelectionCatalog } from "../hooks/useMealSelectionCatalog";
import { COLORS, SCREEN, withOpacity } from "../utils/Constants";
import { MealLog, MealSelectionItem, StagedMealItem } from "../utils/types";

type CatalogTab = "dishes" | "meals";

const MealEditScreen = ({ route, navigation }: any) => {
  const entityType = route.params?.entityType as "dish" | "meal";
  const editingMeal = route.params?.editingMeal as MealLog | null;
  const isFastingToggle = route.params?.isFastingToggle as boolean | undefined;
  const trackingState = route.params?.trackingState as string | undefined;
  const activeScheduleId = route.params?.activeScheduleId as string | undefined;
  const { handleSave, handleDelete, isPending } = useMealLogs();
  const { dishes, meals, isLoading, isRefreshing, refetch } = useMealSelectionCatalog();

  const [name, setName] = useState("BREAKFAST");
  const [activeTab, setActiveTab] = useState<CatalogTab>("dishes");
  const [stagedItems, setStagedItems] = useState<StagedMealItem[]>([]);
  const [mealTime, setMealTime] = useState<Date>(() =>
    editingMeal?.mealTime ? new Date(editingMeal.mealTime) : new Date(),
  );
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  const mealTimeLabel = mealTime.toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: "BREAKFAST",
        label: "Breakfast",
        value: "Breakfast",
        color: COLORS.primary,
        labelStyle: { color: COLORS.text },
      },
      {
        id: "LUNCH",
        label: "Lunch",
        value: "Lunch",
        color: COLORS.primary,
        labelStyle: { color: COLORS.text },
      },
      {
        id: "DINNER",
        label: "Dinner",
        value: "Dinner",
        color: COLORS.primary,
        labelStyle: { color: COLORS.text },
      },
      {
        id: "SNACK",
        label: "Snacks",
        value: "Snacks",
        color: COLORS.primary,
        labelStyle: { color: COLORS.text },
      },
    ],
    [],
  );

  useEffect(() => {
    if (editingMeal) {
      setName(editingMeal.notes?.toUpperCase() || "BREAKFAST");
      setMealTime(
        editingMeal.mealTime ? new Date(editingMeal.mealTime) : new Date(),
      );
      if (editingMeal.dishes && editingMeal.dishes.length > 0) {
        setStagedItems(
          editingMeal.dishes.map((d) => ({
            id: d.dishId || `dish-${d.id}`,
            name: d.name || "Dish",
            calories: d.calories || 0,
            subtitle: "Previously saved selection",
            kind: "dish",
            quantity: d.quantity || 1,
          })),
        );
      } else {
        setStagedItems([]);
      }
      return;
    }

    setMealTime(new Date());
    setStagedItems([]);
  }, [editingMeal]);

  const catalogItems = activeTab === "dishes" ? dishes : meals;
  const selectedIds = new Set(stagedItems.map((item) => item.id));
  const totalCalories = stagedItems.reduce(
    (sum, item) => sum + item.calories * item.quantity,
    0,
  );

  const toggleItem = (item: MealSelectionItem) => {
    setStagedItems((currentItems) => {
      const existingItem = currentItems.find(
        (currentItem) => currentItem.id === item.id,
      );

      if (existingItem) {
        return currentItems.filter((currentItem) => currentItem.id !== item.id);
      }

      return [...currentItems, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setStagedItems((currentItems) =>
      currentItems.flatMap((item) => {
        if (item.id !== id) {
          return [item];
        }

        const quantity = item.quantity + delta;
        if (quantity <= 0) {
          return [];
        }

        return [{ ...item, quantity }];
      }),
    );
  };

  const onSave = () => {
    handleSave(
      name,
      stagedItems,
      editingMeal,
      isFastingToggle,
      trackingState,
      activeScheduleId,
      mealTime,
    );
  };

  return (
    <SafeScreen style={styles.container} scrollable={true} onRefresh={refetch} refreshing={isRefreshing}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {editingMeal ? "Edit Meal" : "Log New Meal"}
        </Text>
        <Text style={styles.subtitle}>
          {editingMeal
            ? "Update the items in this entry"
            : "Build this entry from your saved dishes and meals"}
        </Text>
      </View>

      <Text style={styles.label}>Meal Type</Text>
      <RadioGroup
        radioButtons={radioButtons}
        onPress={setName}
        selectedId={name}
        layout="row"
        containerStyle={styles.radioGroup}
      />

      <Text style={styles.label}>Meal Time</Text>
      <TouchableOpacity
        style={styles.timeRow}
        onPress={() => setIsTimePickerOpen((open) => !open)}
        activeOpacity={0.8}
      >
        <Ionicons name="time-outline" size={16} color={COLORS.primary} />
        <Text style={styles.timeRowText}>{mealTimeLabel}</Text>
        <Ionicons
          name={isTimePickerOpen ? "chevron-up" : "chevron-down"}
          size={16}
          color={COLORS.chevron}
        />
      </TouchableOpacity>
      {isTimePickerOpen && (
        <View style={styles.timePickerCard}>
          <TimePicker initialTime={mealTime} onTimeChange={setMealTime} />
        </View>
      )}

      <View style={styles.stagingCard}>
        <View style={styles.stagingHeader}>
          <Text style={styles.sectionTitle}>Selected Items</Text>
          <Text style={styles.totalCalories}>{totalCalories} kcal</Text>
        </View>

        {stagedItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nothing selected yet</Text>
            <Text style={styles.emptySubtitle}>
              Pick dishes or meals below to build this entry.
            </Text>
          </View>
        ) : (
          stagedItems.map((item) => (
            <View key={item.id} style={styles.stagedItem}>
              <View style={styles.stagedItemDetails}>
                <Text style={styles.stagedItemName}>{item.name}</Text>
                <Text style={styles.stagedItemMeta}>
                  {item.kind === "dish" ? "Dish" : "Meal"} • {item.calories}{" "}
                  kcal
                </Text>
              </View>

              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, -1)}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>

                <Text style={styles.quantityValue}>{item.quantity}</Text>

                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, 1)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "dishes" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("dishes")}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "dishes" && styles.activeTabButtonText,
            ]}
          >
            My dishes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "meals" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("meals")}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "meals" && styles.activeTabButtonText,
            ]}
          >
            My meals
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.catalogCard}>
        <View style={styles.catalogHeader}>
          <Text style={styles.sectionTitle}>
            {activeTab === "dishes" ? "Choose dishes" : "Choose meals"}
          </Text>
          <TouchableOpacity
            style={styles.newButton}
            onPress={() =>
              navigation.navigate(SCREEN.foodeditor, {
                entityType: activeTab === "dishes" ? "dish" : "meal",
              })
            }
          >
            <Text style={styles.newButtonText}>
              + New {activeTab === "dishes" ? "dish" : "meal"}
            </Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={COLORS.primary} />
          </View>
        ) : catalogItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No items available</Text>
            <Text style={styles.emptySubtitle}>
              Your saved {activeTab === "dishes" ? "dishes" : "meals"} will show
              up here.
            </Text>
          </View>
        ) : (
          catalogItems.map((item) => {
            const isSelected = selectedIds.has(item.id);

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.catalogItem}
                onPress={() => toggleItem(item)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.checkbox,
                    isSelected && styles.checkboxSelected,
                  ]}
                >
                  {isSelected && (
                    <Ionicons name="checkmark" size={15} color={COLORS.background} />
                  )}
                </View>

                <View style={styles.catalogItemDetails}>
                  <Text style={styles.catalogItemName}>{item.name}</Text>
                  <Text style={styles.catalogItemMeta}>
                    {item.subtitle ? `${item.subtitle} • ` : ""}
                    {item.calories} kcal
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
              {editingMeal ? "Update Meal" : "Save Meal"}
            </Text>
          )}
        </TouchableOpacity>

        {editingMeal && (
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => {
              handleDelete(editingMeal);
              navigation.goBack();
            }}
            disabled={isPending}
          >
            <Text style={styles.deleteButtonText}>Delete Meal</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeScreen>
  );
};

export default MealEditScreen;

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
  radioGroup: {
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginBottom: 20,
    width: "100%",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  timeRowText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  timePickerCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    marginTop: -12,
    marginBottom: 20,
    overflow: "hidden",
  },
  stagingCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
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
  totalCalories: {
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
  quantityButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  quantityValue: {
    minWidth: 24,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  tabs: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 18,
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: withOpacity(COLORS.text, 0.1),
  },
  activeTabButton: {
    backgroundColor: withOpacity(COLORS.primary, 0.14),
    borderColor: COLORS.accent700,
  },
  tabButtonText: {
    color: COLORS.inactive,
    fontSize: 12.5,
  },
  activeTabButtonText: {
    color: COLORS.accent300,
    fontWeight: "500",
  },
  catalogCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 16,
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
    fontVariant: ["tabular-nums"],
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
