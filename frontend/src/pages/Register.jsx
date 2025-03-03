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
                ← Anasayfaya Dön
            </Link>
            <div className="auth-box">
                <h2>Hesap Oluştur</h2>
                <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Film dünyasına katıl!</p>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-container">
                        <input
                            className="auth-input"
                            type="text"
                            name="username"
                            placeholder="Kullanıcı Adı"
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
                            placeholder="E-posta"
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
                            placeholder="Şifre"
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
                            placeholder="Şifre Tekrar"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button">
                        Hesap Oluştur
                    </button>
                </form>
                <p className="auth-link">
                    Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
                </p>
            </div>
        </div>
    );
};

export default Register; 