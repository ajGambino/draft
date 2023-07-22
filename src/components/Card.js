import React from 'react';

const Card = ({ user, roster }) => {
    return (
        <div className="card">
            <img src={user.picture} alt="Profile" />
            {user && (
                <div className="card-content">
                    <h3>{user.name}</h3>
                    {user.roster ? (
                        <>
                            <p>QB: {user.roster.qb}</p>
                            <p>RB: {user.roster.rb1}</p>
                            <p>RB: {user.roster.rb2}</p>
                            <p>WR: {user.roster.wr1}</p>
                            <p>WR: {user.roster.wr2}</p>
                            <p>TE: {user.roster.te}</p>
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
                </div>
            )}
        </div>
    );
};

export default Card;
