import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import ProfileEdit from './components/ProfileEdit';
import UserProfile from './pages/UserProfile';
import './App.css';

function App() {
    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/movies" element={<Home />} />
                    <Route path="/explore" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/edit" element={<ProfileEdit />} />
                    <Route path="/user/:username" element={<UserProfile />} />
                </Routes>
                <Navbar />
            </div>
        </Router>
    );
}

export default App; 