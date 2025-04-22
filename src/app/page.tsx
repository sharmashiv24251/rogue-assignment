"use client";

import { CityInputContainer } from "@/components/city-input";
import Dashboard from "@/components/dashboard";
import { useState } from "react";

export default function Home() {
  const [city, setCity] = useState("");

  return (
    <main className="relative min-h-screen">
      {!city && <CityInputContainer />}
      {city && <Dashboard />}
    </main>
  );
}
