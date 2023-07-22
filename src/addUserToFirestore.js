import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

// Function to add user data to Firestore
const addUserToFirestore = (user) => {
    const db = firebase.firestore();
    const { uid, displayName, email, photoURL } = user;

    // Create a new document in the 'users' collection with user data
    db.collection('users').doc(uid).set({
        name: displayName,
        email: email,
        profilePicture: photoURL,
        latestLogin: new Date().toString(),
    })
        .then(() => {
            console.log('User data added to Firestore:', user);
        })
        .catch((error) => {
            console.error('Error adding user data to Firestore:', error);
        });
};

export default addUserToFirestore;
