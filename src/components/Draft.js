import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useLocation } from 'react-router-dom';
import Card from './Card';

const Draft = () => {
    const location = useLocation();
    const { contestId, contestName } = location.state || {};
    const [registeredUsers, setRegisteredUsers] = useState([]);

    useEffect(() => {

        const db = firebase.firestore();
        const contestRef = db.collection('contests').doc(contestId);

        contestRef.get().then((doc) => {
            if (doc.exists) {
                const contestData = doc.data();

                const registeredUsersData = contestData.registeredUsersData || [];
                setRegisteredUsers(registeredUsersData);
            }
        });
    }, [contestId]);


    const generatePlaceholderCards = () => {
        const remainingUsersCount = 6 - registeredUsers.length;
        const placeholderCards = [];

        for (let i = 0; i < remainingUsersCount; i++) {
            placeholderCards.push(<Card key={`placeholder-${i}`} user={null} />);
        }

        return placeholderCards;
    };

    return (
        <div>
            <h1>Welcome to the Draft</h1>
            <h2>Contest ID: {contestId}</h2>
            <h2>Contest Name: {contestName}</h2>
            <div className="cards-container">
                {registeredUsers.map((user) => (
                    <Card key={user.id} user={user} />
                ))}
                {generatePlaceholderCards()}
            </div>
        </div>
    );
};

export default Draft;
