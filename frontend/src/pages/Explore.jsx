import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import MovieCard from "../components/MovieCard";
import MovieDetail from "../components/MovieDetail";
import './Explore.css';

const API_KEY = "84e605aa45ef84282ba934b9b2648dc5";

const Explore = () => {
    const { t, i18n } = useTranslation();
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(500);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('year');
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loadedPages, setLoadedPages] = useState(0);
    const [genres, setGenres] = useState([]);

    const getApiLanguage = () => {
        return i18n.language === 'tr' ? 'tr-TR' : 'en-US';
    };

    const getApiUrl = (page) => 
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=${getApiLanguage()}&page=${page}`;
    
    const getSearchApiUrl = (query) => 
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=${getApiLanguage()}&query=${query}`;
    
    const getGenresApiUrl = () => 
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=${getApiLanguage()}`;
    
    const getDiscoverApiUrl = (page, genreId) => 
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=${getApiLanguage()}&sort_by=popularity.desc&page=${page}&with_genres=${genreId}`;

    useEffect(() => {
        fetch(getGenresApiUrl())
            .then(res => res.json())
            .then(data => setGenres(data.genres))
            .catch(error => console.error("Error fetching genres:", error));
    }, [i18n.language]);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                let url;
                if (searchTerm) {
                    url = getSearchApiUrl(searchTerm);
                } else if (selectedCategory !== 'all') {
                    url = getDiscoverApiUrl(currentPage, selectedCategory);
                } else {
                    url = getApiUrl(currentPage);
                }
                
                const response = await fetch(url);
                const data = await response.json();
                
                const moviesWithGenreNames = data.results.map(movie => ({
                    ...movie,
                    genreNames: movie.genre_ids.map(id =>
                        genres.find(genre => genre.id === id)?.name || 'Unknown'
                    )
                }));

                setMovies(moviesWithGenreNames);
                setFilteredMovies(moviesWithGenreNames);
                setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
            } catch (error) {
                console.error("Error fetching movies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [currentPage, searchTerm, selectedCategory, genres, i18n.language]);

    const filterAndSortMovies = (moviesToFilter, sortingOption) => {
        let sortedMovies = [...moviesToFilter];

        switch (sortingOption) {
            case 'az':
                sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'za':
                sortedMovies.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'rating':
                sortedMovies.sort((a, b) => b.vote_average - a.vote_average);
                break;
            case 'year-asc':
                sortedMovies.sort((a, b) => {
                    const yearA = a.release_date ? parseInt(a.release_date.split('-')[0]) : 0;
                    const yearB = b.release_date ? parseInt(b.release_date.split('-')[0]) : 0;
                    return yearA - yearB;
                });
                break;
            case 'year-desc':
                sortedMovies.sort((a, b) => {
                    const yearA = a.release_date ? parseInt(a.release_date.split('-')[0]) : 0;
                    const yearB = b.release_date ? parseInt(b.release_date.split('-')[0]) : 0;
                    return yearB - yearA;
                });
                break;
            default:
                sortedMovies.sort((a, b) => {
                    const yearA = a.release_date ? parseInt(a.release_date.split('-')[0]) : 0;
                    const yearB = b.release_date ? parseInt(b.release_date.split('-')[0]) : 0;
                    return yearA - yearB;
                });
        }

        setFilteredMovies(sortedMovies);
    };

    const handleSortChange = (sortOption) => {
        setSortBy(sortOption);
        filterAndSortMovies(movies, sortOption);
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        filterAndSortMovies(movies, sortBy);
        setCurrentPage(1);
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleMovieClick = (movie) => {
        Promise.all([
            fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&language=${getApiLanguage()}`),
            fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${API_KEY}&language=${getApiLanguage()}`),
            fetch(`https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${API_KEY}`)
        ])
            .then(([detailsRes, creditsRes, providersRes]) =>
                Promise.all([detailsRes.json(), creditsRes.json(), providersRes.json()])
            )
            .then(([detailedMovie, credits, providers]) => {
                const countryCode = i18n.language === 'tr' ? 'TR' : 'US';
                
                setSelectedMovie({
                    ...movie,
                    ...detailedMovie,
                    tmdbId: movie.id,
                    overview: detailedMovie.overview,
                    vote_average: detailedMovie.vote_average,
                    original_title: detailedMovie.original_title,
                    runtime: detailedMovie.runtime,
                    cast: credits.cast.slice(0, 5),
                    providers: providers.results[countryCode] || {}
                });
            })
            .catch(error => console.error("Error fetching movie details:", error));
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleWatchlistUpdate = (movieId, isAdded) => {
        if (isAdded) {
            setMovies(prev => prev.map(movie =>
                movie.id === movieId ? { ...movie, isInWatchlist: true } : movie
            ));
            setFilteredMovies(prev => prev.map(movie =>
                movie.id === movieId ? { ...movie, isInWatchlist: true } : movie
            ));
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-content">
                    <h2>{t('explore.loading.title')}</h2>
                    <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: '100%' }}>
                            <span className="progress-text">{t('explore.loading.progress')}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="explore">
            <header className="explore-header">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder={t('explore.searchPlaceholder')}
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>

                <div className="categories-container">
                    <button 
                        className={`category-button ${selectedCategory === 'all' ? 'active' : ''}`} 
                        onClick={() => handleCategoryClick('all')}
                    >
                        {t('explore.categories.all')}
                    </button>
                    {genres.slice(0, 6).map(genre => (
                        <button
                            key={genre.id}
                            className={`category-button ${selectedCategory === genre.id ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(genre.id)}
                        >
                            {genre.name}
                        </button>
                    ))}
                </div>
            </header>

            <div className="sort-options">
                <span>{t('explore.sort.sortBy')}</span>
                <button className={`sort-button ${sortBy === 'az' ? 'active' : ''}`} onClick={() => handleSortChange('az')}>{t('explore.sort.az')}</button>
                <button className={`sort-button ${sortBy === 'za' ? 'active' : ''}`} onClick={() => handleSortChange('za')}>{t('explore.sort.za')}</button>
                <button className={`sort-button ${sortBy === 'rating' ? 'active' : ''}`} onClick={() => handleSortChange('rating')}>{t('explore.sort.topRated')}</button>
                <button className={`sort-button ${sortBy === 'year-asc' ? 'active' : ''}`} onClick={() => handleSortChange('year-asc')}>{t('explore.sort.oldestFirst')}</button>
                <button className={`sort-button ${sortBy === 'year-desc' ? 'active' : ''}`} onClick={() => handleSortChange('year-desc')}>{t('explore.sort.newestFirst')}</button>
            </div>

            <div className="movie-list">
                {filteredMovies.map(movie => (
                    <MovieCard
                        key={movie.id}
                        movie={movie}
                        onClick={() => handleMovieClick(movie)}
                        isGridView={true}
                    />
                ))}
            </div>

            {selectedMovie && (
                <MovieDetail
                    movie={selectedMovie}
                    onClose={() => setSelectedMovie(null)}
                    isInList={false}
                    onWatchlistUpdate={handleWatchlistUpdate}
                />
            )}

            <div className="pagination">
                <button onClick={goToPrevPage} disabled={currentPage === 1}>←</button>
                <span>{currentPage}{t('explore.pagination.of')}{totalPages}</span>
                <button onClick={goToNextPage} disabled={currentPage === totalPages}>→</button>
            </div>
        </div>
    );
};

export default Explore;