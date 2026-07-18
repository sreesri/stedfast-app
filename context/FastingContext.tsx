import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getActiveFastingSchedule, setupFastingConfig } from "../utils/http";

export interface FastingDate {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

export interface FastingConfig {
  fastingWindow: number;
  eatingWindow: number;
  fastingStartTime: FastingDate;
}

interface FastingContextData {
  isFastingConfigDone: boolean;
  isFastingConfigLoading: boolean;
  fastingConfig: FastingConfig | null;
  setFastingConfig: (config: FastingConfig) => Promise<void>;
}

const FastingContext = createContext<FastingContextData>(
  {} as FastingContextData,
);

export const FastingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isLoggedIn } = useAuth();
  const [isFastingConfigDone, setIsFastingConfigDone] = useState(false);
  const [isFastingConfigLoading, setIsFastingConfigLoading] = useState(true);
  const [fastingConfig, setFastingConfigState] = useState<FastingConfig | null>(
    null,
  );

  useEffect(() => {
    if (!isLoggedIn) {
      setFastingConfigState(null);
      setIsFastingConfigDone(false);
      setIsFastingConfigLoading(false);
      return;
    }

    const fetchFastingConfig = async () => {
      console.log("fetchFastingConfig: Starting...");
      setIsFastingConfigLoading(true);
      try {
        const response = await getActiveFastingSchedule();
        console.log("fetchFastingConfig: Received response:", response);
        if (response) {
          const mappedConfig: FastingConfig = {
            fastingWindow: response.fastingHours,
            eatingWindow: response.eatingHours,
            fastingStartTime: {
              year: new Date(response.fastingStartTime).getFullYear(),
              month: new Date(response.fastingStartTime).getMonth(),
              day: new Date(response.fastingStartTime).getDate(),
              hour: new Date(response.fastingStartTime).getHours(),
              minute: new Date(response.fastingStartTime).getMinutes(),
            },
          };
          setFastingConfigState(mappedConfig);
          setIsFastingConfigDone(true);
          console.log(
            "fetchFastingConfig: Config found, setIsFastingConfigDone(true)",
          );
        } else {
          // This fetch fires once on login and may resolve slowly (cold
          // backend). If the user has already saved a config in the
          // meantime (setFastingConfig set isFastingConfigDone true
          // optimistically), don't let this stale/late response regress it
          // back to false -- that was clobbering onboarding completion and
          // preventing RootNavigator from ever swapping to MainNavigator.
          setIsFastingConfigDone((prev) => {
            console.log(
              `fetchFastingConfig: No config found, keeping isFastingConfigDone as ${prev} (not regressing)`,
            );
            return prev;
          });
        }
      } catch (e) {
        console.log(
          "fetchFastingConfig: No config found or error fetching:",
          e,
        );
        setIsFastingConfigDone((prev) => prev);
      } finally {
        setIsFastingConfigLoading(false);
        console.log("fetchFastingConfig: isFastingConfigLoading set to false");
      }
    };

    fetchFastingConfig();
  }, [isLoggedIn]);

  const setFastingConfig = async (config: FastingConfig) => {
    try {
      await setupFastingConfig(config);
      setFastingConfigState(config);
      setIsFastingConfigDone(true);
      console.log("fasting config set and saved to backend");
    } catch (error) {
      console.error("Failed to save fasting config:", error);
      throw error;
    }
  };

  return (
    <FastingContext.Provider
      value={{
        isFastingConfigDone,
        isFastingConfigLoading,
        fastingConfig,
        setFastingConfig,
      }}
    >
      {children}
    </FastingContext.Provider>
  );
};

export const useFastingContext = () => useContext(FastingContext);
