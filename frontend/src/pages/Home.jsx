import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('userType');

  React.useEffect(() => {
    // Eğer kullanıcı giriş yapmışsa, explore sayfasına yönlendir
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
        <div className="hero-content">
          <h1>SENİ BAŞKA DÜNYALARA GÖTÜRECEK</h1>
          <div className="subscription-box">
            <h2>İlk 7 Gün Ücretsiz</h2>
            <div className="email-input-container">
              <input type="email" placeholder="E-posta adresi" />
              <button onClick={handleExplore}>BAŞLA</button>
            </div>
            <p className="subscription-note">7 günün sonunda ödemeye başla. Dilediğin zaman iptal et.</p>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="feature-container">
          <div className="feature-text">
            <h2>TÜM FİLMLERİ İZLE YA DA İNDİR,<br />NE ZAMAN İSTERSEN. TÜM<br />EKRAN VE CİHAZLARDA, NEREDE<br />İSTERSEN.</h2>
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
            <h2>PROJE ADI</h2>
          </div>
          <div className="collection-text">
            <h2>KÜLT KLASİKLERDEN MODERN BAŞYAPITLARA.<br />
                GELMİŞ GEÇMİŞ EN BÜYÜK SİNEMACILARDAN,<br />
                GÜNÜMÜZÜN EN İYİ YÖNETMENLERİNE.<br />
                DÜNYANIN HER KÖŞESİNDEN FİLMLER.</h2>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
