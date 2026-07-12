import React, { useState } from "react";
import {
  Alert,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import SafeScreen from "../components/SafeScreen";
import { useSavedFoodCatalog } from "../hooks/useSavedFoodCatalog";
import { SCREEN, COLORS } from "../utils/Constants";
import { Dish, Meal } from "../utils/types";

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

  return (
    <SafeScreen style={styles.container} scrollable={true} onRefresh={refetch} refreshing={isRefreshing}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Food</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={navigateToCreatePage}
          activeOpacity={0.85}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
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

      {isLoading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator color={COLORS.primary} size="large" />
        </View>
      ) : activeTab === "dishes" ? (
        dishes.length > 0 ? (
          dishes.map((dish) => (
            <TouchableOpacity
              key={dish.id}
              style={styles.card}
              onPress={() => openDish(dish)}
              activeOpacity={0.85}
            >
              <Text style={styles.cardTitle}>{dish.name}</Text>
              <Text style={styles.cardMeta}>
                {dish.calories} kcal • {dish.protein}P • {dish.carbs}C •{" "}
                {dish.fat}F
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No saved dishes yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap + to add your first dish with calories and macros.
            </Text>
          </View>
        )
      ) : meals.length > 0 ? (
        meals.map((meal) => (
          <TouchableOpacity
            key={meal.id}
            style={styles.card}
            onPress={() => openMeal(meal)}
            activeOpacity={0.85}
          >
            <Text style={styles.cardTitle}>{meal.name}</Text>
            <Text style={styles.cardMeta}>
              {meal.calories} kcal • {meal.protein}P • {meal.carbs}C •{" "}
              {meal.fat}F
            </Text>
            <Text style={styles.cardHint}>
              {meal.dishes.length} saved{" "}
              {meal.dishes.length === 1 ? "dish" : "dishes"}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No saved meals yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap + and build a meal from your saved dishes.
          </Text>
        </View>
      )}
    </SafeScreen>
  );
};

export default FoodLibraryScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 110,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.primary,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: COLORS.background,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: "700",
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: COLORS.ascent,
    padding: 6,
    borderRadius: 16,
    marginBottom: 18,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
  },
  activeTabButton: {
    backgroundColor: COLORS.primary,
  },
  tabButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
  },
  activeTabButtonText: {
    color: COLORS.background,
  },
  loadingState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  card: {
    backgroundColor: COLORS.ascent,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
  },
  cardMeta: {
    marginTop: 6,
    fontSize: 14,
    color: COLORS.primary,
  },
  cardHint: {
    marginTop: 8,
    fontSize: 13,
    color: COLORS.primary,
    opacity: 0.8,
  },
  emptyState: {
    backgroundColor: COLORS.ascent,
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.primary,
    textAlign: "center",
  },
});
