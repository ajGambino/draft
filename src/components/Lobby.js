import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useNavigate } from 'react-router-dom';

const Lobby = () => {
    const navigate = useNavigate();
    const [contests, setContests] = useState([]);
    const [message, setMessage] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        const db = firebase.firestore();
        const unsubscribe = db.collection('contests').onSnapshot((snapshot) => {
            const contestsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setContests(contestsData);

            // Check if the current user is registered for any of the contests
            const user = firebase.auth().currentUser;
            if (user) {
                const promises = contestsData.map((contest) => {
                    const userRef = db.collection('contests').doc(contest.id).collection('registeredUsers').doc(user.uid);
                    return userRef.get().then((doc) => doc.exists);
                });

                Promise.all(promises).then((results) => {
                    const isUserRegistered = results.some((isRegistered) => isRegistered);
                    setIsRegistered(isUserRegistered);
                });
            }
        });

        return () => unsubscribe();
    }, []);


    const handleRegister = (contestId, currentPlayers, contestEntries, contest) => {
        const user = firebase.auth().currentUser;

        if (user) {
            // Check if the user's ID is associated with the contest's registeredUsers subcollection
            const db = firebase.firestore();
            const contestRef = db.collection('contests').doc(contestId);
            const userRef = contestRef.collection('registeredUsers').doc(user.uid);

            db.runTransaction((transaction) => {
                return transaction.get(contestRef).then((contestDoc) => {
                    if (contestDoc.exists) {
                        const contestData = contestDoc.data();

                        // Fetch the user's data from the registeredUsers subcollection
                        return transaction.get(userRef).then((userDoc) => {
                            if (userDoc.exists) {
                                const userData = userDoc.data();
                                // Assuming roster is a map in the user's document
                                const userRoster = userData.roster || {};

                                // Check if the user is already registered for this contest
                                if (!contestData.registeredUsers[userDoc.id]) {
                                    // Check if the contest has reached its maximum number of players
                                    if (contestData.players < contestData.entries) {
                                        // Registration success
                                        transaction.update(contestRef, {
                                            players: contestData.players + 1,
                                            [`registeredUsers.${userDoc.id}`]: true, // Use user's UID as the key in the map
                                        });

                                        setMessage('Registration successful!');

                                        if (contestData.players + 1 === contestData.entries) {
                                            // Contest reached its maximum number of players, start the draft
                                            transaction.update(contestRef, { entries: contestData.entries });

                                            navigate(`/draft/${contestRef.id}`, {
                                                state: {
                                                    contestId: contestRef.id,
                                                    contestName: contestData.name,
                                                },
                                            });
                                        }
                                    } else {
                                        // Contest is full
                                        setMessage('Contest is full. Cannot register.');
                                    }
                                } else {
                                    // User is already registered
                                    setMessage('You are already registered for this contest.');
                                }
                            } else {
                                // User document does not exist in the subcollection
                                // Create the user's document in the subcollection
                                const newUserDoc = {
                                    name: user.displayName,
                                    email: user.email,
                                    picture: user.photoURL,
                                    roster: {
                                        QB: "",
                                        RB1: "",
                                        RB2: "",
                                        TE: "",
                                        WR1: "",
                                        WR2: "",
                                    }, // Assuming roster is an empty map for new users
                                };
                                transaction.set(userRef, newUserDoc);

                                // Continue with the registration process as usual
                                transaction.update(contestRef, {
                                    players: contestData.players + 1,
                                    [`registeredUsers.${user.uid}`]: true, // Use user's UID as the key in the map
                                });

                                setMessage('Registration successful!');

                                if (contestData.players + 1 === contestData.entries) {
                                    // Contest reached its maximum number of players, start the draft
                                    transaction.update(contestRef, { entries: contestData.entries });

                                    navigate(`/draft/${contestRef.id}`, {
                                        state: {
                                            contestId: contestRef.id,
                                            contestName: contestData.name,
                                        },
                                    });
                                }
                            }
                        });
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
            navigate('/login');
        }
    };

    return (
        <div>
            <h1>Lobby</h1>
            {message && <p>{message}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Contest</th>
                        <th>Players</th>
                    </tr>
                </thead>
                <tbody>
                    {contests.map((contest) => (
                        <tr key={contest.id}>
                            <td>{contest.name}</td>
                            <td>{`${contest.players}/${contest.entries}`}</td>
                            <td>
                                <button
                                    onClick={() =>
                                        handleRegister(contest.id, contest.players, contest.entries, contest)
                                    }
                                    disabled={contest.players >= contest.entries}
                                >
                                    Register
                                </button>
                            </td>
                            <td>
                                <button
                                    onClick={() => {
                                        if (contest.players === contest.entries && isRegistered) {
                                            navigate(`/draft/${contest.id}`, {
                                                state: {
                                                    contestId: contest.id,
                                                    contestName: contest.name,
                                                    // Add any other data related to the players in the contest if needed
                                                },
                                            });
                                        }
                                    }}
                                    disabled={contest.players !== contest.entries || !isRegistered}
                                >
                                    Draft Now!
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
