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
  const [responses, setResponses] = useState<Record<number, number>>({
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0,
  });

  const scrolling = useRef(false);
  const SCROLL_DELAY = 500;

  const handleSwipeUp = (latestValue?: number) => {
    const currentId = numberInputs[activeIndex].id;
    const nextIndex = Math.min(activeIndex + 1, numberInputs.length - 1);

    setResponses((prev) => ({
      ...prev,
      [currentId]: latestValue ?? prev[currentId],
    }));

    setActiveIndex(nextIndex);

    if (activeIndex === numberInputs.length - 1) {
      console.log("All answers collected:", {
        ...responses,
        [currentId]: latestValue ?? responses[currentId],
      });
    }
  };

  const handleSwipeDown = () => {
    if (activeIndex === 0) {
      router.push("/");
    } else {
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  useEffect(() => {
    let touchStartY = 0;

    const handleWheel = (e: WheelEvent) => {
      if (scrolling.current) return;
      if (Math.abs(e.deltaY) < 30) return;
      scrolling.current = true;

      if (e.deltaY > 0) {
        handleSwipeUp(responses[numberInputs[activeIndex]?.id]);
      } else {
        handleSwipeDown();
      }

      setTimeout(() => (scrolling.current = false), SCROLL_DELAY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (scrolling.current) return;
      const touchEndY = e.changedTouches[0].clientY;
      const delta = touchStartY - touchEndY;
      if (Math.abs(delta) < 50) return;

      scrolling.current = true;
      if (delta > 0) {
        handleSwipeUp(responses[numberInputs[activeIndex]?.id]);
      } else {
        handleSwipeDown();
      }

      setTimeout(() => (scrolling.current = false), SCROLL_DELAY);
    };

    window.addEventListener("wheel", handleWheel);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [activeIndex, responses]);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-red-600 relative px-4">
      <div className="absolute top-6 text-white text-sm opacity-80 animate-bounce">
        Swipe down to go back ↓
      </div>

      <div className="flex-1 flex items-center justify-center w-full max-w-md">
        {numberInputs[activeIndex] && (
          <AnimatingNumber
            key={numberInputs[activeIndex].id}
            label={numberInputs[activeIndex].label}
            prefix={numberInputs[activeIndex].prefix}
            suffix={numberInputs[activeIndex].suffix}
            value={responses[numberInputs[activeIndex].id]}
            onChange={(val) =>
              setResponses((prev) => ({
                ...prev,
                [numberInputs[activeIndex].id]: val,
              }))
            }
          />
        )}
      </div>

      <div className="absolute bottom-6 text-white text-sm opacity-80 animate-bounce">
        Swipe up to continue ↑
      </div>

      <div className="absolute bottom-16 text-white text-xs opacity-70">
        {activeIndex + 1} / {numberInputs.length}
      </div>
    </div>
  );
}
