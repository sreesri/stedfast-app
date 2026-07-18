export const COLORS = {
  background: "#161826",
  surface: "#232532",
  text: "#e9e9ed",
  primary: "#9184d9",
  accent300: "#d2cefd",
  accent700: "#5d5294",
  inactive: "#75798c",
  track: "#292b31",
  border: "#3f424d",
  // Muted grays for icons/chevrons, distinct from `inactive`
  navIcon: "#9397ab",
  chevron: "#595d6c",
  // Chart/tracker accents
  chartBarMuted: "#796cbf",
  fastZone: "#2d2a55",
  // Legacy aliases for backward compat
  ascent: "#232532",
  secondary: "#9184d9",
  input: "#232532",
};

/** Derives an rgba() string from a COLORS hex value at the given opacity. */
export const withOpacity = (hex: string, opacity: number) => {
  const value = hex.replace("#", "");
  const r = parseInt(value.substring(0, 2), 16);
  const g = parseInt(value.substring(2, 4), 16);
  const b = parseInt(value.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const SCREEN = {
  homescreen: "Home Screen",
  statsscreen: "Stats",
  meallogs: "Meal Logs",
  foodlibrary: "Food Library",
  foodeditor: "Food Editor",
  login: "Login",
  signup: "Signup",
  fastingConfig: "Fasting Config",
  limitConfig: "Limit Config",
  mealedit: "Meal Edit",
  settings: "Settings",
  workoutlogs: "Workout Logs",
  workoutedit: "Workout Edit",
  exerciselibrary: "Exercise Library",
  exerciseeditor: "Exercise Editor",
};

export const MUSCLE_GROUP_LABELS: Record<string, string> = {
  CHEST: "Chest",
  BACK: "Back",
  LEGS: "Legs",
  SHOULDERS: "Shoulders",
  ARMS: "Arms",
  CORE: "Core",
  GLUTES: "Glutes",
  CARDIO: "Cardio",
  FULL_BODY: "Full Body",
};

export const MUSCLE_GROUPS = Object.keys(MUSCLE_GROUP_LABELS) as Array<
  keyof typeof MUSCLE_GROUP_LABELS
>;
