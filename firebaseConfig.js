// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getReactNativePersistence, initializeAuth} from 'firebase/auth'
// Your web app's Firebase configuration
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getFirestore, collection} from 'firebase/firestore';
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";


const firebaseConfig = {
  apiKey: "AIzaSyDymj1d-1XarfpWjP9xeYsMQp2-9uyF9Gw",
  authDomain: "fir-chat-caaee.firebaseapp.com",
  projectId: "fir-chat-caaee",
  storageBucket: "fir-chat-caaee.appspot.com",
  messagingSenderId: "573652719670",
  appId: "1:573652719670:web:50b6ba4f58805b5dfc6097"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app,{
    persistence: getReactNativePersistence(AsyncStorage)
    
});

export const db = getFirestore(app);

export const userRef = collection(db, 'users');
export const roomRef = collection(db, 'rooms');