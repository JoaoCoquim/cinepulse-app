document.addEventListener('DOMContentLoaded', () => {
    const OMDB_API_KEY = window.config.OMDB_API_KEY;
    const suggestions = document.getElementById('suggestions');
    const warnings = document.getElementById('warnings');
    const moviesWithTwoLetters = ["A.I.", "B.S.", "CQ", "D2", "Da", "Em", "F/X", "Go", "Ho!", "I.Q.", "If", "If....", "IO", "It", "Jo", "Pi", "No", "PK", "RV", "Up", "Us", "W.E."];
    const moviesWithNumbers = {
        "seven": "Se7en",
        "thirteen": "Thir13en",
        "megan": "M3GAN",
        "simone": "S1m0ne",
    };
    let debounceTimer;

    const fetchMovies = (query) => {
        let apiUrl = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${OMDB_API_KEY}`;
        const lowerCaseQuery = query.toLowerCase();
        let specialCaseApiUrl = null;

        // Check for 2 letter titles
        moviesWithTwoLetters.forEach(element => {
            if (query.length >= 2 && lowerCaseQuery === element.toLowerCase()) {
                specialCaseApiUrl = `https://www.omdbapi.com/?t=${element}&apikey=${OMDB_API_KEY}`;
            }
        });

        // Check for numbered titles
        if (moviesWithNumbers[lowerCaseQuery]) {
            specialCaseApiUrl = `https://www.omdbapi.com/?t=${moviesWithNumbers[lowerCaseQuery]}&apikey=${OMDB_API_KEY}`;
        }

        if (query.length > 1) {
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.Response === "True") {
                        suggestions.innerHTML = '';
                        suggestions.style.display = 'block';
                        warnings.style.display = 'none';

                        // If there's a special case, fetch that too
                        if (specialCaseApiUrl) {
                            fetch(specialCaseApiUrl)
                                .then(response => response.json())
                                .then(specialData => {
                                    if (specialData.Response === "True") {
                                        // Add the special case movie to suggestions at the top
                                        addMovieToSuggestions(specialData, true);
                                    }
                                })
                                .catch(error => console.error('Error fetching special case movie data:', error));
                        }

                        // Process results from regular search
                        data.Search.forEach(movie => {
                            addMovieToSuggestions(movie);
                        });
                    } else if (data.Error === "Too many results." || data.Error === "Movie not found!") {
                        warnings.innerHTML = `<p id="error">No results found for "${query}"</p>`;
                        warnings.style.display = 'block';
                        suggestions.style.display = 'none';
                    } else {
                        suggestions.style.display = 'none';
                    }
                })
                .catch(error => console.error('Error fetching movie data:', error));
        } else {
            suggestions.style.display = 'none';
        }
    };

    // Add movies to the suggestion list
    function addMovieToSuggestions(movie, isSpecialCase = false) {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.innerHTML = `
                <div style="display: flex; align-items: center; padding: 10px; cursor: pointer;">
                    <img src="${movie.Poster}" alt="${movie.Title} Poster" style="width: auto; height: 75px; margin-right: 10px; object-fit: cover;">
                    <div>
                        <strong>${movie.Title}</strong> (${movie.Year})
                    </div>
                </div>`;
        li.dataset.imdbID = movie.imdbID;
        li.addEventListener('click', () => selectMovieByImdbID(movie.imdbID));
        suggestions.appendChild(li);

        if (isSpecialCase) {
            suggestions.prepend(li); // Add special case at the top
        } else {
            suggestions.appendChild(li); // Add regular movie at the end
        }
    }

    // Debounce function
    function debounce(func, delay) {
        return function () {
            warnings.style.display = 'none';
            clearTimeout(debounceTimer); // Clear the previous timer
            debounceTimer = setTimeout(func, delay); // Set a new timer
        };
    }

    searchInput.addEventListener('input', debounce(() => {
        const query = searchInput.value.trim();
        fetchMovies(query);
    }, 1000)); // Delay in miliseconds

    function selectMovieByImdbID(imdbID) {
        const apiUrl = `https://www.omdbapi.com/?i=${encodeURIComponent(imdbID)}&apikey=${OMDB_API_KEY}`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.Response === "True") {
                    const movieDataString = JSON.stringify(data);
                    window.location.href = 'movie-info.html?movieData=' + encodeURIComponent(movieDataString);
                } else {
                    alert('Movie not found!');
                }
            })
            .catch(error => console.error('Error fetching movie data:', error));
    }


    // Fetches data and updates the content of each movie card on the homepage
    function createMovieCard(data, card) {
        const movieTitlesArray = Object.keys(data);
        const movieTitle = movieTitlesArray[Math.floor(Math.random() * movieTitlesArray.length)];

        let apiUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=${OMDB_API_KEY}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(movieData => {
                if (movieData.Response === "True") {
                    // Set movie title and year
                    document.querySelector(card.titleClass).innerText = `${movieTitle} (${movieData.Year})`;

                    // Set poster and links
                    document.querySelector(card.imageClass).src = movieData.Poster;
                    document.querySelector(card.linkClass).href = 'movie-info.html?movieData=' + encodeURIComponent(JSON.stringify(movieData));

                    // Set ratings
                    const imdbRating = movieData.Ratings.find(r => r.Source === "Internet Movie Database")?.Value || "N/A";
                    const rottenTomatoesRating = movieData.Ratings.find(r => r.Source === "Rotten Tomatoes")?.Value || "N/A";
                    const metacriticRating = movieData.Ratings.find(r => r.Source === "Metacritic")?.Value || "N/A";

                    // Assign the ratings to the correct elements of the corresponding card
                    document.querySelector(card.imdbClass).innerHTML += imdbRating;
                    document.querySelector(card.rottenClass).innerHTML += rottenTomatoesRating;
                    document.querySelector(card.metacriticClass).innerHTML += metacriticRating;

                    // Set links to external rating sites
                    document.querySelector(card.imdbClass).href = `https://www.imdb.com/title/${movieData.imdbID}`;
                    document.querySelector(card.rottenClass).href = `https://www.rottentomatoes.com/search?search=${movieData.Title}`;
                    document.querySelector(card.metacriticClass).href = `https://www.metacritic.com/search/${movieData.Title}`;

                } else {
                    console.error(`Failed to fetch data for ${movieTitle}: ${movieData.Error}`);
                }
            })
            .catch(error => console.error('Error fetching movie data:', error));
    }

    const cardClasses = [
        {
            imageClass: '.first-card-img',
            titleClass: '.first-card-title',
            imdbClass: '.first-card-imdbRating',
            rottenClass: '.first-card-rottenTomatoesRating',
            metacriticClass: '.first-card-metacriticRating',
            linkClass: '.first-card-link'
        },
        {
            imageClass: '.second-card-img',
            titleClass: '.second-card-title',
            imdbClass: '.second-card-imdbRating',
            rottenClass: '.second-card-rottenTomatoesRating',
            metacriticClass: '.second-card-metacriticRating',
            linkClass: '.second-card-link'
        },
        {
            imageClass: '.third-card-img',
            titleClass: '.third-card-title',
            imdbClass: '.third-card-imdbRating',
            rottenClass: '.third-card-rottenTomatoesRating',
            metacriticClass: '.third-card-metacriticRating',
            linkClass: '.third-card-link'
        },
        {
            imageClass: '.fourth-card-img',
            titleClass: '.fourth-card-title',
            imdbClass: '.fourth-card-imdbRating',
            rottenClass: '.fourth-card-rottenTomatoesRating',
            metacriticClass: '.fourth-card-metacriticRating',
            linkClass: '.fourth-card-link'
        }
    ];

    fetch('../data/top100movies.json')
        .then(response => response.json())
        .then(data => {
            cardClasses.forEach(card => {
                createMovieCard(data, card);
            });
        })
        .catch(error => console.error('Error fetching JSON file:', error));
});
