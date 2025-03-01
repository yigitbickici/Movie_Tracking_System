import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Şimdilik sadece login sayfasına yönlendirme yapıyoruz
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-items">
                <Link to="/movies" className="nav-item">
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