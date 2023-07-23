import React, { useState, useEffect } from 'react';

const AuctionBlock = ({ selectedPlayer, timerStarted }) => {
    const [bid, setBid] = useState('');
    const [countdown, setCountdown] = useState(30);

    useEffect(() => {
        if (timerStarted && countdown > 0) {
            const interval = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown > 0 ? prevCountdown - 1 : 0);
            }, 1000);

            // Clean up the interval when the component is unmounted or countdown reaches 0
            return () => clearInterval(interval);
        }
    }, [timerStarted, countdown]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // logic here to store each user's bid.
        console.log('Selected Player:', selectedPlayer);
        console.log('Bid Amount:', bid);
    };

    return (
        <div className='AuctionBlock'>
            <h1>Auction Block</h1>
            {selectedPlayer && (
                <div>
                    <h2>{selectedPlayer.name}</h2>
                    <p>Pos: {selectedPlayer.position}</p>
                    <p>Proj: {selectedPlayer.projection}</p>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <label>
                    Bid Amount:
                    <input type="text" value={bid} onChange={(e) => setBid(e.target.value)} />
                </label>
                <button type="submit">Place Bid</button>
            </form>
            {timerStarted && (
                <h2>{countdown}s</h2>
            )}
        </div>
    );
};

export default AuctionBlock;
