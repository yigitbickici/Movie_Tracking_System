import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import backgroundVideo from '../assets/videos/movie-background.mp4';
import { FaFilm, FaUserFriends, FaStar, FaMobileAlt, FaTabletAlt, FaLaptop, FaDesktop } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('userType');

  React.useEffect(() => {
    if (isLoggedIn) {
      navigate('/explore');
    }
  }, [isLoggedIn, navigate]);

  const handleExplore = () => {
    navigate('/login');
  };

  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="video-background">
          <video autoPlay loop muted playsInline>
            <source src={backgroundVideo} type="video/mp4" />
          </video>
          <div className="overlay"></div>
        </div>
        <div className="hero-content">
          <h1>Meeting Point for Movie Enthusiasts</h1>
          <p className="hero-subtitle">Thousands of movies, unlimited experiences</p>
          <div className="subscription-box">
            <h2>Join Now</h2>
            <div className="email-input-container">
              <input type="email" placeholder="Your email" />
              <button onClick={handleExplore}>Start</button>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Why .Moviary?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FaFilm className="feature-icon" />
            <h3>Wide Movie Collection</h3>
            <p>From classics to modern blockbusters, thousands of movies</p>
          </div>
          <div className="feature-card">
            <FaUserFriends className="feature-icon" />
            <h3>Social Interaction</h3>
            <p>Meet and discuss movies with fellow enthusiasts</p>
          </div>
          <div className="feature-card">
            <FaStar className="feature-icon" />
            <h3>Personalized Recommendations</h3>
            <p>Customized movie recommendations based on your preferences</p>
          </div>
        </div>
      </section>

      <section className="devices-section">
        <div className="devices-content">
          <h2>Use .Moviary Everywhere</h2>
          <p>Connect to the movie world on any device, anytime</p>
          <div className="device-frames">
            <div className="device-item">
              <FaMobileAlt className="device-icon" />
              <span>Phone</span>
            </div>
            <div className="device-item">
              <FaTabletAlt className="device-icon" />
              <span>Tablet</span>
            </div>
            <div className="device-item">
              <FaLaptop className="device-icon" />
              <span>Desktop</span>
            </div>
            <div className="device-item">
              <FaDesktop className="device-icon" />
              <span>Desktop</span>
            </div>
          </div>
        </div>
      </section>

      <section className="collection-section">
        <div className="collection-content">
          <div className="collection-logo">
            <h2>.Moviary</h2>
            <p className="tagline">The new way to track movies</p>
          </div>
          <div className="collection-text">
            <h2>CULT CLASSICS TO MODERN BLOCKBUSTERS<br />
                THE BEST MOVIES OF ALL TIME<br />
                FROM EVERYWHERE IN THE WORLD</h2>
          </div>
          <button className="cta-button" onClick={handleExplore}>Benefit for Free</button>
        </div>
      </section>
    </div>
  );
};

export default Home;
