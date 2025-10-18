"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type AnimatedNumericInputProps = {
  value?: number;
  onChange?: (v: number) => void;
  placeholder?: string;
  currency?: boolean; // format as currency if true
  locale?: string;
  maxDigits?: number; // optional pad / limit
  className?: string;
};

const formatNumber = (num: number | null, currency = false, locale = "en-US") => {
  if (num === null || Number.isNaN(num)) return "";
  if (currency) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(num);
  }
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(num);
};

export default function AnimatedNumericInput({
  value: controlledValue,
  onChange,
  placeholder = "$0",
  currency = true,
  locale = "en-US",
  maxDigits = 7,
  className = "",
}: AnimatedNumericInputProps) {
  const [internalValue, setInternalValue] = useState<number | null>(
    controlledValue ?? null
  );
  const value = controlledValue ?? internalValue;
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const [focused, setFocused] = useState(false);

  // Keep internal sync when controlled
  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  // helper to set numeric value
  const setValue = (n: number | null) => {
    if (onChange) onChange(n ?? 0);
    if (controlledValue === undefined) setInternalValue(n);
  };

  // handle keyboard input via hidden input
  function handleRawChange(raw: string) {
    // Remove non-digit chars except leading minus
    const digits = raw.replace(/[^\d-]/g, "");
    if (digits === "" || digits === "-" || digits === undefined) {
      setValue(null);
      return;
    }
    const parsed = parseInt(digits, 10);
    if (Number.isNaN(parsed)) {
      setValue(null);
    } else {
      // clamp by maxDigits
      const maxAllowed = 10 ** maxDigits - 1;
      setValue(Math.min(parsed, maxAllowed));
    }
  }

  // utility: split formatted string into visible "tokens" — digits and separators
  function tokensForDisplay(formatted: string) {
    // Keep separators (commas, currency symbol) as separate tokens so they animate too
    return Array.from(formatted).map((char, i) => ({ char, key: `${char}-${i}` }));
  }

  const display = value === null ? "" : formatNumber(value, currency, locale);
  const tokens = display ? tokensForDisplay(display) : [];

  // focus proxy: clicking the display focuses the hidden input
  const focusInput = () => {
    hiddenInputRef.current?.focus();
  };

  // increment/decrement helpers (for quick demo buttons)
  const inc = (step = 100) => {
    setValue((value ?? 0) + step);
  };
  const dec = (step = 100) => {
    setValue(Math.max(0, (value ?? 0) - step));
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div
        onClick={focusInput}
        className={`relative rounded-xl border ${
          focused ? "border-gray-900" : "border-gray-300"
        } bg-white shadow-sm px-4 py-3 cursor-text select-none`}
      >
        {/* Hidden input for keyboard / mobile input */}
        <input
          aria-label="Amount"
          ref={hiddenInputRef}
          inputMode="numeric"
          pattern="[0-9]*"
          className="absolute inset-0 opacity-0 pointer-events-none"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => handleRawChange(e.target.value)}
          onKeyDown={(e) => {
            // allow arrow up/down for small adjustments
            if (e.key === "ArrowUp") {
              inc(100);
              e.preventDefault();
            } else if (e.key === "ArrowDown") {
              dec(100);
              e.preventDefault();
            } else if (e.key === "Enter") {
              hiddenInputRef.current?.blur();
            }
          }}
          // keep value in the hidden input in sync with numeric state
          value={value === null ? "" : String(value)}
        />

        <div className="flex items-baseline gap-2">
          <div className="flex-1">
            {display ? (
              // Animated digit tokens
              <div className="flex items-end text-3xl md:text-4xl font-semibold">
                <AnimatePresence initial={false}>
                  {tokens.map((t) => (
                    <motion.span
                      key={t.key}
                      initial={{ y: 6, opacity: 0, scale: 0.95 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      exit={{ y: -6, opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 600, damping: 30 }}
                      className={`inline-block`}
                      aria-hidden
                    >
                      {t.char}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-3xl md:text-4xl text-gray-400 font-semibold">{placeholder}</div>
            )}
            <div className="text-xs text-gray-500 mt-1">Tap to type or use arrows to nudge</div>
          </div>

          {/* Small plus/minus quick controls (optional) */}
          <div className="flex flex-col gap-2 ml-4">
            <button
              type="button"
              onClick={() => inc(100)}
              className="rounded-md bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
            >
              +100
            </button>
            <button
              type="button"
              onClick={() => dec(100)}
              className="rounded-md bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
            >
              -100
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
