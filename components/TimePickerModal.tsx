import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { COLORS } from "../utils/Constants";

const ITEM_HEIGHT = 50;

const hoursList = Array.from({ length: 12 }, (_, i) =>
  (i + 1).toString().padStart(2, "0"),
);
const minutesList = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, "0"),
);
const ampmList = ["AM", "PM"];

const CustomScrollPicker = ({ data, selectedValue, onValueChange }) => {
  const flatListRef = useRef<FlatList>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Add padding elements to allow scrolling to the ends
  const paddedData = ["", "", ...data, "", ""];

  useEffect(() => {
    const index = data.indexOf(selectedValue);
    if (index !== -1) {
      setSelectedIndex(index);
    }
  }, [selectedValue, data]);

  const initialIndex = data.indexOf(selectedValue);

  const onMomentumScrollEnd = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    // adding ITEM_HEIGHT/2 makes sure it registers the closest item
    const index = Math.round(y / ITEM_HEIGHT);
    if (index >= 0 && index < data.length) {
      setSelectedIndex(index);
      onValueChange(data[index]);
    }
  };

  const renderItem = ({ item, index }) => {
    // actualIndex within the real data array
    const actualIndex = index - 2;
    const isSelected = actualIndex === selectedIndex;

    return (
      <View style={[styles.pickerItem, { height: ITEM_HEIGHT }]}>
        <Text
          style={[
            styles.pickerItemText,
            isSelected && styles.pickerItemTextSelected,
          ]}
        >
          {item}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.pickerColumn}>
      <FlatList
        ref={flatListRef}
        data={paddedData}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={onMomentumScrollEnd}
        initialScrollIndex={initialIndex !== -1 ? initialIndex : 0}
        scrollEventThrottle={16}
        // getItemLayout makes scrollToIndex exact
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: false,
            });
          }, 100);
        }}
        bounces={false}
      />
    </View>
  );
};

const TimePickerModal = ({ visible, onClose, onConfirm, initialTime }) => {
  const [selectedHour, setSelectedHour] = useState("12");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [selectedAmpm, setSelectedAmpm] = useState("AM");

  useEffect(() => {
    if (visible && initialTime) {
      const date = new Date(initialTime);
      let h = date.getHours();
      const m = date.getMinutes();
      const ampmString = h >= 12 ? "PM" : "AM";

      h = h % 12;
      h = h ? h : 12; // 0 should be 12

      setSelectedHour(h.toString().padStart(2, "0"));
      setSelectedMinute(m.toString().padStart(2, "0"));
      setSelectedAmpm(ampmString);
    }
  }, [visible, initialTime]);

  const handleConfirm = () => {
    const baseDate = initialTime ? new Date(initialTime) : new Date();
    let h = parseInt(selectedHour, 10);

    if (selectedAmpm === "PM" && h < 12) h += 12;
    if (selectedAmpm === "AM" && h === 12) h = 0;

    baseDate.setHours(h);
    baseDate.setMinutes(parseInt(selectedMinute, 10));
    baseDate.setSeconds(0);

    onConfirm(baseDate);
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          activeOpacity={1}
        />
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Select Time</Text>

          {/* Custom Roller Picker */}
          <View style={styles.pickerContainer}>
            <View style={styles.selectionOverlay} pointerEvents="none" />
            <CustomScrollPicker
              data={hoursList}
              selectedValue={selectedHour}
              onValueChange={setSelectedHour}
            />
            <Text style={styles.colon}>:</Text>
            <CustomScrollPicker
              data={minutesList}
              selectedValue={selectedMinute}
              onValueChange={setSelectedMinute}
            />
            <View style={{ width: 10 }} />
            <CustomScrollPicker
              data={ampmList}
              selectedValue={selectedAmpm}
              onValueChange={setSelectedAmpm}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonConfirm}
              onPress={handleConfirm}
            >
              <Text style={styles.buttonTextConfirm}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TimePickerModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.secondary,
    borderWidth: 5,
    margin: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: COLORS.primary,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: ITEM_HEIGHT * 5, // show 5 items roughly
    overflow: "hidden",
  },
  selectionOverlay: {
    position: "absolute",
    top: ITEM_HEIGHT * 2, // middle position
    height: ITEM_HEIGHT,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 10,
    zIndex: -1, // Keep behind text
  },
  pickerColumn: {
    width: 60,
    height: "100%",
  },
  pickerItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  pickerItemText: {
    fontSize: 20,
    color: "#ccc",
  },
  pickerItemTextSelected: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  colon: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  buttonConfirm: {
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonTextConfirm: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
