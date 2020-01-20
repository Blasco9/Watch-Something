import { showLatestShows } from './main.js';

// Variables
const API_KEY = '9d181ecc759bf1deab6d6c3688395ebb',
  showsSection = document.getElementById('shows'),
  menuList = document.querySelector('.list'),
  searchSection = document.getElementById('searchSection'),
  genresSection = document.getElementById('genresSection');
// Initialize genre list
let genres = getGenres().then(resolve => {
  genres = resolve.genres;
});

// Initial configuration on page load
onload = function init() {
  // Shows latest shows on page load
  showLatestShows();
  // Hides the search bar
  searchSection.style.display = 'none';
  // Hides the genre list
  genresSection.style.display = 'none';
};

// Top Rated
function getTopRated() {
  let shows = fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}&language=en`)
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      return resolve.results.filter((el, index) => index <= 9);
    });
  return shows;
}

// Popular
function getPopular() {
  let shows = fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en`)
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      return resolve.results.filter((el, index) => index <= 9);
    });
  return shows;
}

// Genre
function genreMode(e) {
  showsSection.innerHTML = '';

  if (e.target.className == 'genre') {
    genresSection.style.display = 'block';
    genresSection.addEventListener('change', function(e) {
      showShows(getShowsByGenre);
      e.preventDefault();
    });
  } else {
    genresSection.style.display = 'none';
  }
}

function getGenres() {
  let genres = fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=en`)
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      return resolve;
    });
  return genres;
}

function getShowsByGenre() {
  let selectedGenere = genresSection.value;
  let genreID;

  genres.forEach(el => {
    el.name === selectedGenere ? (genreID = el.id) : null;
  });

  let shows = fetch(
    `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=en&sort_by=popularity.desc&with_genres=${genreID}&include_null_first_air_dates=false`
  )
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      return resolve.results;
    });
  return shows;
}

// Search
function searchMode(e) {
  showsSection.innerHTML = '';

  if (e.target.className == 'search') {
    searchSection.style.display = 'block';
    searchSection.addEventListener('submit', function(e) {
      showShows(searchShows);
      e.preventDefault();
    });
  } else {
    searchSection.style.display = 'none';
  }
}

function searchShows() {
  let input = document.getElementById('search').value;

  let shows = fetch(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&language=en&query=${input}`)
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      return resolve.results;
    });
  return shows;
}

// Renders shows
function showShows(callback) {
  showsSection.innerHTML = '';

  callback().then(resolve => {
    resolve.forEach(show => {
      showsSection.innerHTML += `<div id="show ${show.name}">
          <a href="show.html"><img src="http://image.tmdb.org/t/p/w300${show.poster_path}" id="${show.id}" class="show-img" onerror="this.src='imagenes/Imagen_no_disponible.png'; this.className='img-not-found';"></a>
          </div>`;
    });
  });
}

// Stores show id in session storage
function setShowIdInStorage(e) {
  if(e.target.className == "show-img"){
    sessionStorage.setItem('id', e.target.id)
  }
}

function checkLi(e) {
  e.target.className == 'search' ? searchMode(e) : searchMode(e);
  e.target.className == 'latest' ? showLatestShows() : null;
  e.target.className == 'top-rated' ? showShows(getTopRated) : null;
  e.target.className == 'popular' ? showShows(getPopular) : null;
  e.target.className == 'genre' ? genreMode(e) : genreMode(e);
}

// Add events
menuList.addEventListener('click', checkLi);
showsSection.addEventListener('click', setShowIdInStorage)