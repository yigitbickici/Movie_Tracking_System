import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin'); // örnek kontrol
        
        if (!isAdmin) {
            navigate('/login');
            alert('You do not have acces to this page!');
        }
    }, [navigate]);

    const stats = {
        totalUsers: 1250,
        dailyVisitors: 456,
        totalMovies: 2800,
        totalReviews: 4500
    };

    const topMovies = [
        { title: "Inception", favorites: 1200 },
        { title: "The Dark Knight", favorites: 1150 },
        { title: "Pulp Fiction", favorites: 980 },
        { title: "Fight Club", favorites: 950 }
    ];

    const recentComments = [
        { user: "USER1", movie: "Inception", comment: "Wonderful movie!", date: "2024-03-20" },
        { user: "USER2", movie: "The Matrix", comment: "CLASSIC!", date: "2024-03-19" }
    ];

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            
            <div className="stats-container">
                <div className="stat-card">
                    <i className="fas fa-users"></i>
                    <h3>Total User</h3>
                    <p>{stats.totalUsers}</p>
                </div>
                <div className="stat-card">
                    <i className="fas fa-eye"></i>
                    <h3>Daily Visitors</h3>
                    <p>{stats.dailyVisitors}</p>
                </div>
                <div className="stat-card">
                    <i className="fas fa-film"></i>
                    <h3>Total Movies</h3>
                    <p>{stats.totalMovies}</p>
                </div>
                <div className="stat-card">
                    <i className="fas fa-comments"></i>
                    <h3>Total Reviews</h3>
                    <p>{stats.totalReviews}</p>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h2>Top Favorited Movies</h2>
                    <ul className="top-movies-list">
                        {topMovies.map((movie, index) => (
                            <li key={index}>
                                <span>{movie.title}</span>
                                <span>{movie.favorites} favori</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="dashboard-card">
                    <h2>Recent comments</h2>
                    <div className="recent-comments">
                        {recentComments.map((comment, index) => (
                            <div key={index} className="comment-card">
                                <div className="comment-header">
                                    <span className="comment-user">{comment.user}</span>
                                    <span className="comment-date">{comment.date}</span>
                                </div>
                                <p className="comment-movie">Film: {comment.movie}</p>
                                <p className="comment-text">{comment.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 