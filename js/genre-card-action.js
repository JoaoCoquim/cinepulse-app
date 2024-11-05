window.addEventListener('DOMContentLoaded', () => {
    const genreCards = document.querySelectorAll('.genre-card');
    
    genreCards.forEach(card => {
        card.addEventListener('click', (event) => {
            const genre = card.querySelector('.card-text').innerText;
            window.location.href = `movies-by-genre.html?genre=${encodeURIComponent(genre)}`;
        });
    });
});
