import React from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const Navbar = () => {
    const handleLogout = () => {
        firebase.auth().signOut()
            .then(() => {
                window.location.href = '/login';
            })
            .catch((error) => {
                console.error('Error during logout:', error);
            });
    };

    return (
        <nav>
            <ul>
                <li>
                    <Link to="/lobby">Lobby</Link>
                </li>
                <li>
                    <Link to="/live">Live Results</Link>
                </li>
                <li>
                    <button onClick={handleLogout}>Logout</button>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
