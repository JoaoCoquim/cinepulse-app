document.addEventListener('DOMContentLoaded', () => {
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
                    document.querySelector(card.imageClass).src = movieData.Poster !== 'N/A' ? movieData.Poster : 'img/no-poster-available.jpg';
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