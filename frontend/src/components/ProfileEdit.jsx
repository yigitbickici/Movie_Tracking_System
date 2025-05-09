import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from '../services/axiosConfig';
import './ProfileEdit.css';

const ProfileEdit = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullName: '',
        avatar: '',
        bio: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get('/api/users/profile');
            setFormData({
                ...response.data,
                bio: response.data.bio || ''
            });
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setError(t('profileEdit.error'));
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        try {
            const { username, ...updateData } = formData;
            await axios.put('/api/users/profile', updateData);
            navigate('/profile');
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/profile');
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await axios.post('/api/users/profile/avatar', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.data) {
                    setFormData(prevState => ({
                        ...prevState,
                        avatar: response.data
                    }));
                } else {
                    throw new Error('No URL returned from server');
                }
            } catch (error) {
                console.error('Error uploading avatar:', error);
                setError('Failed to upload avatar');
            }
        }
    };

    const getAvatarUrl = (avatarPath) => {
        if (!avatarPath) return '';
        return avatarPath; // Return the Azure Blob Storage URL directly
    };

    if (isLoading) {
        return <div className="loading">{t('profileEdit.loading')}</div>;
    }

    return (
        <div className="profile-edit-container">
            <h2>{t('profileEdit.title')}</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="profile-edit-form">
                <div className="avatar-section">
                    <div className="current-avatar">
                        {formData.avatar ? (
                            <img 
                                src={getAvatarUrl(formData.avatar)} 
                                alt="Profile" 
                            />
                        ) : (
                            <span>{formData.username.substring(0, 2).toUpperCase()}</span>
                        )}
                    </div>
                    <div className="avatar-upload">
                        <label htmlFor="avatar-input" className="avatar-upload-button">
                            <i className="fas fa-camera"></i>
                            {t('profileEdit.avatar.changePhoto')}
                        </label>
                        <input
                            id="avatar-input"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            hidden
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>{t('profileEdit.fields.username')}</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        disabled
                    />
                </div>

                <div className="form-group">
                    <label>{t('profileEdit.fields.email')}</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>{t('profileEdit.fields.fullName')}</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>{t('profileEdit.fields.about')}</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="4"
                    />
                </div>

                <div className="form-actions">
                    <button type="button" onClick={handleCancel} className="cancel-button">
                        {t('profileEdit.buttons.cancel')}
                    </button>
                    <button type="submit" className="save-button" disabled={isLoading}>
                        {isLoading ? t('profileEdit.buttons.saving') : t('profileEdit.buttons.save')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileEdit; 