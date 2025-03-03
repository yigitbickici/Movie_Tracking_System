import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('userType');
        localStorage.removeItem('userName');
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="nav-items">
                <Link to="/watchlist" className="nav-item">
                    <i className="fas fa-film"></i>
                    <span>My WatchList</span>
                </Link>
                <Link to="/explore" className="nav-item">
                    <i className="fas fa-compass"></i>
                    <span>Explore</span>
                </Link>
                <Link to="/profile" className="nav-item">
                    <i className="fas fa-user"></i>
                    <span>Profile</span>
                </Link>
                {isAdmin && (
                    <Link to="/admin" className="nav-item">
                        <i className="fas fa-cog"></i>
                        <span>Admin Panel</span>
                    </Link>
                )}
            </div>
            <div className="nav-right">
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar; 