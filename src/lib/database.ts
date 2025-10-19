import { initializeApp } from "firebase/app";
import type { QueryDocumentSnapshot } from "firebase/firestore";
import { getFirestore, collection, query, orderBy, getDocs } from "firebase/firestore";
import type { TermLength } from "@/lib/math";
import { getAPR, getMonthlyPaymentFinance, getMonthlyPaymentLease } from "@/lib/math";

type CarData = {
    bodyType: string,
    price: number,
    year: number,
    model: string,
}

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

// connect to database in firestore
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// ensure typing in data retrieval
const carDataConverter = {
    toFirestore: (car: CarData) => car,
    fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as CarData,
}

/**
 * Select cars in an ordered fashion. The primary ordering is by budget, with cars that fit within
 * the specific monthly budget coming first. The secondary ordering is by price, with more expensive
 * cars coming first.
 * @param budget user's preferred monthly payment budget
 * @param downPayment user's preferred down payment
 * @param creditScore user's credit score
 * @param term user's preferred term length in months
 * @param mileage user's estimated annual mileage
 * @returns a Promise to an ordered sequence of cars
 */
export async function selectCars(
    budget: number,
    downPayment: number,
    creditScore: number,
    term: TermLength,
    mileage: number,
) {
    const results = query(
        collection(firestore, "cars").withConverter(carDataConverter),
        orderBy("price", "desc"),
    );

    const rawDocs = await getDocs(results);
    const docsWithPricing = rawDocs.docs.map(doc => {
        const data: CarData = doc.data();

        return {
            ...data,
            apr: getAPR(creditScore, term), 
            finance: getMonthlyPaymentFinance(data.price, downPayment, creditScore, term),
            lease: getMonthlyPaymentLease(data.price, downPayment, creditScore, term, mileage),
        }
    })

    return docsWithPricing.toSorted((a, b) => (a.price - budget) - (b.price - budget));
}