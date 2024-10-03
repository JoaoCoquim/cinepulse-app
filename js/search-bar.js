window.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('searchBar');

    document.addEventListener('click', (e) => {
        if (!searchBar.contains(e.target)) {
            suggestions.style.display = 'none';
            warnings.style.display = 'none';
        }
    });
});
