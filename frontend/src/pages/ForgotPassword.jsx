import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from '../services/axiosConfig';
import './Auth.css';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        code: '',
        newPassword: ''
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

    const handleRequestCode = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axios.post('/api/auth/forgot-password/request', null, {
                params: { email: formData.email }
            });

            setModalMessage(t('forgotPassword.messages.codeSent'));
            setShowModal(true);
            setStep(2);
        } catch (error) {
            setError(error.response?.data?.message || t('forgotPassword.errors.codeSendFailed'));
            console.error('Request code error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axios.post('/api/auth/forgot-password/verify', null, {
                params: {
                    email: formData.email,
                    code: formData.code
                }
            });

            setStep(3);
        } catch (error) {
            setError(error.response?.data?.message || t('forgotPassword.errors.invalidCode'));
            console.error('Verify code error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axios.post('/api/auth/forgot-password/reset', null, {
                params: {
                    email: formData.email,
                    code: formData.code,
                    newPassword: formData.newPassword
                }
            });

            setModalMessage(t('forgotPassword.messages.passwordReset'));
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
                navigate('/login');
            }, 3000);
        } catch (error) {
            setError(error.response?.data?.message || t('forgotPassword.errors.resetFailed'));
            console.error('Reset password error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <Link to="/" className="home-button">
                {t('forgotPassword.backToMain')}
            </Link>
            <div className="auth-box">
                <h2>{t('forgotPassword.title')}</h2>
                {error && <div className="error">{error}</div>}
                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <p>{modalMessage}</p>
                        </div>
                    </div>
                )}
                
                {step === 1 && (
                    <form onSubmit={handleRequestCode} className="auth-form">
                        <div className="input-container">
                            <input
                                className="auth-input"
                                type="email"
                                name="email"
                                placeholder={t('forgotPassword.step1.emailPlaceholder')}
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading} className="auth-button">
                            {loading ? t('forgotPassword.step1.sendingButton') : t('forgotPassword.step1.sendButton')}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyCode} className="auth-form">
                        <div className="input-container">
                            <input
                                className="auth-input"
                                type="text"
                                name="code"
                                placeholder={t('forgotPassword.step2.codePlaceholder')}
                                value={formData.code}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading} className="auth-button">
                            {loading ? t('forgotPassword.step2.verifyingButton') : t('forgotPassword.step2.verifyButton')}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="auth-form">
                        <div className="input-container">
                            <input
                                className="auth-input"
                                type="password"
                                name="newPassword"
                                placeholder={t('forgotPassword.step3.passwordPlaceholder')}
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading} className="auth-button">
                            {loading ? t('forgotPassword.step3.resettingButton') : t('forgotPassword.step3.resetButton')}
                        </button>
                    </form>
                )}

                <p className="auth-link">
                    {t('forgotPassword.rememberPassword')} <Link to="/login">{t('forgotPassword.login')}</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword; 