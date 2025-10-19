"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatingNumberProps {
  value?: number | string;
  label?: string;
  prefix?: string; // optional text before the number
  suffix?: string; // optional text after the number
}

export default function AnimatingNumber({
  value = 0,
  label = "",
  prefix = "",
  suffix = "",
}: AnimatingNumberProps) {
  const [currentValue, setCurrentValue] = useState<string>(value.toString());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(e.target.value);
  };

  const displayValue = currentValue === "" ? "0" : currentValue;

  // Combine value + suffix, preserve spaces using non-breaking space
  const animatedString = displayValue + (suffix ? "\u00A0" + suffix : "");

  return (
    <div className="flex flex-col items-center justify-center">
      {label && (
        <span className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 text-white text-center">
          {label}
        </span>
      )}

      <div className="relative flex items-center justify-center">
        {/* Invisible input for typing */}
        <input
          type="text"
          value={currentValue}
          onChange={handleChange}
          className="absolute inset-0 text-6xl sm:text-8xl md:text-9xl font-extrabold text-center opacity-0 focus:outline-none bg-transparent border-none w-full"
          placeholder="0"
        />

        {/* Animated number display with prefix + suffix */}
        <div className="text-6xl sm:text-8xl md:text-9xl font-extrabold text-center flex items-center text-white">
          {prefix && <span className="mr-2">{prefix}</span>}

          <AnimatePresence mode="popLayout">
            {animatedString.split("").map((char, index) => (
              <motion.span
                key={`${char}-${index}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
