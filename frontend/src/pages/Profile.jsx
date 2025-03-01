import React from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom';


const Profile = () => {
    const userStats = {
        following: 0,
        followers: 0,
        comments: 0,
        movieTime: {
            months: 0,
            days: 0,
            hours: 0
        },
        moviesWatched: 0,
        tvTime: {
            months: 0,
            days: 0,
            hours: 0
        },
        episodesWatched: 0
    };

    const navigate = useNavigate();
    
    const handleEditClick = () => {
        navigate('/profile/edit');
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-info">
                    <div className="profile-avatar">
                        <img src="https://eu.ui-avatars.com/api/?name=John+Doe&size=250" alt="Profile" />
                    </div>
                    <div className="profile-username">
                        <h2>USER1</h2>
                        <button className="edit-profile-btn" onClick={handleEditClick}>EDIT</button>
                    </div>
                </div>

                <div className="profile-stats">
                    <div className="stat-item">
                        <span className="stat-number">{userStats.following}</span>
                        <span className="stat-label">following</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{userStats.followers}</span>
                        <span className="stat-label">follower</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{userStats.comments}</span>
                        <span className="stat-label">comments</span>
                    </div>
                </div>
            </div>

            <section className="stats-section">
                <h3>Stats</h3>
                <div className="stats-grid">
                    <div className="stat-card">
                        <h4>Movie time</h4>
                        <div className="time-stats">
                            <div className="time-stat">
                                <span>{userStats.movieTime.months}</span>
                                <label>MONTHS</label>
                            </div>
                            <div className="time-stat">
                                <span>{userStats.movieTime.days}</span>
                                <label>DAYS</label>
                            </div>
                            <div className="time-stat">
                                <span>{userStats.movieTime.hours}</span>
                                <label>HOURS</label>
                            </div>
                        </div>
                    </div>
                
                    <div className="stat-card">
                        <h4>Movies watched</h4>
                        <div className="single-stat">{userStats.moviesWatched}</div>
                    </div>
                </div>
            </section>

       

            <section className="movies-section">
                <h3>Movies</h3>
                <div className="add-shows">
                    <button className="add-movies-btn">
                        NO MOVIES
                    </button>
                </div>
            </section>

            <section className="favorite-movies-section">
                <h3>Favorite movies</h3>
                <div className="add-favorite-movies">
                    <button className="add-favorite-movies-btn">
                        NO MOVIES
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Profile; 