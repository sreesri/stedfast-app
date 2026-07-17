import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../utils/Constants";

const ITEM_HEIGHT = 50;
const CONTAINER_HEIGHT = 200;
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
  const scrollViewRef = useRef<ScrollView>(null);

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
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        nestedScrollEnabled={true}
        contentContainerStyle={{ paddingVertical: VERTICAL_PADDING }}
        contentOffset={{ x: 0, y: Math.max(0, initialIndex) * ITEM_HEIGHT }}
      >
        {data.map((item, index) => (
          <View key={`${item}-${index}`} style={styles.itemContainer}>
            <Text
              style={[
                styles.pickerItemText,
                item === selectedValue && styles.pickerItemTextSelected,
              ]}
            >
              {item}
            </Text>
          </View>
        ))}
      </ScrollView>
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
  const getInitialTimeParts = (timeToParse?: Date) => {
    if (timeToParse) {
      const date = new Date(timeToParse);
      const monthIndex = date.getMonth();
      const day = date.getDate().toString().padStart(2, "0");
      const year = date.getFullYear().toString();
      let h = date.getHours();
      const m = date.getMinutes().toString().padStart(2, "0");
      const ampmString = h >= 12 ? "PM" : "AM";

      h = h % 12;
      h = h ? h : 12;
      const hourStr = h.toString().padStart(2, "0");

      return {
        month: monthList[monthIndex],
        day,
        year,
        hour: hourStr,
        minute: m,
        ampm: ampmString,
      };
    }
    return {
      month: monthList[0],
      day: dayList[0],
      year: yearList[0],
      hour: "12",
      minute: "00",
      ampm: "AM",
    };
  };

  const initialParts = getInitialTimeParts(initialTime);

  const [selectedMonth, setSelectedMonth] = useState(initialParts.month);
  const [selectedDay, setSelectedDay] = useState(initialParts.day);
  const [selectedYear, setSelectedYear] = useState(initialParts.year);
  const [selectedHour, setSelectedHour] = useState(initialParts.hour);
  const [selectedMinute, setSelectedMinute] = useState(initialParts.minute);
  const [selectedAmpm, setSelectedAmpm] = useState(initialParts.ampm);

  useEffect(() => {
    if (initialTime) {
      const parts = getInitialTimeParts(initialTime);
      setSelectedMonth(parts.month);
      setSelectedDay(parts.day);
      setSelectedYear(parts.year);
      setSelectedHour(parts.hour);
      setSelectedMinute(parts.minute);
      setSelectedAmpm(parts.ampm);
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
    backgroundColor: "rgba(145,132,217,0.12)",
    borderRadius: 8,
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
    color: COLORS.inactive,
  },
  pickerItemTextSelected: {
    fontSize: 18,
    fontWeight: "500",
    color: COLORS.text,
  },
  colon: {
    fontSize: 20,
    fontWeight: "500",
    color: COLORS.text,
    marginHorizontal: 2,
  },
  divider: {
    width: 1,
    height: "60%",
    backgroundColor: "rgba(233,233,237,0.1)",
    marginHorizontal: 10,
  },
});
