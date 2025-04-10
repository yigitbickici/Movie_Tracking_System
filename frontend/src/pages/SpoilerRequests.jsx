import React, { useState } from 'react';
import './SpoilerRequests.css';

const SpoilerRequests = () => {
    const [requests, setRequests] = useState([
        {
            id: 1,
            movieId: 27205,
            movieTitle: "Inception",
            postId: 1,
            postContent: "In the end, the totem keeps spinning which means...",
            reportedBy: "Yiğit Bıçkıcı",
            timestamp: "2 hours ago",
            status: "pending",
            poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg"
        },
        {
            id: 2,
            movieId: 155,
            movieTitle: "The Dark Knight",
            postId: 2,
            postContent: "When Harvey Dent becomes Two-Face...",
            reportedBy: "Emircan Çapkan",
            timestamp: "5 hours ago",
            status: "pending",
            poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
        }
    ]);

    const handleApprove = (requestId) => {
        setRequests(requests.map(request => 
            request.id === requestId 
                ? {...request, status: 'approved'}
                : request
        ));
    };

    const handleReject = (requestId) => {
        setRequests(requests.map(request => 
            request.id === requestId 
                ? {...request, status: 'rejected'}
                : request
        ));
    };

    return (
        <div className="spoiler-requests-container">
            <h1>Spoiler Reports</h1>
            <div className="requests-list">
                {requests.map(request => (
                    <div key={request.id} className={`request-card ${request.status}`}>
                        <div className="request-content-wrapper">
                            <div className="movie-poster">
                                <img 
                                    src={`https://image.tmdb.org/t/p/w200${request.poster_path}`}
                                    alt={request.movieTitle}
                                />
                            </div>
                            <div className="request-details">
                                <div className="request-header">
                                    <h3>{request.movieTitle}</h3>
                                    <span className="timestamp">{request.timestamp}</span>
                                </div>
                                <div className="request-content">
                                    <p className="post-content">{request.postContent}</p>
                                    <p className="reported-by">Reported by: {request.reportedBy}</p>
                                </div>
                                {request.status === 'pending' && (
                                    <div className="request-actions">
                                        <button 
                                            className="approve-button"
                                            onClick={() => handleApprove(request.id)}
                                        >
                                            Mark as Spoiler
                                        </button>
                                        <button 
                                            className="reject-button"
                                            onClick={() => handleReject(request.id)}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                                {request.status !== 'pending' && (
                                    <div className="request-status">
                                        Status: {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SpoilerRequests; 