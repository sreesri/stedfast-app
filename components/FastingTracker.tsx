import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState, useEffect } from "react";
import { COLORS } from "../utils/Constants";

interface FastingTrackerProps {
  trackingState: "FASTING" | "EATING";
  startTime: Date;
  fastRatio?: number;
  eatRatio?: number;
  onToggle: () => void;
}

const FastingTracker: React.FC<FastingTrackerProps> = ({
  trackingState,
  startTime,
  fastRatio = 18,
  eatRatio = 6,
  onToggle,
}) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const fastTargetMs = fastRatio * 3600000;
  const totalCycleMs = 24 * 3600000;
  const fastStartMs = startTime instanceof Date ? startTime.getTime() : Number(startTime);

  const elapsedMs = now - fastStartMs;
  const isFasting = trackingState === "FASTING";
  const targetMs = isFasting ? fastTargetMs : eatRatio * 3600000;
  const remainingMs = targetMs - elapsedMs;

  const elapsedHrs = Math.floor(Math.abs(elapsedMs) / 3600000);
  const elapsedMins = Math.floor((Math.abs(elapsedMs) % 3600000) / 60000);

  const displayMs = Math.abs(remainingMs);
  const hrs = Math.floor(displayMs / 3600000);
  const mins = Math.floor((displayMs % 3600000) / 60000);
  const secs = Math.floor((displayMs % 60000) / 1000);
  const timeStr = `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  const secsStr = `:${String(secs).padStart(2, "0")}`;

  const eatOpenMs = fastStartMs + fastTargetMs;
  const eatOpenDate = new Date(eatOpenMs);
  const eatOpenStr = eatOpenDate.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  const fastStartDate = new Date(fastStartMs);
  const fastStartLabel = fastStartDate.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  const eatLabel = eatOpenDate.toLocaleTimeString([], { hour: "numeric" });
  const nextFastDate = new Date(fastStartMs + totalCycleMs);
  const nextFastLabel = nextFastDate.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  // Band position: how far through the 24h cycle we are
  const positionInCycle = Math.max(0, elapsedMs % totalCycleMs);
  const bandPosition = Math.min(positionInCycle / totalCycleMs, 1);
  const fastFraction = fastRatio / 24;

  const kicker = `${isFasting ? "Fasting" : "Eating"} · ${elapsedHrs}h ${elapsedMins}m in`.toUpperCase();
  const subtitleText = isFasting
    ? `until eating window opens at `
    : `fasting resumes at `;
  const subtitleHighlight = isFasting ? eatOpenStr : nextFastLabel;
  const buttonLabel = isFasting ? "Break fast" : "Start fasting";

  return (
    <View style={styles.container}>
      <Text style={styles.kicker}>{kicker}</Text>

      <View style={styles.countdownRow}>
        <Text style={styles.countdown}>{timeStr}</Text>
        <Text style={styles.countdownSecs}>{secsStr}</Text>
      </View>

      <Text style={styles.subtitle}>
        {subtitleText}
        <Text style={styles.subtitleHighlight}>{subtitleHighlight}</Text>
      </Text>

      {/* 24h band */}
      <View style={styles.band}>
        {/* Fast zone */}
        <View style={[styles.fastZone, { flex: fastRatio }]} />
        {/* Eat zone */}
        <View style={[styles.eatZone, { flex: eatRatio }]} />
        {/* Progress overlay */}
        <View
          style={[
            styles.progressOverlay,
            { width: `${bandPosition * 100}%` as any },
          ]}
        />
        {/* Now marker */}
        <View
          style={[
            styles.nowMarker,
            { left: `${Math.min(bandPosition * 100, 99)}%` as any },
          ]}
        />
      </View>

      <View style={styles.bandLabels}>
        <Text style={styles.bandLabel}>{fastStartLabel}</Text>
        <Text style={[styles.bandLabel, styles.nowLabel]}>now</Text>
        <Text style={styles.bandLabel}>{eatLabel} eat</Text>
        <Text style={styles.bandLabel}>{nextFastLabel}</Text>
      </View>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={onToggle}
        activeOpacity={0.75}
      >
        <Text style={styles.actionText}>{buttonLabel}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FastingTracker;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 34,
  },
  kicker: {
    fontSize: 12,
    letterSpacing: 1,
    color: COLORS.accent300,
    marginBottom: 8,
  },
  countdownRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 4,
  },
  countdown: {
    fontSize: 56,
    fontWeight: "500",
    letterSpacing: -1,
    color: COLORS.text,
    lineHeight: 60,
    fontVariant: ["tabular-nums"],
  },
  countdownSecs: {
    fontSize: 28,
    fontWeight: "500",
    color: "rgba(233,233,237,0.4)",
    marginBottom: 6,
    fontVariant: ["tabular-nums"],
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(233,233,237,0.55)",
    marginBottom: 26,
  },
  subtitleHighlight: {
    color: COLORS.text,
  },
  band: {
    height: 34,
    borderRadius: 6,
    overflow: "hidden",
    flexDirection: "row",
    position: "relative",
  },
  fastZone: {
    backgroundColor: "#2d2a55",
  },
  eatZone: {
    backgroundColor: COLORS.track,
  },
  progressOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(145,132,217,0.25)",
  },
  nowMarker: {
    position: "absolute",
    top: -2,
    width: 2,
    height: 38,
    backgroundColor: COLORS.accent300,
    shadowColor: COLORS.accent300,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 3,
  },
  bandLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 7,
    marginBottom: 26,
  },
  bandLabel: {
    fontSize: 10,
    color: "rgba(233,233,237,0.45)",
    fontVariant: ["tabular-nums"],
  },
  nowLabel: {
    color: COLORS.accent300,
  },
  actionButton: {
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  actionText: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.primary,
  },
});
