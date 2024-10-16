document.addEventListener('DOMContentLoaded', () => {

    const filterDropdown = document.getElementById('filterDropdown');
    filterDropdown.innerHTML = '';

    fetch('./data/tmdb_genres.json')
        .then(response => response.json())
        .then(data => {
            data.genres.forEach(genre => {
                const genreElement = document.createElement('a');
                genreElement.classList.add('genre-item');
                genreElement.href = '#';
                genreElement.textContent = genre.name;
                filterDropdown.appendChild(genreElement);
            })
        })
        .catch(error => console.error('Error loading genres:', error));
});