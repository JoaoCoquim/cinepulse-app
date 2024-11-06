window.addEventListener('DOMContentLoaded', () => {
    const genreContainers = document.querySelectorAll('.genre-container');
    
    genreContainers.forEach(container => {
        container.addEventListener('click', () => {
            const genre = container.querySelector('.genre-name').innerText;
            window.location.href = `movies-by-genre.html?genre=${encodeURIComponent(genre)}`;
        });
    });
});
