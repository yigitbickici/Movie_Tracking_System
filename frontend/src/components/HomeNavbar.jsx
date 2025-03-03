import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeNavbar.css';

const HomeNavbar = () => {
    const navigate = useNavigate();

    return (
        <nav className="home-navbar">
            <div className="home-nav-right">
                <button className="login-button" onClick={() => navigate('/login')}>
                    Giriş Yap
                </button>
            </div>
        </nav>
    );
};

export default HomeNavbar; 