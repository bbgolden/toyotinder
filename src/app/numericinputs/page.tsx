"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AnimatingNumber from "@/components/AnimatedNumberInput";

export default function Numbers() {
  const router = useRouter();

  const numberInputs = [
    { id: 1, label: "What's your monthly budget?", prefix: "$", value: 0 },
    { id: 2, label: "What's your maximum term length?", prefix: "", value: 0, suffix:" years"},
    { id: 3, label: "How often do you commute a week?", prefix: "", value: 0, suffix: " months" },
    { id: 4, label: "How how far is your one-way commute?", prefix: "", value: 0, suffix:" miles" },
    { id: 5, label: "What is your maximum downpayment?", prefix: "$", value: 0 },
    { id: 6, label: "What's your credit score?", prefix: "", value: 0 },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const scrolling = useRef(false);

  const handleSwipeUp = () => {
    setActiveIndex((prev) => Math.min(prev + 1, numberInputs.length - 1));
  };

  const handleSwipeDown = () => {
    if (activeIndex === 0) {
      router.push("/"); // Go back to home on first input
    } else {
      setActiveIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (scrolling.current) return;
      if (Math.abs(e.deltaY) < 30) return; // ignore momentum

      scrolling.current = true;
      if (e.deltaY > 0) handleSwipeUp();
      else handleSwipeDown();

      setTimeout(() => (scrolling.current = false), 500);
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      if (scrolling.current) return;

      scrolling.current = true;
      if (touchStartY - touchEndY > 50) handleSwipeUp();
      else if (touchEndY - touchStartY > 50) handleSwipeDown();

      setTimeout(() => (scrolling.current = false), 500);
    };

    window.addEventListener("wheel", handleWheel);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [activeIndex, router]);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-red-600 relative px-4">

      {/* Swipe-down hint at top */}
      <div className="absolute top-6 text-white text-sm opacity-80 animate-bounce">
        Swipe down to go back ↓
      </div>

      {/* Active AnimatingNumber */}
      <div className="flex-1 flex items-center justify-center w-full max-w-md">
        <AnimatingNumber
          key={numberInputs[activeIndex].id} // ensures animation triggers on change
          label={numberInputs[activeIndex].label}
          prefix={numberInputs[activeIndex].prefix}
          value={numberInputs[activeIndex].value}
          suffix={numberInputs[activeIndex].suffix} // <-- add this
        />

      </div>

      {/* Swipe-up hint at bottom */}
      <div className="absolute bottom-6 text-white text-sm opacity-80 animate-bounce">
        Swipe up to continue ↑
      </div>

      {/* Optional: Input position indicator */}
      <div className="absolute bottom-16 text-white text-xs opacity-70">
        {activeIndex + 1} / {numberInputs.length}
      </div>
    </div>
  );
}
