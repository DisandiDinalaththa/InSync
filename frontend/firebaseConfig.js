// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCLiuasXZLcTSC8tLiLVCNopQ6koCS5fQ",
  authDomain: "sdgp-4a0e6.firebaseapp.com",
  projectId: "sdgp-4a0e6",
  storageBucket: "sdgp-4a0e6.appspot.com",
  messagingSenderId: "1052253847445",
  appId: "1:1052253847445:web:23a03e0884d9a0c444009c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);

export const usersRef = collection(db, 'users');
export const roomRef = collection(db, 'rooms'); 