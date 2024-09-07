document.addEventListener('DOMContentLoaded', () => {
  const YOUTUBE_API_KEY = window.config.YOUTUBE_API_KEY;
  const movieTitle = document.getElementById('title').textContent;
  const movieYear = document.getElementById('year').textContent;
  const youtubeSearch = `${movieTitle} ${movieYear} movie trailer`;

  fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${youtubeSearch}&key=${YOUTUBE_API_KEY}`)
    .then(response => response.json())
    .then(data => {
      const videoId = data.items[0].id.videoId;  // Gets the first video result
      document.getElementById('trailerPlayer').src = `https://www.youtube.com/embed/${videoId}`;
    });
});