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
      className="absolute top-4 left-4 px-4 py-2 rounded hover:bg-blue-600 transition flex items-center justify-center"
    >
      <Image
        src="/undo-left-svgrepo-com.svg"
        alt="Back"
        width={36}
        height={36}
        className="invert" // turns black SVG to white
      />
    </button>
  );
};

export default BackButton;
