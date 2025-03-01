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
    const [posts, setPosts] = useState([
        // İlk örnek post
        {
            id: 1,
            user: {
                name: 'USER1',
                avatar: 'https://eu.ui-avatars.com/api/?name=User1'
            },
            content: 'Bu film gerçekten muhteşemdi! Özellikle son sahne...',
            likes: 15,
            comments: [
                {
                    id: 1,
                    user: {
                        name: 'USER2',
                        avatar: 'https://eu.ui-avatars.com/api/?name=User2'
                    },
                    content: 'Kesinlikle katılıyorum!',
                    likes: 3
                }
            ],
            timestamp: '2 saat önce'
        },
        // Yeni eklenen post
        {
            id: 2,
            user: {
                name: 'USER3',
                avatar: 'https://eu.ui-avatars.com/api/?name=User3'
            },
            content: 'Başyapıt 😄',
            media: '/very-nice-nice.gif',  // Local gif'i kullanıyoruz
            likes: 8,
            comments: [
                {
                    id: 1,
                    user: {
                        name: 'USER4',
                        avatar: 'https://eu.ui-avatars.com/api/?name=User4'
                    },
                    content: '👏',
                    likes: 2
                }
            ],
            timestamp: '45 dakika önce'
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
            timestamp: 'Şimdi'
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
                    <div className="error">Film bulunamadı</div>
                    <button onClick={() => navigate(-1)}>Geri Dön</button>
                </div>
            </div>
        );
    }

    return (
        <div className="social-page-overlay">
            <div className="social-page-content">
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
                            placeholder="Bu film hakkında ne düşünüyorsun?"
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
                                    📷 Fotoğraf
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
                            <button type="submit">Paylaş</button>
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
                                    <span className="timestamp">{post.timestamp}</span>
                                </div>
                            </div>
                            <div className="post-content">
                                {post.content}
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
                            </div>
                            <div className="comments-section">
                                {post.comments.map(comment => (
                                    <div key={comment.id} className="comment">
                                        <img src={comment.user.avatar} alt={comment.user.name} className="user-avatar-small" />
                                        <div className="comment-content">
                                            <span className="username">{comment.user.name}</span>
                                            <p>{comment.content}</p>
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
                                        placeholder="Yorum yaz..."
                                    />
                                    <button type="submit">Gönder</button>
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