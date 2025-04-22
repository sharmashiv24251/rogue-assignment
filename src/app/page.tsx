"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CityInputContainer } from "@/components/city-input";
import Dashboard from "@/components/dashboard";
import { WeatherProvider, useWeather } from "@/context/weather-context";

const queryClient = new QueryClient();

const WeatherApp = () => {
  const { city } = useWeather();

  return (
    <main className="relative min-h-screen">
      {!city && <CityInputContainer />}
      {city && <Dashboard />}
    </main>
  );
};

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <WeatherProvider>
        <WeatherApp />
      </WeatherProvider>
    </QueryClientProvider>
  );
}
