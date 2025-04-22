"use client";

import React, { useState } from "react";
import { useWeather } from "@/context/weather-context";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { GlassmorphicContainer } from "./glassmorphic-container";

const CityInputContainer = () => {
  return (
    <BackgroundGradientAnimation
      time={"evening"}
      className="flex z-40 inset-0 absolute p-5 gap-5 lg:p-10 max-sm:flex-col overflow-scroll items-center justify-center"
    >
      <GlassmorphicContainer className="w-full max-w-md" time={"evening"}>
        <CityInput />
      </GlassmorphicContainer>
    </BackgroundGradientAnimation>
  );
};

const CityInput = () => {
  const [inputCity, setInputCity] = useState("");
  const { setCity } = useWeather();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCity.trim()) {
      setCity(inputCity.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="city" className="block text-lg font-medium">
          Enter your city
        </label>
        <input
          id="city"
          type="text"
          value={inputCity}
          onChange={(e) => setInputCity(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
          placeholder="Enter city name..."
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-all duration-200 font-medium"
      >
        Get Weather
      </button>
    </form>
  );
};

export { CityInputContainer, CityInput };
