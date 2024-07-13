// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDSylhsLUezSekpCYR33j-FZyzheZEMPB8",
    authDomain: "air-selangor-e0ef1.firebaseapp.com",
    projectId: "air-selangor-e0ef1",
    storageBucket: "air-selangor-e0ef1.appspot.com",
    messagingSenderId: "215502883656",
    appId: "1:215502883656:web:edd5eea833f2d1f0a3817d",
    measurementId: "G-JYSVKY6S65"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);

