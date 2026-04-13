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
          console.log(
            "fetchLimitConfig: No config found, setIsLimitConfigDone(false)",
          );
          setIsLimitConfigDone(false);
        }
      } catch (e) {
        console.log("fetchLimitConfig: No config found or error fetching:", e);
        setIsLimitConfigDone(false);
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
