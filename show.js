const API_KEY = '9d181ecc759bf1deab6d6c3688395ebb',
  showSection = document.getElementById('show'),
  showId = sessionStorage.getItem('id');

showShow();

function getShow() {
  let show = fetch(`https://api.themoviedb.org/3/tv/${showId}?api_key=${API_KEY}&language=en&append_to_response=credits,videos`)
    .then(res => {
      return res.json();
    })
    .then(res => {
      return res;
    });
  return show;
}

function showShow() {
  getShow().then(show => {
    // Get the first 5 cast members
    let cast = show.credits.cast
      .filter((el, i) => i < 5)
      .map(el => el.name)
      .join(', ');
    // Get the genres
    let genres = show.genres.map(el => el.name).join(', ');
    // Get the networks
    let networks = show.networks.map(el => el.name).join(', ');
    let trailer = show.videos.results[0] || { key: '' };

    showSection.innerHTML = `<div id="show ${show.name}">
      <h3>${show.name}</h3>
      <div class="poster">
        <a href="#"><img src="http://image.tmdb.org/t/p/w300${show.poster_path}" id="${show.id}" class="show-img"   onerror="this.src='imagenes/Imagen_no_disponible.png'"></a>
      </div>
      <div class="info">
        <p><span class="info-item">Cast:</span> ${cast}</p>
        <p><span class="info-item">Genres:</span> ${genres}</p>
        <p><span class="info-item">Episode Runtime:</span> ${show.episode_run_time}min</p>
        <p><span class="info-item">First Air Date:</span> ${show.first_air_date}</p>
        <p><span class="info-item">Networks:</span> ${networks}</p>
        <p><span class="info-item">Rating:</span> ${show.vote_average}</p>
        <p><span class="info-item">Episodes:</span> ${show.number_of_episodes}</p>
        <p><span class="info-item">Seasons:</span> ${show.number_of_seasons}</p>
      </div>
      <div class="overview">
        <h3>Overview</h3>
        <p>${show.overview}</p>
      </div>
    </div>
    <div id='video'>
      <iframe width="600" height="400" src="https://www.youtube.com/embed/${trailer.key}" allowfullscreen></iframe>
    </div>`;
  });
}
