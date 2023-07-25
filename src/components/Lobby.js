import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useNavigate } from 'react-router-dom';

const Lobby = () => {
    const navigate = useNavigate();
    const [contests, setContests] = useState([]);
    const [isUserRegistered, setIsUserRegistered] = useState(null);


    const handleCreateContest = () => {
        navigate('/create');
    };

    useEffect(() => {
        const db = firebase.firestore();

        const unsubscribe = db.collection('contests').onSnapshot((snapshot) => {
            const contestsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setContests(contestsData);

            const user = firebase.auth().currentUser;
            if (user) {
                const promises = contestsData.map((contest) => {
                    const userRef = db.collection('contests').doc(contest.id).collection('registeredUsers').doc(user.uid);
                    return userRef.get().then((doc) => doc.exists);
                });

                Promise.all(promises).then((results) => {
                    const isUserRegistered = results.some((isRegistered) => isRegistered);
                    setIsUserRegistered(isUserRegistered);
                });
            }
        });



        return () => unsubscribe();
    }, []);

    const handleRegister = (contestId, currentPlayers, contestEntries, contest) => {
        const user = firebase.auth().currentUser;

        if (user) {
            const db = firebase.firestore();
            const contestRef = db.collection('contests').doc(contestId);
            const userRef = contestRef.collection('registeredUsers').doc(user.uid);

            // Check if the user is already registered for the contest
            userRef.get().then((userDoc) => {
                if (userDoc.exists) {
                    // User is already registered, do nothing
                    alert('You are already registered for this contest.');
                } else {
                    // User is not registered, proceed with registration

                    // Initialize the roster with empty values for each position
                    const initialRoster = {
                        QB: '',
                        RB1: '',
                        RB2: '',
                        WR1: '',
                        WR2: '',
                        TE: '',
                    };

                    // Create the user's document in the subcollection with the initial roster
                    const newUserDoc = {
                        name: user.displayName,
                        email: user.email,
                        picture: user.photoURL,
                        roster: initialRoster,
                    };

                    // Add the user document to the registeredUsers subcollection
                    userRef.set(newUserDoc);

                    // Continue with the registration process as usual
                    contestRef.update({
                        players: currentPlayers + 1,
                        [`registeredUsers.${user.uid}`]: true, // Use user's UID as the key in the map
                    });

                    alert('Registration successful!');

                    if (currentPlayers + 1 === contestEntries) {
                        // Contest reached its maximum number of players, start the draft
                        contestRef.update({ entries: contestEntries });

                        navigate(`/draft/${contestId}`, {
                            state: {
                                contestId: contest.id,
                                contestName: contest.name,
                                userRoster: initialRoster, // Pass initialRoster to the Draft page
                            },
                        });
                    }

                    // Update the isUserRegistered state after successful registration
                    setIsUserRegistered(true);
                }
            });
        } else {
            // User is not authenticated
            alert('You need to log in before registering for a contest.');
            navigate('/login');
        }
    };

    return (
        <div>
            <h1>Lobby</h1>
            <button onClick={handleCreateContest}>Create a Contest</button>
            <table>
                <thead>
                    <tr>
                        <th>Contest</th>
                        <th>Buyin</th>
                        <th>Players</th>
                    </tr>
                </thead>
                <tbody>
                    {contests.map((contest) => (
                        <tr key={contest.id}>
                            <td>{contest.name}</td>
                            <td>{contest.buyin}</td>
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
                                        const user = firebase.auth().currentUser;
                                        const isUserRegisteredForCurrentContest = contests.some(
                                            (c) => c.registeredUsers[user.uid] && c.id === contest.id
                                        );

                                        if (isUserRegisteredForCurrentContest && contest.players === contest.entries) {
                                            navigate(`/draft/${contest.id}`, {
                                                state: {
                                                    contestId: contest.id,
                                                    contestName: contest.name,
                                                    // Add any other data related to the players in the contest if needed
                                                },
                                            });
                                        } else if (!isUserRegisteredForCurrentContest) {
                                            alert('You are not registered for this contest. Please register before drafting.');
                                        } else if (contest.players !== contest.entries) {
                                            alert("Draft not yet available, contest is not full.")
                                        }
                                    }}

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
