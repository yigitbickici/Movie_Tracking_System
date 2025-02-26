import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="nav-items">
                <Link to="/movies" className="nav-item">
                    <i className="fas fa-film"></i>
                    <span>Movies</span>
                </Link>
                <Link to="/explore" className="nav-item">
                    <i className="fas fa-compass"></i>
                    <span>Explore</span>
                </Link>
                <Link to="/profile" className="nav-item">
                    <i className="fas fa-user"></i>
                    <span>Profile</span>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar; 