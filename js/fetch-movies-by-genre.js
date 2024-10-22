document.addEventListener('DOMContentLoaded', () => {
    const pageTitle = document.querySelector('title');
    const pageSubtitle = document.querySelector('h1');
    const urlParams = new URLSearchParams(window.location.search);
    const genre = urlParams.get('genre');

    pageTitle.textContent = `${genre} - CinePulse`;
    pageSubtitle.textContent = genre;

    function fetchGenreId(movieGenre) {
        fetch('./data/tmdb_genres.json')
            .then(response => response.json())
            .then(data => {
                data.genres.forEach(genre => {
                    if (genre.name === movieGenre) {
                        let genreId = genre.id;
                        fetchMoviesByGenreId(genreId);
                    }
                })
            })
            .catch(error => logError('fetch-movies-by-genre.js', 'fetchGenreId', error));
    }

    function fetchMoviesByGenreId(id) {
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
                    // Creates new row if needed
                    if (index % 4 === 0) {
                        currentRow = document.createElement('div');
                        currentRow.classList.add('row');
                        rowContainer.appendChild(currentRow);
                    }

                    createMovieCard(movie, currentRow);
                });

            } else {
                alert('No movie details were found for that genre!');
            }
        })
        .catch(error => logError('fetch-movies-by-genre.js', 'fetchMoviesByGenreId', error));
}

    function createMovieCard(movie, rowElement) {
        const movieCardTemplate = document.getElementById('movie-card-template');

        // Clone the movie card template
        const newCard = movieCardTemplate.cloneNode(true);
        newCard.style.display = 'block';

        // Set movie title and year
        const year = movie.release_date.split('-')[0];
        newCard.querySelector('.card-title').innerText = `${movie.title} (${year})`;

        // Set links and poster
        const formattedTitle = movie.title.replace(/\s+/g, '_').toLowerCase();
        newCard.querySelector('.card-link').href = `movie-info.html?title=${formattedTitle}&id=${movie.id}`;
        const moviePoster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'img/no-poster-available.jpg';
        newCard.querySelector('.card-img').src = moviePoster;
        newCard.querySelector('.card-img').alt = `Poster for ${movie.title}`;

        // Set ratings
        const imdbRating = movie.vote_average;
        const rottenTomatoesRating = movie.vote_average;
        const metacriticRating = movie.vote_average;

        // Assign the ratings to the correct elements of the corresponding card
        newCard.querySelector('.imdbRating').innerHTML += imdbRating;
        newCard.querySelector('.rottenTomatoesRating').innerHTML += rottenTomatoesRating;
        newCard.querySelector('.metacriticRating').innerHTML += metacriticRating;

        // Set links to external rating sites
        newCard.querySelector('.imdbRating').href = `https://www.imdb.com/title/${movie.title}`;
        newCard.querySelector('.rottenTomatoesRating').href = `https://www.rottentomatoes.com/search?search=${movie.title}`;
        newCard.querySelector('.metacriticRating').href = `https://www.metacritic.com/search/${movie.title}`;

        // Append the new card to the row
        rowElement.appendChild(newCard);

    }

    function logError(fileName, functionName, error) {
        console.error(`[${fileName} - ${functionName}] Error:`, error);
    }

    fetchGenreId(genre);

});
