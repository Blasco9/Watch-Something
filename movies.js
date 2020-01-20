import { showLatestMovies } from './main.js';

// Variables
const API_KEY = '9d181ecc759bf1deab6d6c3688395ebb',
  moviesSection = document.getElementById('movies'),
  menuList = document.querySelector('.list'),
  searchSection = document.getElementById('searchSection'),
  genresSection = document.getElementById('genresSection');
let page = 1;
// Initialize genre list
let genres = getGenres().then(resolve => {
  genres = resolve.genres;
});

// Initial configuration on page load
onload = function init() {
  // Shows latest movies on page load
  showLatestMovies();
  // Hides the search bar
  searchSection.style.display = 'none';
  // Hides the genre list
  genresSection.style.display = 'none';
};

// Top Rated
function getTopRated() {
  let movies = fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en`)
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      return resolve.results.filter((el, index) => index <= 9);
    });
  return movies;
}

// Popular
function getPopular() {
  let movies = fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en`)
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      return resolve.results.filter((el, index) => index <= 9);
    });
  return movies;
}

// Genre
function genreMode(e) {
  moviesSection.innerHTML = '';

  if (e.target.className == 'genre') {
    genresSection.style.display = 'block';
    genresSection.addEventListener('change', function(e) {
      showMovies(getMoviesByGenre);
      e.preventDefault();
    });
  } else {
    genresSection.style.display = 'none';
  }
}

function getGenres() {
  let genres = fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en`)
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      return resolve;
    });
  return genres;
}

function getMoviesByGenre() {
  let selectedGenere = genresSection.value;
  let genreID;

  genres.forEach(el => {
    el.name === selectedGenere ? (genreID = el.id) : null;
  });

  let movies = fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en&sort_by=popularity.desc&include_adult=true&with_genres=${genreID}`
  )
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      return resolve.results;
    });
  return movies;
}

// Search
function searchMode(e) {
  moviesSection.innerHTML = '';

  if (e.target.className == 'search') {
    searchSection.style.display = 'block';
    searchSection.addEventListener('submit', function(e) {
      showMovies(searchMovies);
      e.preventDefault();
    });  
  } else {
    searchSection.style.display = 'none';
  }
}

function searchMovies() {
  let input = document.getElementById('search').value;

  let movies = fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en&query=${input}&include_adult=true`)
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      return resolve.results;
    });
  return movies;
}

// Renders movies
function showMovies(callback) {
  moviesSection.innerHTML = '';

  callback().then(resolve => {
    resolve.forEach((movie) => {
      moviesSection.innerHTML += `<div id="movie ${movie.title}">
          <a href="movie.html"><img src="http://image.tmdb.org/t/p/w300${movie.poster_path}" id="${movie.id}" class="movie-img" onerror="this.src='imagenes/Imagen_no_disponible.png'; this.className='img-not-found';"></a>
          </div>`; 
    });
  });
}

// Stores movie id in session storage
function setMovieIdInStorage(e) {
  if(e.target.className == "movie-img"){
    sessionStorage.setItem('id', e.target.id)
  }
}

function checkLi(e) {
  e.target.className == 'search' ? searchMode(e) : searchMode(e);
  e.target.className == 'latest' ? showLatestMovies() : null;
  e.target.className == 'top-rated' ? showMovies(getTopRated) : null;
  e.target.className == 'popular' ? showMovies(getPopular) : null;
  e.target.className == 'genre' ? genreMode(e) : genreMode(e);
}

// Add events
menuList.addEventListener('click', checkLi);
moviesSection.addEventListener('click', setMovieIdInStorage)