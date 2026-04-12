import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { COLORS } from "../utils/Constants";

const RATIO_DATA = [
  { id: 0, value: "1 : 23" },
  { id: 1, value: "2 : 22" },
  { id: 2, value: "3 : 21" },
  { id: 3, value: "4 : 20" },
  { id: 4, value: "5 : 19" },
  { id: 5, value: "6 : 18" },
  { id: 6, value: "7 : 17" },
  { id: 7, value: "8 : 16" },
  { id: 8, value: "9 : 15" },
  { id: 9, value: "10 : 14" },
  { id: 10, value: "11 : 13" },
  { id: 11, value: "12 : 12" },
  { id: 12, value: "13 : 11" },
  { id: 13, value: "14 : 10" },
  { id: 14, value: "15 : 9" },
  { id: 15, value: "16 : 8" },
  { id: 16, value: "17 : 7" },
  { id: 17, value: "18 : 6" },
  { id: 18, value: "19 : 5" },
  { id: 19, value: "20 : 4" },
  { id: 20, value: "21 : 3" },
  { id: 21, value: "22 : 2" },
  { id: 22, value: "23 : 1" },
];

const ITEM_HEIGHT = 50;
const CONTAINER_HEIGHT = 150;
const VERTICAL_PADDING = (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2;

interface RatioRollerProps {
  onValueChange?: (value: string) => void;
}

const RatioRoller: React.FC<RatioRollerProps> = ({ onValueChange }) => {
  const flatListRef = useRef<FlatList>(null);
  const [selectedItem, setSelectedItem] = useState(RATIO_DATA[17]);

  const handleScroll = (event: any) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.round(yOffset / ITEM_HEIGHT);

    if (index >= 0 && index < RATIO_DATA.length) {
      const item = RATIO_DATA[index];
      setSelectedItem(item);
      onValueChange?.(item.value);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Fasting : Eating</Text>
      <View style={styles.rollerContainer}>
        <View style={styles.selectedItemOverlay} pointerEvents="none" />
        <FlatList
          ref={flatListRef}
          data={RATIO_DATA}
          renderItem={({ item, index }) => (
            <View style={styles.itemContainer}>
              <Text
                style={[
                  styles.rollItem,
                  index === selectedItem.id && styles.selectedRollItem,
                ]}
              >
                {item.value}
              </Text>
            </View>
          )}
          getItemLayout={(data, index) => ({
            length: ITEM_HEIGHT,
            offset: index * ITEM_HEIGHT,
            index,
          })}
          initialScrollIndex={17}
          keyExtractor={(item) => item.id}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          contentContainerStyle={{ paddingVertical: VERTICAL_PADDING }}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
        />
      </View>
    </View>
  );
};

export default RatioRoller;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  rollerContainer: {
    height: CONTAINER_HEIGHT,
    width: 200,
    borderRadius: 20,
    margin: 5,
    overflow: "hidden",
    alignItems: "center",
  },
  selectedItemOverlay: {
    height: ITEM_HEIGHT,
    width: "99%",
    backgroundColor: COLORS.background,
    position: "absolute",
    top: VERTICAL_PADDING,
    zIndex: -1,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  rollItem: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.background,
    textAlign: "center",
  },
  selectedRollItem: {
    color: COLORS.primary,
  },
});
