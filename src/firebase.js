// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBCpDy4mJiKp_QcKFxK9rwm6lMk9EKhnY0",
    authDomain: "draft-e5aa2.firebaseapp.com",
    projectId: "draft-e5aa2",
    storageBucket: "draft-e5aa2.appspot.com",
    messagingSenderId: "347977788127",
    appId: "1:347977788127:web:cbd5ca1a34b44582bdd76a",
    measurementId: "G-4FBYCF9QZK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);