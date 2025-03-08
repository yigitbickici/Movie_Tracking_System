import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MovieSocialPage.css';

const API_KEY = "84e605aa45ef84282ba934b9b2648dc5";

const MovieSocialPage = () => {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newPost, setNewPost] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [posts, setPosts] = useState([
        // İlk örnek post
        {
            id: 1,
            user: {
                name: 'USER1',
                avatar: 'https://eu.ui-avatars.com/api/?name=User1',
                isFollowing: false
            },
            content: 'Movie was wonderful.Especially last scene...',
            likes: 15,
            isSpoiler: false,
            comments: [
                {
                    id: 1,
                    user: {
                        name: 'USER2',
                        avatar: 'https://eu.ui-avatars.com/api/?name=User2',
                        isFollowing: false
                    },
                    content: 'Agreed!',
                    likes: 3,
                    isSpoiler: false
                }
            ],
            timestamp: '2 hour ago'
        },
        {
            id: 2,
            user: {
                name: 'USER3',
                avatar: 'https://eu.ui-avatars.com/api/?name=User3',
                isFollowing: false
            },
            content: 'Masterpiece 😄',
            media: '/very-nice-nice.gif',  // Local gif'i kullanıyoruz
            likes: 8,
            comments: [
                {
                    id: 1,
                    user: {
                        name: 'USER4',
                        avatar: 'https://eu.ui-avatars.com/api/?name=User4',
                        isFollowing: false
                    },
                    content: '👏',
                    likes: 2
                }
            ],
            timestamp: '45 min ago'
        }
    ]);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-TR`)
            .then(response => response.json())
            .then(data => {
                setMovie(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                setLoading(false);
            });
    }, [movieId]);

    const handleMediaSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedMedia(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setMediaPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePostSubmit = (e) => {
        e.preventDefault();
        if (!newPost.trim() && !selectedMedia) return;

        const newPostObj = {
            id: posts.length + 1,
            user: {
                name: 'USER1',
                avatar: 'https://eu.ui-avatars.com/api/?name=User1'
            },
            content: newPost,
            media: mediaPreview,
            likes: 0,
            comments: [],
            timestamp: 'Now'
        };

        setPosts([newPostObj, ...posts]);
        setNewPost('');
        setSelectedMedia(null);
        setMediaPreview(null);
    };

    const handleLike = (postId) => {
        setPosts(posts.map(post => 
            post.id === postId ? {...post, likes: post.likes + 1} : post
        ));
    };

    const handleCommentSubmit = (postId, comment) => {
        setPosts(posts.map(post => {
            if (post.id === postId) {
                const newComment = {
                    id: post.comments.length + 1,
                    user: {
                        name: 'USER1',
                        avatar: 'https://eu.ui-avatars.com/api/?name=User1'
                    },
                    content: comment,
                    likes: 0
                };
                return {
                    ...post,
                    comments: [...post.comments, newComment]
                };
            }
            return post;
        }));
    };

    const handleFollow = (postId, userId) => {
        setPosts(posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    user: {
                        ...post.user,
                        isFollowing: !post.user.isFollowing
                    }
                };
            }
            return post;
        }));
    };

    const handleSpoilerReport = (postId, commentId = null) => {
        setPosts(posts.map(post => {
            if (postId === post.id) {
                if (commentId === null) {
                    // Post için spoiler işaretleme
                    const newSpoilerState = !post.isSpoiler;
                    setModalMessage(newSpoilerState ? 'Content marked as spoiler' : 'Spoiler removed');
                    setShowModal(true);
                    setTimeout(() => setShowModal(false), 2000);
                    return { ...post, isSpoiler: newSpoilerState };
                } else {
                    // Yorum için spoiler işaretleme
                    const updatedComments = post.comments.map(comment => {
                        if (comment.id === commentId) {
                            const newSpoilerState = !comment.isSpoiler;
                            setModalMessage(newSpoilerState ? 'Comment marked as spoiler' : 'Spoiler removed from comment');
                            setShowModal(true);
                            setTimeout(() => setShowModal(false), 2000);
                            return { ...comment, isSpoiler: newSpoilerState };
                        }
                        return comment;
                    });
                    return { ...post, comments: updatedComments };
                }
            }
            return post;
        }));
    };

    if (loading) {
        return (
            <div className="social-page-overlay">
                <div className="social-page-content">
                    <div className="loading">Loading...</div>
                </div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="social-page-overlay">
                <div className="social-page-content">
                    <div className="error">Movie not found</div>
                    <button onClick={() => navigate(-1)}>Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="social-page-overlay">
            <div className="social-page-content">
                {showModal && (
                    <div className="spoiler-modal">
                        <div className="spoiler-modal-content">
                            <span className="modal-icon">ℹ️</span>
                            {modalMessage}
                        </div>
                    </div>
                )}
                <button className="close-button" onClick={() => navigate(-1)}>×</button>
                
                <div className="movie-header">
                    <img 
                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
                        alt={movie.title} 
                        className="movie-mini-poster"
                    />
                    <div className="movie-title-section">
                        <h2>{movie.title}</h2>
                        <p>{movie.release_date?.split('-')[0]}</p>
                    </div>
                </div>

                <div className="create-post-section">
                    <form onSubmit={handlePostSubmit}>
                        <textarea
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            placeholder="What you think?"
                        />
                        
                        {mediaPreview && (
                            <div className="media-preview">
                                <img src={mediaPreview} alt="Preview" />
                                <button 
                                    type="button" 
                                    className="remove-media"
                                    onClick={() => {
                                        setSelectedMedia(null);
                                        setMediaPreview(null);
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        )}
                        
                        <div className="post-actions-row">
                            <div className="media-upload-buttons">
                                <label className="media-upload-button">
                                    <input
                                        type="file"
                                        accept="image/*,image/gif"
                                        onChange={handleMediaSelect}
                                        style={{ display: 'none' }}
                                    />
                                    📷 Photo
                                </label>
                                <label className="media-upload-button">
                                    <input
                                        type="file"
                                        accept="image/gif"
                                        onChange={handleMediaSelect}
                                        style={{ display: 'none' }}
                                    />
                                    🎭 GIF
                                </label>
                            </div>
                            <button type="submit">Share</button>
                        </div>
                    </form>
                </div>

                <div className="posts-section">
                    {posts.map(post => (
                        <div key={post.id} className="post">
                            <div className="post-header">
                                <img src={post.user.avatar} alt={post.user.name} className="user-avatar" />
                                <div className="post-info">
                                    <span className="username">{post.user.name}</span>
                                    <button 
                                        className={`follow-button ${post.user.isFollowing ? 'following' : ''}`}
                                        onClick={() => handleFollow(post.id, post.user.name)}
                                    >
                                        {post.user.isFollowing ? '✓ Following' : '+ Follow'}
                                    </button>
                                    <span className="timestamp">{post.timestamp}</span>
                                </div>
                            </div>
                            <div className="post-content">
                                {post.isSpoiler ? (
                                    <div className="spoiler-warning">
                                        ⚠️ This post may contain spoilers
                                    </div>
                                ) : post.content}
                                {post.media && (
                                    <div className="post-media">
                                        <img src={post.media} alt="Post media" />
                                    </div>
                                )}
                            </div>
                            <div className="post-actions">
                                <button onClick={() => handleLike(post.id)}>
                                    ❤️ {post.likes}
                                </button>
                                <button>💬 {post.comments.length}</button>
                                <button 
                                    onClick={() => handleSpoilerReport(post.id)} 
                                    className={`spoiler-button ${post.isSpoiler ? 'active' : ''}`}
                                >
                                    {post.isSpoiler ? '✓ Spoiler' : '🚫 Spoiler'}
                                </button>
                            </div>
                            <div className="comments-section">
                                {post.comments.map(comment => (
                                    <div key={comment.id} className="comment">
                                        <img src={comment.user.avatar} alt={comment.user.name} className="user-avatar-small" />
                                        <div className="comment-content">
                                            <span className="username">{comment.user.name}</span>
                                            {comment.isSpoiler ? (
                                                <div className="spoiler-warning">
                                                    ⚠️ Bu yorum spoiler içerebilir
                                                </div>
                                            ) : (
                                                <p>{comment.content}</p>
                                            )}
                                            <button 
                                                onClick={() => handleSpoilerReport(post.id, comment.id)}
                                                className={`spoiler-button-small ${comment.isSpoiler ? 'active' : ''}`}
                                            >
                                                {comment.isSpoiler ? '✓ Spoiler' : '🚫 Spoiler'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const comment = e.target.comment.value;
                                    if (comment.trim()) {
                                        handleCommentSubmit(post.id, comment);
                                        e.target.comment.value = '';
                                    }
                                }}>
                                    <input
                                        type="text"
                                        name="comment"
                                        placeholder="Write a comment..."
                                    />
                                    <button type="submit">Send</button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MovieSocialPage; 