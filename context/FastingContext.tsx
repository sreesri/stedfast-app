import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getFastingConfig, setupFastingConfig } from "../utils/http";

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
        const response = await getFastingConfig();
        console.log("fetchFastingConfig: Received response:", response);
        if (response && Object.keys(response).length > 0) {
          setFastingConfigState(response);
          setIsFastingConfigDone(true);
          console.log(
            "fetchFastingConfig: Config found, setIsFastingConfigDone(true)",
          );
        } else {
          console.log(
            "fetchFastingConfig: No config found, setIsFastingConfigDone(false)",
          );
          setIsFastingConfigDone(false);
        }
      } catch (e) {
        console.log(
          "fetchFastingConfig: No config found or error fetching:",
          e,
        );
        setIsFastingConfigDone(false);
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
