import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaCompass, FaFilm, FaShieldAlt, FaCog, FaUserCircle, FaChevronDown, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('userType');
        localStorage.removeItem('userName');
        navigate('/');
    };

    const mockUsers = [
        { id: 1, username: 'Emircan Çapkan', avatar: 'EC' },
        { id: 2, username: 'Yiğit Bıçkıcı', avatar: 'YB' },
        { id: 3, username: 'Elif Gülüm', avatar: 'EG' },
        { id: 4, username: 'Muhammet Emir Gündoğdu', avatar: 'MEG' }
    ];

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        if (query.trim()) {
            try {
                // Gerçek API çağrısı yapılacak
                const response = await fetch(`/api/users/search?query=${query}`);
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.error('Error searching users:', error);
                // Geçici mock data
                const results = mockUsers.filter(user => 
                    user.username.toLowerCase().includes(query.toLowerCase())
                );
                setSearchResults(results);
            }
        } else {
            setSearchResults([]);
        }
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const renderNavLinks = () => (
        <>
            {userType === 'admin' ? (
                <>
                    <Link 
                        to="/explore" 
                        className={`nav-link ${location.pathname === '/explore' ? 'active' : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <FaCompass />
                        <span>Explore</span>
                    </Link>
                    <Link 
                        to="/admin" 
                        className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <FaCog />
                        <span>Admin Panel</span>
                    </Link>
                </>
            ) : userType === 'editor' ? (
                <>
                    <Link 
                        to="/explore" 
                        className={`nav-link ${location.pathname === '/explore' ? 'active' : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <FaCompass />
                        <span>Explore</span>
                    </Link>
                    <Link 
                        to="/spoiler-requests" 
                        className={`nav-link ${location.pathname === '/spoiler-requests' ? 'active' : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <FaShieldAlt />
                        <span>Spoiler Reports</span>
                    </Link>
                </>
            ) : (
                <>
                    <Link 
                        to="/explore" 
                        className={`nav-link ${location.pathname === '/explore' ? 'active' : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <FaCompass />
                        <span>Explore</span>
                    </Link>
                    <Link 
                        to="/watchlist" 
                        className={`nav-link ${location.pathname === '/watchlist' ? 'active' : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <FaFilm />
                        <span>WatchList</span>
                    </Link>
                </>
            )}
        </>
    );

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-brand">
                    <Link to="/explore">
                        <span className="brand-text">.MOVIARY</span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="nav-links desktop-menu">
                    {renderNavLinks()}
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
                                                to={`/user/${user.username}`}
                                                className="search-result-item"
                                                onClick={() => {
                                                    setShowSearchDropdown(false);
                                                    navigate(`/user/${user.username}`);
                                                }}
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
                            <FaUserCircle />
                            <span>{userName}</span>
                            <FaChevronDown />
                        </div>

                        {showProfileMenu && (
                            <div className="profile-dropdown">
                                {userType !== 'editor' && userType !=='admin' && (
                                    <Link to="/profile" className="dropdown-item">
                                        <FaUser />
                                        <span>Profile</span>
                                    </Link>
                                )}
                                <button onClick={handleLogout} className="dropdown-item logout-item">
                                    <FaSignOutAlt />
                                    <span>Log Out</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Hamburger Menu Button - Only visible on mobile */}
                    <button className="hamburger-button" onClick={toggleMobileMenu}>
                        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
                {renderNavLinks()}
                {userType !== 'editor' && userType !=='admin' && (
                    <Link 
                        to="/profile" 
                        className="nav-link"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <FaUser />
                        <span>Profile</span>
                    </Link>
                )}
                <button 
                    onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                    }} 
                    className="mobile-logout-button"
                >
                    <FaSignOutAlt />
                    <span>Log Out</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar; 