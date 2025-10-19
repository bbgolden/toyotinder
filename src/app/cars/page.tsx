"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface Car {
  id: string;
  make?: string;
  model: string;
  year: number;
  price: number;
  bodyType?: string;
  available?: boolean;
  features?: string[];
  image?: string; // 👈 Added this
}

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "cars"));
        const carList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Car[];
        setCars(carList);
      } catch (error) {
        console.error("❌ Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Loading cars...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-8">
      <h1 className="text-3xl font-bold text-center text-red-600 mb-6">
        Available Cars
      </h1>

      {cars.length === 0 ? (
        <p className="text-center text-gray-600">No cars found in database.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {cars.map((car) => (
            <div
              key={car.id}
              className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition h-64 flex items-end"
              style={{
                backgroundImage: `url(${car.image || "/fallback.jpg"})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40"></div>

              {/* Content */}
              <div className="relative z-10 p-4 text-white w-full">
                <h2 className="text-xl font-semibold">
                  {car.make || "Toyota"} {car.model}
                </h2>
                <p className="text-sm">{car.year}</p>
                <p className="text-sm font-bold">${car.price.toLocaleString()}</p>
                <p className="text-sm">{car.bodyType || "—"}</p>
                <p
                  className={`mt-1 text-sm font-medium ${
                    car.available ? "text-green-300" : "text-red-300"
                  }`}
                >
                  {car.available ? "Available" : "Out of stock"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
