const API_KEY = '9d181ecc759bf1deab6d6c3688395ebb',
  seccionPelicula = document.getElementById('pelicula'),
  listaMenu = document.querySelector('.list'),
  movieId = sessionStorage.getItem('id');

showMovie();

function getMovie() {
  let movie = fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=es&append_to_response=credits,videos`)
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
    // Get the first 5 cast members
    let cast = movie.credits.cast.filter((el, i) => i < 5).map(el => el.name).join(", ");
    // Get the genres
    let genres = movie.genres.map(el => el.name).join(", ");
    let trailer = movie.videos.results[0] || {key: ""}

    seccionPelicula.innerHTML = `<div style="width: 20%" id="${movie.title}">
    <h3>${movie.title}</h3>
    <a href="#"><img src="http://image.tmdb.org/t/p/w200${movie.poster_path}" id="${movie.id}" class="movie-img" onerror="this.src='imagenes/Imagen_no_disponible.png'"></a>
    <p>Cast: ${cast}</p>
    <p>Genres: ${genres}</p>
    <p>Tagline: ${movie.tagline}</p>
    <p>Release Date: ${movie.release_date}</p>
    <p>Runtime: ${movie.runtime} min</p>
    <p>Rating: ${movie.vote_average}</p>
    <p>${movie.overview}</p></div>
    <div id='video'>
    <iframe width="600" height="400" src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>
    </div>`;
  });
}