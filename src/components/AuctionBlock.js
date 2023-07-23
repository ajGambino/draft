import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const AuctionBlock = ({ selectedPlayer, timerStarted, setTimerStarted }) => {
    const [bid, setBid] = useState('');
    const [countdown, setCountdown] = useState(30);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic here to update the selectedPlayer in Firestore with the current selected player
        // and store the bid amount for the current user.
        const db = firebase.firestore();
        const selectedPlayerRef = db.collection('auctionBlock').doc('selectedPlayer');

        // Update the selected player data
        selectedPlayerRef.set({
            name: selectedPlayer.name,
            position: selectedPlayer.position,
            projection: selectedPlayer.projection,
            bidAmount: bid,
        });

        // Add the bid amount as a subcollection document for the current user
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
            selectedPlayerRef.collection('bidAmounts').doc(currentUser.uid).set({
                bidAmount: bid,
            });
        }
        // Reset the bid input to an empty string after placing the bid
        setBid('');

        // Display the success message with the bid amount
        alert(`Your $${bid} bid has been placed.`);
    };

    useEffect(() => {
        if (timerStarted && countdown > 0) {
            const interval = setInterval(() => {
                setCountdown((prevCountdown) => (prevCountdown > 0 ? prevCountdown - 1 : 0));
            }, 1000);

            // Clean up the interval when the component is unmounted or countdown reaches 0
            return () => clearInterval(interval);
        }

        // Reset the timer and allow player selection when countdown reaches 0s
        if (countdown === 0 && timerStarted) {
            setTimerStarted(false);
        }
    }, [timerStarted, countdown, setTimerStarted]);

    return (
        <div className='AuctionBlock'>
            <h1>Auction Block</h1>
            {!timerStarted && (
                <div>
                    <p>Select a player to start the timer.</p>
                </div>
            )}
            {timerStarted && selectedPlayer && (
                <div>
                    <h2>{selectedPlayer.name}</h2>
                    <p>Pos: {selectedPlayer.position}</p>
                    <p>Proj: {selectedPlayer.projection}</p>
                </div>
            )}
            {timerStarted && countdown > 0 && <h2>{countdown}s</h2>}
            {timerStarted && countdown === 0 && (
                <div>
                    <h2>Timer has reached 0s.</h2>
                    <button onClick={() => setTimerStarted(false)}>Restart Timer</button>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <label>
                    Bid Amount:
                    <input type='text' value={bid} onChange={(e) => setBid(e.target.value)} />
                </label>
                <button type='submit' disabled={!selectedPlayer}>
                    Place Bid
                </button>
            </form>
        </div>
    );
};

export default AuctionBlock;
