const API_KEY = '9d181ecc759bf1deab6d6c3688395ebb',
  seccionSeries = document.querySelector('#series'),
  seccionPeliculas = document.querySelector('#peliculas');

export function getLatestMovies() {
  let movies = fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=es&region=AR`)
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      let movies = resolve.results.filter((el, index) => {
        return index <= 4;
      });
      return movies;
    });
  return movies;
}

export function showLatestMovies() {
  getLatestMovies().then(resolve => {
    resolve.forEach(movie => {
      seccionPeliculas.innerHTML += `<div id="pelicula ${movie.title}">
        <a href="pelicula.html"><img src="http://image.tmdb.org/t/p/w300${movie.poster_path}" id="${movie.id}" class="movie-img" onerror="this.src='imagenes/Imagen_no_disponible.png'"></a>
        </div>`;
    });
  });
}

export function getLatestShows() {
  let shows = fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${API_KEY}&language=es&region=AR`)
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      let shows = resolve.results.filter((el, index) => {
        return index <= 4;
      });
      return shows;
    });

  return shows;
}

export function showLatestShows() {
  getLatestShows().then(resolve => {
    resolve.forEach(show => {
      seccionSeries.innerHTML += `<div id="serie ${show.name}">
        <a href="serie.html"><img src="http://image.tmdb.org/t/p/w300${show.poster_path}" id="${show.id}" class="show-img" onerror="this.src='imagenes/Imagen_no_disponible.png'"></a>
        </div>`;
    });
  });
}

function setIdInStorage(e) {
  if (e.target.className.includes('img')) {
    sessionStorage.setItem('id', e.target.id);
  }
}

onload = function Initialize() {
  showLatestMovies();
  showLatestShows();

  seccionSeries.addEventListener('click', setIdInStorage);
  seccionPeliculas.addEventListener('click', setIdInStorage);
};
