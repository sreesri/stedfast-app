import React, { createContext, useContext, useEffect, useState } from "react";
import { getBaseConfig, setupBaseConfig } from "../utils/http";
import { useAuth } from "./AuthContext";

export interface Time {
  hour: number;
  minute: number;
}

interface BaseConfig {
  fastingWindow: number;
  eatingWindow: number;
  fastingStartTime: Time;
  calorieLimit: number;
}

interface BaseContextData {
  isBaseConfigDone: boolean;
  isBaseConfigLoading: boolean;
  baseConfig: BaseConfig | null;
  setBaseConfig: (config: BaseConfig) => void;
}

const BaseContext = createContext<BaseContextData>({} as BaseContextData);

export const BaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isLoggedIn } = useAuth();
  const [isBaseConfigDone, setIsBaseConfigDone] = useState(false);
  const [isBaseConfigLoading, setIsBaseConfigLoading] = useState(true);
  const [baseConfig, setBaseConfigState] = useState<BaseConfig | null>(null);

  useEffect(() => {
    // console.log("BaseProvider useEffect: isLoggedIn =", isLoggedIn);

    if (!isLoggedIn) {
      setBaseConfigState(null);
      setIsBaseConfigDone(false);
      setIsBaseConfigLoading(false);
      return;
    }

    const fetchBaseConfig = async () => {
      console.log("fetchBaseConfig: Starting...");
      setIsBaseConfigLoading(true);
      try {
        const response = await getBaseConfig();
        console.log("fetchBaseConfig: Received response:", response);
        if (response && Object.keys(response).length > 0) {
          setBaseConfigState(response);
          setIsBaseConfigDone(true);
          console.log("fetchBaseConfig: Config found, setIsBaseConfigDone(true)");
        } else {
          console.log("fetchBaseConfig: No config found, setIsBaseConfigDone(false)");
          setIsBaseConfigDone(false);
        }
      } catch (e) {
        console.log("fetchBaseConfig: No base config found or error fetching:", e);
        setIsBaseConfigDone(false);
      } finally {
        setIsBaseConfigLoading(false);
        console.log("fetchBaseConfig: isBaseConfigLoading set to false");
      }
    };

    fetchBaseConfig();
  }, [isLoggedIn]);

  const setBaseConfig = (config: BaseConfig) => {
    setupBaseConfig(config);
    setBaseConfigState(config);
    setIsBaseConfigDone(true);
  };

  return (
    <BaseContext.Provider
      value={{
        isBaseConfigDone,
        isBaseConfigLoading,
        baseConfig,
        setBaseConfig,
      }}
    >
      {children}
    </BaseContext.Provider>
  );
};

export const useBaseContext = () => useContext(BaseContext);
