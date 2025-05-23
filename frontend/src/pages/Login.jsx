import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from '../services/axiosConfig';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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

        try {
            const response = await axios.post('/api/auth/login', {
                email: formData.email,
                password: formData.password
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', response.data.id);
                localStorage.setItem('userMail', response.data.email);
                localStorage.setItem('userType', response.data.role.toLowerCase());
                localStorage.setItem('isAdmin', response.data.role === 'ADMIN' ? 'true' : 'false');

                setModalMessage(t('login.successMessage'));
                setShowModal(true);
                setTimeout(() => {
                    setShowModal(false);
                    navigate('/explore');
                }, 2000);
            }
        } catch (error) {
            setError(error.response?.data?.message || t('login.error'));
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <Link to="/" className="home-button">
                {t('login.backToMain')}
            </Link>
            <div className="auth-box">
                <h2>{t('login.title')}</h2>
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
                            type="email"
                            name="email"
                            placeholder={t('login.email')}
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
                            placeholder={t('login.password')}
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="forgot-password">
                        <Link to="/forgot-password">{t('login.forgotPassword')}</Link>
                    </div>
                    <button type="submit" disabled={loading} className="auth-button">
                        {loading ? t('login.loading') : t('login.loginButton')}
                    </button>
                </form>
                <p className="auth-link">
                    {t('login.noAccount')} <Link to="/register">{t('login.register')}</Link>
                </p>
            </div>
        </div>
    );
};

export default Login; 