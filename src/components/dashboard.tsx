"use client";

import React from "react";
import { useWeather } from "@/context/weather-context";
import { GlassmorphicContainer } from "@/components/glassmorphic-container";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import Settings from "@/components/settings";
import { useWeatherQuery } from "@/hooks/use-weather-query";
import ActivityContainer from "@/components/activity-container";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";
import { Settings2 } from "lucide-react";
// --- Helper Functions ---

// Format UNIX timestamp + timezone offset to local time string (HH:MM AM/PM)
const formatTime = (timestamp: number, timezoneOffset: number): string => {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  return date.toLocaleTimeString("en-US", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Convert wind degrees to cardinal direction
const getWindDirection = (degrees: number): string => {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

// --- WeatherInfo Component ---

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
        <div className="animate-pulse text-lg font-medium">
          Loading weather data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-3 text-center p-6">
        <div className="text-2xl font-medium text-red-400">
          Unable to fetch weather data
        </div>
        <div className="text-sm opacity-70 max-w-md">
          {error instanceof Error && error.message === "City is required"
            ? "Please enter a city name to get started."
            : "Please check the city name and try again."}
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Define Weather Emojis
  const weatherEmoji: {
    [key: string]: string | { day: string; night: string };
  } = {
    Clear: { day: "☀️", night: "🌙" },
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
  const hour = new Date((data.dt + data.timezone) * 1000).getUTCHours();
  const isNight = hour < 5 || hour >= 20;

  const emoji: string =
    typeof weatherEmoji[currentWeather] === "object"
      ? (weatherEmoji[currentWeather] as { day: string; night: string })[
          isNight ? "night" : "day"
        ]
      : (weatherEmoji[currentWeather] as string) || "🌈";

  // Format data points
  const sunriseTime = formatTime(data.sys.sunrise, data.timezone);
  const sunsetTime = formatTime(data.sys.sunset, data.timezone);
  const windDirection = getWindDirection(data.wind.deg);
  const visibilityKm = (data.visibility / 1000).toFixed(1);
  const currentTime = formatTime(data.dt, data.timezone);

  // Reusable Tile Component
  const InfoTile = ({
    label,
    value,
    unit,
    icon,
    className = "",
  }: {
    label: string;
    value: string | number;
    unit?: string;
    icon?: string;
    className?: string;
  }) => (
    <div
      className={`bg-black/10 backdrop-blur-sm p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
    >
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs sm:text-sm opacity-70">{label}</p>
        {icon && <span className="text-sm opacity-70">{icon}</span>}
      </div>
      <p className="text-base sm:text-lg font-medium">
        {value}
        {unit && <span className="text-xs sm:text-sm opacity-80"> {unit}</span>}
      </p>
    </div>
  );

  return (
    <div className="flex flex-col h-full space-y-6 p-4 overflow-y-auto relative">
      {/* Location and Current Time */}
      <div className="flex flex-col items-center space-y-1">
        <div className="flex items-center space-x-2">
          <h2 className="text-3xl font-bold">{data.name}</h2>
          <span className="text-sm bg-black/20 px-2 py-1 rounded-full">
            {data.sys.country}
          </span>
        </div>
        <p className="text-sm opacity-70">
          {currentTime} •{" "}
          {new Date((data.dt + data.timezone) * 1000).toLocaleDateString(
            "en-US",
            {
              timeZone: "UTC",
              weekday: "long",
              month: "short",
              day: "numeric",
            }
          )}
        </p>
      </div>

      {/* Main Weather Display */}
      <div className="flex flex-col items-center justify-center space-y-3 my-6">
        <div className="text-8xl sm:text-9xl mb-2">{emoji}</div>
        <div className="text-5xl sm:text-6xl font-light">
          {Math.round(data.main.temp)}°C
        </div>
        <div className="text-lg capitalize font-medium">
          {data.weather[0].description}
        </div>
        <div className="flex items-center space-x-4 text-sm opacity-80">
          <span>Feels like {Math.round(data.main.feels_like)}°C</span>
          <span>•</span>
          <span>
            {Math.round(data.main.temp_min)}° / {Math.round(data.main.temp_max)}
            °
          </span>
        </div>
      </div>

      {/* Detailed Info Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <InfoTile
          label="Wind"
          value={`${data.wind.speed.toFixed(1)} ${windDirection}`}
          unit="m/s"
          icon="💨"
        />
        <InfoTile
          label="Humidity"
          value={data.main.humidity}
          unit="%"
          icon="💧"
        />
        <InfoTile
          label="Pressure"
          value={data.main.pressure}
          unit="hPa"
          icon="📊"
        />
        <InfoTile label="Visibility" value={visibilityKm} unit="km" icon="👁️" />
        <InfoTile
          label="Cloudiness"
          value={data.clouds.all}
          unit="%"
          icon="☁️"
        />
        {data.wind.gust && (
          <InfoTile
            label="Wind Gust"
            value={data.wind.gust.toFixed(1)}
            unit="m/s"
            icon="🌬️"
          />
        )}
      </div>

      {/* Sunrise/Sunset Section */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-2">
        <InfoTile
          label="Sunrise"
          value={sunriseTime}
          icon="🌅"
          className="bg-gradient-to-r from-amber-500/20 to-yellow-400/20"
        />
        <InfoTile
          label="Sunset"
          value={sunsetTime}
          icon="🌇"
          className="bg-gradient-to-r from-orange-500/20 to-pink-500/20"
        />
      </div>

      {/* Coordinates */}
      <div className="text-center text-xs opacity-60 mt-2">
        Coordinates: {data.coord.lat.toFixed(2)}°N, {data.coord.lon.toFixed(2)}
        °E
      </div>
      <div className="absolute top-0 right-0">
        <Dialog>
          <DialogTrigger>
            <span className="text-4xl cursor-pointer">
              <Settings2 />
            </span>
          </DialogTrigger>
          <DialogContent className="bg-transparent p-0">
            <GlassmorphicContainer time={"night"}>
              <Settings />
            </GlassmorphicContainer>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

// --- Dashboard Component ---

const Dashboard = () => {
  const { theme } = useWeather();

  return (
    <BackgroundGradientAnimation
      time={theme}
      className="flex z-40 inset-0 absolute p-5 gap-5 lg:p-10 max-sm:flex-col overflow-y-auto"
    >
      <GlassmorphicContainer
        className="md:w-2/3 sm:min-h-[500px]  flex flex-col"
        time={theme}
      >
        <WeatherInfo />
      </GlassmorphicContainer>
      <div className="flex flex-col gap-5 md:w-1/3 sm:w-1/2 ">
        <GlassmorphicContainer
          time={theme}
          className="sm:h-screen overflow-y-scroll"
        >
          <ActivityContainer />
        </GlassmorphicContainer>
      </div>
    </BackgroundGradientAnimation>
  );
};

export default Dashboard;
