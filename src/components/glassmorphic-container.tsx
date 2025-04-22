"use client";

import { TimeOfDay } from "@/types/time-of-day";
import { ReactNode } from "react";

interface GlassmorphicContainerProps {
  children: ReactNode;
  className?: string;
  title?: string;
  time?: TimeOfDay;
}

export const GlassmorphicContainer = ({
  children,
  className = "",
  title,
  time,
}: GlassmorphicContainerProps) => {
  /*  */
  const isDark = time === "night" || time === "evening";
  return (
    <div
      className={`rounded-2xl backdrop-blur-md 
        ${
          isDark
            ? "bg-white/20 border-white/30 text-white shadow-lg shadow-white/5"
            : "bg-black/10 border-black/20  text-black shadow-lg shadow-black/5"
        } 
        p-6 ${className}`}
    >
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      {children}
    </div>
  );
};
