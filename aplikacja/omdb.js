// omdb.js

const API_KEY = '1b1e879d'; // Klucz API

// Funkcja wyszukuj¹ca filmy po tytule
function searchMovie() {
    const title = document.getElementById('searchInput').value.trim();
    const resultsContainer = document.getElementById('results');
    const detailsContainer = document.getElementById('movieDetails');

    if (!title) {
        alert('Wpisz tytul filmu.');
        return;
    }

    resultsContainer.innerHTML = '<p>Szukam...</p>';
    detailsContainer.innerHTML = '';

    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(title)}`)
        .then(response => response.json())
        .then(data => {
            console.log('Dane z OMDb:', data);
            resultsContainer.innerHTML = '';

            if (data.Response === 'True') {
                data.Search.forEach(movie => {
                    const movieItem = document.createElement('div');
                    movieItem.className = 'movie-item';
                    movieItem.innerHTML = `
                        <h3>${movie.Title} (${movie.Year})</h3>
                        <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="Poster" height="200">
                        <br>
                        <button onclick="getDetails('${movie.imdbID}')">Szczegoly</button>
                        <hr>
                    `;
                    resultsContainer.appendChild(movieItem);
                });
            } else {
                resultsContainer.innerHTML = `<p>Nie znaleziono filmow.</p>`;
            }
        })
        .catch(error => {
            console.error('Blad zapytania do OMDb:', error);
            resultsContainer.innerHTML = `<p>Blad polaczenia z API.</p>`;
        });
}

// Funkcja pobieraj¹ca szczegó³y wybranego filmu
function getDetails(imdbID) {
    const detailsContainer = document.getElementById('movieDetails');
    detailsContainer.innerHTML = '<p>Ladowanie szczegolow...</p>';

    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`)
        .then(response => response.json())
        .then(data => {
            detailsContainer.innerHTML = `
                <h2>${data.Title} (${data.Year})</h2>
                <p><strong>Rezyser:</strong> ${data.Director}</p>
                <p><strong>Gatunek:</strong> ${data.Genre}</p>
                <p><strong>Obsada:</strong> ${data.Actors}</p>
                <p><strong>Opis:</strong> ${data.Plot}</p>
                <p><strong>Ocena IMDb:</strong> ${data.imdbRating}</p>
                <img src="${data.Poster !== 'N/A' ? data.Poster : 'placeholder.jpg'}" alt="Poster" height="300">
                <br><br>
            `;
        })
        .catch(error => {
            console.error('Blad pobierania szczegolow filmu:', error);
            detailsContainer.innerHTML = `<p>Nie udalo sie pobrac szczegolow.</p>`;
        });
}