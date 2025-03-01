import React, { useState } from 'react';
import MovieCard from '../components/MovieCard';
import MovieDetail from '../components/MovieDetail';
import './Watchlist.css';

const API_KEY = "84e605aa45ef84282ba934b9b2648dc5";

const Watchlist = () => {
    const [activeTab, setActiveTab] = useState('watchlist');
    const [isGridView, setIsGridView] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState(null);

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

    const watchedMovies = [
        {
            id: 680,
            title: "Pulp Fiction",
            release_date: "1994-10-14",
            poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
            overview: "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper.",
            vote_average: 8.7,
            isWatched: true
        },
        {
            id: 129,
            title: "Spirited Away",
            release_date: "2001-07-20",
            poster_path: "/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
            overview: "A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.",
            vote_average: 8.5,
            isWatched: true
        },
        {
            id: 122,
            title: "The Lord of the Rings: The Return of the King",
            release_date: "2003-12-01",
            poster_path: "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
            overview: "Aragorn is revealed as the heir to the ancient kings as he, Gandalf and the other members of the broken fellowship struggle to save Gondor.",
            vote_average: 8.5,
            isWatched: true
        }
    ];

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
                {(activeTab === 'watchlist' ? watchlistMovies : watchedMovies).map(movie => (
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