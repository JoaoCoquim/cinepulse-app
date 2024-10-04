document.addEventListener('DOMContentLoaded', () => {
    const YOUTUBE_API_KEY = window.config.YOUTUBE_API_KEY;
    const movieTitle = document.getElementById('title').textContent;
    const movieYear = document.getElementById('year').textContent;
    const youtubeSearch = `${movieTitle} ${movieYear} movie trailer`;
    const imageContainer = document.querySelector('.image-container');
    const placeholderImage = document.getElementById('placeholderImage');
    const playButtonOverlay = document.querySelector('.play-button-overlay');
    const trailerWrapper = document.querySelector('.trailer-wrapper');
    const trailerPlayer = document.getElementById('trailerPlayer');

    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${youtubeSearch}&key=${YOUTUBE_API_KEY}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                if (data.error.errors[0].reason === 'quotaExceeded') {
                    console.error('Quota limit reached:', data.error.message);
                    showNotAvailableImage();
                } else {
                    console.error('YouTube API Error:', data.error.message);
                    showNotAvailableImage();
                }
            } else {
                // Check if there are video results
                if (data.items && data.items.length > 0) {
                    const videoId = data.items[0].id.videoId;

                    placeholderImage.src = data.items[0].snippet.thumbnails.medium.url; // Display trailer thumbnail
                    placeholderImage.alt = `${movieTitle} trailer thumbnail`;
                    placeholderImage.addEventListener('load', () => {
                        playButtonOverlay.style.display = 'block';
                    });

                    imageContainer.addEventListener('click', () => {
                        placeholderImage.style.display = 'none';
                        playButtonOverlay.style.display = 'none';
                        trailerWrapper.style.display = 'block';
                        trailerPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                    })
                };
            }
        })
        .catch(error => {
            console.error('Error fetching YouTube data:', error);
        });

    const showNotAvailableImage = () => {
        placeholderImage.src = 'img/no-trailer-available.jpg';
        placeholderImage.alt = `No trailer thumbnail`;
        playButtonOverlay.style.display = 'none';
        imageContainer.style.cursor = 'not-allowed';
    }
});
