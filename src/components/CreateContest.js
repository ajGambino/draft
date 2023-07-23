import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const CreateContest = () => {
    const [name, setName] = useState('');
    const [entrants, setEntrants] = useState('1');
    const [buyin, setBuyin] = useState('free');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add code here to create a new document in the Firestore collection with the form values
        const db = firebase.firestore();
        db.collection('contests')
            .add({
                name: name,
                players: 0,
                entries: parseInt(entrants),
                buyin: buyin,
            })
            .then(() => {
                console.log('Contest created successfully!');
                // Show success message
                setSuccessMessage('Your contest has been successfully added to the lobby.');
                // Reset the form
                setName('');
                setEntrants('1');
                setBuyin('free');
            })
            .catch((error) => {
                console.error('Error creating contest:', error);
            });
    };

    return (
        <div>
            <h1>Create Contest</h1>
            {successMessage && <p>{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Contest Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </label>
                <br />
                <label>
                    How Many Entrants?
                    <select value={entrants} onChange={(e) => setEntrants(e.target.value)} required>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                    </select>
                </label>
                <br />
                <label>
                    Buyin $:
                    <select value={buyin} onChange={(e) => setBuyin(e.target.value)} required>
                        <option value="free">Free</option>
                        <option value="$1">$1</option>
                        <option value="$5">$5</option>
                    </select>
                </label>
                <br />
                <button type="submit">Add Blind Auction to Lobby</button>
            </form>
        </div>
    );
};

export default CreateContest;
