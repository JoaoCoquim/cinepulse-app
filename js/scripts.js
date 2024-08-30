/*!
* Start Bootstrap - Creative v7.0.7 (https://startbootstrap.com/theme/creative)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-creative/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Activate SimpleLightbox plugin for portfolio items
    new SimpleLightbox({
        elements: '#portfolio a.portfolio-box'
    });

});

const searchButton = document.getElementById('searchButton');
const searchBar = document.getElementById('searchBar');
const searchInput = document.getElementById('searchInput');

// Search Button behavior
searchButton.onclick = function () {
    if (searchBar.style.display === 'none' || searchBar.style.display === '') {
        searchButton.style.display = 'none';
        searchBar.style.display = 'block';
        searchInput.focus();
    } else {
        searchBar.style.display = 'none';
    }
};

const suggestions = document.getElementById('suggestions');

searchInput.addEventListener('input', function () {
    const query = searchInput.value.trim();
    if (query.length > 2) {
        const apiUrl = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=1f70a320`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.Response === "True") {
                    suggestions.innerHTML = '';
                    suggestions.style.display = 'block';

                    data.Search.forEach(movie => {
                        const li = document.createElement('li');
                        li.classList.add('list-group-item');
                        li.innerHTML = `
                            <div style="display: flex; align-items: center; padding: 10px; cursor: pointer;">
                                <img src="${movie.Poster}" alt="${movie.Title} Poster" style="width: auto; height: 75px; margin-right: 10px; object-fit: cover;">
                                <div>
                                    <strong>${movie.Title}</strong> (${movie.Year})
                                </div>
                            </div>
                        `;
                        li.dataset.imdbID = movie.imdbID;
                        li.addEventListener('click', () => selectMovie(movie.imdbID));
                        suggestions.appendChild(li);
                    });
                } else {
                    suggestions.style.display = 'none';
                }
            })
            .catch(error => console.error('Error fetching movie data:', error));
    } else {
        suggestions.style.display = 'none';
    }
});

function selectMovie(imdbID) {
    const apiUrl = `https://www.omdbapi.com/?i=${encodeURIComponent(imdbID)}&apikey=1f70a320`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.Response === "True") {
                const movieDataString = JSON.stringify(data);
                window.location.href = 'movie-info.html?movieData=' + encodeURIComponent(movieDataString);
            } else {
                alert('Movie not found!');
            }
        })
        .catch(error => console.error('Error fetching movie data:', error));
}

document.addEventListener('click', (e) => {
    if (!searchBar.contains(e.target)) {
        suggestions.style.display = 'none';
    }
});
