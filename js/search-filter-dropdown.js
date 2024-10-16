window.addEventListener('DOMContentLoaded', () => {
    const dropbtn = document.querySelector('.dropbtn');
    const filterDropdown = document.getElementById("filterDropdown");
    const suggestionsList = document.getElementById('suggestionsList');
    const warnings = document.getElementById('warnings');

    dropbtn.addEventListener('click', (event) => {
        event.stopPropagation();
        suggestionsList.style.display = 'none';
        warnings.style.display = 'none';
        filterDropdown.classList.toggle("show");
    });

    // Close the dropdown menu if the user clicks outside of it
    window.onclick = function (event) {
        if (!event.target.matches('.dropbtn')) {
            let dropdowns = document.getElementsByClassName("dropdown-content");
            let i;
            for (i = 0; i < dropdowns.length; i++) {
                let openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }
});
