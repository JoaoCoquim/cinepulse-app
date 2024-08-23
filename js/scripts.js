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

searchButton.onclick = function() {
    // Toggle the visibility of the search bar
    if (searchBar.style.display === 'none' || searchBar.style.display === '') {
        searchButton.style.display = 'none';
        searchBar.style.display = 'block';
        searchInput.focus();
    } else {
        searchBar.style.display = 'none';
    }
};

// API CALL
searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const movieTitle = searchInput.value;
        const apiKey = '1f70a320';
        const apiUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=${apiKey}`;
        // Example: https://www.omdbapi.com/?i=tt3896198&apikey=1f70a320

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.Response === "True") {
                    const movieDataString = JSON.stringify(data);
                    const movieWindow = window.open('movie-info.html?movieData=' + encodeURIComponent(movieDataString), '_blank');
                    movieWindow.focus();
                } else {
                    alert('Movie not found!');
                }
            })
            .catch(error => console.error('Error fetching movie data:', error));
    }
});
