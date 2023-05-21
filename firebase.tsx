import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyComDZtcSlMR2uRf6tPSGcPTz7M69kOI8M",
    authDomain: "hackdavis-1eac3.firebaseapp.com",
    projectId: "hackdavis-1eac3",
    storageBucket: "hackdavis-1eac3.appspot.com",
    messagingSenderId: "482476758036",
    appId: "1:482476758036:web:d9a395593b480e35878301",
    measurementId: "G-ERGVXG3E8D"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);