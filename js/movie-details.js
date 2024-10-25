document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tmdb_id = urlParams.get('id');

    function fetchMovieById(id) {
        const TMDB_API_KEY = window.config.TMDB_API_KEY;
        let apiUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(movieData => {
                if (movieData.id && movieData.title) {
                    let imdbId = movieData.imdb_id;
                    fetchByImdbId(imdbId);
                } else {
                    alert('Movie details not found!');
                }
            })
            .catch(error => logError('movie-details.js', 'fetchMovieById', error));
    }

    function fetchByImdbId(imdbId) {
        const OMDB_API_KEY = window.config.OMDB_API_KEY;
        let apiUrl = `https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(movieData => {
                if (movieData.Response === "True") {
                    populateMovieDetails(movieData);
                } else {
                    alert('Movie details not found!');
                }
            })
            .catch(error => logError('movie-details.js', 'fetchByImdbId', error));
    }

    function populateMovieDetails(movie) {

        const genresArray = movie.Genre.split(', ');
        const genresElement = document.getElementById('genre');
        genresElement.innerHTML = '';

        genresArray.forEach(genre => {
            const createdElement = document.createElement('a');
            createdElement.textContent = genre;
            createdElement.href = `movies-by-genre.html?genre=${encodeURIComponent(genre)}`;
            createdElement.classList.add('genre-link');
            createdElement.target = '_blank';
            genresElement.appendChild(createdElement);
        });

        // Set Movie Info
        document.getElementById('title').textContent = movie.Title;
        document.getElementById('year').textContent = movie.Year;
        document.getElementById('runtime').textContent = movie.Runtime;
        document.getElementById('director').textContent = movie.Director;
        document.getElementById('writer').textContent = movie.Writer;
        document.getElementById('actors').textContent = movie.Actors;
        document.getElementById('plot').textContent = movie.Plot;
        document.getElementById('language').textContent = movie.Language;
        document.getElementById('country').textContent = movie.Country;
        document.getElementById('awards').textContent = movie.Awards;
        document.getElementById('poster').src = movie.Poster !== 'N/A' ? movie.Poster : 'img/no-poster-available.jpg';

        document.title = `${movie.Title} (${movie.Year}) - CinePulse`;

        // Set Ratings
        const imdbRating = movie.Ratings.find(r => r.Source === "Internet Movie Database")?.Value || "N/A";
        const rottenTomatoesRating = movie.Ratings.find(r => r.Source === "Rotten Tomatoes")?.Value || "N/A";
        const metacriticRating = movie.Ratings.find(r => r.Source === "Metacritic")?.Value || "N/A";
        document.getElementById('imdbRating').textContent = imdbRating;
        document.getElementById('rottenTomatoesRating').textContent = rottenTomatoesRating;
        document.getElementById('metacriticRating').textContent = metacriticRating;

        // Set Links
        document.getElementById('imdbLink').href = `https://www.imdb.com/title/${movie.imdbID}`;
        document.getElementById('rottenTomatoesLink').href = `https://www.rottentomatoes.com/search?search=${movie.Title}`;
        document.getElementById('metacriticLink').href = `https://www.metacritic.com/search/${movie.Title}`;
    }

    function logError(fileName, functionName, error) {
        console.error(`[${fileName} - ${functionName}] Error:`, error);
    }

    fetchMovieById(tmdb_id);

});
