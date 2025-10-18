import Image from "next/image";
import toyotaLogo from "../../public/toyota-logo.png"; // Make sure you have the logo in the public folder

export default function Home() {
  return (
    <>
    
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-red-600 sm:hidden">
        <Image src={toyotaLogo} alt="Toyota Logo" width={100} height={100} className="mb-6" />
        <h1 className="text-white text-3xl font-bold">ToyoTinder</h1>
      </div>
    
    <div className="hidden sm:flex justify-center items-center h-screen">
      <p className="text-gray-600 text-xl">
        Please use a mobile device for the best experience.
      </p>

    </div>
    </>
  );
}
