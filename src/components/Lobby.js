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
                const isUserRegistered = contestsData.some((contest) =>
                    contest.registeredUsers.includes(user.uid)
                );
                setIsRegistered(isUserRegistered);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleRegister = (contestId, currentPlayers, contestEntries, contest) => {
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
                            if (currentPlayers < contestEntries) {
                                // Registration success
                                transaction.update(contestRef, {
                                    players: currentPlayers + 1,
                                    registeredUsers: firebase.firestore.FieldValue.arrayUnion(user.uid),
                                });
                                setMessage('Registration successful!');
                                if (currentPlayers + 1 === contestEntries) {
                                    // Contest reached its maximum number of players, start the draft
                                    // Set the entries field to the contestEntries
                                    transaction.update(contestRef, { entries: contestEntries });
                                    navigate(`/draft/${contest.id}`, {
                                        state: {
                                            contestId: contest.id,
                                            contestName: contest.name,
                                            // Add any other data related to the players in the contest if needed
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
                        <th>Contest </th>
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
                                    onClick={() => handleRegister(contest.id, contest.players, contest.entries, contest)}
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
