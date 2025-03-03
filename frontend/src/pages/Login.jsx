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
        } else {
            alert('Geçersiz email veya şifre!');
        }
    };

    return (
        <div className="auth-container">
            <Link to="/" className="home-button">
                ← Anasayfaya Dön
            </Link>
            <div className="auth-box">
                <h2>Hoş Geldin</h2>
                <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Giriş yap ve izlemeye başla!</p>
                <form onSubmit={handleSubmit} className="auth-form">
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
                    <div className="forgot-password">
                        <Link to="/forgot-password">Şifreni mi unuttun?</Link>
                    </div>
                    <button type="submit" className="auth-button">
                        Giriş
                    </button>
                </form>
                <p className="auth-link">
                    Bir hesabın yok mu? <Link to="/register">Ücretsiz Hesap Oluştur</Link>
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