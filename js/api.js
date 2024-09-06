const apiKey = "1f70a320";
const suggestions = document.getElementById('suggestions');
const warning = document.getElementById('warning');
const moviesWithTwoLetters = ["A.I.", "B.S.", "CQ", "D2", "Da", "Em", "F/X", "Go", "Ho!", "I.Q.", "If", "If....", "IO", "It", "Jo", "Pi", "No", "PK", "RV", "Up", "Us", "W.E."];

searchInput.addEventListener('input', function () {
    const query = searchInput.value.trim();
    let apiUrl = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}`;
    let isTwoLetterMatch = false;
    //console.log('Query:', query);

    // Checks for 2 letter movies and handle them with specific title search (?t=)
    moviesWithTwoLetters.forEach(element => {
        if (query.length >= 2 && query.toLowerCase() === element.toLowerCase()) {
            apiUrl = `https://www.omdbapi.com/?t=${element}&apikey=${apiKey}`;
            isTwoLetterMatch = true;  // Marks this as a single movie query (from the array)
        }
    });

    console.log('Fetching:', apiUrl);

    if (query.length > 1) {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.Response === "True") {
                    suggestions.innerHTML = '';
                    suggestions.style.display = 'block';
                    warning.style.display = 'none';

                    // Process results from movies with 2 letters
                    if (isTwoLetterMatch) {
                        const li = document.createElement('li');
                        li.classList.add('list-group-item');
                        li.innerHTML = `
                            <div style="display: flex; align-items: center; padding: 10px; cursor: pointer;">
                                <img src="${data.Poster}" alt="${data.Title} Poster" style="width: auto; height: 75px; margin-right: 10px; object-fit: cover;">
                                <div>
                                    <strong>${data.Title}</strong> (${data.Year})
                                </div>
                            </div>
                        `;
                        li.dataset.imdbID = data.imdbID;
                        li.addEventListener('click', () => selectMovie(data.imdbID));
                        suggestions.appendChild(li);
                    } else {
                        // Process results from `?s=` (multiple movies)
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
                    }

                    // Handle other results
                } else if (data.Error === "Too many results.") {
                    warning.innerHTML = `<p id="error">Too many results. Please check your syntax!</p>`;
                    warning.style.display = 'block';
                    suggestions.style.display = 'none';
                } else if (data.Error === "Movie not found!") {
                    warning.innerHTML = `<p id="error">Movie not found. Please check your syntax!</p>`;
                    warning.style.display = 'block';
                    suggestions.style.display = 'none';
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
    const apiUrl = `https://www.omdbapi.com/?i=${encodeURIComponent(imdbID)}&apikey=${apiKey}`;
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
