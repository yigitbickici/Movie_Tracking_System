import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import './Home.css';

const API_KEY = "84e605aa45ef84282ba934b9b2648dc5";


const API_URL = (page) => `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=tr-TR&page=${page}`;

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetch(API_URL(currentPage))
        .then((response) => response.json())
        .then((data) => {
          setMovies(data.results);
          setTotalPages(data.total_pages);
        })
        .catch((error) => console.error("Hata:", error));
  }, [currentPage]);

  // Sayfa değişimini yöneten fonksiyonlar
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
      <div className="home">
        <header className="home-header">
          <h1>Movie Management System</h1>
          <div className="search-bar">
            <input type="text" placeholder="Search movies..." />
          </div>
        </header>

        <div className="movie-list">
          {movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        <div className="pagination">
          <button onClick={goToPrevPage} disabled={currentPage === 1}>←</button>
          <span>{currentPage} / {totalPages}</span>
          <button onClick={goToNextPage} disabled={currentPage === totalPages}>→</button>
        </div>
      </div>
  );
};

export default MovieList;
