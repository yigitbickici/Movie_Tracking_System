import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
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
                    <Link 
                        to="/explore" 
                        className={`nav-link ${location.pathname === '/explore' ? 'active' : ''}`}
                    >
                        <i className="fas fa-compass"></i>
                        <span>Keşfet</span>
                    </Link>
                    <Link 
                        to="/watchlist" 
                        className={`nav-link ${location.pathname === '/watchlist' ? 'active' : ''}`}
                    >
                        <i className="fas fa-film"></i>
                        <span>İzleme Listem</span>
                    </Link>
                    {isAdmin && (
                        <Link 
                            to="/admin" 
                            className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                        >
                            <i className="fas fa-cog"></i>
                            <span>Admin Panel</span>
                        </Link>
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
                            <Link to="/profile" className="dropdown-item">
                                <i className="fas fa-user"></i>
                                <span>Profil</span>
                            </Link>
                            <Link to="/settings" className="dropdown-item">
                                <i className="fas fa-cog"></i>
                                <span>Ayarlar</span>
                            </Link>
                            <div className="dropdown-divider"></div>
                            <button onClick={handleLogout} className="dropdown-item logout-item">
                                <i className="fas fa-sign-out-alt"></i>
                                <span>Çıkış Yap</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 