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
        
        // Admin kontrolü
        if (formData.email === 'admin@example.com' && formData.password === 'admin123') {
            localStorage.setItem('isAdmin', 'true');
            localStorage.setItem('userType', 'admin');
            localStorage.setItem('userName', 'Admin');
            navigate('/admin');
        }
        // Normal kullanıcı kontrolü
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
            <div className="auth-box">
                <h2>Login</h2>
                <form onSubmit={handleSubmit} lang='en'>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button">
                        LOGIN
                    </button>
                </form>
                <p className="auth-link">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
                <div className="login-info">
                    <p>Test Hesapları:</p>
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
            </div>
        </div>
    );
};

export default Login; 