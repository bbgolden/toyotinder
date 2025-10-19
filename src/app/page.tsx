"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toyotaLogo from "../../public/toyota-logo.png";

export default function Home() {
  const router = useRouter();
  const scrolling = useRef(false);

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (scrolling.current) return;
      if (e.deltaY > 50) {
        scrolling.current = true;
        router.push("/numericinputs");
        setTimeout(() => (scrolling.current = false), 800);
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      if (scrolling.current) return;

      if (touchStartY - touchEndY > 50) {
        scrolling.current = true;
        router.push("/numericinput");
        setTimeout(() => (scrolling.current = false), 800);
      }
    };

    window.addEventListener("wheel", handleScroll, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [router]);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-red-600 overflow-y-auto relative">
      {/* Logo + Title */}
        <Image
          src={toyotaLogo}
          alt="Toyota Logo"
          width={100}
          height={100}
          className="mb-6"
        />
        <h1 className="text-white text-3xl font-bold">ToyoSwipe</h1>

      {/* "Swipe Up" Message */}
      <div className="absolute bottom-8 text-white text-sm opacity-80 animate-bounce">
        Swipe up to continue ↑
      </div>
    </div>
  );
}
