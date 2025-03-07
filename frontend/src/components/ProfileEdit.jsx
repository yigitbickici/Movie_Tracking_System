import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileEdit.css';

const ProfileEdit = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: 'JohnDoe', 
        email: 'john@example.com',
        fullName: 'John Doe',
        avatar: 'https://eu.ui-avatars.com/api/?name=John+Doe&size=250',
        bio: 'Bir Film Tutkunu.',
        favoriteGenres: ['Aksiyon', 'Bilim Kurgu']
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        console.log('Form sent:', formData);
        navigate('/profile'); 
    };

    const handleCancel = () => {
        navigate('/profile');
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prevState => ({
                    ...prevState,
                    avatar: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="profile-edit-container">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit} className="profile-edit-form">
                <div className="avatar-section">
                    <div className="current-avatar">
                        {formData.avatar.includes('http') ? (
                            <img 
                                src={formData.avatar} 
                                alt="Profile" 
                                className="current-avatar"
                            />
                        ) : (
                            <span>{formData.username.substring(0, 2).toUpperCase()}</span>
                        )}
                    </div>
                    <div className="avatar-upload">
                        <label htmlFor="avatar-input" className="avatar-upload-button">
                            <i className="fas fa-camera"></i>
                            Change Photo
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
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>E-Mail</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>About</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="4"
                    />
                </div>

                <div className="form-actions">
                    <button type="button" onClick={handleCancel} className="cancel-button">
                        Cancel
                    </button>
                    <button type="submit" className="save-button">
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileEdit; 