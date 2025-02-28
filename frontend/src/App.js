import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import ProfileEdit from './components/ProfileEdit';
import MovieSocialPage from './components/MovieSocialPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Home />} />
          <Route path="/explore" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="/movies/:movieId/social" element={<MovieSocialPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 