window.addEventListener('DOMContentLoaded', () => {
  let suggestedMovies;
  let currentIndex = -1;
  let firstArrowUpPress = true;

  const resetHighlights = () => {
    suggestedMovies.forEach(item => item.style.backgroundColor = "");
  };

  const highlightMovie = (index) => {
    if (index >= 0 && index < suggestedMovies.length) {
      resetHighlights();
      suggestedMovies[index].style.backgroundColor = "#f88d6f";
      // Scroll the highlighted movie into view
      suggestedMovies[index].scrollIntoView({
        behavior: "auto",
        block: "nearest"
      });
    }
  };

  const handleArrowNavigation = (event) => {
    // Updates suggestedMovies every time a key is pressed
    suggestedMovies = document.querySelectorAll("#suggestions li");

    if (event.key === "ArrowDown") {
      event.preventDefault();
      currentIndex = (currentIndex + 1) % suggestedMovies.length;
      highlightMovie(currentIndex);
      firstArrowUpPress = false;
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (firstArrowUpPress) {
        currentIndex = 2; // Sets index to third suggested movie on first Arrow Up press
        firstArrowUpPress = false;
      } else {
        currentIndex = (currentIndex - 1 + suggestedMovies.length) % suggestedMovies.length; // Move up
      }
      highlightMovie(currentIndex);
    } else if (event.key === "Enter" && currentIndex >= 0) {
      event.preventDefault();
      suggestedMovies[currentIndex].click();
      resetHighlights();
    }
  };

  // Listen to keyboard events on the search input
  document.getElementById("searchInput").addEventListener("keydown", handleArrowNavigation);
});
