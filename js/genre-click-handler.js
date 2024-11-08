window.addEventListener('DOMContentLoaded', () => {

    const createGenreBlock = (genre) => {
        const genreBlocks = document.getElementById('genre-blocks');

        const genreColumn = document.createElement('div');
        genreColumn.classList.add('col');

        const genreLink = document.createElement('a');
        genreLink.setAttribute('href', `movies-by-genre.html?genre=${encodeURIComponent(genre)}`)

        const genreContainer = document.createElement('div');
        genreContainer.classList.add('genre-container');

        const genreImage = document.createElement('img');
        genreImage.classList.add('genre-img');
        genreImage.setAttribute('src', `img/genres/${genre}.jpg`);
        genreImage.setAttribute('alt', `${genre}`);

        const genreName = document.createElement('p');
        genreName.classList.add('genre-name');
        genreName.textContent = genre;

        genreContainer.append(genreImage, genreName);
        genreLink.appendChild(genreContainer);
        genreColumn.appendChild(genreLink);
        genreBlocks.appendChild(genreColumn);
    }

    fetch('../data/tmdb_genres.json')
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.genres.length; i++) {
                const genre = data.genres[i].name;
                createGenreBlock(genre);
            }
        })
        .catch(error => console.error('Error fetching JSON file:', error));
});
