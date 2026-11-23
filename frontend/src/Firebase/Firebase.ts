import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "ai-editor-5150f.firebaseapp.com",
    projectId: "ai-editor-5150f",
    storageBucket: "ai-editor-5150f.firebasestorage.app",
    messagingSenderId: "273758937679",
    appId: "1:273758937679:web:0df6ff850013401ddfc03a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();