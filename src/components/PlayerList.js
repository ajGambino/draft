import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const PlayerList = ({ onSelectPlayer }) => {
    const [players, setPlayers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPosition, setSelectedPosition] = useState('All'); // Initialize with 'All'
    const playersPerPage = 10;

    useEffect(() => {
        // Fetch the list of players from the 'players' collection
        const db = firebase.firestore();
        db.collection('players').get().then((snapshot) => {
            const playersData = snapshot.docs.map((playerDoc) => ({
                id: playerDoc.id,
                ...playerDoc.data(),
            }));
            // Sort players by projection in descending order
            playersData.sort((a, b) => b.projection - a.projection);
            setPlayers(playersData);
        });
    }, []);

    // Filter players by the selected position
    const filteredPlayers = selectedPosition === 'All'
        ? players
        : players.filter((player) => player.position === selectedPosition);

    // Calculate the index of the last player on the current page
    const indexOfLastPlayer = currentPage * playersPerPage;
    // Calculate the index of the first player on the current page
    const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
    // Get the current page of players to display
    const currentPlayers = filteredPlayers.slice(indexOfFirstPlayer, indexOfLastPlayer);

    // Function to handle clicking on the "Next" button
    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    // Function to handle clicking on the "Previous" button
    const handlePrevPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    // Function to handle clicking on a position tab
    const handleTabClick = (position) => {
        setSelectedPosition(position);
        setCurrentPage(1); // Reset current page to 1 when changing position
    };

    return (
        <div>
            <h1>Player List</h1>
            <div>
                <ul>
                    <li className={selectedPosition === 'All' ? 'active' : ''} onClick={() => handleTabClick('All')}>
                        All
                    </li>
                    <li className={selectedPosition === 'QB' ? 'active' : ''} onClick={() => handleTabClick('QB')}>
                        QB
                    </li>
                    <li className={selectedPosition === 'RB' ? 'active' : ''} onClick={() => handleTabClick('RB')}>
                        RB
                    </li>
                    <li className={selectedPosition === 'WR' ? 'active' : ''} onClick={() => handleTabClick('WR')}>
                        WR
                    </li>
                    <li className={selectedPosition === 'TE' ? 'active' : ''} onClick={() => handleTabClick('TE')}>
                        TE
                    </li>
                </ul>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Projection</th>
                        <th>Team</th>
                    </tr>
                </thead>
                <tbody>
                    {currentPlayers.map((player) => (
                        <tr key={player.id} onClick={() => onSelectPlayer(player)}>
                            <td>{player.name}</td>
                            <td>{player.position}</td>
                            <td>{player.projection}</td>
                            <td>{player.team}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                {currentPage > 1 && (
                    <button onClick={handlePrevPage}>Previous</button>
                )}
                {currentPlayers.length === playersPerPage && (
                    <button onClick={handleNextPage}>Next</button>
                )}
            </div>
        </div>
    );
};

export default PlayerList;
