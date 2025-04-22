"use client";

import React from "react";
import { useWeather } from "@/context/weather-context";
import { TimeOfDay } from "@/types/time-of-day";
import { CityInput } from "./city-input";
import { motion } from "framer-motion";

const Settings = () => {
  const { theme, setTheme } = useWeather();
  const themes: TimeOfDay[] = ["morning", "afternoon", "evening", "night"];

  // Theme emoji mapping
  const themeEmojis: Record<TimeOfDay, string> = {
    morning: "🌅",
    afternoon: "☀️",
    evening: "🌆",
    night: "🌙",
  };

  return (
    <div className="p-2">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <span className="text-lg">🔍</span>
          Location
        </h3>
        <CityInput />
      </div>

      <div className="mt-8 space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <span className="text-lg">🎨</span>
          Theme
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {themes.map((timeOfDay) => (
            <motion.button
              key={timeOfDay}
              onClick={() => setTheme(timeOfDay)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`group w-full py-3 px-4 rounded-xl text-sm font-medium capitalize transition-all duration-300 ease-out border backdrop-blur-md shadow-sm flex items-center justify-center gap-2
                ${
                  theme === timeOfDay
                    ? "bg-white/30 border-white/50 shadow-md"
                    : "bg-white/5 border-white/20 hover:bg-white/15"
                }`}
            >
              <span className="text-lg group-hover:scale-110 transition-transform">
                {themeEmojis[timeOfDay]}
              </span>
              <span>{timeOfDay}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs opacity-60">
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default Settings;
