const API_KEY = '9d181ecc759bf1deab6d6c3688395ebb',
  showsSection = document.querySelector('#shows'),
  moviesSection = document.querySelector('#movies');

function getLatestMovies() {
  let movies = fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en`)
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      return resolve.results.filter((el, index) => index <= 11);
    });
  return movies;
}

function showLatestMovies() {
  getLatestMovies().then(resolve => {
    resolve.forEach(movie => {
      moviesSection.innerHTML += `<div id="movie ${movie.title}">
        <a href="movie.html"><img src="http://image.tmdb.org/t/p/w300${movie.poster_path}" id="${movie.id}" class="movie-img" onerror="this.src='img/img-not-found.png'"></a>
        </div>`;
    });
  });
}

function getLatestShows() {
  let shows = fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${API_KEY}&language=en`)
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      return resolve.results.filter((el, index) => index <= 11);
    });
  return shows;
}

function showLatestShows() {
  getLatestShows().then(resolve => {
    resolve.forEach(show => {
      showsSection.innerHTML += `<div id="show ${show.name}">
        <a href="show.html"><img src="http://image.tmdb.org/t/p/w300${show.poster_path}" id="${show.id}" class="show-img" onerror="this.src='img/img-not-found.png'"></a>
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

  showsSection.addEventListener('click', setIdInStorage);
  moviesSection.addEventListener('click', setIdInStorage);
};
