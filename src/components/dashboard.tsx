"use client";

import { TimeOfDay } from "@/types/time-of-day";
import { useState } from "react";
import React from "react";
import ActivityContainer from "@/components/activity-container";
import { GlassmorphicContainer } from "@/components/glassmorphic-container";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import WeatherContainer from "@/components/weather-container";

const Dashboard = () => {
  const [time, setTime] = useState<TimeOfDay>("morning");
  return (
    <BackgroundGradientAnimation
      time={time}
      className="flex z-40 inset-0 absolute p-5 gap-5 lg:p-10 max-sm:flex-col overflow-scroll"
    >
      <GlassmorphicContainer
        className="md:w-2/3 sm:w-1/2 max-sm:h-1/3"
        time={time}
      >
        <WeatherContainer />
      </GlassmorphicContainer>

      <GlassmorphicContainer
        className="md:w-1/3 sm:w-1/2 max-sm:h-2/3"
        time={time}
      >
        <ActivityContainer />
      </GlassmorphicContainer>
    </BackgroundGradientAnimation>
  );
};

export default Dashboard;
