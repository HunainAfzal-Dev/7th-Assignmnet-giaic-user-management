

"use client"
// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAd-2pW9PA_Ksk6Jcn7Vh0I0nT5Yy5b-Es",
    authDomain: "user-management-709dc.firebaseapp.com",
    projectId: "user-management-709dc",
    storageBucket: "user-management-709dc.appspot.com",
    messagingSenderId: "1080939521576",
    appId: "1:1080939521576:web:d856c63e982fc8ad57771d",
    measurementId: "G-4J6CDDJ4GK"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
