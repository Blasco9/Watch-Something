import { showLatestMovies } from './main.js';

// Variables
const API_KEY = '9d181ecc759bf1deab6d6c3688395ebb',
  seccionPeliculas = document.getElementById('peliculas'),
  listaMenu = document.querySelector('.list'),
  seccionBuscador = document.getElementById('seccionBuscador'),
  seccionGeneros = document.getElementById('seccionGeneros');
// Inicializa la lista de generos
let genres = getGenres().then(resolve => {
  genres = resolve.genres;
});

// Configuracion inicial al cargar
onload = function init() {
  // Muestra ultimas peliculas al cargar
  showLatestMovies();
  // Oculta el buscador
  seccionBuscador.style.display = 'none';
  // Oculta lista de generos
  seccionGeneros.style.display = 'none';
};

// Top Rated
function getTopRated() {
  let movies = fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=es&region=AR`)
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
  let movies = fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=es-&region=AR`)
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
  if (e.target.className == 'genero') {
    seccionGeneros.style.display = 'block';
    seccionGeneros.addEventListener('change', function(e) {
      showMovies(getMoviesByGenre);
      e.preventDefault();
    });
  } else {
    seccionGeneros.style.display = 'none';
  }
}

function getGenres() {
  let genres = fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=es`)
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      return resolve;
    });
  return genres;
}

function getMoviesByGenre() {
  let selectedGenere = seccionGeneros.value;
  let genreID;

  genres.forEach(el => {
    el.name === selectedGenere ? (genreID = el.id) : null;
  });

  let movies = fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=es&sort_by=popularity.desc&include_adult=true&with_genres=${genreID}`
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
  if (e.target.className == 'buscar') {
    seccionBuscador.style.display = 'block';
    seccionBuscador.addEventListener('submit', function(e) {
      showMovies(searchMovies);
      e.preventDefault();
    });  
  } else {
    seccionBuscador.style.display = 'none';
  }
}

function searchMovies() {
  let input = document.getElementById('buscador').value;

  let movies = fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=es&query=${input}&include_adult=true`)
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      return resolve.results;
    });
  return movies;
}

// Muestra las peliculas en pantalla
function showMovies(callback) {
  seccionPeliculas.innerHTML = '';

  callback().then(resolve => {
    resolve.forEach((movie) => {
      seccionPeliculas.innerHTML += `<div id="pelicula ${movie.title}">
          <a href="pelicula.html"><img src="http://image.tmdb.org/t/p/w300${movie.poster_path}" id="${movie.id}" class="movie-img" onerror="this.src='imagenes/Imagen_no_disponible.png'; this.className='img-not-found';"></a>
          </div>`; 
    });
  });
}

// Guarda id de la pelicula en storage
function setMovieIdInStorage(e) {
  if(e.target.className == "movie-img"){
    sessionStorage.setItem('id', e.target.id)
  }
}

function checkLi(e) {
  seccionPeliculas.innerHTML = '';
  e.target.className == 'buscar' ? searchMode(e) : searchMode(e);
  e.target.className == 'ultimas' ? showLatestMovies() : null;
  e.target.className == 'valoradas' ? showMovies(getTopRated) : null;
  e.target.className == 'populares' ? showMovies(getPopular) : null;
  e.target.className == 'genero' ? genreMode(e) : genreMode(e);
}

// Add events
listaMenu.addEventListener('click', checkLi);
seccionPeliculas.addEventListener('click', setMovieIdInStorage)