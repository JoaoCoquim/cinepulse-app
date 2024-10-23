document.addEventListener('DOMContentLoaded', () => {
    const pageTitle = document.querySelector('title');
    const pageSubtitle = document.querySelector('h1');
    const urlParams = new URLSearchParams(window.location.search);
    const genre = urlParams.get('genre');

    pageTitle.textContent = `${genre} - CinePulse`;
    pageSubtitle.textContent = genre;

    function getGenreId(movieGenre) {
        fetch('./data/tmdb_genres.json')
            .then(response => response.json())
            .then(data => {
                data.genres.forEach(genre => {
                    if (genre.name === movieGenre) {
                        loadMoviesByGenreId(genre.id);
                    }
                })
            })
            .catch(error => logError('fetch-movies-by-genre.js', 'fetchGenreId', error));
    }

    function loadMoviesByGenreId(id) {
        const TMDB_API_KEY = window.config.TMDB_API_KEY;
        let apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${id}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(moviesData => {
                if (moviesData.total_results !== 0) {
                    const moviesDataArray = moviesData.results;
                    const rowContainer = document.querySelector('.cards-container .row');
                    let currentRow;

                    moviesDataArray.forEach((movie, index) => {
                        // Create new row for every 4 cards
                        if (index % 4 === 0) {
                            currentRow = document.createElement('div');
                            currentRow.classList.add('row');
                            rowContainer.appendChild(currentRow);
                        }
                        fetchMovieDetailsByTmdbId(movie.id, currentRow);
                    });

                } else {
                    alert('No movie details were found for that genre!');
                }
            })
            .catch(error => logError('fetch-movies-by-genre.js', 'fetchMoviesByGenreId', error));
    }

    function fetchMovieDetailsByTmdbId(tmdbId, rowElement) {
        const TMDB_API_KEY = window.config.TMDB_API_KEY;
        let apiUrl = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(movieData => {
                if (movieData.id && movieData.title) {
                    // Check if imdb_id is available
                    if (movieData.imdb_id) {
                        // Creates movieInfo object to store variables
                        const movieInfo = { tmdbId, rowElement };
                        fetchMovieDetailsFromOmdb(movieData.imdb_id, movieInfo);
                    } else {
                        console.warn(`IMDb ID not found for TMDB ID: ${tmdbId}. Skipping fetch for OMDb.`);
                    }
                } else {
                    alert('Some movie details were not found!');
                }
            })
            .catch(error => logError('fetch-movies-by-genre.js', 'getImdbId', error));
    }

    function fetchMovieDetailsFromOmdb(imdbId, movieInfo) {
        const OMDB_API_KEY = window.config.OMDB_API_KEY;
        let apiUrl = `https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(movieData => {
                if (movieData.Response === "True") {
                    populateMovieDetails(movieData, movieInfo);
                } else {
                    alert('Some movie details were not found!');
                }
            })
            .catch(error => logError('movie-details.js', 'fetchMovieByImdbId', error));
    }

    function populateMovieDetails(movie, { tmdbId, rowElement }) {
        const movieCardTemplate = document.getElementById('movie-card-template');

        // Clone the movie card template
        const newCard = movieCardTemplate.cloneNode(true);
        newCard.style.display = 'block';

        // Set movie title and year
        newCard.querySelector('.card-title').innerText = `${movie.Title} (${movie.Year})`;

        // Set links and poster
        const formattedTitle = movie.Title.replace(/\s+/g, '_').toLowerCase();
        newCard.querySelector('.card-link').href = `movie-info.html?title=${formattedTitle}&id=${tmdbId}`;
        newCard.querySelector('.card-img').src = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : 'img/no-poster-available.jpg';
        newCard.querySelector('.card-img').alt = `Poster for ${movie.Title}`;

        // Set ratings
        const imdbRating = movie.Ratings.find(r => r.Source === "Internet Movie Database")?.Value || "N/A";
        const rottenTomatoesRating = movie.Ratings.find(r => r.Source === "Rotten Tomatoes")?.Value || "N/A";
        const metacriticRating = movie.Ratings.find(r => r.Source === "Metacritic")?.Value || "N/A";

        // Assign the ratings to the correct elements of the corresponding card
        newCard.querySelector('.imdbRating').innerHTML += imdbRating;
        newCard.querySelector('.rottenTomatoesRating').innerHTML += rottenTomatoesRating;
        newCard.querySelector('.metacriticRating').innerHTML += metacriticRating;

        // Set links to external rating sites
        newCard.querySelector('.imdbRating').href = `https://www.imdb.com/title/${movie.imdbID}`;
        newCard.querySelector('.rottenTomatoesRating').href = `https://www.rottentomatoes.com/search?search=${movie.Title}`;
        newCard.querySelector('.metacriticRating').href = `https://www.metacritic.com/search/${movie.Title}`;

        // Append the new card to the row
        rowElement.appendChild(newCard);
    }

    function logError(fileName, functionName, error) {
        console.error(`[${fileName} - ${functionName}] Error:`, error);
    }

    getGenreId(genre);

});
