"use client";

import { useState } from "react";

interface AnimatingNumberProps {
  value?: number;        // initial value
  label?: string;        // label to display above the number
}

export default function AnimatingNumber({ value = 0, label = "" }: AnimatingNumberProps) {
  const [currentValue, setCurrentValue] = useState<number | "">(value === 0 ? "" : value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      setCurrentValue("");
    } else {
      setCurrentValue(Number(val));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {label && (
        <span className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 text-gray-700">
          {label}
        </span>
      )}
      <input
        type="number"
        value={currentValue}
        onChange={handleChange}
        className="text-6xl sm:text-8xl md:text-9xl font-extrabold text-center focus:outline-none bg-transparent border-none w-auto"
        placeholder="0"
      />
    </div>
  );
}
