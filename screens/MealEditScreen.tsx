import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RadioGroup, { RadioButtonProps } from "react-native-radio-buttons-group";
import SafeScreen from "../components/SafeScreen";
import { useMealLogs } from "../hooks/useMealLogs";
import { useMealSelectionCatalog } from "../hooks/useMealSelectionCatalog";
import { COLORS } from "../utils/Constants";
import { MealLog, MealSelectionItem, StagedMealItem } from "../utils/types";

type CatalogTab = "dishes" | "meals";

const MealEditScreen = ({ route, navigation }: any) => {
  const entityType = route.params?.entityType as "dish" | "meal";
  const editingMeal = route.params?.editingMeal as MealLog | null;
  const isFastingToggle = route.params?.isFastingToggle as boolean | undefined;
  const trackingState = route.params?.trackingState as string | undefined;
  const activeScheduleId = route.params?.activeScheduleId as string | undefined;
  const { handleSave, handleDelete, isPending } = useMealLogs();
  const { dishes, meals, isLoading } = useMealSelectionCatalog();

  const [name, setName] = useState("BREAKFAST");
  const [activeTab, setActiveTab] = useState<CatalogTab>("dishes");
  const [stagedItems, setStagedItems] = useState<StagedMealItem[]>([]);

  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: "BREAKFAST",
        label: "Breakfast",
        value: "Breakfast",
        color: COLORS.primary,
        labelStyle: { color: COLORS.primary },
      },
      {
        id: "LUNCH",
        label: "Lunch",
        value: "Lunch",
        color: COLORS.primary,
        labelStyle: { color: COLORS.primary },
      },
      {
        id: "DINNER",
        label: "Dinner",
        value: "Dinner",
        color: COLORS.primary,
        labelStyle: { color: COLORS.primary },
      },
      {
        id: "SNACK",
        label: "Snacks",
        value: "Snacks",
        color: COLORS.primary,
        labelStyle: { color: COLORS.primary },
      },
    ],
    [],
  );

  useEffect(() => {
    if (editingMeal) {
      setName(editingMeal.notes?.toUpperCase() || "BREAKFAST");
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
    );
  };

  return (
    <SafeScreen style={styles.container} scrollable={true}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {editingMeal ? "Edit Meal" : "Add New Meal"}
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
        <Text style={styles.sectionTitle}>
          {activeTab === "dishes" ? "Choose dishes" : "Choose meals"}
        </Text>

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
                  {isSelected && <Text style={styles.checkboxMark}>✓</Text>}
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
            <ActivityIndicator color="#fff" />
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
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  label: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 10,
  },
  radioGroup: {
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginBottom: 20,
    width: "100%",
  },
  stagingCard: {
    backgroundColor: COLORS.ascent,
    borderRadius: 20,
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
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
  },
  totalCalories: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
  },
  emptyState: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.primary,
    opacity: 0.8,
    marginTop: 6,
    textAlign: "center",
  },
  stagedItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
  },
  stagedItemDetails: {
    flex: 1,
    paddingRight: 12,
  },
  stagedItemName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },
  stagedItemMeta: {
    fontSize: 13,
    color: COLORS.primary,
    marginTop: 4,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: "700",
  },
  quantityValue: {
    minWidth: 28,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: COLORS.ascent,
    padding: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  activeTabButton: {
    backgroundColor: COLORS.primary,
  },
  tabButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "700",
  },
  activeTabButtonText: {
    color: COLORS.background,
  },
  catalogCard: {
    backgroundColor: COLORS.ascent,
    borderRadius: 20,
    padding: 16,
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
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
  },
  checkboxMark: {
    color: COLORS.background,
    fontSize: 13,
    fontWeight: "700",
  },
  catalogItemDetails: {
    flex: 1,
  },
  catalogItemName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },
  catalogItemMeta: {
    fontSize: 13,
    color: COLORS.primary,
    marginTop: 4,
  },
  actions: {
    marginTop: 20,
    alignItems: "center",
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    width: "100%",
    borderRadius: 16,
  },
  deleteButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ff4d4d",
    width: "100%",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  deleteButtonText: {
    color: "#ff4d4d",
    fontSize: 16,
    fontWeight: "bold",
  },
});
