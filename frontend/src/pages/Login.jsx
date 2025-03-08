import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (formData.email === 'admin@example.com' && formData.password === 'admin123') {
            localStorage.setItem('isAdmin', 'true');
            localStorage.setItem('userType', 'admin');
            localStorage.setItem('userName', 'Admin');
            navigate('/admin');
        }
        else if (formData.email === 'user@example.com' && formData.password === 'user123') {
            localStorage.setItem('isAdmin', 'false');
            localStorage.setItem('userType', 'user');
            localStorage.setItem('userName', 'User1');
            navigate('/');
        } 
        else if (formData.email === 'editor@example.com' && formData.password === 'editor123') {
            localStorage.setItem('isAdmin', 'false');
            localStorage.setItem('userType', 'editor');
            localStorage.setItem('userName', 'Editor');
            navigate('/');
        }else {
            alert('Invalid email or password!');
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
                    <button type="submit" className="auth-button">
                        Login
                    </button>
                </form>
                <p className="auth-link">
                    Do not have any account? <Link to="/register">Register Free</Link>
                </p>
                
                {/*
                <div className="login-info">
                    <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Test Hesapları</p>
                    <div className="test-account">
                        <p><strong>Admin Hesabı:</strong></p>
                        <p>Email: admin@example.com</p>
                        <p>Şifre: admin123</p>
                    </div>
                    <div className="test-account">
                        <p><strong>Normal Kullanıcı:</strong></p>
                        <p>Email: user@example.com</p>
                        <p>Şifre: user123</p>
                    </div>
                </div>
                */}

            </div>
        </div>
    );
};

export default Login; 