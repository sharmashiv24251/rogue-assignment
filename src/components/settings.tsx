"use client";

import React from "react";
import { useWeather } from "@/context/weather-context";
import { TimeOfDay } from "@/types/time-of-day";
import { CityInput } from "./city-input";

const Settings = () => {
  const { theme, setTheme } = useWeather();
  const themes: TimeOfDay[] = ["morning", "afternoon", "evening", "night"];

  return (
    <>
      <div className="space-y-3">
        <CityInput />
      </div>

      <div className="mt-6 space-y-3">
        <h3 className="text-xl font-semibold /90">Theme</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {themes.map((timeOfDay) => (
            <button
              key={timeOfDay}
              onClick={() => setTheme(timeOfDay)}
              className={`w-full py-2 rounded-xl text-sm font-medium capitalize transition-all duration-300 ease-out border backdrop-blur-md shadow-sm
                ${
                  theme === timeOfDay
                    ? "bg-white/50 border-white/40 "
                    : "bg-white/5 border-white/20 /70 hover:bg-white/10 "
                }`}
            >
              {timeOfDay}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Settings;
