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

  useEffect(() => {
    if (searchTerm) {
      fetch(SEARCH_API_URL(searchTerm))
        .then((response) => response.json())
        .then((data) => {
          setMovies(data.results);
          setTotalPages(data.total_pages);
        })
        .catch((error) => console.error("Error:", error));
    } else {
      fetch(API_URL(currentPage))
        .then((response) => response.json())
        .then((data) => {
          setMovies(data.results);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [currentPage, searchTerm]);

  const goToNextPage = () => {
      setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
      setCurrentPage(currentPage - 1);
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

        <div className="movie-list">
          {movies.map(movie => (
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
          <span>{currentPage} / {totalPages}</span>
          <button onClick={goToNextPage} disabled={currentPage === totalPages}>→</button>
        </div>
      </div>
  );
};

export default Explore; 