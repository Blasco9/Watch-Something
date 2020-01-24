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
  // Initialize all event listeners
  addEvents();
};

// Adds events
function addEvents() {
  menuList.addEventListener('click', checkLi);
  showsSection.addEventListener('click', setShowIdInStorage);
  genresSection.addEventListener('change', function(e) {
    showShows(getShowsByGenre);
    e.preventDefault();
  });
  searchSection.addEventListener('submit', function(e) {
    showShows(searchShows);
    e.preventDefault();
  });
}

// Top Rated
function getTopRated() {
  let shows = fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}&language=en`)
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      return resolve.results.filter((el, index) => index <= 11);
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
      return resolve.results.filter((el, index) => index <= 11);
    });
  return shows;
}

// Genre
function genreMode(e) {
  showsSection.innerHTML = '';
  document.getElementById('search').value = '';

  if (e.target.className.includes('genre')) {
    genresSection.style.display = 'block';
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

  if (e.target.className.includes('search')) {
    searchSection.style.display = 'block';
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
          <a href="show.html"><img src="http://image.tmdb.org/t/p/w300${show.poster_path}" id="${show.id}" class="show-img" onerror="this.src='img/img-not-found.png'; this.className='img-not-found';"></a>
          </div>`;
    });
  });
}

// Stores show id in session storage
function setShowIdInStorage(e) {
  if (e.target.className.includes('show-img')) {
    sessionStorage.setItem('id', e.target.id);
  }
}

function checkLi(e) {
  toggleSelected(e);

  e.target.className.includes('search') ? searchMode(e) : searchMode(e);
  e.target.className.includes('latest') ? showLatestShows() : null;
  e.target.className.includes('top-rated') ? showShows(getTopRated) : null;
  e.target.className.includes('popular') ? showShows(getPopular) : null;
  e.target.className.includes('genre') ? genreMode(e) : genreMode(e);
}

// Change color of selected Li
function toggleSelected(e) {
  let lis = menuList.children;

  for (let i = 0; i < lis.length; i++) {
    lis[i] == e.target ? lis[i].classList.add('selected') : lis[i].classList.remove('selected');
  }
}
