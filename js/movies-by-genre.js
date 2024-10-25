document.addEventListener('DOMContentLoaded', () => {
    const pageTitle = document.querySelector('title');
    const pageSubtitle = document.querySelector('h1');
    const urlParams = new URLSearchParams(window.location.search);
    const genre = urlParams.get('genre');
    let currentPage = Math.min(Number(urlParams.get('page')) || 1, 500); // Set currentPage to user input or default to 1, with a max. limit of 500

    pageTitle.textContent = `${genre} - CinePulse`;
    pageSubtitle.textContent = genre;

    // Fetch genres, find the one matching the current genre, and load its movies
    function fetchMoviesByGenre(movieGenre) {
        fetch('./data/tmdb_genres.json')
            .then(response => response.json())
            .then(data => {
                data.genres.forEach(genre => {
                    if (genre.name === movieGenre) {
                        loadMoviesByGenreId(genre.id, genre.name);
                    }
                })
            })
            .catch(error => logError('fetch-movies-by-genre.js', 'fetchGenreId', error));
    }

    function loadMoviesByGenreId(genreId, genreName) {
        const TMDB_API_KEY = window.config.TMDB_API_KEY;
        let apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&page=${currentPage}`;
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

                    updatePagination(Math.min(moviesData.total_pages, 500), genreName);

                } else {
                    alert('No movie details were found for that genre!');
                }
            })
            .catch(error => logError('fetch-movies-by-genre.js', 'fetchMoviesByGenreId', error));
    }

    function updatePagination(totalPages, genreName) {
        const paginationContainer = document.querySelector('.pagination');
        paginationContainer.innerHTML = '';

        // "Previous" button
        const previousPageItem = document.createElement('li');
        previousPageItem.classList.add('page-item');
        if (currentPage === 1) {
            previousPageItem.classList.add('disabled');
        }
        const previousPageLink = document.createElement('a');
        previousPageLink.classList.add('page-link');
        const chevronLeft = document.createElement('i');
        chevronLeft.classList.add('fa-solid', 'fa-chevron-left', 'me-2');
        previousPageLink.appendChild(chevronLeft);
        previousPageLink.appendChild(document.createTextNode('Previous'));
        previousPageLink.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                previousPageLink.href = `movies-by-genre.html?genre=${encodeURIComponent(genreName)}&page=${currentPage}`;
            }
        });
        previousPageItem.appendChild(previousPageLink);
        paginationContainer.appendChild(previousPageItem);

        // Numbered buttons
        let startPage = Math.max(1, currentPage - 1);
        let endPage = Math.min(totalPages, startPage + 2);

        // Adjusts startPage if there's less than 3 visible pages
        if (endPage - startPage < 2) {
            startPage = Math.max(1, endPage - 2);
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageItem = document.createElement('li');
            pageItem.classList.add('page-item');
            if (i === currentPage) {
                pageItem.classList.add('active');
            }

            const pageLink = document.createElement('a');
            pageLink.classList.add('page-link');
            pageLink.textContent = i;
            pageLink.addEventListener('click', () => {
                currentPage = i;
                pageLink.href = `movies-by-genre.html?genre=${encodeURIComponent(genreName)}&page=${currentPage}`;
            });

            pageItem.appendChild(pageLink);
            paginationContainer.appendChild(pageItem);
        }

        // Add ellipsis and total pages
        if (currentPage < totalPages - 1) {
            const ellipsisItem = document.createElement('li');
            ellipsisItem.classList.add('page-item', 'disabled');
            const ellipsisLink = document.createElement('a');
            ellipsisLink.classList.add('page-link', 'ellipsis');
            ellipsisLink.textContent = '...';
            ellipsisItem.appendChild(ellipsisLink);
            paginationContainer.appendChild(ellipsisItem);

            const totalPagesItem = document.createElement('li');
            totalPagesItem.classList.add('page-item', 'disabled');
            const totalPagesLink = document.createElement('a');
            totalPagesLink.classList.add('page-link');
            totalPagesLink.textContent = totalPages;
            totalPagesItem.appendChild(totalPagesLink);
            paginationContainer.appendChild(totalPagesItem);
        }

        // "Next" button
        const nextPageItem = document.createElement('li');
        nextPageItem.classList.add('page-item');
        if (currentPage === totalPages) {
            nextPageItem.classList.add('disabled');
        }
        const nextPageLink = document.createElement('a');
        nextPageLink.classList.add('page-link');
        const chevronRight = document.createElement('i');
        chevronRight.classList.add('fa-solid', 'fa-chevron-right', 'ms-2');
        nextPageLink.appendChild(document.createTextNode('Next'));
        nextPageLink.appendChild(chevronRight);
        nextPageLink.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                nextPageLink.href = `movies-by-genre.html?genre=${encodeURIComponent(genreName)}&page=${currentPage}`;
            }
        });
        nextPageItem.appendChild(nextPageLink);
        paginationContainer.appendChild(nextPageItem);
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
                        fetchOmdbMovieDetails(movieData.imdb_id, movieInfo);
                    } else {
                        console.warn(`IMDb ID not found for TMDB ID: ${tmdbId}. Skipping fetch for OMDb.`);
                    }
                } else {
                    alert('Some movie details were not found!');
                }
            })
            .catch(error => logError('fetch-movies-by-genre.js', 'getImdbId', error));
    }

    function fetchOmdbMovieDetails(imdbId, movieInfo) {
        const OMDB_API_KEY = window.config.OMDB_API_KEY;
        let apiUrl = `https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(movieData => {
                if (movieData.Response === "True") {
                    populateMovieCard(movieData, movieInfo);
                } else {
                    alert('Some movie details were not found!');
                }
            })
            .catch(error => logError('movie-details.js', 'fetchMovieByImdbId', error));
    }

    function populateMovieCard(movie, { tmdbId, rowElement }) {
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

    fetchMoviesByGenre(genre);

});
