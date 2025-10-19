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

// connect to database in firestore
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

/**
 * @description 
 * Retrieve cars from the database which match the given query. Query consists of a database field
 * to check, an operator to check with, and an arg to compare to. Analogus to a SQL SELECT query.  
 * pre: comparator is in {"<", "<=", "==", "!=", ">=", ">", "array-contains", "in", 
 * "array-contains-any", "not-in"}
 * @param field the field in the database that must be checked
 * @param comparator the comparator to use
 * @param arg the argument to be compared to
 * @returns a Promise to all matching vehicles in the database
 */
export async function select(
    field: string, 
    comparator: WhereFilterOp, 
    arg: string
): Promise<QuerySnapshot> {
    const results = query(
        collection(firestore, "cars"),
        where(field, comparator, arg),
    );

    return getDocs(results);
}