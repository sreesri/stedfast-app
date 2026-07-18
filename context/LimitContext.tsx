import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getLimitConfig, setupLimitConfig } from "../utils/http";

export interface LimitConfig {
  calorieLimit: number;
  proteinLimit: number;
  carbsLimit: number;
  fatLimit: number;
}

interface LimitContextData {
  limitConfig: LimitConfig | null;
  isLimitConfigDone: boolean;
  isLimitConfigLoading: boolean;
  setLimitConfig: (config: LimitConfig) => Promise<void>;
}

const LimitContext = createContext<LimitContextData>({} as LimitContextData);

export const LimitProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isLoggedIn } = useAuth();
  const [isLimitConfigDone, setIsLimitConfigDone] = useState(false);
  const [isLimitConfigLoading, setIsLimitConfigLoading] = useState(true);
  const [limitConfig, setLimitConfigState] = useState<LimitConfig | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setLimitConfigState(null);
      setIsLimitConfigDone(false);
      setIsLimitConfigLoading(false);
      return;
    }

    const fetchLimitConfig = async () => {
      console.log("fetchLimitConfig: Starting...");
      setIsLimitConfigLoading(true);
      try {
        const response = await getLimitConfig();
        console.log("fetchLimitConfig: Received response:", response);
        if (response && Object.keys(response).length > 0) {
          setLimitConfigState(response);
          setIsLimitConfigDone(true);
          console.log(
            "fetchLimitConfig: Config found, setIsLimitConfigDone(true)",
          );
        } else {
          // This fetch fires once on login and may resolve slowly (cold
          // backend). If the user already saved a config in the meantime
          // (setLimitConfig set isLimitConfigDone true optimistically),
          // don't let this stale/late response regress it back to false --
          // that was clobbering onboarding completion and preventing
          // RootNavigator from ever swapping to MainNavigator.
          setIsLimitConfigDone((prev) => {
            console.log(
              `fetchLimitConfig: No config found, keeping isLimitConfigDone as ${prev} (not regressing)`,
            );
            return prev;
          });
        }
      } catch (e) {
        console.log("fetchLimitConfig: No config found or error fetching:", e);
        setIsLimitConfigDone((prev) => prev);
      } finally {
        setIsLimitConfigLoading(false);
        console.log("fetchLimitConfig: isLimitConfigLoading set to false");
      }
    };

    fetchLimitConfig();
  }, [isLoggedIn]);

  const setLimitConfig = async (config: LimitConfig) => {
    try {
      await setupLimitConfig(config);
      setLimitConfigState(config);
      setIsLimitConfigDone(true);
    } catch (error) {
      console.error("Failed to save limit config:", error);
      throw error;
    }
  };

  return (
    <LimitContext.Provider
      value={{
        isLimitConfigDone,
        isLimitConfigLoading,
        limitConfig,
        setLimitConfig,
      }}
    >
      {children}
    </LimitContext.Provider>
  );
};

export const useLimitContext = () => useContext(LimitContext);
