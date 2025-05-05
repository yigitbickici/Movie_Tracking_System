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
    const [revealedSpoilers, setRevealedSpoilers] = useState(new Set());
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        console.log('User ID from localStorage:', userId);
        
        if (userId) {
            setCurrentUserId(userId);
            console.log('Current User ID set to:', userId);
        } else {
            console.log('No user ID found in localStorage');
        }

        if (!token) {
            setModalMessage('Please login first');
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
                navigate('/login');
            }, 2000);
            setLoading(false);
            return;
        }

        const cleanMovieId = movieId.split('/')[0];

        Promise.all([
            fetch(`https://api.themoviedb.org/3/movie/${cleanMovieId}?api_key=${API_KEY}&language=en-TR`),
            axios.get(`/api/posts/movie/${cleanMovieId}`)
        ])
        .then(([movieRes, postsRes]) => 
            Promise.all([movieRes.json(), postsRes.data])
        )
        .then(([movieData, postsData]) => {
            console.log('Posts data from API:', postsData);
            setMovie(movieData);
            
            // Ensure postsData is an array
            const postsArray = Array.isArray(postsData) ? postsData : [];
            
            // Process posts data with proper error handling
            const postsWithLikeStatus = postsArray.map(post => {
                try {
                    console.log('Processing post:', post);
                    return {
                        ...post,
                        user: {
                            ...post.user,
                            name: post.user?.username || 'Unknown User',
                            avatar: post.user?.avatar || null
                        },
                        isLiked: false, // Default value, will be updated
                        likeNum: post.likeNum || 0,
                        commentNum: post.commentNum || 0,
                        comments: Array.isArray(post.comments) ? post.comments : []
                    };
                } catch (error) {
                    console.error('Error processing post:', error, post);
                    return null;
                }
            }).filter(post => post !== null); // Remove any null posts
            
            setPosts(postsWithLikeStatus);
            
            // Fetch like status for all posts at once
            const likeStatusPromises = postsWithLikeStatus.map(post => 
                axios.get(`/api/posts/${post.id}/like-status`)
                    .then(response => ({ postId: post.id, isLiked: response.data.liked }))
                    .catch(error => {
                        console.error(`Error fetching like status for post ${post.id}:`, error);
                        return { postId: post.id, isLiked: false };
                    })
            );
            
            Promise.all(likeStatusPromises)
                .then(likeStatuses => {
                    setPosts(prevPosts => 
                        prevPosts.map(post => {
                            const likeStatus = likeStatuses.find(status => status.postId === post.id);
                            return likeStatus 
                                ? { ...post, isLiked: likeStatus.isLiked } 
                                : post;
                        })
                    );
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching like statuses:', error);
                    setLoading(false);
                });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                setModalMessage('Your session has expired, please log in again.');
                setShowModal(true);
                setTimeout(() => {
                    setShowModal(false);
                    navigate('/login');
                }, 2000);
            } else {
                setModalMessage('An error occurred while loading data. Please try again.');
                setShowModal(true);
                setTimeout(() => setShowModal(false), 2000);
            }
            setLoading(false);
        });
    }, [movieId, navigate]);

    const handleMediaSelect = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await axios.post('/api/posts/upload-media', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.data && response.data.url) {
                    setSelectedMedia(file);
                    setMediaPreview(response.data.url);
                } else {
                    throw new Error('No URL returned from server');
                }
            } catch (error) {
                console.error('Error uploading media:', error);
                setModalMessage('Failed to upload media');
                setShowModal(true);
                setTimeout(() => setShowModal(false), 2000);
            }
        }
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!newPost.trim() && !mediaPreview) return;

        const token = localStorage.getItem('token');
        if (!token) {
            setModalMessage('Please login first');
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
                navigate('/login');
            }, 2000);
            return;
        }

        try {
            const cleanMovieId = movieId.split('/')[0];

            const postData = {
                movieId: parseInt(cleanMovieId),
                content: newPost,
                mediaUrl: mediaPreview // Add the Azure Blob Storage URL
            };

            console.log('Sending post data:', postData); // Debug log

            const response = await axios.post('/api/posts/create', postData);

            if (response.status === 200) {
                const newPostData = response.data;
                console.log('New post data from API:', newPostData);

                setPosts([{
                    ...newPostData,
                    isSpoiler: newPostData.isSpoiler,
                    spoilerPending: newPostData.spoilerPending,
                    spoilerReviewed: newPostData.spoilerReviewed,
                    likeNum: 0,
                    commentNum: 0,
                    comments: [],
                    isLiked: false,
                    mediaUrl: newPostData.mediaUrl, // Make sure to include mediaUrl
                    user: {
                        ...newPostData.user,
                        name: newPostData.user.username,
                        avatar: newPostData.user.avatarUrl || newPostData.user.username.substring(0, 2).toUpperCase()
                    }
                }, ...posts]);
                
                setNewPost('');
                setSelectedMedia(null);
                setMediaPreview(null);
            }
        } catch (error) {
            console.error('Error creating post:', error);
            if (error.response) {
                if (error.response.status === 401) {
                    setModalMessage('Your session has expired. Please log in again.');
                    setShowModal(true);
                    setTimeout(() => {
                        setShowModal(false);
                        navigate('/login');
                    }, 2000);
                } else {
                    setModalMessage('An error occurred while creating the post: ' + error.response.data);
                    setShowModal(true);
                }
            } else {
                setModalMessage('An error occurred while creating the post. Please try again.');
                setShowModal(true);
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
            const response = await axios.post(`/api/posts/${postId}/like`);
            const isLiked = response.data.liked;
            
            setPosts(prevPosts => prevPosts.map(post => 
                post.id === postId ? {
                    ...post, 
                    isLiked: isLiked,
                    likeNum: isLiked ? (post.likeNum || 0) + 1 : Math.max(0, (post.likeNum || 0) - 1)
                } : post
            ));
        } catch (error) {
            console.error('Error toggling like:', error);
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
            const response = await axios.post(`/api/posts/${postId}/comments`, { content: comment });

            if (response.data) {
                const newComment = response.data;

                setPosts(posts.map(post => {
                    if (post.id === postId) {
                        return {
                            ...post,
                            comments: [...post.comments, {
                                ...newComment,
                                isSpoiler: newComment.isSpoiler,
                                spoilerPending: newComment.spoilerPending,
                                spoilerReviewed: newComment.spoilerReviewed,
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
        console.log("Sending spoiler request with token:", localStorage.getItem('token'));
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

    const toggleSpoilerContent = (id) => {
        setRevealedSpoilers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleUserClick = (username) => {
        navigate(`/UserProfile/${username}`);
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm('Are you sure you want to delete this post?')) {
            return;
        }

        try {
            const response = await axios.delete(`/api/posts/${postId}`);
            if (response.status === 200) {
                setPosts(posts.filter(post => post.id !== postId));
                setModalMessage('Post is successfully deleted');
                setShowModal(true);
                setTimeout(() => setShowModal(false), 2000);
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            setModalMessage('Error deleting post');
            setShowModal(true);
            setTimeout(() => setShowModal(false), 2000);
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
                                <img 
                                    src={post.user.avatar || `https://ui-avatars.com/api/?name=${post.user.username}&background=random`} 
                                    alt={post.user.username} 
                                    className="user-avatar"
                                    onClick={() => handleUserClick(post.user.username)}
                                    style={{ cursor: 'pointer' }}
                                />
                                <div className="post-info">
                                    <span 
                                        className="username"
                                        onClick={() => handleUserClick(post.user.username)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {post.user.username}
                                    </span>
                                    {parseInt(post.user.id) !== parseInt(currentUserId) && (
                                        <button 
                                            className={`follow-button ${post.user.isFollowing ? 'following' : ''}`}
                                            onClick={() => handleFollow(post.id, post.user.id)}
                                        >
                                            {post.user.isFollowing ? '✓ Following' : '+ Follow'}
                                        </button>
                                    )}
                                    {parseInt(post.user.id) === parseInt(currentUserId) && (
                                        <button 
                                            className="delete-icon"
                                            onClick={() => handleDeletePost(post.id)}
                                            title="Delete post"
                                        >
                                            🗑️
                                        </button>
                                    )}
                                    <span className="timestamp">{new Date(post.createdAt).toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="post-content">
                                {post.isSpoiler ? (
                                    <>
                                        <div 
                                            className="spoiler-warning"
                                            onClick={() => toggleSpoilerContent(post.id)}
                                        >
                                            ⚠️ Bu gönderi spoiler içerebilir
                                        </div>
                                        <div 
                                            className={`spoiler-content ${revealedSpoilers.has(post.id) ? 'revealed' : ''}`}
                                            onClick={() => !revealedSpoilers.has(post.id) && toggleSpoilerContent(post.id)}
                                        >
                                            {post.content}
                                        </div>
                                    </>
                                ) : (
                                    post.content
                                )}
                                {post.mediaUrl && (
                                    <div className="post-media">
                                        <img src={post.mediaUrl} alt="Post media" />
                                    </div>
                                )}
                            </div>
                            <div className="post-actions">
                                <button 
                                    onClick={() => handleLike(post.id)}
                                    className={`like-button ${post.isLiked ? 'liked' : ''}`}
                                >
                                    {post.isLiked ? '❤️' : '🤍'} {post.likeNum}
                                </button>
                                <button>💬 {post.commentNum}</button>
                                {!post.spoilerReviewed && !post.spoilerPending && (
                                    <button
                                        onClick={() => handleReportSpoiler(post.id, null)}
                                        className={`spoiler-button ${post.isSpoiler ? 'active' : ''}`}
                                    >
                                        {post.isSpoiler ? '✓ Spoiler' : '🚫 Spoiler'}
                                    </button>
                                )}
                                {post.spoilerReviewed && (
                                    <div className="spoiler-reviewed-label">
                                        🛑 Editör tarafından incelendi
                                    </div>
                                )}
                            </div>
                            <div className="comments-section">
                                {post.comments.map(comment => (
                                    <div key={comment.id} className="comment">
                                        <img 
                                            src={comment.user.avatar || `https://ui-avatars.com/api/?name=${comment.user.username}&background=random`} 
                                            alt={comment.user.username} 
                                            className="user-avatar-small"
                                            onClick={() => handleUserClick(comment.user.username)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                        <div className="comment-content">
                                            <span 
                                                className="username"
                                                onClick={() => handleUserClick(comment.user.username)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {comment.user.username}
                                            </span>
                                            {comment.isSpoiler ? (
                                                // Yorum spoiler onaylandı
                                                <>
                                                    <div className="spoiler-warning" onClick={() => toggleSpoilerContent(`comment-${comment.id}`)}>
                                                        ⚠️ Bu yorum spoiler içerebilir
                                                    </div>
                                                    <div className={`spoiler-content ${revealedSpoilers.has(`comment-${comment.id}`) ? 'revealed' : ''}`}
                                                         onClick={() => !revealedSpoilers.has(`comment-${comment.id}`) && toggleSpoilerContent(`comment-${comment.id}`)}>
                                                        {comment.content}
                                                    </div>
                                                </>
                                            ) : comment.spoilerPending ? (
                                                // Yorum kullanıcı tarafından spoiler olarak işaretlendi, editör onayı bekliyor
                                                <div className="pending-warning">
                                                    📬 Bu yorumu spoiler olarak işaretlediniz. Editör'e isteğiniz gönderildi.
                                                </div>
                                            ) : (
                                                // Normal yorum
                                                <p>{comment.content}</p>
                                            )}
                                            {!comment.spoilerReviewed && !comment.spoilerPending && (
                                                <button
                                                    onClick={() => handleReportSpoiler(post.id, comment.id)}
                                                    className={`spoiler-button-small ${comment.isSpoiler ? 'active' : ''}`}
                                                >
                                                    {comment.isSpoiler ? '✓ Spoiler' : '🚫 Spoiler'}
                                                </button>
                                            )}
                                        </div>
                                        {comment.spoilerReviewed && (
                                            <div className="spoiler-reviewed-label">
                                                🛑 Editör tarafından incelendi
                                            </div>
                                        )}
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