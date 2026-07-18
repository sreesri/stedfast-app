import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import SafeScreen from "../components/SafeScreen";
import { useSavedFoodCatalog } from "../hooks/useSavedFoodCatalog";
import { SCREEN, COLORS, withOpacity } from "../utils/Constants";
import { Dish, Meal } from "../utils/types";
import Ionicons from "@expo/vector-icons/Ionicons";

type CatalogTab = "dishes" | "meals";

const FoodLibraryScreen = () => {
  const navigation = useNavigation<any>();
  const { dishes, meals, isLoading, refetch, isRefreshing } = useSavedFoodCatalog();
  const [activeTab, setActiveTab] = useState<CatalogTab>("dishes");

  const navigateToCreatePage = () => {
    navigation.navigate(SCREEN.foodeditor, {
      entityType: activeTab === "dishes" ? "dish" : "meal",
    });
  };

  const openDish = (dish: Dish) => {
    navigation.navigate(SCREEN.foodeditor, {
      entityType: "dish",
      editingDish: dish,
    });
  };

  const openMeal = (meal: Meal) => {
    navigation.navigate(SCREEN.foodeditor, {
      entityType: "meal",
      editingMeal: meal,
    });
  };

  const items = activeTab === "dishes" ? dishes : meals;

  return (
    <SafeScreen
      style={styles.container}
      scrollable={true}
      onRefresh={refetch}
      refreshing={isRefreshing}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Library</Text>
          <Text style={styles.subtitle}>
            {dishes.length} {dishes.length === 1 ? "dish" : "dishes"} · {meals.length}{" "}
            {meals.length === 1 ? "meal" : "meals"}
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

      {/* Tab chips */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.chip, activeTab === "dishes" && styles.activeChip]}
          onPress={() => setActiveTab("dishes")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.chipText,
              activeTab === "dishes" && styles.activeChipText,
            ]}
          >
            My dishes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chip, activeTab === "meals" && styles.activeChip]}
          onPress={() => setActiveTab("meals")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.chipText,
              activeTab === "meals" && styles.activeChipText,
            ]}
          >
            My meals
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator color={COLORS.primary} size="large" />
        </View>
      ) : items.length > 0 ? (
        <View style={styles.listGroup}>
          {items.map((item: Dish | Meal, index) => {
            const isLastItem = index === items.length - 1;
            return (
              <TouchableOpacity
                key={(item as any).id}
                style={[styles.listRow, !isLastItem && styles.listRowBorder]}
                onPress={() =>
                  activeTab === "dishes"
                    ? openDish(item as Dish)
                    : openMeal(item as Meal)
                }
                activeOpacity={0.7}
              >
                <View style={styles.iconSquare}>
                  <Ionicons
                    name="restaurant-outline"
                    size={17}
                    color={COLORS.primary}
                  />
                </View>
                <View style={styles.rowContent}>
                  <Text style={styles.rowTitle}>{item.name}</Text>
                  <Text style={styles.rowMeta}>
                    {item.calories} kcal · {item.protein}P · {item.carbs}C · {item.fat}F
                    {"dishes" in item && item.dishes.length > 0
                      ? ` · ${item.dishes.length} ${item.dishes.length === 1 ? "dish" : "dishes"}`
                      : ""}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={14} color={COLORS.chevron} />
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>
            {activeTab === "dishes" ? "No saved dishes yet" : "No saved meals yet"}
          </Text>
          <Text style={styles.emptySubtitle}>
            {activeTab === "dishes"
              ? "Tap + to add your first dish."
              : "Tap + and build a meal from your saved dishes."}
          </Text>
        </View>
      )}
    </SafeScreen>
  );
};

export default FoodLibraryScreen;

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
  tabs: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 18,
  },
  chip: {
    paddingVertical: 6,
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
    fontVariant: ["tabular-nums"],
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
