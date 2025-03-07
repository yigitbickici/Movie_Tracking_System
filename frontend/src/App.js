import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProfileEdit from './components/ProfileEdit';
import MovieSocialPage from './components/MovieSocialPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Watchlist from './pages/Watchlist';
import AdminDashboard from './pages/AdminDashboard';
import Explore from './pages/Explore';
import HomeNavbar from './components/HomeNavbar';
import SpoilerRequests from './pages/SpoilerRequests';
import './App.css';

const AppLayout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isLoggedIn = localStorage.getItem('userType'); // Kullanıcı girişi kontrolü

  return (
    <div className="app">
      <div className={`app-container ${(isHomePage || isAuthPage) ? 'no-padding' : ''}`}>
        {isHomePage && !isLoggedIn && <HomeNavbar />}
        {isLoggedIn && !isAuthPage && <Navbar />}
        {children}
        {!isAuthPage && <Footer />}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="/movies/:movieId/social" element={<MovieSocialPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/spoiler-requests" element={<SpoilerRequests />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App; 