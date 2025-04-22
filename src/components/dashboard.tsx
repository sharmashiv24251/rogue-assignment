"use client";

import React from "react";
import { useWeather } from "@/context/weather-context";
import { GlassmorphicContainer } from "@/components/glassmorphic-container";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import Settings from "@/components/settings";
import { useWeatherQuery } from "@/hooks/use-weather-query";
import ActivityContainer from "@/components/activity-container";
import { useIsMobile } from "@/hooks/use-mobile";

const WeatherInfo = () => {
  const { city, setTheme } = useWeather();
  const { data, isLoading, error } = useWeatherQuery(city);

  React.useEffect(() => {
    if (data) {
      const localTime = new Date((data.dt + data.timezone) * 1000);
      const hour = localTime.getUTCHours();

      if (hour >= 5 && hour < 12) setTheme("morning");
      else if (hour >= 12 && hour < 17) setTheme("afternoon");
      else if (hour >= 17 && hour < 20) setTheme("evening");
      else setTheme("night");
    }
  }, [data, setTheme]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-lg">Loading weather data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-2">
        <div className="text-xl font-medium text-red-400">
          Unable to fetch weather data
        </div>
        <div className="text-sm opacity-70">
          {error instanceof Error && error.message === "City is required"
            ? "Please enter a city name to get started"
            : "Please check the city name and try again"}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const weatherEmoji: any = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Snow: "❄️",
    Thunderstorm: "⚡",
    Drizzle: "🌦️",
    Mist: "🌫️",
    Fog: "🌫️",
    Smoke: "💨",
    Haze: "🌫️",
    Dust: "🌪️",
    Sand: "🌪️",
    Ash: "🌋",
    Squall: "🌪️",
    Tornado: "🌪️",
  };

  const currentWeather = data.weather[0].main;
  const emoji: string = weatherEmoji[currentWeather] || "🌈";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{data.name}</h2>
        <div className="text-4xl">
          {Math.round(data.main.temp)}°C {emoji}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm opacity-70">Feels Like</p>
          <p className="text-lg">{Math.round(data.main.feels_like)}°C</p>
        </div>
        <div>
          <p className="text-sm opacity-70">Humidity</p>
          <p className="text-lg">{data.main.humidity}%</p>
        </div>
        <div>
          <p className="text-sm opacity-70">Wind Speed</p>
          <p className="text-lg">{data.wind.speed} m/s</p>
        </div>
        <div>
          <p className="text-sm opacity-70">Weather</p>
          <p className="text-lg capitalize">{data.weather[0].description}</p>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { theme } = useWeather();
  const isMobile = useIsMobile();
  return (
    <BackgroundGradientAnimation
      time={theme}
      className="flex z-40 inset-0 absolute p-5 gap-5 lg:p-10 max-sm:flex-col overflow-scroll"
    >
      {isMobile && (
        <GlassmorphicContainer time={theme}>
          <Settings />
        </GlassmorphicContainer>
      )}
      <GlassmorphicContainer
        className="md:w-2/3 sm:w-1/2 max-sm:h-1/2"
        time={theme}
      >
        <WeatherInfo />
      </GlassmorphicContainer>
      <div className="flex flex-col gap-5 md:w-1/3 sm:w-1/2 max-sm:h-1/2">
        <GlassmorphicContainer time={theme}>
          <ActivityContainer />
        </GlassmorphicContainer>
        {!isMobile && (
          <GlassmorphicContainer time={theme}>
            <Settings />
          </GlassmorphicContainer>
        )}
      </div>
    </BackgroundGradientAnimation>
  );
};

export default Dashboard;
