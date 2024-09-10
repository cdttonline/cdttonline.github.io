
import { getDocs } from 'firebase/firestore';
// import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js';
// import { getFirestore, collection, Timestamp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';
import {getAuth} from "firebase/auth"
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
    apiKey: "AIzaSyDuKnaBoKS1M6sZVC5Nht4lfUJwCj9C9cY",
    authDomain: "cdtt-dc538.firebaseapp.com",
    projectId: "cdtt-dc538",
    storageBucket: "cdtt-dc538.appspot.com",
    messagingSenderId: "110118431025",
    appId: "1:110118431025:web:0a93184db381462d41e810",
    measurementId: "G-9M8V21CJ3J"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);


export const resultsCollection = collection(db, 'testResults');
export const usersCollection = collection(db, 'Users');
export const auth = getAuth(firebaseApp);
