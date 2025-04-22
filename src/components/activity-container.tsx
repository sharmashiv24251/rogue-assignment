"use client";

import React from "react";
import { useWeather } from "@/context/weather-context";
import { useWeatherQuery } from "@/hooks/use-weather-query";
import { Skeleton } from "./ui/skeleton";

type Activity = {
  title: string;
  description: string;
  emoji: string;
};

type ActivityResponse = {
  activities: Activity[];
};

const ActivityContainer = () => {
  const { city } = useWeather();
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

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="p-3 rounded-lg bg-white/50 backdrop-blur-sm"
          >
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-10 w-3/4 " />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 text-center py-4">{error}</div>;
  }

  if (!activities.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Suggested Activities</h2>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="p-3 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{activity.emoji}</span>
              <h3 className="font-medium">{activity.title}</h3>
            </div>
            <p className="mt-1 text-sm opacity-80">{activity.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityContainer;
