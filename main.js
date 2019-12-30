const API_KEY = '9d181ecc759bf1deab6d6c3688395ebb';

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
  const seccionPeliculas = document.querySelector('#peliculas');

  getLatestMovies().then(resolve => {
    resolve.forEach(movie => {
      seccionPeliculas.innerHTML += `<div style="width: 20%" id="pelicula ${movie.title}">
        <h3>${movie.title}</h3>
        <img src="http://image.tmdb.org/t/p/w200${movie.poster_path}" onerror="this.src='imagenes/Imagen_no_disponible.png'">
        <p>${movie.overview}</p></div>`;
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
  let seccionSeries = document.querySelector('#series');

  getLatestShows().then(resolve => {
    resolve.forEach(show => {
      seccionSeries.innerHTML += `<div style="width: 20%" id="serie ${show.name}">
        <h3>${show.name}</h3>
        <img src="http://image.tmdb.org/t/p/w200${show.poster_path}" onerror="this.src='imagenes/Imagen_no_disponible.png'">
        <p>${show.overview}</p></div>`;
    });
  });
}

onload = function Initialize() {
  showLatestMovies();
  showLatestShows();
};
