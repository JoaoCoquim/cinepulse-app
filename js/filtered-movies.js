document.addEventListener('DOMContentLoaded', () => {
    const TMDB_API_KEY = window.config.TMDB_API_KEY;
    const urlParams = new URLSearchParams(window.location.search);
    const movieGenre = urlParams.get('genre');

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
                                console.log('Movies:', moviesData);
                            } else {
                                alert('No movie details were found for that genre!');
                            }
                        })
                        .catch(error => console.error(`Error fetching movies with genre '${movieGenre}':`, error));
                }
            })
        })
});
