import { initializeApp } from "firebase/app";
import type { QuerySnapshot, WhereFilterOp } from "firebase/firestore";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};


const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export async function select(
    field: string, 
    operator: WhereFilterOp, 
    arg: string
): Promise<QuerySnapshot> {
    const results = query(
        collection(firestore, "cars"),
        where(field, operator, arg),
    );

    return getDocs(results);
}