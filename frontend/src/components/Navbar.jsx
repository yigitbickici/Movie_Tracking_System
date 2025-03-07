import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userType = localStorage.getItem('userType');
    const userName = localStorage.getItem('userName');
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('userType');
        localStorage.removeItem('userName');
        navigate('/');
    };

    const mockUsers = [
        { id: 1, username: 'JohnDoe', avatar: 'JD' },
        { id: 2, username: 'AliceSmith', avatar: 'AS' },
        { id: 3, username: 'BobWilson', avatar: 'BW' },
    ];

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        if (query.trim()) {
            const results = mockUsers.filter(user => 
                user.username.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
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

                <div className="nav-actions">
                    <div className="search-wrapper">
                        <button 
                            className="search-button"
                            onClick={() => setShowSearchDropdown(!showSearchDropdown)}
                        >
                            <FaSearch />
                        </button>
                        
                        {showSearchDropdown && (
                            <div className="search-dropdown">
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    autoFocus
                                />
                                {searchResults.length > 0 && (
                                    <div className="search-results">
                                        {searchResults.map(user => (
                                            <Link 
                                                key={user.id} 
                                                to={`/profile/${user.username}`} 
                                                className="search-result-item"
                                                onClick={() => setShowSearchDropdown(false)}
                                            >
                                                <div className="user-avatar-small">{user.avatar}</div>
                                                <span className="username">{user.username}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
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
            </div>
        </nav>
    );
};

export default Navbar; 