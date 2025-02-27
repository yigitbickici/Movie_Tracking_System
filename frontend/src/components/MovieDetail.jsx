import React from 'react';
import './MovieDetail.css';

const MovieDetail = ({ movie, onClose }) => {
    if (!movie) return null;

    // Convert runtime to hours and minutes
    const formatRuntime = (minutes) => {
        if (!minutes) return '';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}s ${mins}dk`;
    };

    return (
        <div className="movie-detail-overlay">
            <div className="movie-detail-content">
                <button className="close-button" onClick={onClose}>×</button>
                <div className="movie-detail-header">
                    <img 
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                        alt={movie.title} 
                        className="detail-poster"
                    />
                    <div className="movie-detail-info">
                        <h1>{movie.title}</h1>
                        <p className="original-title">{movie.original_title}</p>
                        <div className="movie-meta">
                            <span>{movie.release_date.split("-")[0]}</span>
                            <span>⭐ {movie.vote_average}</span>
                            {movie.runtime && <span>⏱️ {formatRuntime(movie.runtime)}</span>}
                        </div>
                        <p className="overview">{movie.overview}</p>
                        
                        {/* Add providers section */}
                        {movie.providers && (
                            <div className="providers-section">
                                <h3>Mevcut Platformlar(Türkiye):</h3>
                                <div className="providers-list">
                                    {(!movie.providers.flatrate && !movie.providers.rent && !movie.providers.buy) ? (
                                        <div className="no-providers">
                                            <span className="sad-face">😔</span>
                                            <p>Henüz Türkiye'de izleme seçeneği mevcut değil.</p>
                                        </div>
                                    ) : (
                                        <>
                                            {movie.providers.flatrate && (
                                                <div className="provider-category">
                                                    <h4>Abonelik</h4>
                                                    <div className="provider-items">
                                                        {movie.providers.flatrate.map(provider => (
                                                            <div key={provider.provider_id} className="provider-item">
                                                                <img 
                                                                    src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                                                    alt={provider.provider_name}
                                                                    title={provider.provider_name}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {movie.providers.rent && (
                                                <div className="provider-category">
                                                    <h4>Kiralama</h4>
                                                    <div className="provider-items">
                                                        {movie.providers.rent.map(provider => (
                                                            <div key={provider.provider_id} className="provider-item">
                                                                <img 
                                                                    src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                                                    alt={provider.provider_name}
                                                                    title={provider.provider_name}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {movie.providers.buy && (
                                                <div className="provider-category">
                                                    <h4>Satın Alma</h4>
                                                    <div className="provider-items">
                                                        {movie.providers.buy.map(provider => (
                                                            <div key={provider.provider_id} className="provider-item">
                                                                <img 
                                                                    src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                                                    alt={provider.provider_name}
                                                                    title={provider.provider_name}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Cast section */}
                        {movie.cast && (
                            <div className="cast-section">
                                <h3>Oyuncular:</h3>
                                <div className="cast-list">
                                    {movie.cast.map(actor => (
                                        <div key={actor.id} className="cast-item">
                                            {actor.profile_path ? (
                                                <img 
                                                    src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                                    alt={actor.name}
                                                    className="cast-photo"
                                                />
                                            ) : (
                                                <div className="cast-photo-placeholder">
                                                    👤
                                                </div>
                                            )}
                                            <p className="cast-name">{actor.name}</p>
                                            <p className="cast-character">{actor.character}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <button className="detail-add-button" onClick={() => console.log("Film listeye eklendi:", movie.title)}>
                            + ADD TO MY LIST
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetail; 