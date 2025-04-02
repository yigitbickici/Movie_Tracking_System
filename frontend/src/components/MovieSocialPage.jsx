import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MovieSocialPage.css';
import axios from '../services/axiosConfig';

const API_KEY = "84e605aa45ef84282ba934b9b2648dc5";

const MovieSocialPage = () => {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newPost, setNewPost] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [posts, setPosts] = useState([]);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);

    useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            setModalMessage('Lütfen önce giriş yapın');
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
                navigate('/login');
            }, 2000);
            setLoading(false);
            return;
        }

        Promise.all([
            fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-TR`),
            axios.get(`/api/posts/movie/${movieId}`)
        ])
        .then(([movieRes, postsRes]) => 
            Promise.all([movieRes.json(), postsRes.data])
        )
        .then(([movieData, postsData]) => {
            setMovie(movieData);
            setPosts(postsData);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                setModalMessage('Oturum süreniz dolmuş, lütfen tekrar giriş yapın');
                setShowModal(true);
                setTimeout(() => {
                    setShowModal(false);
                    navigate('/login');
                }, 2000);
            } else {
                setModalMessage('Veri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
                setShowModal(true);
                setTimeout(() => setShowModal(false), 2000);
            }
            setLoading(false);
        });
    }, [movieId, navigate]);

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

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!newPost.trim() && !selectedMedia) return;

        const token = localStorage.getItem('token');
        if (!token) {
            setModalMessage('Lütfen önce giriş yapın');
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
                navigate('/login');
            }, 2000);
            return;
        }

        try {
            const response = await axios.post('/api/posts/create', {
                movieId: parseInt(movieId),
                content: newPost
            });
            
            const newPostData = response.data;
            
            setPosts([{
                ...newPostData,
                user: {
                    name: newPostData.user.username,
                    avatar: newPostData.user.avatar || newPostData.user.username.substring(0, 2).toUpperCase(),
                    isFollowing: false
                },
                timestamp: new Date(newPostData.createdAt).toLocaleString(),
                comments: []
            }, ...posts]);
            
            setNewPost('');
            setSelectedMedia(null);
            setMediaPreview(null);
            setModalMessage('Post başarıyla paylaşıldı');
            setShowModal(true);
        
        } catch (error) {
            console.error('Post oluşturma hatası:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                setModalMessage('Oturum süreniz dolmuş, lütfen tekrar giriş yapın');
                setShowModal(true);
                setTimeout(() => {
                    setShowModal(false);
                    navigate('/login');
                }, 2000);
            } else {
                setModalMessage('Post paylaşılırken bir hata oluştu. Lütfen tekrar deneyin.');
                setShowModal(true);
                setTimeout(() => setShowModal(false), 2000);
            }
        }
    };

    const handleLike = async (postId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setModalMessage('Lütfen önce giriş yapın');
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
                navigate('/login');
            }, 2000);
            return;
        }

        try {
            await axios.post(`/api/posts/${postId}/like`);
            setPosts(posts.map(post => 
                post.id === postId ? {...post, likeNum: post.likeNum + 1} : post
            ));
        } catch (error) {
            console.error('Error liking post:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                setModalMessage('Oturum süreniz dolmuş olabilir, lütfen tekrar giriş yapın');
                setShowModal(true);
                setTimeout(() => {
                    setShowModal(false);
                    navigate('/login');
                }, 2000);
            }
        }
    };

    const handleCommentSubmit = async (postId, comment) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setModalMessage('Lütfen önce giriş yapın');
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
                navigate('/login');
            }, 2000);
            return;
        }

        try {
            const response = await axios.post(`/api/posts/${postId}/comments`, 
                { content: comment }
            );
            
            if (response.data) {
                const newComment = response.data;
                
                setPosts(posts.map(post => {
                    if (post.id === postId) {
                        return {
                            ...post,
                            comments: [...post.comments, {
                                ...newComment,
                                user: {
                                    name: newComment.user.username,
                                    avatar: newComment.user.avatar || newComment.user.username.substring(0, 2).toUpperCase(),
                                    isFollowing: false
                                }
                            }],
                            commentNum: post.commentNum + 1
                        };
                    }
                    return post;
                }));
                
                setModalMessage('Yorumunuz başarıyla eklendi');
                setShowModal(true);
                setTimeout(() => setShowModal(false), 2000);
            }
        } catch (error) {
            console.error('Error creating comment:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                setModalMessage('Oturum süreniz dolmuş olabilir, lütfen tekrar giriş yapın');
                setShowModal(true);
                setTimeout(() => {
                    setShowModal(false);
                    navigate('/login');
                }, 2000);
            } else {
                setModalMessage('Yorum yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
                setShowModal(true);
                setTimeout(() => setShowModal(false), 2000);
            }
        }
    };

    const handleFollow = async (postId, userId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setModalMessage('Lütfen önce giriş yapın');
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
                navigate('/login');
            }, 2000);
            return;
        }

        try {
            await axios.post(`/api/profile/follow/${userId}`);
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
        } catch (error) {
            console.error('Error following user:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                setModalMessage('Oturum süreniz dolmuş olabilir, lütfen tekrar giriş yapın');
                setShowModal(true);
                setTimeout(() => {
                    setShowModal(false);
                    navigate('/login');
                }, 2000);
            }
        }
    };

    const handleReportSpoiler = async (postId, commentId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setModalMessage('Lütfen önce giriş yapın');
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
                navigate('/login');
            }, 2000);
            return;
        }

        try {
            if (commentId === null) {
                await axios.post(`/api/spoiler-requests/post/${postId}`);
                setPosts(posts.map(post => {
                    if (postId === post.id) {
                        const newSpoilerState = !post.isSpoiler;
                        setModalMessage(newSpoilerState ? 'İçerik spoiler olarak işaretlendi' : 'Spoiler işareti kaldırıldı');
                        setShowModal(true);
                        setTimeout(() => setShowModal(false), 2000);
                        return { ...post, isSpoiler: newSpoilerState };
                    }
                    return post;
                }));
            } else {
                await axios.post(`/api/spoiler-requests/comment/${commentId}`);
                setPosts(posts.map(post => {
                    if (postId === post.id) {
                        const updatedComments = post.comments.map(comment => {
                            if (comment.id === commentId) {
                                const newSpoilerState = !comment.isSpoiler;
                                setModalMessage(newSpoilerState ? 'Yorum spoiler olarak işaretlendi' : 'Spoiler işareti kaldırıldı');
                                setShowModal(true);
                                setTimeout(() => setShowModal(false), 2000);
                                return { ...comment, isSpoiler: newSpoilerState };
                            }
                            return comment;
                        });
                        return { ...post, comments: updatedComments };
                    }
                    return post;
                }));
            }
        } catch (error) {
            console.error('Error reporting spoiler:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                setModalMessage('Oturum süreniz dolmuş olabilir, lütfen tekrar giriş yapın');
                setShowModal(true);
                setTimeout(() => {
                    setShowModal(false);
                    navigate('/login');
                }, 2000);
            }
        }
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
                                    onClick={() => handleReportSpoiler(post.id)} 
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
                                                onClick={() => handleReportSpoiler(post.id, comment.id)}
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