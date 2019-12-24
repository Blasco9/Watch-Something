import { showLatestMovies } from './main.js';

const API_KEY = '9d181ecc759bf1deab6d6c3688395ebb',
  seccionPeliculas = document.getElementById('peliculas'),
  listaMenu = document.querySelector('.list'),
  seccionBuscador = document.getElementById('seccionBuscador'),
  seccionGeneros = document.getElementById('seccionGeneros');

// Muestra ultimas peliculas al cargar
onload = function init() {
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

function showTopRated() {
  getTopRated().then(resolve => {
    resolve.forEach(movie => {
      seccionPeliculas.innerHTML += `<div style="width: 20%" id="pelicula ${movie.title}">
        <h3>${movie.title}</h3>
        <img src="http://image.tmdb.org/t/p/w200${movie.poster_path}">
        <p>${movie.overview}</p></div>`;
    });
  });
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

function showPopular() {
  getPopular().then(resolve => {
    resolve.forEach(movie => {
      seccionPeliculas.innerHTML += `<div style="width: 20%" id="pelicula ${movie.title}">
        <h3>${movie.title}</h3>
        <img src="http://image.tmdb.org/t/p/w200${movie.poster_path}">
        <p>${movie.overview}</p></div>`;
    });
  });
}

function genreMode(e) {
  if(e.target.className == 'genero'){
    seccionGeneros.style.display = 'block'
    seccionGeneros.addEventListener('change', showGenere);
  } else {
    seccionGeneros.style.display = 'none'
  }
}

function getGenres(genre) {
  let genreID = fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=es`)
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      let genreID;
      resolve.genres.forEach(el => {
        el.name === genre ? (genreID = el.id) : null;
      });
      return genreID;
    });
  return genreID;
}

function getMoviesByGenre(genreID) {
  let movies = fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=es&sort_by=popularity.desc&include_adult=true&with_genres=${genreID}`
  )
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      return resolve;
    });
  return movies;
}

function showGenere(e) {
  let genre = e.target.value;

  seccionPeliculas.innerHTML = '';

  getGenres(genre).then(genreID => {
    getMoviesByGenre(genreID).then(resolve => {
      console.log(resolve.results);
      resolve.results.forEach(movie => {
        seccionPeliculas.innerHTML += `<div style="width: 20%" id="pelicula ${movie.title}">
        <h3>${movie.title}</h3>
        <img src="http://image.tmdb.org/t/p/w200${movie.poster_path}" onerror="this.src='imagenes/Imagen_no_disponible.png'">
        <p>${movie.overview}</p></div>`;
      });
    });
  });
}

function searchMode(e) {
  if(e.target.className == 'buscar'){
    seccionBuscador.style.display = 'block'
    seccionBuscador.addEventListener('submit', showMovies);
  } else {
    seccionBuscador.style.display = 'none'
  }
}

function searchMovies(input) {
  let movies = fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=es&query=${input}&include_adult=true`)
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      return resolve.results;
    });
  return movies;
}

function showMovies(e) {
  let input = document.getElementById('buscador').value;
  // Borra las peliculas de la busqueda anterior y el input
  seccionPeliculas.innerHTML = '';
  // Muestra las peliculas
  searchMovies(input).then(resolve => {
    resolve.forEach(movie => {
      seccionPeliculas.innerHTML += `<div style="width: 20%" id="pelicula ${movie.title}">
      <h3>${movie.title}</h3>
      <img src="http://image.tmdb.org/t/p/w200${movie.poster_path}">
      <p>${movie.overview}</p></div>`;
    });
  });
  e.preventDefault();
}

// Events
listaMenu.addEventListener('click', checkLi);

function checkLi(e) {
  seccionPeliculas.innerHTML = '';
  e.target.className == 'buscar' ? searchMode(e) : searchMode(e);
  e.target.className == 'ultimas' ? showLatestMovies() : null;
  e.target.className == 'valoradas' ? showTopRated() : null;
  e.target.className == 'populares' ? showPopular() : null;
  e.target.className == 'genero' ? genreMode(e) : genreMode(e);
}
