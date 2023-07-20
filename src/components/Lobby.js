// register button, onclick add 1 to players field in that document ID in contests collection
//when players === 6, disable register button, and redirect those 6 users to the draft page
// do not let players register more than once
// render each document in contests collection as [name] | [players]'/6' | register button
import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const Lobby = () => {
    const [contests, setContests] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch contests data from Firestore
        const db = firebase.firestore();
        const unsubscribe = db.collection('contests').onSnapshot((snapshot) => {
            const contestsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setContests(contestsData);
        });

        return () => unsubscribe();
    }, []);

    const handleRegister = (contestId, currentPlayers) => {
        const user = firebase.auth().currentUser;
        if (user) {
            // Check if the user's ID is associated with the contest's registeredUsers field
            const db = firebase.firestore();
            const contestRef = db.collection('contests').doc(contestId);

            db.runTransaction((transaction) => {
                return transaction.get(contestRef).then((contestDoc) => {
                    if (contestDoc.exists) {
                        const contestData = contestDoc.data();
                        if (!contestData.registeredUsers || !contestData.registeredUsers.includes(user.uid)) {
                            if (currentPlayers < 6) {
                                // Registration success
                                transaction.update(contestRef, {
                                    players: currentPlayers + 1,
                                    registeredUsers: firebase.firestore.FieldValue.arrayUnion(user.uid),
                                });
                                setMessage('Registration successful!');
                            } else {
                                // Contest is full
                                setMessage('Contest is full. Cannot register.');
                            }
                        } else {
                            // User is already registered
                            setMessage('You are already registered for this contest.');
                        }
                    } else {
                        // Contest does not exist
                        setMessage('Contest does not exist.');
                    }
                });
            }).catch((error) => {
                console.error('Error during registration:', error);
            });
        } else {
            // User is not authenticated
            setMessage('You need to log in before registering for a contest.');
            // You can implement the redirect logic here
        }
    };

    return (
        <div>
            <h1>Lobby</h1>
            {message && <p>{message}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Contest Name</th>
                        <th>Players</th>
                        <th>Register</th>
                    </tr>
                </thead>
                <tbody>
                    {contests.map((contest) => (
                        <tr key={contest.id}>
                            <td>{contest.name}</td>
                            <td>{`${contest.players}/6`}</td>
                            <td>
                                <button
                                    onClick={() => handleRegister(contest.id, contest.players)}
                                    disabled={contest.players >= 6}
                                >
                                    Register
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Lobby;
