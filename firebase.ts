import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCAwl0QCQjDmxLXGgkgRxv36IpcLPL3eKI",
    authDomain: "pdash-app.firebaseapp.com",
    projectId: "pdash-app",
    storageBucket: "pdash-app.firebasestorage.app",
    messagingSenderId: "29286315226",
    appId: "1:29286315226:web:f936cae8a222b9baaba1e3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);