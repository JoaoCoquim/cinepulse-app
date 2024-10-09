document.addEventListener('DOMContentLoaded', () => {
    const OMDB_API_KEY = window.config.OMDB_API_KEY;

    // Fetches data and updates the content of each movie card on the homepage
    function createMovieCard(data, selectedTitles, rowElement) {
        const movieTitlesArray = Object.keys(data);
        const movieCardTemplate = document.getElementById('movie-card-template');
        let movieTitle;

        // Select a random movie title until a unique title is found
        do {
            movieTitle = movieTitlesArray[Math.floor(Math.random() * movieTitlesArray.length)];
        } while (selectedTitles.has(movieTitle));

        selectedTitles.add(movieTitle);

        let apiUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=${OMDB_API_KEY}`;

        // Clone the movie card template
        const newCard = movieCardTemplate.cloneNode(true);
        newCard.style.display = 'block';

        fetch(apiUrl)
            .then(response => response.json())
            .then(movieData => {
                if (movieData.Response === "True") {
                    // Set movie title and year
                    newCard.querySelector('.card-title').innerText = `${movieTitle} (${movieData.Year})`;

                    // Set links and poster
                    newCard.querySelector('.card-link').href = 'movie-info.html?movieData=' + encodeURIComponent(JSON.stringify(movieData));
                    newCard.querySelector('.card-img').src = movieData.Poster !== 'N/A' ? movieData.Poster : 'img/no-poster-available.jpg';
                    newCard.querySelector('.card-img').alt = `Poster for ${movieData.Title}`;

                    // Set ratings
                    const imdbRating = movieData.Ratings.find(r => r.Source === "Internet Movie Database")?.Value || "N/A";
                    const rottenTomatoesRating = movieData.Ratings.find(r => r.Source === "Rotten Tomatoes")?.Value || "N/A";
                    const metacriticRating = movieData.Ratings.find(r => r.Source === "Metacritic")?.Value || "N/A";

                    // Assign the ratings to the correct elements of the corresponding card
                    newCard.querySelector('.imdbRating').innerHTML += imdbRating;
                    newCard.querySelector('.rottenTomatoesRating').innerHTML += rottenTomatoesRating;
                    newCard.querySelector('.metacriticRating').innerHTML += metacriticRating;

                    // Set links to external rating sites
                    newCard.querySelector('.imdbRating').href = `https://www.imdb.com/title/${movieData.imdbID}`;
                    newCard.querySelector('.rottenTomatoesRating').href = `https://www.rottentomatoes.com/search?search=${movieData.Title}`;
                    newCard.querySelector('.metacriticRating').href = `https://www.metacritic.com/search/${movieData.Title}`;
                } else {
                    console.error(`Failed to fetch data for ${movieTitle}: ${movieData.Error}`);
                    newCard.querySelector('.card-img').src = 'img/no-poster-available.jpg';
                    newCard.querySelector('.card-img').alt = `Movie poster not available`;
                }

                // Append the new card to the row
                rowElement.appendChild(newCard);
            })
            .catch(error => {
                console.error('Error fetching movie data:', error)
                newCard.querySelector('.card-img').src = 'img/no-poster-available.jpg';
                newCard.querySelector('.card-img').alt = 'Movie poster not available';
                rowElement.appendChild(newCard);
            });
    }

    fetch('../data/top100movies.json')
        .then(response => response.json())
        .then(data => {
            const selectedTitles = new Set();
            const rows = document.querySelectorAll('.carousel-item .row');
            rows.forEach((row) => {
                for (let i = 0; i < 4; i++) { // Defines number of movie cards to generate per row
                    createMovieCard(data, selectedTitles, row);
                }
            })
        })
        .catch(error => console.error('Error fetching JSON file:', error));
});
