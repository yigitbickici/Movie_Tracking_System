import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import backgroundVideo from '../assets/videos/movie-background.mp4';

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
          <h1>Join the Community</h1>
          <div className="subscription-box">
            <h2>Register Now</h2>
            <div className="email-input-container">
              <input type="email" placeholder="E-mail address" />
              <button onClick={handleExplore}>Start</button>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="feature-container">
          <div className="feature-text">
            <h2>Take your place among movie enthusiasts.</h2>
          </div>
          <div className="device-frames">
            <div className="device phone"></div>
            <div className="device tablet"></div>
            <div className="device laptop"></div>
            <div className="device desktop"></div>
          </div>
        </div>
      </section>

      <section className="collection-section">
        <div className="collection-content">
          <div className="collection-logo">
            <h2>.MOVIARY</h2>
          </div>
          <div className="collection-text">
            <h2>FROM CULT CLASSICS TO MODERN MASTERPIECES.<br />
              ONE OF THE GREATEST FILMS EVER<br />
                MOVIES FROM EVERYWHERE.</h2>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
