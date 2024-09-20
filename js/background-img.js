document.addEventListener('DOMContentLoaded', () => {
    const images = [
        'img/movie-wallpapers/alien.jpg',
        'img/movie-wallpapers/deadpool.jpg',
        'img/movie-wallpapers/et.jpg',
        'img/movie-wallpapers/inception.jpg',
        'img/movie-wallpapers/inside-out.jpg',
        'img/movie-wallpapers/it.jpg',
        'img/movie-wallpapers/jurassic-park.jpg',
        'img/movie-wallpapers/lord-of-the-rings.jpg',
        'img/movie-wallpapers/matrix.jpg',
        'img/movie-wallpapers/star-wars.jpg',
        'img/movie-wallpapers/up.jpg',
        'img/movie-wallpapers/wall-e.jpg'
    ];

    let currentImageIndex = Math.floor(Math.random() * images.length);

    // Preload images into an array of Image objects for faster loading
    const preloadedImages = images.map(image => {
        const img = new Image();
        img.src = image;
        return img;
    });

    function changeBackgroundImage() {
        const masthead = document.querySelector('.masthead');
        masthead.style.backgroundImage = `url(${preloadedImages[currentImageIndex].src})`; // Use preloaded images

        // Update index to show the next image
        currentImageIndex = (currentImageIndex + 1) % images.length;
    }

    changeBackgroundImage();

    // Change image every 5 seconds
    setInterval(changeBackgroundImage, 5000);

});
