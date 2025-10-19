import { initializeApp } from "firebase/app";
import type { QuerySnapshot, WhereFilterOp } from "firebase/firestore";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAPQqhsU2jH7iVoiYSFYBZ_ogO6yHGs4yc",
  authDomain: "toyotaswiper.firebaseapp.com",
  projectId: "toyotaswiper",
  storageBucket: "toyotaswiper.firebasestorage.app",
  messagingSenderId: "213385454803",
  appId: "1:213385454803:web:92f8a9d9289998021f6026",
  measurementId: "G-N2NFNKB00L"
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