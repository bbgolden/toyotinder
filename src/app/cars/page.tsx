"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { useSearchParams } from "next/navigation";
import {
  getAPR,
  getMonthlyPaymentFinance,
  getMonthlyPaymentLease,
  type TermLength,
} from "@/lib/math";

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
  features?: string[];
  image?: string;
}

export default function CarsPage() {
  const searchParams = useSearchParams();

  const budget = Number(searchParams.get("budget") ?? 0);
  const termYears = Number(searchParams.get("termYears") ?? 5);
  const downPayment = Number(searchParams.get("downPayment") ?? 5000);
  const creditScore = Number(searchParams.get("creditScore") ?? 700);
  const commuteDays = Number(searchParams.get("commuteDays") ?? 5);
  const commuteMiles = Number(searchParams.get("commuteMiles") ?? 10);
  const mileage = commuteDays * commuteMiles * 52 * 2;
  const term = (termYears * 12) as TermLength;

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const snapshot = await getDocs(collection(db, "cars"));
        const carList = snapshot.docs.map((doc) => ({
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
    <div className="min-h-screen bg-gray-200 py-8 px-4 sm:px-8">
      <h1 className="text-3xl font-bold text-center text-black mb-6">
        Here's your vehicle finance report!
      </h1>

      <div className="max-w-3xl mx-auto mb-8 bg-white rounded-lg shadow-md p-4 text-sm text-gray-700">
        <p>
          <span className="font-semibold">Monthly Budget:</span> ${budget}
        </p>
        <p>
          <span className="font-semibold">Credit Score:</span> {creditScore}
        </p>
        <p>
          <span className="font-semibold">Down Payment:</span> ${downPayment}
        </p>
        <p>
          <span className="font-semibold">Term:</span> {term} months
        </p>
        <p>
          <span className="font-semibold">Estimated Mileage:</span>{" "}
          {mileage.toLocaleString()} mi/year
        </p>
      </div>

      {cars.length === 0 ? (
        <p className="text-center text-gray-600">No cars found in database.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {cars.map((car) => {
            const apr = getAPR(creditScore, term);
            const finance = getMonthlyPaymentFinance(
              car.price,
              downPayment,
              creditScore,
              term
            );
            const lease = getMonthlyPaymentLease(
              car.price,
              downPayment,
              creditScore,
              term,
              mileage
            );

            // ✅ Calculate what the "recommended" down payment would be for this car (10% baseline)
            const carDownPayment = car.price * 0.1;

            // ✅ Matching logic
            const isFinanceMatch = finance <= budget;
            const isLeaseMatch = lease <= budget;
            const isDownPaymentMatch =
              Math.abs(carDownPayment - downPayment) < 500;

            return (
              <div
                key={car.id}
                className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
                style={{
                  backgroundImage: car.image
                    ? `url(${car.image})`
                    : "url(/default-car.jpg)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "350px",
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-all duration-300"></div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
                  <h2 className="text-xl font-bold">
                    {car.make || "Toyota"} {car.model}
                  </h2>
                  <p className="text-sm">{car.year}</p>
                  <p className="font-semibold text-lg">
                    ${car.price.toLocaleString()}
                  </p>
                  <p className="text-xs opacity-90">{car.bodyType || "—"}</p>

                  <div className="mt-3 text-xs space-y-1">
                    <p>
                      <span className="font-semibold">APR:</span>{" "}
                      {(apr * 100).toFixed(2)}%
                    </p>
                    <p
                      className={
                        isFinanceMatch
                          ? "font-semibold text-green-400"
                          : "font-semibold"
                      }
                    >
                      Finance: ${finance.toFixed(2)}/mo
                    </p>
                    <p
                      className={
                        isLeaseMatch
                          ? "font-semibold text-green-400"
                          : "font-semibold"
                      }
                    >
                      Lease: ${lease.toFixed(2)}/mo
                    </p>
                    <p
                      className={
                        isDownPaymentMatch
                          ? "font-semibold text-green-400"
                          : "font-semibold"
                      }
                    >
                      Suggested Down: ${carDownPayment.toFixed(2)}
                    </p>
                  </div>

                  {car.features && car.features.length > 0 && (
                    <ul className="mt-2 text-xs list-disc list-inside opacity-80">
                      {car.features.slice(0, 3).map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
