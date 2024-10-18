document.addEventListener('DOMContentLoaded', () => {
    const pageTitle = document.querySelector('title');
    const pageSubtitle = document.querySelector('h1');
    const TMDB_API_KEY = window.config.TMDB_API_KEY;
    const urlParams = new URLSearchParams(window.location.search);
    const movieGenre = urlParams.get('genre');

    pageTitle.textContent = `${movieGenre} - CinePulse`;
    pageSubtitle.textContent = movieGenre;

    // Updates the content of each movie card on the page by genre
    function createMovieCard(moviesDataArray, rowElement) {
        const movieCardTemplate = document.getElementById('movie-card-template');

        // For each movie in the array of movies data
        moviesDataArray.forEach((movie) => {

            // Clone the movie card template
            const newCard = movieCardTemplate.cloneNode(true);
            newCard.style.display = 'block';

            // Set movie title and year
            const movieYear = movie.release_date.split('-')[0];
            newCard.querySelector('.card-title').innerText = `${movie.title} (${movieYear})`;

            // Set links and poster
            const formattedTitle = movie.title.replace(/\s+/g, '_').toLowerCase();
            newCard.querySelector('.card-link').href = `movie-info.html?title=${formattedTitle}&year=${movieYear}&imdbID=${movie.id}`;
            const moviePoster = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            newCard.querySelector('.card-img').src = moviePoster !== 'N/A' ? moviePoster : 'img/no-poster-available.jpg';
            newCard.querySelector('.card-img').alt = `Poster for ${movie.title}`;

            // Set ratings
            const imdbRating = movie.vote_average
            const rottenTomatoesRating = movie.vote_average
            const metacriticRating = movie.vote_average

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
        })
    }

    fetch('./data/tmdb_genres.json')
        .then(response => response.json())
        .then(data => {
            data.genres.forEach(genre => {
                if (genre.name === movieGenre) {
                    let genreId = genre.id;
                    let apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}`;

                    fetch(apiUrl)
                        .then(response => response.json())
                        .then(moviesData => {
                            if (moviesData.total_results !== 0) {
                                let moviesDataArray = moviesData.results;
                                // Split moviesDataArray into chunks of 4 movies per row
                                const chunkedMoviesArray = [];
                                for (let i = 0; i < moviesDataArray.length; i += 4) {
                                    chunkedMoviesArray.push(moviesDataArray.slice(i, i + 4));
                                }

                                const rows = document.querySelectorAll('.carousel-item .row');

                                // Iterate through rows and populate with 4 movies per row
                                chunkedMoviesArray.forEach((movieChunk, index) => {
                                    if (rows[index]) {
                                        createMovieCard(movieChunk, rows[index]);
                                    }
                                });
                            } else {
                                alert('No movie details were found for that genre!');
                            }
                        })
                        .catch(error => console.error(`Error fetching movies with genre '${movieGenre}':`, error));
                }
            })
        })
});
