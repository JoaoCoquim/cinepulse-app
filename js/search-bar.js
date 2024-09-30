window.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const searchBar = document.getElementById('searchBar');
    const searchInput = document.getElementById('searchInput');

    searchButton.onclick = function () {
        if (searchBar.style.display === 'none' || searchBar.style.display === '') {
            searchButton.style.display = 'none';
            searchBar.style.display = 'block';
            searchInput.focus();
        } else {
            searchBar.style.display = 'none';
        }
    };

    document.addEventListener('click', (e) => {
        if (!searchBar.contains(e.target)) {
            suggestions.style.display = 'none';
            warnings.style.display = 'none';
        }
    });
});
