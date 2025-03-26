import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
            const response = await axios.post('http://localhost:8080/api/auth/login', formData);
            
            if (response.data.success) {
                // Kullanıcı bilgilerini local storage'a kaydet
                localStorage.setItem('userId', response.data.userId);
                localStorage.setItem('userMail', response.data.email);
                localStorage.setItem('userType', response.data.role.toLowerCase());
                localStorage.setItem('isAdmin', response.data.role === 'ADMIN' ? 'true' : 'false');
                
                // Kullanıcı rolüne göre yönlendirme
                if (response.data.role === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed. Please try again.');
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <Link to="/" className="home-button">
                ← Back to Main Page
            </Link>
            <div className="auth-box">
                <h2>Welcome</h2>
                <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Login and Start Now!</p>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit} className="auth-form">
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
                    <div className="forgot-password">
                        <Link to="#">Forgot your password?</Link>
                    </div>
                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="auth-link">
                    Do not have any account? <Link to="/register">Register Free</Link>
                </p>
                
                {/* Test hesapları bölümü geliştirme aşamasında yararlı olabilir */}
                <div className="login-info">
                    <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Test Accounts</p>
                    <div className="test-account">
                        <p><strong>Admin Account:</strong></p>
                        <p>Email: admin@example.com</p>
                        <p>Password: admin123</p>
                    </div>
                    <div className="test-account">
                        <p><strong>Normal User:</strong></p>
                        <p>Email: user@example.com</p>
                        <p>Password: user123</p>
                    </div>
                    <div className="test-account">
                        <p><strong>Editor Account:</strong></p>
                        <p>Email: editor@example.com</p>
                        <p>Password: editor123</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login; 