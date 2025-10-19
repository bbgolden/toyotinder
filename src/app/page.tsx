"use client";

import Image from "next/image";
import toyotaLogo from "../../public/toyota-logo.png"; // Make sure you have the logo in the public folder
import DesktopMessage from "@/components/DesktopMessage";
import { useRouter } from "next/navigation";
import AnimatedNumberInput from "../components/AnimatedNumberInput";

export default function Home() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/number-input"); // navigate to first number input page
  };

  const handleLogoClick = () => {
    router.push("/test"); // navigate to /test when clicking logo or title
  };

  return (
    <>
      <div className="w-screen h-screen flex flex-col justify-center items-center bg-red-600 sm:hidden">
        <button
          onClick={handleLogoClick}
          className="flex flex-col items-center focus:outline-none"
        >
          <Image
            src={toyotaLogo}
            alt="Toyota Logo"
            width={100}
            height={100}
            className="mb-6"
          />
          <h1 className="text-white text-3xl font-bold">ToyoTinder</h1>
        </button>
      </div>

      <div className="hidden sm:flex justify-center items-center h-screen">
        <DesktopMessage />
      </div>

      <button
        onClick={handleStart}
        className="bg-white text-red-600 font-bold px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition"
      >
        Get Started
      </button>
    </>
  );
}
