import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../services/axiosConfig';
import './Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('/api/auth/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            if (response.data) {
                setModalMessage('Registration successful! Please login.');
                setShowModal(true);
                setTimeout(() => {
                    setShowModal(false);
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed. Please try again.');
            console.error('Registration error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <Link to="/" className="home-button">
                ← Back to Main page
            </Link>
            <div className="auth-box">
                <h2>Register</h2>
                {error && <div className="error">{error}</div>}
                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <p>{modalMessage}</p>
                        </div>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-container">
                        <input
                            className="auth-input"
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-container">
                        <input
                            className="auth-input"
                            type="email"
                            name="email"
                            placeholder="E-mail"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-container">
                        <input
                            className="auth-input"
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-container">
                        <input
                            className="auth-input"
                            type="password"
                            name="confirmPassword"
                            placeholder="Re-password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} className="auth-button">
                        {loading ? 'Loading...' : 'Register'}
                    </button>
                </form>
                <p className="auth-link">
                    I only have a account <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register; 