import React from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { useNavigate } from 'react-router-dom';


const firebaseConfig = {
    apiKey: "AIzaSyBCpDy4mJiKp_QcKFxK9rwm6lMk9EKhnY0",
    authDomain: "draft-e5aa2.firebaseapp.com",
    projectId: "draft-e5aa2",
    storageBucket: "draft-e5aa2.appspot.com",
    messagingSenderId: "347977788127",
    appId: "1:347977788127:web:cbd5ca1a34b44582bdd76a",
    measurementId: "G-4FBYCF9QZK"
};


firebase.initializeApp(firebaseConfig);

const Login = () => {
    const navigate = useNavigate();
    const handleGoogleLogin = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                const user = result.user;
                console.log('Logged in user:', user);
                navigate('/lobby')
            })
            .catch((error) => {
                console.error('Error during Google login:', error);
            });
    };

    return (
        <div>
            <h1>Login</h1>
            <button onClick={handleGoogleLogin}>Login with Google</button>
        </div>
    );
};

export default Login;
