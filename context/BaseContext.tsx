import React, { createContext, useContext, useState } from "react";
import { setupBaseConfig } from "../utils/http";

export interface Time {
  hour: number;
  minute: number;
}

interface BaseConfig {
  fastingWindow: number;
  eatingWindow: number;
  fastingStartTime: Time;
  dailyCalorieLimit: number;
}

interface BaseContextData {
  isBaseConfigDone: boolean;
  baseConfig: BaseConfig | null;
  setBaseConfig: (config: BaseConfig) => void;
}

const BaseContext = createContext<BaseContextData>({} as BaseContextData);

export const BaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isBaseConfigDone, setIsBaseConfigDone] = useState(false);
  const [baseConfig, setBaseConfigState] = useState<BaseConfig | null>(null);

  const setBaseConfig = (config: BaseConfig) => {
    setupBaseConfig(config);
    setBaseConfigState(config);
    setIsBaseConfigDone(true);
  };

  return (
    <BaseContext.Provider
      value={{
        isBaseConfigDone,
        baseConfig,
        setBaseConfig,
      }}
    >
      {children}
    </BaseContext.Provider>
  );
};

export const useBaseContext = () => useContext(BaseContext);
