window.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const searchContainer = document.getElementById('searchContainer');
    const searchInputField = document.getElementById('searchInputField');

    searchButton.onclick = function () {
        if (searchContainer.style.display === 'none' || searchContainer.style.display === '') {
            searchButton.style.display = 'none';
            searchContainer.style.display = 'block';
            searchInputField.focus();
        } else {
            searchContainer.style.display = 'none';
        }
    };
});
