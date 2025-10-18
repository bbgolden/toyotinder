export default function Home() {
  return (
    <>
    <div className="w-screen h-screen flex flex-col justify-center items-center sm:hidden">
      <h1 className="text-white text-3xl font-bold">🚗 ToyoSwipe</h1>
      <p className="text-white mt-2">Find your perfect Toyota match ❤️</p>
    </div>
    
    <div className="hidden sm:flex justify-center items-center h-screen">
      <p className="text-gray-600 text-xl">
        Please use a mobile device for the best experience.
      </p>
    </div>
    </>
  );
}
