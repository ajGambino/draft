import React from 'react';
import { useLocation } from 'react-router-dom';

const Draft = () => {
    const location = useLocation();
    const { contestId, contestName } = location.state || {};

    return (
        <div>
            <h1>Welcome to the Draft</h1>
            <h2>Contest ID: {contestId}</h2>
            <h2>Contest Name: {contestName}</h2>
        </div>
    );
};

export default Draft;
