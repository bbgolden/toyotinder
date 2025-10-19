import AnimatingNumber from "@/components/AnimatedNumberInput";
import BackButton from "@/components/BackButton";

export default function Numbers() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Back button top-left */}
      <BackButton to="/" />

      {/* Centered giant number input */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatingNumber value={0} />
      </div>
    </div>
  );
}
