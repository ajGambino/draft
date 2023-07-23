import React, { useState } from 'react';

const AuctionBlock = ({ selectedPlayer }) => {
    const [bid, setBid] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // logic here to store each user's bid.
        console.log('Selected Player:', selectedPlayer);
        console.log('Bid Amount:', bid);
    };

    return (
        <div className='AuctionBlock'>
            <h1>Auction Block</h1>
            {selectedPlayer ? (
                <div>
                    <h2>Selected Player: {selectedPlayer.name}</h2>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Bid Amount:
                            <input type="text" value={bid} onChange={(e) => setBid(e.target.value)} />
                        </label>
                        <button type="submit">Place Bid</button>
                    </form>
                </div>
            ) : (
                <div>
                    <p>No player selected.</p>
                </div>
            )}
        </div>
    );
};

export default AuctionBlock;
