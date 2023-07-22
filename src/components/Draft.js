import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useLocation } from 'react-router-dom';
import Card from './Card';

const Draft = () => {
    const location = useLocation();
    const { contestId, contestName, userRoster } = location.state || {};
    const [registeredUsers, setRegisteredUsers] = useState([]);

    useEffect(() => {
        const db = firebase.firestore();
        const contestRef = db.collection('contests').doc(contestId);

        // Fetch the contest document
        contestRef.get().then((doc) => {
            if (doc.exists) {
                // Fetch registered users and their rosters from the subcollection
                contestRef.collection('registeredUsers').get().then((snapshot) => {
                    const registeredUsersData = snapshot.docs.map((userDoc) => ({
                        id: userDoc.id,
                        ...userDoc.data(),
                    }));
                    setRegisteredUsers(registeredUsersData);
                });
            } else {
                console.log('Contest does not exist.');
            }
        });
    }, [contestId]);

    return (
        <div>
            <h1>Welcome to the Draft</h1>
            <h2>Contest ID: {contestId}</h2>
            <h2>Contest Name: {contestName}</h2>
            <div className="cards-container">
                {registeredUsers.map((user) => (
                    <Card key={user.id} user={user} roster={userRoster} /> // Pass userRoster as a prop to the Card component
                ))}
            </div>
        </div>
    );
};

export default Draft;
