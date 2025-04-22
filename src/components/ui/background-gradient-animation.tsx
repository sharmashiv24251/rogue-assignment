"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

const timeBasedColors = {
  afternoon: {
    gradientBackgroundStart: "rgb(255, 223, 186)", // #FFDFBA
    gradientBackgroundEnd: "rgb(186, 225, 255)", // #B9E1FF
    firstColor: "255,183,77", // warm sun (#FFB74D)
    secondColor: "255,229,172", // soft apricot (#FFE5AC)
    thirdColor: "197,225,165", // mint (#C5E1A5)
    fourthColor: "244,196,48", // golden hour (#F4C430)
    fifthColor: "255,255,204", // pale lemon (#FFFFCC)
    pointerColor: "255,183,77", // match firstColor
  },
  morning: {
    gradientBackgroundStart: "rgb(135, 206, 235)", // Sky blue
    gradientBackgroundEnd: "rgb(255, 255, 224)", // Light yellow
    firstColor: "100, 180, 255", // Light blue
    secondColor: "180, 220, 255", // Lighter blue
    thirdColor: "255, 255, 200", // Soft yellow
    fourthColor: "150, 200, 255", // Medium blue
    fifthColor: "200, 230, 255", // Pale blue
    pointerColor: "130, 190, 255", // Bright blue
  },
  evening: {
    gradientBackgroundStart: "rgb(72,61,139)", // #483D8B (DarkSlateBlue)
    gradientBackgroundEnd: "rgb(199,21,133)", // #C71585 (MediumVioletRed)
    firstColor: "199,21,133", // fuchsia (#C71585)
    secondColor: "72,61,139", // indigo (#483D8B)
    thirdColor: "255,140,0", // orange (#FF8C00)
    fourthColor: "255,69,0", // orangered (#FF4500)
    fifthColor: "255,20,147", // hotpink (#FF1493)
    pointerColor: "255,105,180", // pink (#FF69B4)
  },
  night: {
    gradientBackgroundStart: "rgb(25, 25, 112)", // Dark blue
    gradientBackgroundEnd: "rgb(0, 0, 30)", // Very dark blue
    firstColor: "50, 50, 200", // Deep blue
    secondColor: "100, 100, 255", // Bright blue
    thirdColor: "50, 150, 255", // Sky blue
    fourthColor: "0, 0, 100", // Navy
    fifthColor: "70, 70, 180", // Medium blue
    pointerColor: "100, 150, 255", // Light blue
  },
};

export const BackgroundGradientAnimation = ({
  time = "morning",
  size = "80%",
  blendingValue = "hard-light",
  children,
  className,
  interactive = true,
  containerClassName,
}: {
  time?: TimeOfDay;
  size?: string;
  blendingValue?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
  containerClassName?: string;
}) => {
  const colors = timeBasedColors[time];
  const interactiveRef = useRef<HTMLDivElement>(null);

  const [curX, setCurX] = useState(0);
  const [curY, setCurY] = useState(0);
  const [tgX, setTgX] = useState(0);
  const [tgY, setTgY] = useState(0);

  useEffect(() => {
    document.body.style.setProperty(
      "--gradient-background-start",
      colors.gradientBackgroundStart
    );
    document.body.style.setProperty(
      "--gradient-background-end",
      colors.gradientBackgroundEnd
    );
    document.body.style.setProperty("--first-color", colors.firstColor);
    document.body.style.setProperty("--second-color", colors.secondColor);
    document.body.style.setProperty("--third-color", colors.thirdColor);
    document.body.style.setProperty("--fourth-color", colors.fourthColor);
    document.body.style.setProperty("--fifth-color", colors.fifthColor);
    document.body.style.setProperty("--pointer-color", colors.pointerColor);
    document.body.style.setProperty("--size", size);
    document.body.style.setProperty("--blending-value", blendingValue);
  }, [colors, size, blendingValue]);

  useEffect(() => {
    function move() {
      if (!interactiveRef.current) {
        return;
      }
      setCurX(curX + (tgX - curX) / 20);
      setCurY(curY + (tgY - curY) / 20);
      interactiveRef.current.style.transform = `translate(${Math.round(
        curX
      )}px, ${Math.round(curY)}px)`;
    }

    move();
  }, [tgX, tgY]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (interactiveRef.current) {
      const rect = interactiveRef.current.getBoundingClientRect();
      setTgX(event.clientX - rect.left);
      setTgY(event.clientY - rect.top);
    }
  };

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  }, []);

  return (
    <div
      className={cn(
        "h-screen w-screen relative overflow-hidden top-0 left-0 bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]",
        containerClassName
      )}
    >
      <svg className="hidden">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div className={cn("", className)}>{children}</div>
      <div
        className={cn(
          "gradients-container h-full w-full blur-lg",
          isSafari ? "blur-2xl" : "[filter:url(#blurMe)_blur(40px)]"
        )}
      >
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_var(--first-color)_0,_var(--first-color)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
            `[transform-origin:center_center]`,
            `animate-first`,
            `opacity-100`
          )}
        ></div>
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--second-color),_0.8)_0,_rgba(var(--second-color),_0)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
            `[transform-origin:calc(50%-400px)]`,
            `animate-second`,
            `opacity-100`
          )}
        ></div>
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--third-color),_0.8)_0,_rgba(var(--third-color),_0)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
            `[transform-origin:calc(50%+400px)]`,
            `animate-third`,
            `opacity-100`
          )}
        ></div>
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--fourth-color),_0.8)_0,_rgba(var(--fourth-color),_0)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
            `[transform-origin:calc(50%-200px)]`,
            `animate-fourth`,
            `opacity-70`
          )}
        ></div>
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--fifth-color),_0.8)_0,_rgba(var(--fifth-color),_0)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
            `[transform-origin:calc(50%-800px)_calc(50%+800px)]`,
            `animate-fifth`,
            `opacity-100`
          )}
        ></div>

        {interactive && (
          <div
            ref={interactiveRef}
            onMouseMove={handleMouseMove}
            className={cn(
              `absolute [background:radial-gradient(circle_at_center,_rgba(var(--pointer-color),_0.8)_0,_rgba(var(--pointer-color),_0)_50%)_no-repeat]`,
              `[mix-blend-mode:var(--blending-value)] w-full h-full -top-1/2 -left-1/2`,
              `opacity-70`
            )}
          ></div>
        )}
      </div>
    </div>
  );
};
