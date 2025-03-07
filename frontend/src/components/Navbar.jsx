import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userType = localStorage.getItem('userType');
    const userName = localStorage.getItem('userName');
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('userType');
        localStorage.removeItem('userName');
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-brand">
                    <Link to="/explore">
                        <span className="brand-text">MOVIEAPP</span>
                    </Link>
                </div>

                <div className="nav-links">
                    {userType === 'editor' ? (
                        <>
                            <Link 
                                to="/explore" 
                                className={`nav-link ${location.pathname === '/explore' ? 'active' : ''}`}
                            >
                                <i className="fas fa-compass"></i>
                                <span>Explore</span>
                            </Link>
                            <Link 
                                to="/spoiler-requests" 
                                className={`nav-link ${location.pathname === '/spoiler-requests' ? 'active' : ''}`}
                            >
                                <i className="fas fa-shield-alt"></i>
                                <span>Spoiler Reports</span>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link 
                                to="/explore" 
                                className={`nav-link ${location.pathname === '/explore' ? 'active' : ''}`}
                            >
                                <i className="fas fa-compass"></i>
                                <span>Explore</span>
                            </Link>
                            <Link 
                                to="/watchlist" 
                                className={`nav-link ${location.pathname === '/watchlist' ? 'active' : ''}`}
                            >
                                <i className="fas fa-film"></i>
                                <span>WatchList</span>
                            </Link>
                            {userType === 'admin' && (
                                <Link 
                                    to="/admin" 
                                    className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                                >
                                    <i className="fas fa-cog"></i>
                                    <span>Admin Panel</span>
                                </Link>
                            )}
                        </>
                    )}
                </div>

                <div className="nav-profile">
                    <div 
                        className="profile-button"
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                    >
                        <i className="fas fa-user-circle"></i>
                        <span>{userName}</span>
                        <i className="fas fa-chevron-down"></i>
                    </div>

                    {showProfileMenu && (
                        <div className="profile-dropdown">
                            {userType !== 'editor' && (
                                <Link to="/profile" className="dropdown-item">
                                    <i className="fas fa-user"></i>
                                    <span>Profile</span>
                                </Link>
                            )}
                            <button onClick={handleLogout} className="dropdown-item logout-item">
                                <i className="fas fa-sign-out-alt"></i>
                                <span>Log Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 