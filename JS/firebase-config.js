// === JS/firebase-config.js ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAdtKX5fNbjt4a8nh_X0SHOEmlPdkboB64",
  authDomain: "seclab-login.firebaseapp.com",
  projectId: "seclab-login",
  storageBucket: "seclab-login.firebasestorage.app",
  messagingSenderId: "33229186177",
  appId: "1:33229186177:web:970b09549c6494fde25980",
  measurementId: "G-65BDZEB8SV"
};  

export const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
