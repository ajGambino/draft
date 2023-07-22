import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const Card = ({ user, roster }) => {
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);

    useEffect(() => {
        // Function to fetch the user's Google profile picture URL
        const fetchProfilePicture = async () => {
            try {
                if (user.providerData && user.providerData.length > 0) {
                    const provider = user.providerData[0].providerId;
                    if (provider === 'google.com') {
                        // The user is signed in with Google, fetch the profile picture URL
                        const googleProfilePicture = user.providerData[0].photoURL;
                        setProfilePictureUrl(googleProfilePicture);
                    }
                }
            } catch (error) {
                console.error('Error fetching profile picture:', error);
            }
        };

        // Check if the user is registered and fetch the profile picture from the subcollection
        if (user && user.uid) {
            const db = firebase.firestore();
            const userRef = db.collection('contests').doc(user.contestId).collection('registeredUsers').doc(user.uid);
            userRef.get().then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    if (userData.picture) {
                        setProfilePictureUrl(userData.picture);
                    } else {
                        fetchProfilePicture();
                    }
                } else {
                    console.log('User data not found in the subcollection.');
                    fetchProfilePicture();
                }
            });
        }
    }, [user]);

    return (
        <div className="card">
            {profilePictureUrl && <img src={profilePictureUrl} alt="Profile" />}
            {user && (
                <div className="card-content">
                    <h3>{user.name}</h3>
                    {user.roster ? (
                        <>
                            <p>QB: {user.roster.qb}</p>
                            <p>RB: {user.roster.rb1}</p>
                            <p>RB: {user.roster.rb2}</p>
                            <p>WR: {user.roster.wr1}</p>
                            <p>WR: {user.roster.wr2}</p>
                            <p>TE: {user.roster.te}</p>
                        </>
                    ) : (
                        <>
                            <p>QB: </p>
                            <p>RB: </p>
                            <p>RB: </p>
                            <p>WR: </p>
                            <p>WR:</p>
                            <p>TE: </p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Card;
