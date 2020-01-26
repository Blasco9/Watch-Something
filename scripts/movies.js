import { showLatestMovies } from './main.js';

// Variables
const API_KEY = '9d181ecc759bf1deab6d6c3688395ebb',
  moviesSection = document.getElementById('movies'),
  menuList = document.querySelector('.list'),
  searchSection = document.getElementById('searchSection'),
  genresSection = document.getElementById('genresSection'),
  pagesSection = document.getElementById('pages');
let currentPage = 1,
  totalPages = 0,
  selectedLi = menuList.children[1],
  selectedBtn = pagesSection.children[1];
// Initialize genre list
let genres = getGenres().then(resolve => {
  genres = resolve.genres;
});

// Initial configuration on page load
onload = function init() {
  // Shows latest movies on page load
  showLatestMovies();
  // Hides the search bar
  searchSection.style.display = 'none';
  // Hides the genre list
  genresSection.style.display = 'none';
  // Initialize all event listeners
  addEvents();
};

// Adds events
function addEvents() {
  menuList.addEventListener('click', checkLi);
  moviesSection.addEventListener('click', setMovieIdInStorage);
  genresSection.addEventListener('change', function(e) {
    currentPage = 1;
    showMovies(getMoviesByGenre);
    e.preventDefault();
  });
  searchSection.addEventListener('submit', function(e) {
    showMovies(searchMovies);
    e.preventDefault();
  });
  pagesSection.addEventListener('click', checkPage);
}

// Top Rated
function getTopRated() {
  let movies = fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en&page=${currentPage}`)
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      totalPages = resolve.total_pages;
      return resolve.results.filter((el, index) => index <= 11);
    });
  return movies;
}

// Latest
function getLatest() {
  let movies = fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en&page=${currentPage}`)
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      totalPages = resolve.total_pages;
      return resolve.results.filter((el, index) => index <= 11);
    });
  return movies;
}

// Popular
function getPopular() {
  let movies = fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en&page=${currentPage}`)
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      totalPages = resolve.total_pages;
      return resolve.results.filter((el, index) => index <= 11);
    });
  return movies;
}

// Genre
function genreMode(li) {
  moviesSection.innerHTML = '';

  if (li.className.includes('genre')) {
    genresSection.style.display = 'block';
  } else {
    genresSection.style.display = 'none';
  }
}

function getGenres() {
  let genres = fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en`)
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      return resolve;
    });
  return genres;
}

function getMoviesByGenre() {
  let selectedGenere = genresSection.value;
  let genreID;

  genres.forEach(el => {
    el.name === selectedGenere ? (genreID = el.id) : null;
  });

  let movies = fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en&sort_by=popularity.desc&include_adult=true&with_genres=${genreID}&page=${currentPage}`
  )
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      totalPages = resolve.total_pages;
      return resolve.results;
    });
  return movies;
}

// Search
function searchMode(li) {
  moviesSection.innerHTML = '';
  document.getElementById('search').value = '';

  if (li.className.includes('search')) {
    searchSection.style.display = 'block';
  } else {
    searchSection.style.display = 'none';
  }
}

function searchMovies() {
  let input = document.getElementById('search').value;

  let movies = fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en&query=${input}&include_adult=true&page=${currentPage}`
  )
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      totalPages = resolve.total_pages;
      return resolve.results;
    });
  return movies;
}

// Renders movies
function showMovies(callback) {
  moviesSection.innerHTML = '';

  callback().then(resolve => {
    resolve.forEach(movie => {
      moviesSection.innerHTML += `<div id="movie ${movie.title}">
          <a href="movie.html"><img src="http://image.tmdb.org/t/p/w300${movie.poster_path}" id="${movie.id}" class="movie-img" onerror="this.src='img/img-not-found.png'; this.className='img-not-found';"></a>
          </div>`;
    });
  });
}

// Stores movie id in session storage
function setMovieIdInStorage(e) {
  if (e.target.className == 'movie-img') {
    sessionStorage.setItem('id', e.target.id);
  }
}

function checkLi(e) {
  let li = e.target ? e.target : e;

  // Change selected page and li when changing category
  if(li != selectedLi) {
    currentPage = 1;
    toggleSelectedLi(li); 
    toggleSelectedBtn(1, 1);
  }

  li.className.includes('search') ? searchMode(li) : searchMode(li);
  li.className.includes('latest') ? showMovies(getLatest) : null;
  li.className.includes('top-rated') ? showMovies(getTopRated) : null;
  li.className.includes('popular') ? showMovies(getPopular) : null;
  li.className.includes('genre') ? genreMode(li) : genreMode(li);
}

// Change color of selected Li
function toggleSelectedLi(li) {
  // Get lis and convert to arr
  let lis = [...menuList.children];

  lis.forEach(el => {
    if (el == li) {
      el.classList.add('selected');
      selectedLi = el;
    } else {
      el.classList.remove('selected');
    }
  });
}

function checkPage(e) {
  let btn = e.target.textContent;

  if (currentPage == 1) {
    btn != '<-' ? changePage(btn) : null;
  } else if (currentPage == totalPages) {
    btn != '->' ? changePage(btn) : null;
  } else if (currentPage > 1 && currentPage < totalPages) {
    changePage(btn);
  }
}

// Change the movie page displayed
function changePage(btn) {
  let btns = [...pagesSection.children],
    firstNum = Number(btns[1].textContent),
    lastNum = Number(btns[10].textContent);

  if (Number(btn)) {
    currentPage = btn;
    toggleSelectedBtn(currentPage, firstNum);
  } else if (btn == '<-') {
    currentPage--;
    currentPage < firstNum ? toggleSelectedBtn(currentPage, firstNum - 1) : toggleSelectedBtn(currentPage, firstNum);
  } else {
    currentPage++;
    currentPage > lastNum ? toggleSelectedBtn(currentPage, firstNum + 1) : toggleSelectedBtn(currentPage, firstNum);
  }

  // Make request for next page of selected li
  selectedLi.className.includes('genre')
    ? showMovies(getMoviesByGenre)
    : selectedLi.className.includes('search')
    ? showMovies(searchMovies)
    : checkLi(selectedLi);
}

function toggleSelectedBtn(currentBtn, btnNum) {
  let btns = [...pagesSection.children].slice(1, 11);

  btns.forEach(el => {
    el.textContent = btnNum;
    if (el.textContent == currentBtn) {
      el.classList.add('selected');
      selectedBtn = el;
    } else {
      el.classList.remove('selected');
    }
    btnNum++;
  });
}
