import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaInstagram, FaGithub, FaHeart } from 'react-icons/fa';
import './Footer.css';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section brand-section">
                    <h3>.MOVIARY</h3>
                    <p>{t('footer.tagline')} <img src="https://cdn-icons-png.flaticon.com/512/860/860349.png" alt="" style={{ width: '20px', height: '20px' }} /></p>
                </div>
                <div className="footer-section">
                    <h4>{t('footer.navigation')}</h4>
                    <ul>
                        <li><Link to="/">{t('footer.home')}</Link></li>
                        <li><Link to="/explore">{t('footer.explore')}</Link></li>
                        <li><Link to="/watchlist">{t('footer.watchlist')}</Link></li>
                        <li><Link to="/profile">{t('footer.profile')}</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>{t('footer.connect')}</h4>
                    <div className="social-links">
                        <a href="#" aria-label="Twitter"><FaTwitter /></a>
                        <a href="#" aria-label="Instagram"><FaInstagram /></a>
                        <a href="#" aria-label="Github"><FaGithub /></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>{t('footer.madeIn')}</p>
                <p>{t('footer.copyright')}</p>
            </div>
        </footer>
    );
};

export default Footer; 