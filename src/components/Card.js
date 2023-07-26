import React from 'react';

const Card = ({ user, roster, wallet }) => {
    return (
        <div className="card">
            <img src={user.picture} alt="Profile" />
            {user && (
                <div className="card-content">
                    <h3>{user.name}</h3>
                    {user.roster ? (
                        <>
                            <p>QB: {user.roster.QB}</p>
                            <p>RB: {user.roster.RB1}</p>
                            <p>RB: {user.roster.RB2}</p>
                            <p>WR: {user.roster.WR1}</p>
                            <p>WR: {user.roster.WR2}</p>
                            <p>TE: {user.roster.TE}</p>
                        </>
                    ) : (
                        <>
                            <p>QB: </p>
                            <p>RB: </p>
                            <p>RB: </p>
                            <p>WR: </p>
                            <p>WR:</p>
                            <p>TE: </p>
                        </>
                    )}
                    <h2> ${user.wallet}</h2>
                </div>
            )}
        </div>
    );
};

export default Card;
