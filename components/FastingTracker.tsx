import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState, useEffect } from "react";
import { COLORS, withOpacity } from "../utils/Constants";

interface FastingTrackerProps {
  trackingState: "FASTING" | "EATING";
  startTime: Date;
  fastRatio?: number;
  eatRatio?: number;
  onToggle: () => void;
  /**
   * When the active fasting schedule was created. Used as a hard floor on
   * how far back the band will extrapolate — without it, a brand-new
   * schedule's very first session would get "backfilled" with a fake
   * eat/fast history before the plan even existed.
   */
  scheduleStartTime?: Date;
}

type ZoneType = "FAST" | "EAT";

interface Zone {
  type: ZoneType;
  startMs: number;
  endMs: number;
}

const HOUR_MS = 3600000;
const DAY_MS = 24 * HOUR_MS;
// Safety cap on how many zones we'll tile in either direction — well beyond
// any realistic fast/eat ratio, just guards against a degenerate 0h config.
const MAX_TILES = 48;

const formatClockTime = (ms: number) =>
  new Date(ms).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

/**
 * Tiles the repeating fast/eat schedule forward and backward from the
 * currently active session's real boundaries to cover [windowStart, windowEnd).
 * Because the schedule doesn't reset at midnight, a fixed calendar-day window
 * can clip a zone at either edge — e.g. a fast that started yesterday evening
 * still occupies the first few hours of today. That's why this can produce
 * either 2 zones (a boundary happens to land on midnight) or 3 (fast-eat-fast
 * / eat-fast-eat, the more common case).
 */
function buildDayZones(
  currentType: ZoneType,
  currentStartMs: number,
  currentDurationMs: number,
  fastDurationMs: number,
  eatDurationMs: number,
  windowStartMs: number,
  windowEndMs: number,
): Zone[] {
  const safeFastMs = Math.max(fastDurationMs, 60000);
  const safeEatMs = Math.max(eatDurationMs, 60000);
  const durationFor = (type: ZoneType) => (type === "FAST" ? safeFastMs : safeEatMs);

  const zones: Zone[] = [
    { type: currentType, startMs: currentStartMs, endMs: currentStartMs + currentDurationMs },
  ];

  let cursorStart = currentStartMs;
  let cursorType = currentType;
  for (let i = 0; i < MAX_TILES && cursorStart > windowStartMs; i++) {
    const prevType: ZoneType = cursorType === "FAST" ? "EAT" : "FAST";
    const prevEnd = cursorStart;
    const prevStart = prevEnd - durationFor(prevType);
    zones.unshift({ type: prevType, startMs: prevStart, endMs: prevEnd });
    cursorStart = prevStart;
    cursorType = prevType;
  }

  let cursorEnd = currentStartMs + currentDurationMs;
  cursorType = currentType;
  for (let i = 0; i < MAX_TILES && cursorEnd < windowEndMs; i++) {
    const nextType: ZoneType = cursorType === "FAST" ? "EAT" : "FAST";
    const nextStart = cursorEnd;
    const nextEnd = nextStart + durationFor(nextType);
    zones.push({ type: nextType, startMs: nextStart, endMs: nextEnd });
    cursorEnd = nextEnd;
    cursorType = nextType;
  }

  return zones
    .map((z) => ({
      type: z.type,
      startMs: Math.max(z.startMs, windowStartMs),
      endMs: Math.min(z.endMs, windowEndMs),
    }))
    .filter((z) => z.endMs > z.startMs);
}

