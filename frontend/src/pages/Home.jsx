import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import MovieDetail from "../components/MovieDetail";
import './Home.css';

const API_KEY = "84e605aa45ef84282ba934b9b2648dc5";

const API_URL = (page) => `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=tr-TR&page=${page}`;

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState(null);

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
    // Fetch movie details, credits, and watch providers in parallel
    Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&language=tr-TR`),
      fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${API_KEY}&language=tr-TR`),
      fetch(`https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${API_KEY}`)
    ])
      .then(([detailsRes, creditsRes, providersRes]) => 
        Promise.all([detailsRes.json(), creditsRes.json(), providersRes.json()])
      )
      .then(([detailedMovie, credits, providers]) => {
        // Combine all data
        setSelectedMovie({
          ...movie,
          runtime: detailedMovie.runtime,
          cast: credits.cast.slice(0, 5),
          providers: providers.results.TR || {} // Get Turkish providers if available
        });
      })
      .catch(error => console.error("Error fetching movie details:", error));
  };

  return (
      <div className="home">
        <header className="home-header">
          <h1>Movie Tracking System</h1>
          <div className="search-bar">
            <input type="text" placeholder="Search movies..." />
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
            isInList={false} // when true movie detail page will show with rating section
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

export default Home;
