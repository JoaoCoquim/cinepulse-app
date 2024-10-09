window.addEventListener('DOMContentLoaded', () => {
    const searchContainer = document.getElementById('searchContainer');

    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target)) {
            suggestionsList.style.display = 'none';
            warnings.style.display = 'none';
        }
    });
});
