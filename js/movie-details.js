document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const imdbID = urlParams.get('imdbID');
    const OMDB_API_KEY = window.config.OMDB_API_KEY;
    let apiUrl = `https://www.omdbapi.com/?i=${encodeURIComponent(imdbID)}&apikey=${OMDB_API_KEY}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(movieData => {
            if (movieData.Response === "True") {
                populateMovieDetails(movieData);
            } else {
                alert('Movie details not found!');
            }
        })
        .catch(error => console.error('Error fetching movie details:', error));

    function populateMovieDetails(movieData) {
        // Set Movie Info
        document.getElementById('title').textContent = movieData.Title;
        document.getElementById('year').textContent = movieData.Year;
        document.getElementById('runtime').textContent = movieData.Runtime;
        document.getElementById('genre').textContent = movieData.Genre;
        document.getElementById('director').textContent = movieData.Director;
        document.getElementById('writer').textContent = movieData.Writer;
        document.getElementById('actors').textContent = movieData.Actors;
        document.getElementById('plot').textContent = movieData.Plot;
        document.getElementById('language').textContent = movieData.Language;
        document.getElementById('country').textContent = movieData.Country;
        document.getElementById('awards').textContent = movieData.Awards;
        document.getElementById('poster').src = movieData.Poster !== 'N/A' ? movieData.Poster : 'img/no-poster-available.jpg';

        document.title = `${movieData.Title} (${movieData.Year}) - CinePulse`;

        // Set Ratings
        const imdbRating = movieData.Ratings.find(r => r.Source === "Internet Movie Database")?.Value || "N/A";
        const rottenTomatoesRating = movieData.Ratings.find(r => r.Source === "Rotten Tomatoes")?.Value || "N/A";
        const metacriticRating = movieData.Ratings.find(r => r.Source === "Metacritic")?.Value || "N/A";
        document.getElementById('imdbRating').textContent = imdbRating;
        document.getElementById('rottenTomatoesRating').textContent = rottenTomatoesRating;
        document.getElementById('metacriticRating').textContent = metacriticRating;

        // Set Links
        document.getElementById('imdbLink').href = `https://www.imdb.com/title/${movieData.imdbID}`;
        document.getElementById('rottenTomatoesLink').href = `https://www.rottentomatoes.com/search?search=${movieData.Title}`;
        document.getElementById('metacriticLink').href = `https://www.metacritic.com/search/${movieData.Title}`;
    }
});
