import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
    console.log('App component rendering'); // Debug log
    
    return (
        <Router>
            <Routes>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/" element={<Navigate to="/admin" replace />} />
            </Routes>
        </Router>
    );
};

export default App; 