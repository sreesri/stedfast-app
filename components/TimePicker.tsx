import { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../utils/Constants";

const ITEM_HEIGHT = 50;
const CONTAINER_HEIGHT = 150;
const VERTICAL_PADDING = (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2;

const monthList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dayList = Array.from({ length: 31 }, (_, i) =>
  (i + 1).toString().padStart(2, "0"),
);

const yearList = Array.from({ length: 20 }, (_, i) => (i + 2020).toString());

const hoursList = Array.from({ length: 12 }, (_, i) =>
  (i + 1).toString().padStart(2, "0"),
);
const minutesList = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, "0"),
);
const ampmList = ["AM", "PM"];

interface CustomScrollPickerProps {
  data: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  width?: number;
}

const CustomScrollPicker: React.FC<CustomScrollPickerProps> = ({
  data,
  selectedValue,
  onValueChange,
  width = 60,
}) => {
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: any) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.round(yOffset / ITEM_HEIGHT);

    if (index >= 0 && index < data.length) {
      if (data[index] !== selectedValue) {
        onValueChange(data[index]);
      }
    }
  };

  const initialIndex = data.indexOf(selectedValue);

  return (
    <View style={[styles.pickerColumn, { width }]}>
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text
              style={[
                styles.pickerItemText,
                item === selectedValue && styles.pickerItemTextSelected,
              ]}
            >
              {item}
            </Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingVertical: VERTICAL_PADDING }}
        initialScrollIndex={initialIndex !== -1 ? initialIndex : 0}
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
      />
    </View>
  );
};

interface TimePickerProps {
  onTimeChange: (date: Date) => void;
  initialTime?: Date;
}

const TimePicker: React.FC<TimePickerProps> = ({
  onTimeChange,
  initialTime,
}) => {
  const [selectedMonth, setSelectedMonth] = useState(monthList[0]);
  const [selectedDay, setSelectedDay] = useState(dayList[0]);
  const [selectedYear, setSelectedYear] = useState(yearList[0]);
  const [selectedHour, setSelectedHour] = useState("12");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [selectedAmpm, setSelectedAmpm] = useState("AM");

  useEffect(() => {
    if (initialTime) {
      const date = new Date(initialTime);
      const monthIndex = date.getMonth();
      const day = date.getDate().toString().padStart(2, "0");
      const year = date.getFullYear().toString();
      let h = date.getHours();
      const m = date.getMinutes().toString().padStart(2, "0");
      const ampmString = h >= 12 ? "PM" : "AM";

      h = h % 12;
      h = h ? h : 12;
      const hourStr = h.toString().padStart(2, "0");

      setSelectedMonth(monthList[monthIndex]);
      setSelectedDay(day);
      setSelectedYear(year);
      setSelectedHour(hourStr);
      setSelectedMinute(m);
      setSelectedAmpm(ampmString);
    }
  }, [initialTime]);

  const updateSelectedTime = (
    month: string,
    day: string,
    year: string,
    hour: string,
    minute: string,
    ampm: string,
  ) => {
    const monthIndex = monthList.indexOf(month);
    const d = new Date(parseInt(year), monthIndex, parseInt(day));

    let h = parseInt(hour, 10);
    if (ampm === "PM" && h < 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;

    d.setHours(h);
    d.setMinutes(parseInt(minute, 10));
    d.setSeconds(0);

    onTimeChange(d);
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <View style={styles.selectionOverlay} pointerEvents="none" />
        <CustomScrollPicker
          data={yearList}
          selectedValue={selectedYear}
          onValueChange={(y) =>
            updateSelectedTime(
              selectedMonth,
              selectedDay,
              y,
              selectedHour,
              selectedMinute,
              selectedAmpm,
            )
          }
          width={50}
        />
        <CustomScrollPicker
          data={monthList}
          selectedValue={selectedMonth}
          onValueChange={(m) =>
            updateSelectedTime(
              m,
              selectedDay,
              selectedYear,
              selectedHour,
              selectedMinute,
              selectedAmpm,
            )
          }
          width={100}
        />
        <CustomScrollPicker
          data={dayList}
          selectedValue={selectedDay}
          onValueChange={(d) =>
            updateSelectedTime(
              selectedMonth,
              d,
              selectedYear,
              selectedHour,
              selectedMinute,
              selectedAmpm,
            )
          }
          width={30}
        />
        <Text style={styles.colon}>,</Text>
        <CustomScrollPicker
          data={hoursList}
          selectedValue={selectedHour}
          onValueChange={(h) =>
            updateSelectedTime(
              selectedMonth,
              selectedDay,
              selectedYear,
              h,
              selectedMinute,
              selectedAmpm,
            )
          }
          width={30}
        />
        <Text style={styles.colon}>:</Text>
        <CustomScrollPicker
          data={minutesList}
          selectedValue={selectedMinute}
          onValueChange={(m) =>
            updateSelectedTime(
              selectedMonth,
              selectedDay,
              selectedYear,
              selectedHour,
              m,
              selectedAmpm,
            )
          }
          width={30}
        />
        <CustomScrollPicker
          data={ampmList}
          selectedValue={selectedAmpm}
          onValueChange={(a) =>
            updateSelectedTime(
              selectedMonth,
              selectedDay,
              selectedYear,
              selectedHour,
              selectedMinute,
              a,
            )
          }
          width={30}
        />
      </View>
    </View>
  );
};

export default TimePicker;

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: CONTAINER_HEIGHT,
    overflow: "hidden",
    width: "100%",
  },
  selectionOverlay: {
    position: "absolute",
    top: VERTICAL_PADDING,
    height: ITEM_HEIGHT,
    width: "100%",
    backgroundColor: COLORS.background,
    borderRadius: 10,
    zIndex: -1,
  },
  pickerColumn: {
    height: "100%",
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerItemText: {
    fontSize: 14,
    color: COLORS.background,
  },
  pickerItemTextSelected: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  colon: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginHorizontal: 2,
  },
  divider: {
    width: 1,
    height: "60%",
    backgroundColor: COLORS.primary + "20",
    marginHorizontal: 10,
  },
});
