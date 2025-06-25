import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAfEss9H3QEwoLWjkaG_W3kZ0fpVwV_Bko",
  authDomain: "miapp-integral-3cdb8.firebaseapp.com",
  projectId: "miapp-integral-3cdb8",
  storageBucket: "miapp-integral-3cdb8.firebasestorage.app",
  messagingSenderId: "79261244199",
  appId: "1:79261244199:web:789338e81d2da3c0002702",
  measurementId: "G-8E72GC0ZSM"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};