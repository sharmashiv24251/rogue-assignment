"use client";

import React from "react";

import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

const CityInputContainer = () => {
  return (
    <BackgroundGradientAnimation
      time={"night"}
      className="flex z-40 inset-0 absolute p-5 gap-5 lg:p-10 max-sm:flex-col overflow-scroll"
    >
      <CityInput />
    </BackgroundGradientAnimation>
  );
};

const CityInput = () => {
  return (
    <div>
      Please enter your city
      <input type="text" className="rounded-lg p-2" />
    </div>
  );
};

export { CityInputContainer, CityInput };
