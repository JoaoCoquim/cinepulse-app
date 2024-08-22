const images = [
    'img/movies/alien.jpg',
    'img/movies/deadpool.jpg',
    'img/movies/et.jpg',
    'img/movies/inception.jpg',
    'img/movies/inside-out.jpg',
    'img/movies/it.jpg',
    'img/movies/jurassic-park.jpg',
    'img/movies/lord-of-the-rings.jpg',
    'img/movies/matrix.jpg',
    'img/movies/starwars.jpg',
    'img/movies/up.jpg',
    'img/movies/wall-e.jpg'
];

let currentImageIndex = Math.floor(Math.random() * images.length);

// Function to change the background image
function changeBackgroundImage() {
    const masthead = document.querySelector('.masthead');
    masthead.style.backgroundImage = `url(${images[currentImageIndex]})`;

    // Update index to show the next image
    currentImageIndex = (currentImageIndex + 1) % images.length;
}

changeBackgroundImage();

// Change image every 5 seconds
setInterval(changeBackgroundImage, 5000);