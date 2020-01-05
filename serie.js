const API_KEY = '9d181ecc759bf1deab6d6c3688395ebb',
  seccionSerie = document.getElementById('serie'),
  listaMenu = document.querySelector('.list'),
  showId = sessionStorage.getItem('id');

showShow();

function getShow() {
  let show = fetch(`https://api.themoviedb.org/3/tv/${showId}?api_key=${API_KEY}&language=es`)
    .then(res => {
      return res.json();
    })
    .then(res => {
      console.log(res);
      return res;
    });
  return show;
}

function showShow() {
  getShow().then(show => {
    seccionSerie.innerHTML = `<div style="width: 20%" id="serie ${show.name}">
    <h3>${show.name}</h3>
    <a href="#"><img src="http://image.tmdb.org/t/p/w200${show.poster_path}" id="${show.id}" class="show-img" onerror="this.src='imagenes/Imagen_no_disponible.png'"></a>
    <p>${show.overview}</p></div>`;
  });
}
