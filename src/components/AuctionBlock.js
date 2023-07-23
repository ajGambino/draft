import React, { useState } from 'react'

const AuctionBlock = () => {
    const [bid, setBid] = useState(' ')

    const handleSubmit = (e) => {
        e.preventDefault();
        // logic here to store each users bid.
    }

    return (
        <div className='AuctionBlock'>
            <h1>auction block</h1>

            <form onSubmit={handleSubmit}>
                <label>
                    Bid Amount:
                    <input type="text" value={bid} onChange={(e) => setBid(e.target.value)} />
                </label>
                <button type="submit">Place Bid</button>
            </form>

        </div>
    )
}

export default AuctionBlock