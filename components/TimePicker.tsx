import React, { useEffect, useRef, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, View } from "react-native";
// gesture-handler's ScrollView participates in RNGH's nested-scroll
// arbitration: while this column still has room to scroll, it claims the
// vertical drag for itself instead of handing it to the parent page (which
// is what caused pull-to-refresh to fire while spinning a wheel).
import { ScrollView } from "react-native-gesture-handler";
import { COLORS, withOpacity } from "../utils/Constants";

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
  const isInteractingRef = useRef(false);
  // Local, per-column value used just for highlighting the item under the
  // selector while the user is actively dragging. Kept separate from
  // `selectedValue` (owned by the parent) so mid-drag frames don't bounce
  // state back up and re-render the whole picker on every scroll tick.
  const [liveValue, setLiveValue] = useState(selectedValue);

  const indexOf = (value: string) => Math.max(0, data.indexOf(value));

  // Re-sync this column when its value changes from *outside* (e.g. loading
  // a different meal to edit), but never fight the user mid-drag.
  useEffect(() => {
    if (isInteractingRef.current) return;
    setLiveValue(selectedValue);
    scrollViewRef.current?.scrollTo({
      y: indexOf(selectedValue) * ITEM_HEIGHT,
      animated: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValue, data]);

  const handleScrollBeginDrag = () => {
    isInteractingRef.current = true;
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.min(
      data.length - 1,
      Math.max(0, Math.round(yOffset / ITEM_HEIGHT)),
    );
    if (data[index] !== liveValue) {
      setLiveValue(data[index]);
    }
  };

  // With snapToInterval set, releasing a drag always animates to the
  // nearest item, so momentum-end is a reliable single point to commit the
  // final selection from (no need to separately handle onScrollEndDrag).
  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.min(
      data.length - 1,
      Math.max(0, Math.round(yOffset / ITEM_HEIGHT)),
    );
    isInteractingRef.current = false;
    setLiveValue(data[index]);
    if (data[index] !== selectedValue) {
      onValueChange(data[index]);
    }
  };

  return (
    <View style={[styles.pickerColumn, { width }]}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onScrollBeginDrag={handleScrollBeginDrag}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingVertical: VERTICAL_PADDING }}
        contentOffset={{ x: 0, y: indexOf(selectedValue) * ITEM_HEIGHT }}
      >
        {data.map((item, index) => (
          <View key={`${item}-${index}`} style={styles.itemContainer}>
            <Text
              style={[
                styles.pickerItemText,
                item === liveValue && styles.pickerItemTextSelected,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const daysInMonth = new Date(parseInt(year), monthIndex + 1, 0).getDate();
    const clampedDay = Math.min(parseInt(day, 10), daysInMonth)
      .toString()
      .padStart(2, "0");

    const d = new Date(parseInt(year), monthIndex, parseInt(clampedDay, 10));

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
    backgroundColor: withOpacity(COLORS.primary, 0.12),
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
    backgroundColor: withOpacity(COLORS.text, 0.1),
    marginHorizontal: 10,
  },
});
