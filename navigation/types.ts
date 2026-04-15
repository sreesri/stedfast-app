import { SCREEN } from "../utils/Constants";

export type RootStackParamList = {
  [SCREEN.homescreen]: undefined;
  [SCREEN.statsscreen]: undefined;
  [SCREEN.meallogs]: undefined;
  [SCREEN.login]: undefined;
  [SCREEN.signup]: undefined;
  [SCREEN.fastingconfig]: undefined;
  [SCREEN.limitConfig]: undefined;
  [SCREEN.mealedit]: {
    mealId?: string;
    isFastingToggle?: boolean;
    trackingState?: string;
    activeScheduleId?: string;
  };
};
