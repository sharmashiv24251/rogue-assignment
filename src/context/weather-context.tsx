"use client";

import { TimeOfDay } from "@/types/time-of-day";
import { createContext, useContext, useState, ReactNode } from "react";

type WeatherContextType = {
  city: string;
  setCity: (city: string) => void;
  theme: TimeOfDay;
  setTheme: (theme: TimeOfDay) => void;
};

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState("");
  const [theme, setTheme] = useState<TimeOfDay>("morning");

  return (
    <WeatherContext.Provider value={{ city, setCity, theme, setTheme }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
}
