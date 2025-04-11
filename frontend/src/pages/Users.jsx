import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Users.css';
import { FaUsers, FaChevronRight, FaSearch } from 'react-icons/fa';
import axios from '../services/axiosConfig';

const Users = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const userType = localStorage.getItem('userType');
        if (userType !== 'editor') {
            navigate('/login');
            alert('Bu sayfaya erişim yetkiniz bulunmamaktadır!');
        }
    }, [navigate]);

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
            .catch(err => console.error("Kullanıcılar alınırken hata oluştu:", err));
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
        "Unsuitable content sharing",
        "Spam/Advertising",
        "Hate speech/Insult",
        "Fake account",
        "Other"
    ];

    const handleBanUser = async (userId, reason) => {
        try {
            await axios.post(`/api/editor/ban/${userId}`, { reason });
            fetchUsers();
            setBanModal({ isOpen: false, userId: null, isBanned: false });
        } catch (error) {
            console.error("Ban işlemi başarısız:", error);
            alert("Ban işlemi sırasında bir hata oluştu.");
        }
    };

    const handleUnbanUser = async (userId) => {
        try {
            await axios.put(`/api/editor/unban/${userId}`);
            fetchUsers();
        } catch (error) {
            console.error("Unban işlemi başarısız:", error);
            alert("Unban işlemi sırasında bir hata oluştu.");
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
                        <span>{user.movieCount} movie</span>
                        <span> • </span>
                        <span>{user.commentCount} comment</span>
                    </div>
                    <div className="user-join-date">
                        Joined: {new Date(user.joinDate).toLocaleDateString('tr-TR')}
                    </div>
                    {user.isBanned && (
                        <div className="ban-reason">
                            Reason: {user.banReason}
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
                        Unban
                    </button>
                ) : (
                    <button
                        className="ban-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setBanModal({ isOpen: true, userId: user.id });
                        }}
                    >
                        Ban
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
                    <h3>Ban User</h3>
                    <div className="ban-form">
                        <select
                            value={selectedReason}
                            onChange={(e) => setSelectedReason(e.target.value)}
                            className="ban-reason-select"
                        >
                            <option value="">Select the reason for the ban</option>
                            {banReasons.map((reason, index) => (
                                <option key={index} value={reason}>{reason}</option>
                            ))}
                        </select>
                        {selectedReason === "Other" && (
                            <textarea
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                placeholder="Write the reason for the ban..."
                                className="custom-reason-input"
                            />
                        )}
                    </div>
                    <div className="ban-modal-buttons">
                        <button
                            className="ban-modal-button cancel"
                            onClick={() => setBanModal({ isOpen: false, userId: null })}
                        >
                            Cancel
                        </button>
                        <button
                            className="ban-modal-button confirm"
                            onClick={() => handleBanUser(banModal.userId,
                                selectedReason === "Other" ? customReason : selectedReason)}
                            disabled={!selectedReason}
                        >
                            Ban
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
                    User Management
                </h1>
                <div className="search-container">
                    <div className="search-input-wrapper">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search for a user..."
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
                        <p>User not found</p>
                    </div>
                )}
            </div>
            <BanModal />
        </div>
    );
};

export default Users;
