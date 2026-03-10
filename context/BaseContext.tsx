import React, { createContext, useContext, useEffect, useState } from "react";
import { getBaseConfig, setupBaseConfig } from "../utils/http";

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
  baseConfig: BaseConfig | null;
  setBaseConfig: (config: BaseConfig) => void;
}

const BaseContext = createContext<BaseContextData>({} as BaseContextData);

export const BaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isBaseConfigDone, setIsBaseConfigDone] = useState(false);
  const [baseConfig, setBaseConfigState] = useState<BaseConfig | null>(null);

  useEffect(() => {
    const fetchBaseConfig = async () => {
      const response = await getBaseConfig();
      console.log(response);
      setBaseConfig(response);
    };
    fetchBaseConfig();
  }, []);

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
