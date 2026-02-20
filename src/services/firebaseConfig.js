import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyANPujwT4gal_Ev6AMXVnmnIsf51Lw3kKI",
    authDomain: "pethub-9cdd8.firebaseapp.com",
    projectId: "pethub-9cdd8",
    storageBucket: "pethub-9cdd8.firebasestorage.app",
    messagingSenderId: "166231495449",
    appId: "1:166231495449:android:0050447d46d475af666b88"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
