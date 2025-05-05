import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeNavbar.css';
import { useTranslation } from 'react-i18next';

const HomeNavbar = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <nav className="home-navbar">
            <div className="home-nav-right">
                <button className="register-button" onClick={() => navigate('/register')}>
                    {t('homeNavbar.register')}
                </button>
                <button className="login-button" onClick={() => navigate('/login')}>
                    {t('homeNavbar.login')}
                </button>
            </div>
        </nav>
    );
};

export default HomeNavbar; 