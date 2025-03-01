import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h4>About Us</h4>
                    <p>Your movie tracking companion</p>
                </div>
                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/watchlist">My Watchlist</Link></li>
                        <li><Link to="/explore">Explore</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Connect</h4>
                    <div className="social-links">
                        <a href="#"><i className="fab fa-twitter"></i></a>
                        <a href="#"><i className="fab fa-instagram"></i></a>
                        <a href="#"><i className="fab fa-github"></i></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 Your App Name. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer; 