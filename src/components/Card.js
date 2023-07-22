// Card.js
import React from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const Card = ({ user, roster }) => {
    // Function to fetch the user's Google profile picture URL
    const fetchProfilePicture = async () => {
        try {
            const user = firebase.auth().currentUser;
            if (user && user.providerData && user.providerData.length > 0) {
                const provider = user.providerData[0].providerId;
                if (provider === 'google.com') {
                    // The user is signed in with Google, fetch the profile picture URL
                    const googleProfilePicture = user.providerData[0].photoURL;
                    return googleProfilePicture;
                }
            }
        } catch (error) {
            console.error('Error fetching profile picture:', error);
        }
        return null;
    };

    // Use React hooks to fetch the profile picture URL and update the state
    const [profilePictureUrl, setProfilePictureUrl] = React.useState(null);

    React.useEffect(() => {
        fetchProfilePicture().then((url) => {
            setProfilePictureUrl(url);
        });
    }, []);

    return (
        <div className="card">
            {profilePictureUrl && <img src={profilePictureUrl} alt="Profile" />}
            {roster ? (
                <div className="card-content">
                    <h3>{user.name}</h3>
                    <p>QB: {roster.qb}</p>
                    <p>RB: {roster.rb1}</p>
                    <p>RB: {roster.rb2}</p>
                    <p>WR: {roster.wr1}</p>
                    <p>WR: {roster.wr2}</p>
                    <p>TE: {roster.te}</p>
                </div>
            ) : (
                <div className="card-content">
                    <p>No user data available.</p>
                    <p>QB: </p>
                    <p>RB: </p>
                    <p>RB: </p>
                    <p>WR: </p>
                    <p>WR: </p>
                    <p>TE: </p>
                </div>
            )}
        </div>
    );
};

export default Card;
