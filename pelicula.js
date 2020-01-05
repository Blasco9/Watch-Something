const API_KEY = '9d181ecc759bf1deab6d6c3688395ebb',
  seccionPelicula = document.getElementById('pelicula'),
  listaMenu = document.querySelector('.list'),
  movieId = sessionStorage.getItem('id');

showMovie();

function getMovie() {
  let movie = fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=es`)
    .then(res => {
      return res.json();
    })
    .then(res => {
      return res;
    });
  return movie;
}

function showMovie() {
  getMovie().then(movie => {
    console.log(movie)
    seccionPelicula.innerHTML = `<div style="width: 20%" id="${movie.title}">
    <h3>${movie.title}</h3>
    <a href="#"><img src="http://image.tmdb.org/t/p/w200${movie.poster_path}" id="${movie.id}" class="movie-img" onerror="this.src='imagenes/Imagen_no_disponible.png'"></a>
    <p>${movie.overview}</p></div>`;
  });
}