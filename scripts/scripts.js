let filmsData = []; // Initialize an empty array to hold film data

// Fetch film data from the JSON file
fetch('scripts/films_data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok.");
        }
        return response.json();
    })
    .then(data => {
        filmsData = data; // Store fetched data into filmsData
        console.log("Films data loaded:", filmsData); // Debugging log
        renderFilms(filmsData); // Render the films initially
    })
    .catch(error => {
        console.error('Error loading film data:', error);
    });

// Function to clean and convert the Box Office Revenue
function cleanBoxOfficeRevenue(revenue) {
    // Remove non-numeric characters except for the decimal point
    const cleanedRevenue = revenue.replace(/[^0-9.-]+/g, "");
    // Convert to a number
    return parseFloat(cleanedRevenue);
}

// Render film data dynamically
function renderFilms(films) {
    const filmContainer = document.getElementById('filmData');
    filmContainer.innerHTML = ''; // Clear any existing data

    if (films.length === 0) {
        filmContainer.innerHTML = "<p>No films available</p>";
        return;
    }

    films.forEach(film => {
        const filmCard = document.createElement('div');
        filmCard.classList.add('card');

        // Clean and convert Box Office Revenue to a number before formatting
        const boxOffice = cleanBoxOfficeRevenue(film["Box Office Revenue"]);
        //console.log(film);

        filmCard.innerHTML = `
            <h2>${film.Title}</h2>
            <p class="release-year">Release Year: ${film['Release Year']}</p>
            <p>Directors: ${film.Directors}</p>
            <p class="box-office">$${boxOffice.toLocaleString()}</p>
            <p>Country: ${film['Country of Origin']}</p>
        `;

        filmContainer.appendChild(filmCard);
    });
}

// Sort films based on selected criteria
function sortFilms() {
    const sortBy = document.getElementById('sortBy').value;
    let sortedFilms;

    if (sortBy === 'title') {
        sortedFilms = [...filmsData].sort((a, b) => a.Title.localeCompare(b.Title));
    } else if (sortBy === 'releaseYear') {
        sortedFilms = [...filmsData].sort((a, b) => a['Release Year'] - b['Release Year']);
    } else if (sortBy === 'boxOffice') {
        sortedFilms = [...filmsData].sort((a, b) => {
            const boxOfficeA = cleanBoxOfficeRevenue(a["Box Office Revenue"]);
            const boxOfficeB = cleanBoxOfficeRevenue(b["Box Office Revenue"]);
            return boxOfficeB - boxOfficeA; // Sort descending by box office revenue
        });
    }

    renderFilms(sortedFilms);
}

// Filter films by country
function filterFilms() {
    const filterCountry = document.getElementById('filterCountry').value.toLowerCase();
    const filterName = document.getElementById('filterName').value.toLowerCase();

    const filteredFilms = filmsData.filter(film => {
        const matchesCountry = film['Country of Origin'].toLowerCase().includes(filterCountry);
        const matchesName = film.Title.toLowerCase().includes(filterName);
        return matchesCountry && matchesName; // Filter by both country and title
    });

    renderFilms(filteredFilms);
}

// Initial render when data is loaded (already handled by the fetch)
