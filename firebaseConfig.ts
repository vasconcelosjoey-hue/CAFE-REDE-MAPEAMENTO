import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCvlQcZUQ0sHN6zuimj8TfU03FjoZcGy8",
  authDomain: "cafe-rede-mapeamento.firebaseapp.com",
  projectId: "cafe-rede-mapeamento",
  storageBucket: "cafe-rede-mapeamento.firebasestorage.app",
  messagingSenderId: "778416245724",
  appId: "1:778416245724:web:e2f632a7a07ae0e3add19"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);