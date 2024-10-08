document.addEventListener('DOMContentLoaded', () => {
    const OMDB_API_KEY = window.config.OMDB_API_KEY;

    // Fetches data and updates the content of each movie card on the homepage
    function createMovieCard(data, card, selectedTitles) {
        const movieTitlesArray = Object.keys(data);
        let movieTitle;

        // Select a random movie title until a unique title is found
        do {
            movieTitle = movieTitlesArray[Math.floor(Math.random() * movieTitlesArray.length)];
        } while (selectedTitles.has(movieTitle));

        selectedTitles.add(movieTitle);

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
        },
        {
            imageClass: '.fifth-card-img',
            titleClass: '.fifth-card-title',
            imdbClass: '.fifth-card-imdbRating',
            rottenClass: '.fifth-card-rottenTomatoesRating',
            metacriticClass: '.fifth-card-metacriticRating',
            linkClass: '.fifth-card-link'
        },
        {
            imageClass: '.sixth-card-img',
            titleClass: '.sixth-card-title',
            imdbClass: '.sixth-card-imdbRating',
            rottenClass: '.sixth-card-rottenTomatoesRating',
            metacriticClass: '.sixth-card-metacriticRating',
            linkClass: '.sixth-card-link'
        },
        {
            imageClass: '.seventh-card-img',
            titleClass: '.seventh-card-title',
            imdbClass: '.seventh-card-imdbRating',
            rottenClass: '.seventh-card-rottenTomatoesRating',
            metacriticClass: '.seventh-card-metacriticRating',
            linkClass: '.seventh-card-link'
        },
        {
            imageClass: '.eighth-card-img',
            titleClass: '.eighth-card-title',
            imdbClass: '.eighth-card-imdbRating',
            rottenClass: '.eighth-card-rottenTomatoesRating',
            metacriticClass: '.eighth-card-metacriticRating',
            linkClass: '.eighth-card-link'
        },
        {
            imageClass: '.ninth-card-img',
            titleClass: '.ninth-card-title',
            imdbClass: '.ninth-card-imdbRating',
            rottenClass: '.ninth-card-rottenTomatoesRating',
            metacriticClass: '.ninth-card-metacriticRating',
            linkClass: '.ninth-card-link'
        },
        {
            imageClass: '.tenth-card-img',
            titleClass: '.tenth-card-title',
            imdbClass: '.tenth-card-imdbRating',
            rottenClass: '.tenth-card-rottenTomatoesRating',
            metacriticClass: '.tenth-card-metacriticRating',
            linkClass: '.tenth-card-link'
        },
        {
            imageClass: '.eleventh-card-img',
            titleClass: '.eleventh-card-title',
            imdbClass: '.eleventh-card-imdbRating',
            rottenClass: '.eleventh-card-rottenTomatoesRating',
            metacriticClass: '.eleventh-card-metacriticRating',
            linkClass: '.eleventh-card-link'
        },
        {
            imageClass: '.twelfth-card-img',
            titleClass: '.twelfth-card-title',
            imdbClass: '.twelfth-card-imdbRating',
            rottenClass: '.twelfth-card-rottenTomatoesRating',
            metacriticClass: '.twelfth-card-metacriticRating',
            linkClass: '.twelfth-card-link'
        }
    ];

    fetch('../data/top100movies.json')
        .then(response => response.json())
        .then(data => {
            const selectedTitles = new Set();
            cardClasses.forEach(card => {
                createMovieCard(data, card, selectedTitles);
            });
        })
        .catch(error => console.error('Error fetching JSON file:', error));
});
