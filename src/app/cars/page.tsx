"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
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
  available?: boolean;
  features?: string[];
}

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // temporary user input (replace with form later)
  const [creditScore, setCreditScore] = useState(720);
  const [downPayment, setDownPayment] = useState(5000);
  const [term, setTerm] = useState<TermLength>(60);
  const [mileage, setMileage] = useState(12000);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const snapshot = await getDocs(collection(db, "cars"));
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Car[];
        setCars(fetched);
      } catch (error) {
        console.error("Error fetching cars:", error);
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

      {/* User Input Controls */}
      <div className="flex flex-wrap justify-center gap-4 mb-8 bg-white p-4 rounded-lg shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-600">Credit Score</label>
          <input
            type="number"
            value={creditScore}
            onChange={(e) => setCreditScore(Number(e.target.value))}
            className="border rounded-md px-2 py-1 w-28 text-center"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Down Payment</label>
          <input
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="border rounded-md px-2 py-1 w-28 text-center"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Term (months)</label>
          <select
            value={term}
            onChange={(e) => setTerm(Number(e.target.value) as TermLength)}
            className="border rounded-md px-2 py-1"
          >
            <option value={24}>24</option>
            <option value={36}>36</option>
            <option value={48}>48</option>
            <option value={60}>60</option>
            <option value={72}>72</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Mileage</label>
          <input
            type="number"
            value={mileage}
            onChange={(e) => setMileage(Number(e.target.value))}
            className="border rounded-md px-2 py-1 w-28 text-center"
          />
        </div>
      </div>

      {/* Car Cards */}
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

          return (
            <div
              key={car.id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {car.make || "Toyota"} {car.model}
              </h2>
              <p className="text-gray-600 text-sm mb-2">{car.year}</p>
              <p className="text-gray-700 font-bold">${car.price.toLocaleString()}</p>
              <p className="text-gray-500 text-sm">{car.bodyType || "—"}</p>
              <p
                className={`mt-2 text-sm font-medium ${
                  car.available ? "text-green-600" : "text-red-600"
                }`}
              >
                {car.available ? "Available" : "Out of stock"}
              </p>

              {/* Financial Info */}
              <div className="mt-4 border-t pt-3 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">APR:</span>{" "}
                  {(apr * 100).toFixed(2)}%
                </p>
                <p>
                  <span className="font-semibold">Finance Payment:</span>{" "}
                  ${finance.toFixed(2)}/mo
                </p>
                <p>
                  <span className="font-semibold">Lease Payment:</span>{" "}
                  ${lease.toFixed(2)}/mo
                </p>
              </div>

              {car.features && car.features.length > 0 && (
                <ul className="mt-3 text-sm text-gray-500 list-disc list-inside">
                  {car.features.slice(0, 3).map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}