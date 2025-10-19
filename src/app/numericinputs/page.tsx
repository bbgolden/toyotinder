"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AnimatingNumber from "@/components/AnimatedNumberInput";

export default function Numbers() {
  const router = useRouter();

  const numberInputs = [
    { id: 1, label: "What's your monthly budget?", prefix: "$", suffix: "" },
    { id: 2, label: "What's your maximum term length (years)?", prefix: "", suffix: "" },
    { id: 3, label: "How often do you commute a week?", prefix: "", suffix: "" },
    { id: 4, label: "How far is your one-way commute (miles)?", prefix: "", suffix: "" },
    { id: 5, label: "What is your maximum downpayment?", prefix: "$", suffix: "" },
    { id: 6, label: "What's your credit score?", prefix: "", suffix: "" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const scrolling = useRef(false);

const handleSwipeUp = () => {
  const currentInput = numberInputs[activeIndex];
  const currentValue = responses[currentInput.id] ?? 0;

  if (activeIndex < numberInputs.length - 1) {
    setActiveIndex((prev) => prev + 1);
  } else {
    // Use the latest value from state + current input
    console.log("All answers collected:", {
      ...responses,
      [currentInput.id]: currentValue,
    });
    // TODO: router.push("/results") or API call
  }
};

  const handleSwipeDown = () => {
    if (activeIndex === 0) {
      router.push("/"); // Go back to home
    } else {
      setActiveIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (scrolling.current) return;
      if (Math.abs(e.deltaY) < 30) return;

      scrolling.current = true;
      e.deltaY > 0 ? handleSwipeUp() : handleSwipeDown();
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
      {/* Swipe-down hint */}
      <div className="absolute top-6 text-white text-sm opacity-80 animate-bounce">
        Swipe down to go back ↓
      </div>

      {/* Active input */}
      <div className="flex-1 flex items-center justify-center w-full max-w-md">
        <AnimatingNumber
          key={numberInputs[activeIndex].id}
          label={numberInputs[activeIndex].label}
          prefix={numberInputs[activeIndex].prefix}
          suffix={numberInputs[activeIndex].suffix}
          value={responses[numberInputs[activeIndex].id] ?? 0}
          onChange={(val) =>
            setResponses((prev) => ({
              ...prev,
              [numberInputs[activeIndex].id]: val,
            }))
          }
        />
      </div>

      {/* Swipe-up hint */}
      <div className="absolute bottom-6 text-white text-sm opacity-80 animate-bounce">
        Swipe up to continue ↑
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-16 text-white text-xs opacity-70">
        {activeIndex + 1} / {numberInputs.length}
      </div>
    </div>
  );
}
