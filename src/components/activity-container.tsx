"use client";

import React from "react";
import { useWeather } from "@/context/weather-context";
import { useWeatherQuery } from "@/hooks/use-weather-query";
import { motion } from "framer-motion";

type Activity = {
  title: string;
  description: string;
  emoji: string;
};

type ActivityResponse = {
  activities: Activity[];
};

const ActivityContainer = () => {
  const { city, theme } = useWeather();
  const { data: weatherData } = useWeatherQuery(city);
  const [activities, setActivities] = React.useState<Activity[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchActivities = async () => {
      if (!weatherData) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/activities", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            weather: weatherData.weather[0].main,
            temperature: weatherData.main.temp,
            city: weatherData.name,
            time: new Date().toLocaleTimeString(),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch activities");
        }

        const data: ActivityResponse = await response.json();
        setActivities(data.activities);
      } catch (err) {
        setError("Unable to load activity suggestions");
        console.error("Error fetching activities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [weatherData]);

  // Skeleton loader with animation
  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span className="text-lg">🎯</span>
          Suggested Activities
        </h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-white/10 backdrop-blur-sm animate-pulse"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 rounded-full bg-white/30"></div>
                <div className="h-5 w-1/2 rounded bg-white/30"></div>
              </div>
              <div className="h-4 w-3/4 rounded bg-white/20 mb-1"></div>
              <div className="h-4 w-1/2 rounded bg-white/20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="text-xl mb-2">😕</div>
        <div className="text-red-400 text-center font-medium">{error}</div>
        <button
          className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
          onClick={() => setLoading(true)}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!activities.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="text-2xl mb-3">🔍</div>
        <p className="text-center opacity-70">
          Enter a city to see activity suggestions
        </p>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-4 h-full overflow-y-auto">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <span className="text-lg">🎯</span>
        AI Suggested Activities
      </h2>

      <motion.div
        className="space-y-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            variants={item}
            className={`p-4 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/10 shadow-sm`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{activity.emoji}</span>
              <h3 className="font-medium text-base">{activity.title}</h3>
            </div>
            <p className="mt-2 text-sm opacity-80">{activity.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="pt-2 text-xs opacity-60 text-center">
        Based on current weather conditions in {city || "your location"}
      </div>
    </div>
  );
};

export default ActivityContainer;
