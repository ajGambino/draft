import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useLocation } from 'react-router-dom';
import Card from './Card';
import AuctionBlock from './AuctionBlock';
import PlayerList from './PlayerList';

const Draft = () => {
    const location = useLocation();
    const { contestId, contestName, userRoster } = location.state || {};
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [timerStarted, setTimerStarted] = useState(false);

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

    const handleSelectPlayer = (player) => {
        console.log('Selected Player:', player);
        setSelectedPlayer(player); // Set the selected player in the state
        setTimerStarted(true); // Start the timer when a player is selected
    };

    return (
        <div>
            <h1>Welcome to the Draft</h1>
            <h2>Contest ID: {contestId}</h2>
            <h2>Contest Name: {contestName}</h2>
            <AuctionBlock
                selectedPlayer={selectedPlayer}
                timerStarted={timerStarted}
                setTimerStarted={setTimerStarted}
            />
            {!timerStarted && <PlayerList onSelectPlayer={handleSelectPlayer} />}
            <div className='cards-container'>
                {registeredUsers.map((user) => (
                    <Card key={user.id} user={user} roster={userRoster} />
                ))}
            </div>
        </div>
    );
};

export default Draft;
