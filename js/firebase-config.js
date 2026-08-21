import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Konfigurasi resmi Firebase Project AT Digital
export const firebaseConfig = {
  apiKey: "AIzaSyANJ1Aqs8VGbWidIxRSNh-6jxEETlhn63w",
  authDomain: "gen-lang-client-0645438603.firebaseapp.com",
  projectId: "gen-lang-client-0645438603",
  storageBucket: "gen-lang-client-0645438603.firebasestorage.app",
  messagingSenderId: "579181577117",
  appId: "1:579181577117:web:6bdf2a8fe1b5b9c20ba574"
};

// Inisialisasi Firebase App singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
