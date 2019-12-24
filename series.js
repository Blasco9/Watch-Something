import { showLatestShows, showLatestMovies } from './main.js'

const API_KEY = '9d181ecc759bf1deab6d6c3688395ebb',
  seccionSeries = document.getElementById('series'),
  listaMenu = document.querySelector('.list'),
  seccionBuscador = document.getElementById('seccionBuscador'),
  seccionGeneros = document.getElementById('seccionGeneros');

// Muestra ultimas series al cargar
onload = function init() {
  showLatestShows();

  // Oculta el buscador
  seccionBuscador.style.display = 'none';
  // Oculta lista de generos
  seccionGeneros.style.display = 'none';
};

// Top Rated
function getTopRated() {
  let shows = fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}&language=es`)
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      console.log(resolve);
      return resolve.results.filter((el, index) => index <= 9);
    });
  return shows;
}

function showTopRated() {
  getTopRated().then(resolve => {
    resolve.forEach(show => {
      if(!show.poster_path){
        seccionSeries.innerHTML += `<div style="width: 20%" id="pelicula ${show.name}">
          <h3>${show.name}</h3>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Imagen_no_disponible.svg/1024px-Imagen_no_disponible.svg.png" style="width: 200px;">
          <p>${show.overview}</p></div>`;
      } else {
        seccionSeries.innerHTML += `<div style="width: 20%" id="pelicula ${show.name}">
          <h3>${show.name}</h3>
          <img src="http://image.tmdb.org/t/p/w200${show.poster_path}">
          <p>${show.overview}</p></div>`;
      }
    });
  });
}

// Popular
function getPopular() {
  let shows = fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=es`)
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      console.log(resolve);
      return resolve.results.filter((el, index) => index <= 9);
    });
  return shows;
}

function showPopular() {
  getPopular().then(resolve => {
    resolve.forEach(show => {
      if(!show.poster_path){
        seccionSeries.innerHTML += `<div style="width: 20%" id="pelicula ${show.name}">
          <h3>${show.name}</h3>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Imagen_no_disponible.svg/1024px-Imagen_no_disponible.svg.png" style="width: 200px;">
          <p>${show.overview}</p></div>`;
      } else {
        seccionSeries.innerHTML += `<div style="width: 20%" id="pelicula ${show.name}">
          <h3>${show.name}</h3>
          <img src="http://image.tmdb.org/t/p/w200${show.poster_path}">
          <p>${show.overview}</p></div>`;
      }
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
  let genreID = fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=es`)
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

function getShowsByGenre(genreID) {
  let shows = fetch(
    `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=es&sort_by=popularity.desc&with_genres=${genreID}&include_null_first_air_dates=false`
  )
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      return resolve;
    });
  return shows;
}

function showGenere(e) {
  let genre = e.target.value;

  seccionSeries.innerHTML = '';

  getGenres(genre).then(genreID => {
    getShowsByGenre(genreID).then(resolve => {
      console.log(resolve.results);
      resolve.results.forEach(show => {
        if(!show.poster_path){
          seccionSeries.innerHTML += `<div style="width: 20%" id="pelicula ${show.name}">
            <h3>${show.name}</h3>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Imagen_no_disponible.svg/1024px-Imagen_no_disponible.svg.png" style="width: 200px;">
            <p>${show.overview}</p></div>`;
        } else {
          seccionSeries.innerHTML += `<div style="width: 20%" id="pelicula ${show.name}">
            <h3>${show.name}</h3>
            <img src="http://image.tmdb.org/t/p/w200${show.poster_path}">
            <p>${show.overview}</p></div>`;
        }
      });
    });
  });
}

function searchMode(e) {
  if(e.target.className == 'buscar'){
    seccionBuscador.style.display = 'block'
    seccionBuscador.addEventListener('submit', showShows);
  } else {
    seccionBuscador.style.display = 'none'
  }
}

function searchShows(input) {
  let shows = fetch(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&language=es&query=${input}`)
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      return resolve.results;
    });
  return shows;
}

function showShows(e) {
  let input = document.getElementById('buscador').value;
  // Borra las peliculas de la busqueda anterior y el input
  seccionSeries.innerHTML = '';
  // Muestra las peliculas
  searchShows(input).then(resolve => {
    resolve.forEach(show => {
      if(!show.poster_path){
        seccionSeries.innerHTML += `<div style="width: 20%" id="pelicula ${show.name}">
          <h3>${show.name}</h3>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Imagen_no_disponible.svg/1024px-Imagen_no_disponible.svg.png" style="width: 200px;">
          <p>${show.overview}</p></div>`;
      } else {
        seccionSeries.innerHTML += `<div style="width: 20%" id="pelicula ${show.name}">
          <h3>${show.name}</h3>
          <img src="http://image.tmdb.org/t/p/w200${show.poster_path}">
          <p>${show.overview}</p></div>`;
      }
    });
  });
  e.preventDefault();
}

// Events
listaMenu.addEventListener('click',checkLi);

function checkLi(e) {
  seccionSeries.innerHTML = '';
  e.target.className == 'buscar'? searchMode(e) : searchMode(e);
  e.target.className == 'ultimas'? showLatestShows() : null;
  e.target.className == 'valoradas'? showTopRated() : null;
  e.target.className == 'populares'? showPopular() : null;
  e.target.className == 'genero'? genreMode(e) : genreMode(e); 
}