const FastingTracker: React.FC<FastingTrackerProps> = ({
  trackingState,
  startTime,
  fastRatio = 18,
  eatRatio = 6,
  onToggle,
  scheduleStartTime,
}) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const fastTargetMs = fastRatio * HOUR_MS;
  const eatTargetMs = eatRatio * HOUR_MS;
  const sessionStartMs = startTime instanceof Date ? startTime.getTime() : Number(startTime);

  const elapsedMs = now - sessionStartMs;
  const isFasting = trackingState === "FASTING";
  const targetMs = isFasting ? fastTargetMs : eatTargetMs;
  const remainingMs = targetMs - elapsedMs;

  const elapsedHrs = Math.floor(Math.abs(elapsedMs) / HOUR_MS);
  const elapsedMins = Math.floor((Math.abs(elapsedMs) % HOUR_MS) / 60000);

  const displayMs = Math.abs(remainingMs);
  const hrs = Math.floor(displayMs / HOUR_MS);
  const mins = Math.floor((displayMs % HOUR_MS) / 60000);
  const secs = Math.floor((displayMs % 60000) / 1000);
  const timeStr = `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  const secsStr = `:${String(secs).padStart(2, "0")}`;

  const eatOpenMs = sessionStartMs + fastTargetMs;
  const eatOpenDate = new Date(eatOpenMs);
  const eatOpenStr = eatOpenDate.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  const nextFastDate = new Date(sessionStartMs + DAY_MS);
  const nextFastLabel = nextFastDate.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  const kicker = `${isFasting ? "Fasting" : "Eating"} for ${elapsedHrs}h ${elapsedMins}m`.toUpperCase();
  const subtitleText = isFasting
    ? `until eating window opens at `
    : `fasting resumes at `;
  const subtitleHighlight = isFasting ? eatOpenStr : nextFastLabel;
  const buttonLabel = isFasting ? "Break fast" : "Start fasting";

  // Today, midnight to midnight — the band always shows a full calendar day.
  const windowStartDate = new Date(now);
  windowStartDate.setHours(0, 0, 0, 0);
  const windowStartMs = windowStartDate.getTime();
  const windowEndMs = windowStartMs + DAY_MS;

  // Never extrapolate a fast/eat history further back than the schedule
  // actually existed — otherwise a user's very first session gets padded
  // with a fabricated eat/fast period that never really happened.
  const scheduleStartMs = scheduleStartTime?.getTime();
  const extrapolationFloorMs =
    scheduleStartMs !== undefined
      ? Math.max(windowStartMs, Math.min(scheduleStartMs, sessionStartMs))
      : windowStartMs;

  const zones = buildDayZones(
    isFasting ? "FAST" : "EAT",
    sessionStartMs,
    targetMs,
    fastTargetMs,
    eatTargetMs,
    extrapolationFloorMs,
    windowEndMs,
  );

  // The stretch of today before the schedule existed (if any) isn't a real
  // fast or eat zone — it's simply before tracking began.
  const noDataEndMs = Math.min(extrapolationFloorMs, windowEndMs);
  const hasNoDataZone = noDataEndMs > windowStartMs;

  // Every point where consecutive real zones meet is a fast<->eat transition.
  const boundaries = zones.slice(0, -1).map((z) => z.endMs);

  const nowPosition = Math.min(Math.max((now - windowStartMs) / DAY_MS, 0), 1);

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

      {/* 24h band — today, split into its actual fasting/eating zones */}
      <View style={styles.bandWrapper}>
        <Text
          style={[
            styles.nowFloatingLabel,
            { left: `${Math.min(Math.max(nowPosition * 100, 6), 94)}%` as any },
          ]}
        >
          now · {formatClockTime(now)}
        </Text>
        <View style={styles.band}>
          {hasNoDataZone && (
            <View
              style={[
                styles.noDataZone,
                { width: `${((noDataEndMs - windowStartMs) / DAY_MS) * 100}%` as any },
              ]}
            />
          )}
          {zones.map((zone, i) => {
            const widthPct = ((zone.endMs - zone.startMs) / DAY_MS) * 100;
            return (
              <View
                key={i}
                style={[
                  zone.type === "FAST" ? styles.fastZone : styles.eatZone,
                  { width: `${widthPct}%` as any },
                ]}
              />
            );
          })}
          <View
            style={[
              styles.progressOverlay,
              { width: `${nowPosition * 100}%` as any },
            ]}
          />
          <View
            style={[
              styles.nowMarker,
              { left: `${Math.min(nowPosition * 100, 99)}%` as any },
            ]}
          />
        </View>
      </View>

      <View style={styles.zoneLabelsRow}>
        {boundaries.map((boundaryMs, i) => (
          <Text
            key={i}
            style={[
              styles.zoneBoundaryLabel,
              { left: `${Math.min(Math.max(((boundaryMs - windowStartMs) / DAY_MS) * 100, 4), 96)}%` as any },
            ]}
          >
            {formatClockTime(boundaryMs)}
          </Text>
        ))}
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
    color: withOpacity(COLORS.text, 0.4),
    marginBottom: 6,
    fontVariant: ["tabular-nums"],
  },
  subtitle: {
    fontSize: 13,
    color: withOpacity(COLORS.text, 0.55),
    marginBottom: 26,
  },
  subtitleHighlight: {
    color: COLORS.text,
  },
  bandWrapper: {
    position: "relative",
    marginTop: 16,
  },
  nowFloatingLabel: {
    position: "absolute",
    top: -16,
    width: 76,
    marginLeft: -38,
    textAlign: "center",
    fontSize: 10,
    color: COLORS.accent300,
    fontVariant: ["tabular-nums"],
  },
  band: {
    height: 34,
    borderRadius: 6,
    overflow: "hidden",
    flexDirection: "row",
    position: "relative",
  },
  fastZone: {
    backgroundColor: COLORS.fastZone,
  },
  eatZone: {
    backgroundColor: COLORS.track,
  },
  noDataZone: {
    backgroundColor: "transparent",
  },
  progressOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: withOpacity(COLORS.primary, 0.25),
  },
  nowMarker: {
    position: "absolute",
    top: -2,
    width: 3,
    height: 50,
    backgroundColor: COLORS.accent300,
    shadowColor: COLORS.accent300,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 3,
  },
  zoneLabelsRow: {
    position: "relative",
    height: 14,
    marginTop: 7,
    marginBottom: 26,
  },
  zoneBoundaryLabel: {
    position: "absolute",
    top: 0,
    width: 50,
    marginLeft: -25,
    textAlign: "center",
    fontSize: 10,
    color: withOpacity(COLORS.text, 0.45),
    fontVariant: ["tabular-nums"],
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
