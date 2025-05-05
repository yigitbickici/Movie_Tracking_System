import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Users.css';
import { FaUsers, FaChevronRight, FaSearch } from 'react-icons/fa';
import axios from '../services/axiosConfig';
import { useTranslation } from 'react-i18next';

const Users = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const userType = localStorage.getItem('userType');
        if (userType !== 'editor') {
            navigate('/login');
            alert(t('users.noPermission'));
        }
    }, [navigate, t]);

    const [users, setUsers] = useState([]);

    const fetchUsers = () => {
        axios.get('/api/editor/all-users')
            .then(res => {
                const updatedUsers = res.data.map(user => ({
                    ...user,
                    isBanned: user.banReason !== null
                }));
                setUsers(updatedUsers);
            })
            .catch(err => console.error("Error while retrieving users:", err));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [banModal, setBanModal] = useState({
        isOpen: false,
        userId: null,
        isBanned: false
    });

    const banReasons = [
        t('banReasons.unsuitable'),
        t('banReasons.spam'),
        t('banReasons.hateSpeech'),
        t('banReasons.fakeAccount'),
        t('banReasons.other')
    ];

    const handleBanUser = async (userId, reason) => {
        try {
            await axios.post(`/api/editor/ban/${userId}`, { reason });
            fetchUsers();
            setBanModal({ isOpen: false, userId: null, isBanned: false });
        } catch (error) {
            console.error("Ban failed:", error);
            alert(t('users.banError'));
        }
    };

    const handleUnbanUser = async (userId) => {
        try {
            await axios.put(`/api/editor/unban/${userId}`);
            fetchUsers();
        } catch (error) {
            console.error("Unban failed:", error);
            alert(t('users.unbanError'));
        }
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const UserCard = ({ user }) => (
        <div className="user-card">
            <div className="user-info-section" onClick={() => navigate(`/UserProfile/${user.username}`)}>
                <div className="user-avatar">
                    {getInitials(user.username)}
                </div>
                <div className="user-info">
                    <h4>{user.username}</h4>
                    <div className="user-stats">
                        <span>{user.movieCount} {t('users.movie')}</span>
                        <span> • </span>
                        <span>{user.commentCount} {t('users.comment')}</span>
                    </div>
                    <div className="user-join-date">
                        {t('users.joined')} {new Date(user.joinDate).toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US')}
                    </div>
                    {user.isBanned && (
                        <div className="ban-reason">
                            {t('users.banReason')} {user.banReason}
                        </div>
                    )}
                </div>
            </div>
            <div className="user-actions">
                {user.isBanned ? (
                    <button
                        className="unban-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleUnbanUser(user.id);
                        }}
                    >
                        {t('users.unbanAction')}
                    </button>
                ) : (
                    <button
                        className="ban-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setBanModal({ isOpen: true, userId: user.id });
                        }}
                    >
                        {t('users.banAction')}
                    </button>
                )}
            </div>
        </div>
    );

    const BanModal = () => {
        const [selectedReason, setSelectedReason] = useState('');
        const [customReason, setCustomReason] = useState('');

        return (
            <div className={`ban-modal-overlay ${banModal.isOpen ? 'active' : ''}`}>
                <div className="ban-modal-content">
                    <h3>{t('users.banUser')}</h3>
                    <div className="ban-form">
                        <select
                            value={selectedReason}
                            onChange={(e) => setSelectedReason(e.target.value)}
                            className="ban-reason-select"
                        >
                            <option value="">{t('users.selectReason')}</option>
                            {banReasons.map((reason, index) => (
                                <option key={index} value={reason}>{reason}</option>
                            ))}
                        </select>
                        {selectedReason === t('banReasons.other') && (
                            <textarea
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                placeholder={t('users.writeReason')}
                                className="custom-reason-input"
                            />
                        )}
                    </div>
                    <div className="ban-modal-buttons">
                        <button
                            className="ban-modal-button cancel"
                            onClick={() => setBanModal({ isOpen: false, userId: null })}
                        >
                            {t('users.cancel')}
                        </button>
                        <button
                            className="ban-modal-button confirm"
                            onClick={() => handleBanUser(banModal.userId,
                                selectedReason === t('banReasons.other') ? customReason : selectedReason)}
                            disabled={!selectedReason}
                        >
                            {t('users.banAction')}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="users-page">
            <div className="users-header">
                <h1>
                    <FaUsers className="header-icon" />
                    {t('users.title')}
                </h1>
                <div className="search-container">
                    <div className="search-input-wrapper">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder={t('users.searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>
            </div>
            <div className="users-grid">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                        <UserCard key={user.id} user={user} />
                    ))
                ) : (
                    <div className="no-results">
                        <p>{t('users.noResults')}</p>
                    </div>
                )}
            </div>
            <BanModal />
        </div>
    );
};

export default Users;
