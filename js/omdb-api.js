document.addEventListener('DOMContentLoaded', () => {

    const OMDB_API_KEY = window.config.OMDB_API_KEY;
    const suggestions = document.getElementById('suggestions');
    const warnings = document.getElementById('warnings');
    const moviesWithTwoLetters = ["A.I.", "B.S.", "CQ", "D2", "Da", "Em", "F/X", "Go", "Ho!", "I.Q.", "If", "If....", "IO", "It", "Jo", "Pi", "No", "PK", "RV", "Up", "Us", "W.E."];

    searchInput.addEventListener('input', function () {
        const query = searchInput.value.trim();
        let apiUrl = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${OMDB_API_KEY}`;
        let isTwoLetterMatch = false;

        // Checks for 2 letter movies and handle them with specific title search (?t=)
        moviesWithTwoLetters.forEach(element => {
            if (query.length >= 2 && query.toLowerCase() === element.toLowerCase()) {
                apiUrl = `https://www.omdbapi.com/?t=${element}&apikey=${OMDB_API_KEY}`;
                isTwoLetterMatch = true;  // Marks this as a single movie query (from the array)
            }
        });

        if (query.length > 1) {
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.Response === "True") {
                        suggestions.innerHTML = '';
                        suggestions.style.display = 'block';
                        warnings.style.display = 'none';

                        // Process results from movies with 2 letters
                        if (isTwoLetterMatch) {
                            const li = document.createElement('li');
                            li.classList.add('list-group-item');
                            li.innerHTML = `
                            <div style="display: flex; align-items: center; padding: 10px; cursor: pointer;">
                                <img src="${data.Poster}" alt="${data.Title} Poster" style="width: auto; height: 75px; margin-right: 10px; object-fit: cover;">
                                <div>
                                    <strong>${data.Title}</strong> (${data.Year})
                                </div>
                            </div>
                        `;
                            li.dataset.imdbID = data.imdbID;
                            li.addEventListener('click', () => selectMovieByImdbID(data.imdbID));
                            suggestions.appendChild(li);
                        } else {
                            // Process results from `?s=` (multiple movies)
                            data.Search.forEach(movie => {
                                const li = document.createElement('li');
                                li.classList.add('list-group-item');
                                li.innerHTML = `
                            <div style="display: flex; align-items: center; padding: 10px; cursor: pointer;">
                                <img src="${movie.Poster}" alt="${movie.Title} Poster" style="width: auto; height: 75px; margin-right: 10px; object-fit: cover;">
                                <div>
                                    <strong>${movie.Title}</strong> (${movie.Year})
                                </div>
                            </div>
                        `;
                                li.dataset.imdbID = movie.imdbID;
                                li.addEventListener('click', () => selectMovieByImdbID(movie.imdbID));
                                suggestions.appendChild(li);
                            });
                        }

                        // Handle other results
                    } else if (data.Error === "Too many results.") {
                        warnings.innerHTML = `<p id="error">Too many results. Please check your syntax!</p>`;
                        warnings.style.display = 'block';
                        suggestions.style.display = 'none';
                    } else if (data.Error === "Movie not found!") {
                        warnings.innerHTML = `<p id="error">Movie not found. Please check your syntax!</p>`;
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
    });

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
    function createMovieCard(movieTitle, cardImageClass, imdbClass, rottenClass, metacriticClass, cardLinkClass) {
        const cardImage = document.querySelector(cardImageClass);
        const cardLink = document.querySelector(cardLinkClass);

        let apiUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=${OMDB_API_KEY}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(movieData => {
                if (movieData.Response === "True") {
                    const imdbRating = movieData.Ratings.find(r => r.Source === "Internet Movie Database")?.Value || "N/A";
                    const rottenTomatoesRating = movieData.Ratings.find(r => r.Source === "Rotten Tomatoes")?.Value || "N/A";
                    const metacriticRating = movieData.Ratings.find(r => r.Source === "Metacritic")?.Value || "N/A";

                    // Assign the ratings to the correct elements of the corresponding card
                    document.querySelector(imdbClass).innerHTML += imdbRating;
                    document.querySelector(rottenClass).innerHTML += rottenTomatoesRating;
                    document.querySelector(metacriticClass).innerHTML += metacriticRating;

                    // Update the card image source with the poster
                    cardImage.src = movieData.Poster;

                    // Set the href attribute of the card link
                    cardLink.href = 'movie-info.html?movieData=' + encodeURIComponent(JSON.stringify(movieData));

                    // IMDb, Rotten Tomatoes and Metacritic links
                    document.querySelector(imdbClass).href = `https://www.imdb.com/title/${movieData.imdbID}`;
                    document.querySelector(rottenClass).href = `https://www.rottentomatoes.com/search?search=${movieData.Title}`;
                    document.querySelector(metacriticClass).href = `https://www.metacritic.com/search/${movieData.Title}`;

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
            cardLinkClass: '.first-card-link'
        },
        {
            imageClass: '.second-card-img',
            titleClass: '.second-card-title',
            imdbClass: '.second-card-imdbRating',
            rottenClass: '.second-card-rottenTomatoesRating',
            metacriticClass: '.second-card-metacriticRating',
            cardLinkClass: '.second-card-link'
        },
        {
            imageClass: '.third-card-img',
            titleClass: '.third-card-title',
            imdbClass: '.third-card-imdbRating',
            rottenClass: '.third-card-rottenTomatoesRating',
            metacriticClass: '.third-card-metacriticRating',
            cardLinkClass: '.third-card-link'
        },
        {
            imageClass: '.fourth-card-img',
            titleClass: '.fourth-card-title',
            imdbClass: '.fourth-card-imdbRating',
            rottenClass: '.fourth-card-rottenTomatoesRating',
            metacriticClass: '.fourth-card-metacriticRating',
            cardLinkClass: '.fourth-card-link'
        }
    ];

    cardClasses.forEach(card => {
        fetch('../data/top100movies.json')
            .then(response => response.json())
            .then(data => {
                const movieTitlesArray = Object.keys(data);
                const movieTitle = movieTitlesArray[Math.floor(Math.random() * movieTitlesArray.length)];
                document.querySelector(card.titleClass).innerText = movieTitle; //fills the card with corresponding movie title

                createMovieCard(movieTitle, card.imageClass, card.imdbClass, card.rottenClass, card.metacriticClass, card.cardLinkClass);
            })
            .catch(error => console.error('Error fetching JSON:', error));

    });

});