import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Şimdilik sadece yönlendirme yapıyoruz
        navigate('/login');
    };

    return (
        <div className="auth-container">
            <Link to="/" className="home-button">
                ← Back to Main page
            </Link>
            <div className="auth-box">
                <h2>Create Account</h2>
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
                    <button type="submit" className="auth-button">
                        Create
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