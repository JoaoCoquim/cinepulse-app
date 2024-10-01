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
        let numberedTitleApiUrl = null;

        // Check for 2 letter titles
        let foundTwoLetterMovie = moviesWithTwoLetters.find(element => lowerCaseQuery === element.toLowerCase());
        if (foundTwoLetterMovie) {
            let twoLetterApiUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(foundTwoLetterMovie)}&apikey=${OMDB_API_KEY}`;
            fetch(twoLetterApiUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.Response === "True") {
                        suggestions.innerHTML = '';
                        suggestions.style.display = 'block';
                        warnings.style.display = 'none';
                        addMovieToSuggestions(data, true);
                    } else {
                        warnings.innerHTML = `<p id="error">No results found for "${query}"</p>`;
                        warnings.style.display = 'block';
                        suggestions.style.display = 'none';
                    }
                })
                .catch(error => console.error('Error fetching two-letter movie:', error));
            return; // Exit after handling the two-letter movie
        }

        // Check for numbered titles
        if (moviesWithNumbers[lowerCaseQuery]) {
            numberedTitleApiUrl = `https://www.omdbapi.com/?t=${moviesWithNumbers[lowerCaseQuery]}&apikey=${OMDB_API_KEY}`;
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
                        if (numberedTitleApiUrl) {
                            fetch(numberedTitleApiUrl)
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
        let moviePoster = movie.Poster !== 'N/A' ? movie.Poster : 'img/no-poster-available.jpg';
        li.innerHTML = `
                <div style="display: flex; align-items: center; padding: 10px; cursor: pointer;">
                    <img src="${moviePoster}" alt="${movie.Title} Poster" style="width: auto; height: 75px; margin-right: 10px; object-fit: cover;">
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
});
