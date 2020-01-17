const API_KEY = '9d181ecc759bf1deab6d6c3688395ebb',
  seccionSerie = document.getElementById('serie'),
  listaMenu = document.querySelector('.list'),
  showId = sessionStorage.getItem('id');

showShow();

function getShow() {
  let show = fetch(`https://api.themoviedb.org/3/tv/${showId}?api_key=${API_KEY}&language=es&append_to_response=credits,videos`)
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
    let cast = show.credits.cast.filter((el, i) => i < 5).map(el => el.name).join(", ");
    // Get the genres
    let genres = show.genres.map(el => el.name).join(", ");
    // Get the networks
    let networks = show.networks.map(el => el.name).join(", ")
    let trailer = show.videos.results[0] || {key: ""}

    seccionSerie.innerHTML = `<div style="width: 20%" id="serie ${show.name}">
    <h3>${show.name}</h3>
    <a href="#"><img src="http://image.tmdb.org/t/p/w200${show.poster_path}" id="${show.id}" class="show-img" onerror="this.src='imagenes/Imagen_no_disponible.png'"></a>
    <p>Cast: ${cast}</p>
    <p>Genres: ${genres}</p>
    <p>Episode Runtime: ${show.episode_run_time}min</p>
    <p>First Air Date: ${show.first_air_date}</p>
    <p>Networks: ${networks}</p>
    <p>Rating: ${show.vote_average}</p>
    <p>Episodes: ${show.number_of_episodes}</p>
    <p>Seasons: ${show.number_of_seasons}</p>
    <p>${show.overview}</p></div>
    <div id='video'>
    <iframe width="600" height="400" src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>
    </div>`;
  });
}
