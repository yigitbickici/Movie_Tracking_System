import React, { useState } from 'react';
import MovieCard from '../components/MovieCard';
import MovieDetail from '../components/MovieDetail';
import './Watchlist.css';

const API_KEY = "84e605aa45ef84282ba934b9b2648dc5";

const Watchlist = () => {
    const [activeTab, setActiveTab] = useState('watchlist');
    const [isGridView, setIsGridView] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [watchedMovies, setWatchedMovies] = useState(new Set());

    // Örnek veri - Backend entegrasyonunda burası API'dan gelecek
    const watchlistMovies = [
        {
            id: 238,
            title: "The Godfather",
            release_date: "1972-03-14",
            poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
            overview: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family.",
            vote_average: 8.7,
            isWatched: false
        },
        {
            id: 155,
            title: "The Dark Knight",
            release_date: "2008-07-18",
            poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
            overview: "Batman raises the stakes in his war on crime.",
            vote_average: 8.9,
            isWatched: false
        },
        {
            id: 550,
            title: "Fight Club",
            release_date: "1999-10-15",
            poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
            overview: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
            vote_average: 8.4,
            isWatched: false
        },
        {
            id: 278,
            title: "The Shawshank Redemption",
            release_date: "1994-09-23",
            poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
            overview: "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison.",
            vote_average: 8.7,
            isWatched: false
        },
        {
            id: 13,
            title: "Forrest Gump",
            release_date: "1994-07-06",
            poster_path: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
            overview: "A man with a low IQ has accomplished great things in his life and been present during significant historic events.",
            vote_average: 8.5,
            isWatched: false
        },
        {
            id: 497,
            title: "The Green Mile",
            release_date: "1999-12-10",
            poster_path: "/velWPhVMQeQKcxggNEU8YmIo52R.jpg",
            overview: "A supernatural tale set on death row in a Southern prison.",
            vote_average: 8.5,
            isWatched: false
        },
        {
            id: 429,
            title: "The Good, the Bad and the Ugly",
            release_date: "1966-12-23",
            poster_path: "/bX2xnavhMYjWDoZp1VM6VnU1xwe.jpg",
            overview: "While the Civil War rages on between the Union and the Confederacy, three men pursue their own goals.",
            vote_average: 8.5,
            isWatched: false
        },
        {
            id: 389,
            title: "12 Angry Men",
            release_date: "1957-04-10",
            poster_path: "/ppd84D2i9W8jXmsyInGyihiSyqz.jpg",
            overview: "The defense and the prosecution have rested and the jury is filing into the jury room to decide if a young man is guilty or innocent of murdering his father.",
            vote_average: 8.5,
            isWatched: false
        },
        {
            id: 240,
            title: "The Godfather Part II",
            release_date: "1974-12-20",
            poster_path: "/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg",
            overview: "The early life and career of Vito Corleone in 1920s New York City is portrayed, while his son, Michael, expands and tightens his grip on the family crime syndicate.",
            vote_average: 8.6,
            isWatched: false
        },
        {
            id: 424,
            title: "Schindler's List",
            release_date: "1993-12-15",
            poster_path: "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
            overview: "The true story of how businessman Oskar Schindler saved over a thousand Jewish lives from the Nazis.",
            vote_average: 8.6,
            isWatched: false
        }
    ];

    const watchedMoviesData = [
        {
            id: 27205,
            title: "Inception",
            release_date: "2010-07-16",
            poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
            overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life.",
            vote_average: 8.4
        },
        {
            id: 157336,
            title: "Interstellar",
            release_date: "2014-11-07",
            poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
            overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel.",
            vote_average: 8.4
        },
        {
            id: 680,
            title: "Pulp Fiction",
            release_date: "1994-09-10",
            poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
            overview: "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper.",
            vote_average: 8.5
        },
        {
            id: 603,
            title: "The Matrix",
            release_date: "1999-03-30",
            poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
            overview: "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.",
            vote_average: 8.2
        },
        {
            id: 769,
            title: "Goodfellas",
            release_date: "1990-09-12",
            poster_path: "/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg",
            overview: "The true story of Henry Hill, a half-Irish, half-Sicilian Brooklyn kid who is adopted by neighbourhood gangsters at an early age and climbs the ranks of a Mafia family.",
            vote_average: 8.5
        }
    ];

    const handleWatchedToggle = (movieId, event) => {
        event.stopPropagation();
        setWatchedMovies(prev => {
            const newSet = new Set(prev);
            if (newSet.has(movieId)) {
                newSet.delete(movieId);
            } else {
                newSet.add(movieId);
            }
            return newSet;
        });
    };

    const handleMovieClick = (movie) => {
        // Fetch movie details, credits, and watch providers in parallel
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
                    providers: providers.results.TR || {} // Get Turkish providers if available
                });
            })
            .catch(error => console.error("Error fetching movie details:", error));
    };

    const toggleView = () => {
        setIsGridView(!isGridView);
    };

    const MovieCard = ({ movie, onClick }) => (
        <div className="movie-card" onClick={onClick}>
            <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title}
            />
            {activeTab === 'watchlist' && (
                <button 
                    className={`watched-indicator ${watchedMovies.has(movie.id) ? 'active' : ''}`}
                    onClick={(e) => handleWatchedToggle(movie.id, e)}
                >
                    ✓
                </button>
            )}
            <div className="movie-info">
                <h4>{movie.title}</h4>
                <p>{movie.release_date?.split('-')[0]}</p>
            </div>
        </div>
    );

    return (
        <div className="watchlist-container">
            <div className="watchlist-header">
                <div className="tab-buttons">
                    <button 
                        className={`tab-button ${activeTab === 'watchlist' ? 'active' : ''}`}
                        onClick={() => setActiveTab('watchlist')}
                    >
                        WatchList
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'watched' ? 'active' : ''}`}
                        onClick={() => setActiveTab('watched')}
                    >
                        Watched
                    </button>
                </div>
                <button className="view-toggle" onClick={toggleView}>
                    {isGridView ? '⊞' : '≣'}
                </button>
            </div>

            <div className={`movies-container ${isGridView ? 'grid-view' : 'list-view'}`}>
                {(activeTab === 'watchlist' ? watchlistMovies : watchedMoviesData).map(movie => (
                    <MovieCard 
                        key={movie.id}
                        movie={movie}
                        onClick={() => handleMovieClick(movie)}
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
        </div>
    );
};

export default Watchlist; 