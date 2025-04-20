import React, { useState, useEffect } from 'react';
import axios from '../services/axiosConfig';
import './SpoilerRequests.css';

const SpoilerRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSpoilerRequests();
    }, []);

    const fetchSpoilerRequests = async () => {
        try {
            const response = await axios.get('/api/spoiler-requests');
            setRequests(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading spoiler requests:', error);
            setError('Spoiler requests could not be loaded');
            setLoading(false);
        }
    };

    const handleApprove = async (requestId) => {
        try {
            await axios.post(`/api/spoiler-requests/${requestId}/approve`);
            setRequests(requests.map(request => 
                request.id === requestId 
                    ? {...request, status: 'APPROVED'}
                    : request
            ));
        } catch (error) {
            console.error('Error while approving spoiler:', error);
        }
    };

    const handleReject = async (requestId) => {
        try {
            await axios.post(`/api/spoiler-requests/${requestId}/reject`);
            setRequests(requests.map(request => 
                request.id === requestId 
                    ? {...request, status: 'REJECTED'}
                    : request
            ));
        } catch (error) {
            console.error('Error while denying spoiler:', error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="spoiler-requests-container">
            <h1>Spoiler Notifications</h1>
            <div className="requests-list">
                {requests.map((request, index) => {
                    console.log(`[${index}] Spoiler Request:`, request);
                    console.log(`Post content: ${request.post?.content}`);
                    console.log(`Poster path: ${request.post?.movie?.posterPath}`);
                    console.log(`Request Type: ${request.type}`);
    
                    return (
                        <div key={request.id} className={`request-card ${request.status.toLowerCase()}`}>
                            <div className="request-content-wrapper">
                                <div className="movie-poster">
                                    <img 
                                        src={`https://image.tmdb.org/t/p/w200${request.post?.movie?.posterPath}`}
                                        alt={request.post?.movie?.title}
                                    />
                                </div>
                                <div className="request-details">
                                    <div className="request-header">
                                        <h3>{request.post?.movie?.title}</h3>
                                        <span className="timestamp">
                                            {new Date(request.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="request-content">
                                        <p className="post-content">
                                            {request.type === 'POST' ? request.post?.content : request.comment?.content}
                                        </p>
                                        <p className="reported-by">
                                            Reporter: {request.requestedByUser?.username}
                                        </p>
                                    </div>
                                    {request.status === 'PENDING' && (
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
                                                Decline
                                            </button>
                                        </div>
                                    )}
                                    {request.status !== 'PENDING' && (
                                        <div className="request-status">
                                            Status: {request.status === 'APPROVED' ? 'Onaylandı' : 'Reddedildi'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );    
};

export default SpoilerRequests; 