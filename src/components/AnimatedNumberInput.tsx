"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatingNumberProps {
  value?: number | string;
  label?: string;
  prefix?: string;
  suffix?: string;
  onChange?: (val: number) => void; // <-- added
}

export default function AnimatingNumber({
  value = 0,
  label = "",
  prefix = "",
  suffix = "",
  onChange,
}: AnimatingNumberProps) {
  const [currentValue, setCurrentValue] = useState<string>(value.toString());

  // Keep internal value in sync with prop
  useEffect(() => {
    setCurrentValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setCurrentValue(val);
      onChange && onChange(Number(val));
    }
  };

  const displayValue = currentValue === "" ? "0" : currentValue;
  const animatedString = displayValue + (suffix ?? "");

  return (
    <div className="flex flex-col items-center justify-center">
      {label && (
        <span className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 text-white text-center">
          {label}
        </span>
      )}
      <div className="relative flex items-center justify-center">
        <input
          type="text"
          value={currentValue}
          onChange={handleChange}
          className="absolute inset-0 text-6xl sm:text-8xl md:text-9xl font-extrabold text-center text-transparent caret-white bg-transparent focus:outline-none w-full"
          placeholder="0"
        />
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
                className={`inline-block ${
                  displayValue === "0" && char === "0" ? "opacity-0" : "opacity-100"
                }`}
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
