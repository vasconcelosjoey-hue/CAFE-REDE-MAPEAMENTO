import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configuração extraída da sua imagem (Print 2)
const firebaseConfig = {
  apiKey: "AIzaSyCvlQcZUQ0sHN6Zuimj8TfU03FjoZcGYY8",
  authDomain: "cafe-rede-mapeamento.firebaseapp.com",
  projectId: "cafe-rede-mapeamento",
  storageBucket: "cafe-rede-mapeamento.firebasestorage.app",
  messagingSenderId: "778416245724",
  appId: "1:778416245724:web:0e2f632a7a07ae0e3add19"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);