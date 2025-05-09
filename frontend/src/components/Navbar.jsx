import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaCompass, FaFilm, FaShieldAlt, FaCog, FaUserCircle, FaChevronDown, FaUser, FaSignOutAlt, FaBars, FaTimes, FaUsers, FaGlobe } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
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
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);
    const { t, i18n } = useTranslation();

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
                const response = await fetch(`/api/users/search?query=${query}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Search request failed');
                }
                
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.error('Error searching users:', error);
                setSearchResults([]);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleUserClick = (username) => {
        setShowSearchDropdown(false);
        setSearchQuery('');
        navigate(`/UserProfile/${username}`);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setShowLanguageMenu(false);
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
                        <span>{t('navbar.explore')}</span>
                    </Link>
                    <Link 
                        to="/admin" 
                        className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <FaCog />
                        <span>{t('navbar.admin')}</span>
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
                        <span>{t('navbar.explore')}</span>
                    </Link>
                    <Link 
                        to="/users" 
                        className={`nav-link ${location.pathname === '/users' ? 'active' : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <FaUsers />
                        <span>{t('navbar.users')}</span>
                    </Link>
                    <Link 
                        to="/spoiler-requests" 
                        className={`nav-link ${location.pathname === '/spoiler-requests' ? 'active' : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <FaShieldAlt />
                        <span>{t('navbar.spoilerReports')}</span>
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
                        <span>{t('navbar.explore')}</span>
                    </Link>
                    <Link 
                        to="/watchlist" 
                        className={`nav-link ${location.pathname === '/watchlist' ? 'active' : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <FaFilm />
                        <span>{t('navbar.watchlist')}</span>
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
                    <div className="language-selector">
                        <button 
                            className="language-button"
                            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                        >
                            <FaGlobe />
                        </button>
                        
                        {showLanguageMenu && (
                            <div className="language-dropdown">
                                <button 
                                    onClick={() => changeLanguage('en')} 
                                    className={`language-item ${i18n.language === 'en' ? 'active' : ''}`}
                                >
                                    {t('language.en')}
                                </button>
                                <button 
                                    onClick={() => changeLanguage('tr')} 
                                    className={`language-item ${i18n.language === 'tr' ? 'active' : ''}`}
                                >
                                    {t('language.tr')}
                                </button>
                            </div>
                        )}
                    </div>

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
                                    placeholder={t('navbar.searchUsers')}
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    autoFocus
                                />
                                {searchResults.length > 0 && (
                                    <div className="search-results">
                                        {searchResults.map(user => (
                                            <div 
                                                key={user.id} 
                                                className="search-result-item"
                                                onClick={() => handleUserClick(user.username)}
                                            >
                                                <div className="user-avatar-small">{user.username.substring(0, 2).toUpperCase()}</div>
                                                <span className="username">{user.username}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {searchQuery && searchResults.length === 0 && (
                                    <div className="no-results">
                                        {t('navbar.noUsersFound')}
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
                                        <span>{t('navbar.profile')}</span>
                                    </Link>
                                )}
                                <button onClick={handleLogout} className="dropdown-item logout-item">
                                    <FaSignOutAlt />
                                    <span>{t('navbar.logout')}</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <button className="hamburger-button" onClick={toggleMobileMenu}>
                        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
                {renderNavLinks()}
                {userType !== 'editor' && userType !=='admin' && (
                    <Link 
                        to="/profile" 
                        className="nav-link"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <FaUser />
                        <span>{t('navbar.profile')}</span>
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
                    <span>{t('navbar.logout')}</span>
                </button>
                
                <div className="mobile-language-options">
                    <button 
                        onClick={() => changeLanguage('en')} 
                        className={`mobile-language-item ${i18n.language === 'en' ? 'active' : ''}`}
                    >
                        {t('language.en')}
                    </button>
                    <button 
                        onClick={() => changeLanguage('tr')} 
                        className={`mobile-language-item ${i18n.language === 'tr' ? 'active' : ''}`}
                    >
                        {t('language.tr')}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 