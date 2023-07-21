import React from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const Card = ({ user }) => {
    const fetchProfilePicture = async () => {
        try {
            const user = firebase.auth().currentUser;
            if (user && user.providerData && user.providerData.length > 0) {
                const provider = user.providerData[0].providerId;
                if (provider === 'google.com') {
                    const googleProfilePicture = user.providerData[0].photoURL;
                    return googleProfilePicture;
                }
            }
        } catch (error) {
            console.error('Error fetching profile picture:', error);
        }
        return null;
    };

    const [profilePictureUrl, setProfilePictureUrl] = React.useState(null);

    React.useEffect(() => {
        fetchProfilePicture().then((url) => {
            setProfilePictureUrl(url);
        });
    }, []);

    return (
        <div className="card">
            {profilePictureUrl && <img src={profilePictureUrl} alt="Profile" />}
            {user ? (
                <div className="card-content">
                    <h3>{user.name}</h3>
                    <p>QB: {user.qb}</p>
                    <p>RB: {user.rb1}</p>
                    <p>RB: {user.rb2}</p>
                    <p>WR: {user.wr1}</p>
                    <p>WR: {user.wr2}</p>
                    <p>TE: {user.te}</p>
                </div>
            ) : (
                <p>No user data available.</p>
            )}
        </div>
    );
};

export default Card;
