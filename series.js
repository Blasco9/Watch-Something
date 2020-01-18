import { showLatestShows } from './main.js';

// Variables
const API_KEY = '9d181ecc759bf1deab6d6c3688395ebb',
  seccionSeries = document.getElementById('series'),
  listaMenu = document.querySelector('.list'),
  seccionBuscador = document.getElementById('seccionBuscador'),
  seccionGeneros = document.getElementById('seccionGeneros');
// Inicializa la lista de generos
let genres = getGenres().then(resolve => {
  genres = resolve.genres;
});

// Configuracion inicial al cargar
onload = function init() {
  // Muestra ultimas series al cargar
  showLatestShows();
  // Oculta el buscador
  seccionBuscador.style.display = 'none';
  // Oculta selector de genero
  seccionGeneros.style.display = 'none';
};

// Top Rated
function getTopRated() {
  let shows = fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}&language=es`)
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
  let shows = fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=es`)
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
  if (e.target.className == 'genero') {
    seccionGeneros.style.display = 'block';
    seccionGeneros.addEventListener('change', function(e) {
      showShows(getShowsByGenre);
      e.preventDefault();
    });
  } else {
    seccionGeneros.style.display = 'none';
  }
}

function getGenres() {
  let genres = fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=es`)
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      return resolve;
    });
  return genres;
}

function getShowsByGenre() {
  let selectedGenere = seccionGeneros.value;
  let genreID;

  genres.forEach(el => {
    el.name === selectedGenere ? (genreID = el.id) : null;
  });

  let shows = fetch(
    `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=es&sort_by=popularity.desc&with_genres=${genreID}&include_null_first_air_dates=false`
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
  if (e.target.className == 'buscar') {
    seccionBuscador.style.display = 'block';
    seccionBuscador.addEventListener('submit', function(e) {
      showShows(searchShows);
      e.preventDefault();
    });
  } else {
    seccionBuscador.style.display = 'none';
  }
}

function searchShows() {
  let input = document.getElementById('buscador').value;

  let shows = fetch(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&language=es&query=${input}`)
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      return resolve.results;
    });
  return shows;
}

// Muestra las series en pantalla
function showShows(callback) {
  seccionSeries.innerHTML = '';

  callback().then(resolve => {
    resolve.forEach(show => {
      seccionSeries.innerHTML += `<div id="serie ${show.name}">
          <a href="serie.html"><img src="http://image.tmdb.org/t/p/w300${show.poster_path}" id="${show.id}" class="show-img" onerror="this.src='imagenes/Imagen_no_disponible.png'; this.className='img-not-found';"></a>
          </div>`;
    });
  });
}

// Guarda id de la serie en storage
function setShowIdInStorage(e) {
  if(e.target.className == "show-img"){
    sessionStorage.setItem('id', e.target.id)
  }
}

function checkLi(e) {
  seccionSeries.innerHTML = '';
  e.target.className == 'buscar' ? searchMode(e) : searchMode(e);
  e.target.className == 'ultimas' ? showLatestShows() : null;
  e.target.className == 'valoradas' ? showShows(getTopRated) : null;
  e.target.className == 'populares' ? showShows(getPopular) : null;
  e.target.className == 'genero' ? genreMode(e) : genreMode(e);
}

// Add events
listaMenu.addEventListener('click', checkLi);
seccionSeries.addEventListener('click', setShowIdInStorage)