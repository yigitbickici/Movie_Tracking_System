import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Home.css';
import backgroundVideo from '../assets/videos/movie-background.mp4';
import { FaFilm, FaUserFriends, FaStar, FaMobileAlt, FaTabletAlt, FaLaptop, FaDesktop } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('userType');
  const { t } = useTranslation();

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
          <h1>{t('home.hero.title')}</h1>
          <p className="hero-subtitle">{t('home.hero.subtitle')}</p>
          <div className="subscription-box">
            <h2>{t('home.hero.joinNow')}</h2>
            <div className="email-input-container">
              <input type="email" placeholder={t('home.hero.emailPlaceholder')} />
              <button onClick={handleExplore}>{t('home.hero.start')}</button>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">{t('home.features.title')}</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FaFilm className="feature-icon" />
            <h3>{t('home.features.wideCollection.title')}</h3>
            <p>{t('home.features.wideCollection.description')}</p>
          </div>
          <div className="feature-card">
            <FaUserFriends className="feature-icon" />
            <h3>{t('home.features.socialInteraction.title')}</h3>
            <p>{t('home.features.socialInteraction.description')}</p>
          </div>
          <div className="feature-card">
            <FaStar className="feature-icon" />
            <h3>{t('home.features.recommendations.title')}</h3>
            <p>{t('home.features.recommendations.description')}</p>
          </div>
        </div>
      </section>

      <section className="devices-section">
        <div className="devices-content">
          <h2>{t('home.devices.title')}</h2>
          <p>{t('home.devices.subtitle')}</p>
          <div className="device-frames">
            <div className="device-item">
              <FaMobileAlt className="device-icon" />
              <span>{t('home.devices.phone')}</span>
            </div>
            <div className="device-item">
              <FaTabletAlt className="device-icon" />
              <span>{t('home.devices.tablet')}</span>
            </div>
            <div className="device-item">
              <FaLaptop className="device-icon" />
              <span>{t('home.devices.laptop')}</span>
            </div>
            <div className="device-item">
              <FaDesktop className="device-icon" />
              <span>{t('home.devices.desktop')}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="collection-section">
        <div className="collection-content">
          <div className="collection-logo">
            <h2>.Moviary</h2>
            <p className="tagline">{t('home.collection.tagline')}</p>
          </div>
          <div className="collection-text">
            <h2>{t('home.collection.headline')}</h2>
          </div>
          <button className="cta-button" onClick={handleExplore}>{t('home.collection.cta')}</button>
        </div>
      </section>
    </div>
  );
};

export default Home;
