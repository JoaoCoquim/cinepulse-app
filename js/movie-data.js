document.addEventListener('DOMContentLoaded', () => {
    // Movie data will be passed as a query string
    const urlParams = new URLSearchParams(window.location.search);
    const movieData = JSON.parse(urlParams.get('movieData'));

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

    document.title = movieData.Title;

    // Ratings
    const imdbRating = movieData.Ratings.find(r => r.Source === "Internet Movie Database")?.Value || "N/A";
    const rottenTomatoesRating = movieData.Ratings.find(r => r.Source === "Rotten Tomatoes")?.Value || "N/A";
    const metacriticRating = movieData.Ratings.find(r => r.Source === "Metacritic")?.Value || "N/A";
    document.getElementById('imdbRating').textContent = imdbRating;
    document.getElementById('rottenTomatoesRating').textContent = rottenTomatoesRating;
    document.getElementById('metacriticRating').textContent = metacriticRating;

    // IMDb link
    document.getElementById('imdbLink').href = `https://www.imdb.com/title/${movieData.imdbID}`;

    // Rotten Tomatoes link
    document.getElementById('rottenTomatoesLink').href = `https://www.rottentomatoes.com/search?search=${movieData.Title}`;

    // Metacritic link
    document.getElementById('metacriticLink').href = `https://www.metacritic.com/search/${movieData.Title}`;
});
