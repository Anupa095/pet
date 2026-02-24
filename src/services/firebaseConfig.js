import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
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

// Initialize Auth with persistence for React Native
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);
export const storage = getStorage(app);
