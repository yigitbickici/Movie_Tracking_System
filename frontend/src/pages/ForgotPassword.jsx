import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../services/axiosConfig';
import './Auth.css';

const ForgotPassword = () => {
    const navigate = useNavigate();
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

            setModalMessage('Reset code has been sent to your email');
            setShowModal(true);
            setStep(2);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to send reset code. Please try again.');
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
            setError(error.response?.data?.message || 'Invalid reset code. Please try again.');
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

            setModalMessage('Password has been reset successfully!');
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
                navigate('/login');
            }, 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to reset password. Please try again.');
            console.error('Reset password error:', error);
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
                <h2>Reset Password</h2>
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
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading} className="auth-button">
                            {loading ? 'Sending...' : 'Send Reset Code'}
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
                                placeholder="Enter reset code"
                                value={formData.code}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading} className="auth-button">
                            {loading ? 'Verifying...' : 'Verify Code'}
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
                                placeholder="Enter new password"
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading} className="auth-button">
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                <p className="auth-link">
                    Remember your password? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword; 