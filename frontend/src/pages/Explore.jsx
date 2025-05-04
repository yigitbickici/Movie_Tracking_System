import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import MovieDetail from "../components/MovieDetail";
import './Explore.css';

const API_KEY = "84e605aa45ef84282ba934b9b2648dc5";
const API_URL = (page) => `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-TR&page=${page}`;
const SEARCH_API_URL = (query) => `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-TR&query=${query}`;

const Explore = () => {
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(500);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('year'); // Default sorting by year
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0); // Progress state for loading bar
    const [loadedPages, setLoadedPages] = useState(0); // Track number of loaded pages

    useEffect(() => {
        const fetchAllMovies = async () => {
            try {
                setLoading(true);
                setProgress(0);
                setLoadedPages(0);
                const TOTAL_PAGES = 500;
                const pageNumbers = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);

                const allResults = await Promise.all(
                    pageNumbers.map((page, index) =>
                        fetch(API_URL(page))
                            .then(res => res.json())
                            .then(data => {
                                const newLoaded = index + 1;
                                setLoadedPages(newLoaded);
                                const newProgress = Math.floor((newLoaded / TOTAL_PAGES) * 100);
                                setProgress(newProgress);
                                return data.results || [];
                            })
                    )
                );

                const allMovies = allResults.flat();

                // Remove duplicate movies based on ID
                const uniqueMoviesMap = new Map();
                allMovies.forEach(movie => uniqueMoviesMap.set(movie.id, movie));
                const uniqueMovies = Array.from(uniqueMoviesMap.values());

                sortMovies(uniqueMovies, sortBy);
            } catch (error) {
                console.error("Error fetching all 500 pages:", error);
            } finally {
                setLoading(false);
                setProgress(100);
            }
        };

        if (searchTerm) {
            fetch(SEARCH_API_URL(searchTerm))
                .then((response) => response.json())
                .then((data) => {
                    sortMovies(data.results, sortBy);
                    setTotalPages(data.total_pages);
                })
                .catch((error) => console.error("Error:", error));
        } else {
            fetchAllMovies();
        }
    }, [searchTerm]);

    // Sorting function
    const sortMovies = (moviesToSort, sortingOption) => {
        let sortedMovies = [...moviesToSort];

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

        setMovies(sortedMovies);
    };

    const handleSortChange = (sortOption) => {
        setSortBy(sortOption);
        sortMovies(movies, sortOption);
    };

    const goToNextPage = () => {
        setCurrentPage(prev => prev + 1);
    };

    const goToPrevPage = () => {
        setCurrentPage(prev => prev - 1);
    };

    const handleMovieClick = (movie) => {
        Promise.all([
            fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&language=en-TR`),
            fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${API_KEY}&language=en-TR`),
            fetch(`https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${API_KEY}`)
        ])
            .then(([detailsRes, creditsRes, providersRes]) =>
                Promise.all([detailsRes.json(), creditsRes.json(), providersRes.json()])
            )
            .then(([detailedMovie, credits, providers]) => {
                setSelectedMovie({
                    ...movie,
                    ...detailedMovie,
                    tmdbId: movie.id,
                    overview: detailedMovie.overview,
                    vote_average: detailedMovie.vote_average,
                    original_title: detailedMovie.original_title,
                    runtime: detailedMovie.runtime,
                    cast: credits.cast.slice(0, 5),
                    providers: providers.results.TR || {}
                });
            })
            .catch(error => console.error("Error fetching movie details:", error));
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
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
        }
    };

    // Sayfaya göre slice'la
    const moviesPerPage = 20;
    const startIndex = (currentPage - 1) * moviesPerPage;
    const currentMovies = movies.slice(startIndex, startIndex + moviesPerPage);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-content">
                    <h2>Loading Movies...</h2>
                    <div className="progress-bar-container">
                        <div
                            className="progress-bar"
                            style={{ width: `${progress}%` }}
                        >
                            <span className="progress-text">{progress}%</span>
                        </div>
                    </div>
                    <p className="progress-info">Please wait while we fetch all movies...</p>
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
                        placeholder="Search the movies..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>

                <div className="categories-container">
                    <button className={`category-button ${selectedCategory === 'all' ? 'active' : ''}`} onClick={() => handleCategoryClick('all')}>
                        All
                    </button>
                    <button className={`category-button ${selectedCategory === 'action' ? 'active' : ''}`} onClick={() => handleCategoryClick('action')}>
                        Action
                    </button>
                    <button className={`category-button ${selectedCategory === 'drama' ? 'active' : ''}`} onClick={() => handleCategoryClick('drama')}>
                        Drama
                    </button>
                    <button className={`category-button ${selectedCategory === 'comedy' ? 'active' : ''}`} onClick={() => handleCategoryClick('comedy')}>
                        Comedy
                    </button>
                    <button className={`category-button ${selectedCategory === 'horror' ? 'active' : ''}`} onClick={() => handleCategoryClick('horror')}>
                        Horror
                    </button>
                    <button className={`category-button ${selectedCategory === 'sci-fi' ? 'active' : ''}`} onClick={() => handleCategoryClick('sci-fi')}>
                        Sci-Fi
                    </button>
                </div>
            </header>

            <div className="sort-options">
                <span>Sort by: </span>
                <button className={`sort-button ${sortBy === 'az' ? 'active' : ''}`} onClick={() => handleSortChange('az')}>A to Z</button>
                <button className={`sort-button ${sortBy === 'za' ? 'active' : ''}`} onClick={() => handleSortChange('za')}>Z to A</button>
                <button className={`sort-button ${sortBy === 'rating' ? 'active' : ''}`} onClick={() => handleSortChange('rating')}>Top Rated</button>
                <button className={`sort-button ${sortBy === 'year-asc' ? 'active' : ''}`} onClick={() => handleSortChange('year-asc')}>Oldest First</button>
                <button className={`sort-button ${sortBy === 'year-desc' ? 'active' : ''}`} onClick={() => handleSortChange('year-desc')}>Newest First</button>
            </div>

            <div className="movie-list">
                {currentMovies.map(movie => (
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
                <span>{currentPage} / {Math.ceil(movies.length / moviesPerPage)}</span>
                <button onClick={goToNextPage} disabled={currentPage === Math.ceil(movies.length / moviesPerPage)}>→</button>
            </div>
        </div>
    );
};

export default Explore;