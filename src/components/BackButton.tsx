"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

interface BackButtonProps {
  to: string;
}

const BackButton: React.FC<BackButtonProps> = ({ to }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(to);
  };

  return (
    <button
      onClick={handleClick}
      className="absolute top-4 left-4 p-1 hover:opacity-80 transition"
      style={{ background: "transparent", border: "none" }}
    >
      {/* Use PNG */}
      <Image src="/restart.png" alt="Back" width={24} height={24} />

      {/* Or use Material Symbol */}
      {/* 
      <span
        className="material-symbols-outlined text-black text-2xl"
        style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
      >
        restart_alt
      </span> 
      */}
    </button>
  );
};

export default BackButton;
