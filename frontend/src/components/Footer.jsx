import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaInstagram, FaGithub, FaHeart } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section brand-section">
                    <h3>.MOVIARY</h3>
                    <p>Your best movie tracking companion ❤️</p>
                </div>
                <div className="footer-section">
                    <h4>Navigation</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/explore">Explore</Link></li>
                        <li><Link to="/watchlist">Watchlist</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Connect</h4>
                    <div className="social-links">
                        <a href="#" aria-label="Twitter"><FaTwitter /></a>
                        <a href="#" aria-label="Instagram"><FaInstagram /></a>
                        <a href="#" aria-label="Github"><FaGithub /></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>Made in Türkiye</p>
                <p>&copy; 2024 .MOVIARY - All rights reserved</p>
            </div>
        </footer>
    );
};

export default Footer; 