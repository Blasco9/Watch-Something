const API_KEY = '9d181ecc759bf1deab6d6c3688395ebb',
  movieSection = document.getElementById('movie'),
  movieId = sessionStorage.getItem('id');

showMovie();

function getMovie() {
  let movie = fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en&append_to_response=credits,videos`)
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
    let cast = movie.credits.cast
      .filter((el, i) => i < 5)
      .map(el => el.name)
      .join(', ');
    // Get the genres
    let genres = movie.genres.map(el => el.name).join(', ');
    let trailer = movie.videos.results[0] || { key: '' };

    movieSection.innerHTML = `<div id="movie ${movie.title}">
      <h1 class="title">${movie.title}</h1>
      <div class="poster">
        <a href="#"><img src="http://image.tmdb.org/t/p/w300${movie.poster_path}" id="${movie.id}" class="movie-img" onerror="this.src='img/img-not-found.png'"></a>
      </div>
      <div class="info">
        <p class="info-paragraph"><span class="info-item">Cast:</span> ${cast}</p>
        <p class="info-paragraph"><span class="info-item">Genres:</span> ${genres}</p>
        <p class="info-paragraph"><span class="info-item">Tagline:</span> ${movie.tagline}</p>
        <p class="info-paragraph"><span class="info-item">Release Date:</span> ${movie.release_date}</p>
        <p class="info-paragraph"><span class="info-item">Runtime:</span> ${movie.runtime} min</p>
        <p class="info-paragraph"><span class="info-item">Rating:</span> ${movie.vote_average}</p>
      </div>
      <div class="overview">
        <h3>Overview</h3>
        <p>${movie.overview}</p>
      </div>
    </div>
    <div id='video'>
      <iframe width="600" height="400" src="https://www.youtube.com/embed/${trailer.key}" allowfullscreen></iframe>
    </div>`;
  });
}
