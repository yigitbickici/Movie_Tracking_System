import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import MovieDetail from "../components/MovieDetail";
import './Explore.css';

const API_KEY = "84e605aa45ef84282ba934b9b2648dc5";

const API_URL = (page) => `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-TR&page=${page}`;

const Explore = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetch(API_URL(currentPage))
        .then((response) => response.json())
        .then((data) => {
          setMovies(data.results);
          setTotalPages(data.total_pages);
        })
        .catch((error) => console.error("Hata:", error));
  }, [currentPage]);

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

  return (
      <div className="explore">
        <header className="explore-header">
          <h1>Filmleri Keşfet</h1>
          <div className="search-bar">
            <input type="text" placeholder="Film ara..." />
          </div>
          <div className="categories-container">
            <button className={`category-button ${selectedCategory === 'all' ? 'active' : ''}`} onClick={() => handleCategoryClick('all')}>
              Tümü
            </button>
            <button className={`category-button ${selectedCategory === 'action' ? 'active' : ''}`} onClick={() => handleCategoryClick('action')}>
              Aksiyon
            </button>
            <button className={`category-button ${selectedCategory === 'drama' ? 'active' : ''}`} onClick={() => handleCategoryClick('drama')}>
              Drama
            </button>
            <button className={`category-button ${selectedCategory === 'comedy' ? 'active' : ''}`} onClick={() => handleCategoryClick('comedy')}>
              Komedi
            </button>
            <button className={`category-button ${selectedCategory === 'horror' ? 'active' : ''}`} onClick={() => handleCategoryClick('horror')}>
              Korku
            </button>
            <button className={`category-button ${selectedCategory === 'sci-fi' ? 'active' : ''}`} onClick={() => handleCategoryClick('sci-fi')}>
              Bilim Kurgu
            </button>
          </div>
        </header>

        <div className="movie-list">
          {movies.map(movie => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                onClick={handleMovieClick}
              />
          ))}
        </div>

        {selectedMovie && (
          <MovieDetail 
            movie={selectedMovie} 
            onClose={() => setSelectedMovie(null)}
            isInList={true}
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