import { StyleSheet, Text, View, Animated } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { COLORS } from "../utils/Constants";
import Svg, { Circle } from "react-native-svg";
import ActionButton from "./ActionButton";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const FastingTracker = ({ trackingState, startTime, fastRatio = 18, eatRatio = 6, onToggle }) => {
  const [now, setNow] = useState(Date.now());

  // Continuous timer tick
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fastTargetMs = fastRatio * 3600000;
  const eatTargetMs = eatRatio * 3600000;
  
  const targetDuration = trackingState === "FASTING" ? fastTargetMs : eatTargetMs;
  const elapsedMs = now - startTime;
  const remainingMs = targetDuration - elapsedMs;
  
  const isOvertime = remainingMs < 0;
  const displayMs = Math.abs(remainingMs); // Just show raw time duration

  // Formatting time hr:min:sec
  const hrs = Math.floor(displayMs / 3600000);
  const mins = Math.floor((displayMs % 3600000) / 60000);
  const secs = Math.floor((displayMs % 60000) / 1000);
  
  const timeString = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  // Calculate Progress for SVG Ring
  const radius = 100;
  const strokeWidth = 15;
  const circumference = 2 * Math.PI * radius;
  
  // Cap progress at 1 if not overtime, keep at 1 if overtime
  const progressRatio = isOvertime ? 1 : elapsedMs / targetDuration;
  
  const animatedProgress = useRef(new Animated.Value(progressRatio)).current;

  // Animate the progress smoothly
  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progressRatio,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progressRatio, animatedProgress]);

  const strokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0]
  });

  const activeColor = trackingState === "FASTING" ? COLORS.primary : "#E63946"; // Orange/red for eating

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>
        {trackingState === "FASTING" ? "Fasting Window" : "Eating Window"}
      </Text>
      
      <View style={styles.svgContainer}>
        {/* Background Track */}
        <Svg width={(radius + strokeWidth) * 2} height={(radius + strokeWidth) * 2}>
          <Circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke={COLORS.ascent}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress Track */}
          <AnimatedCircle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke={activeColor}
            strokeWidth={strokeWidth+15}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${radius + strokeWidth} ${radius + strokeWidth})`}
          />
        </Svg>
        
        {/* Center Text */}
        <View style={styles.centerTextContainer}>
          <Text style={styles.timeText}>{isOvertime? "+" +timeString : timeString}</Text>
          <Text style={styles.subText}>
            {isOvertime ? "Overtime" : "Remaining"}
          </Text>
        </View>
      </View>

      <ActionButton
        title={trackingState === "FASTING" ? "Break Fast" : "Start Fasting"}
        onPress={onToggle}
        backgroundColor={trackingState === "FASTING" ? "#E63946" : COLORS.primary}
      />
    </View>
  );
};

export default FastingTracker;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: COLORS.ascent,
    borderRadius: 15,
    marginVertical: 10,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
  titleText: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  svgContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  centerTextContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  timeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  subText: {
    fontSize: 16,
    color: COLORS.primary,
    marginTop: 4,
  },
});
