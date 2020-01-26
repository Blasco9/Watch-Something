import { showLatestShows } from './main.js';

// Variables
const API_KEY = '9d181ecc759bf1deab6d6c3688395ebb',
  showsSection = document.getElementById('shows'),
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
  // Shows latest shows on page load
  showLatestShows();
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
  showsSection.addEventListener('click', setShowIdInStorage);
  genresSection.addEventListener('change', function(e) {
    showShows(getShowsByGenre);
    e.preventDefault();
  });
  searchSection.addEventListener('submit', function(e) {
    showShows(searchShows);
    e.preventDefault();
  });
  pagesSection.addEventListener('click', checkPage);
}

// Top Rated
function getTopRated() {
  let shows = fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}&language=en&page=${currentPage}`)
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      totalPages = resolve.total_pages;
      return resolve.results.filter((el, index) => index <= 11);
    });
  return shows;
}

// Latest
function getLatest() {
  let shows = fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${API_KEY}&language=en&page=${currentPage}`)
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      totalPages = resolve.total_pages;
      return resolve.results.filter((el, index) => index <= 11);
    });
  return shows;
}

// Popular
function getPopular() {
  let shows = fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en&page=${currentPage}`)
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      totalPages = resolve.total_pages;
      return resolve.results.filter((el, index) => index <= 11);
    });
  return shows;
}

// Genre
function genreMode(li) {
  showsSection.innerHTML = '';

  if (li.className.includes('genre')) {
    genresSection.style.display = 'block';
    pagesSection.style.display = 'none';
  } else {
    genresSection.style.display = 'none';
  }
}

function getGenres() {
  let genres = fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=en`)
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      return resolve;
    });
  return genres;
}

function getShowsByGenre() {
  let selectedGenere = genresSection.value;
  let genreID;

  genres.forEach(el => {
    el.name === selectedGenere ? (genreID = el.id) : null;
  });

  let shows = fetch(
    `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=en&sort_by=popularity.desc&with_genres=${genreID}&include_null_first_air_dates=false&page=${currentPage}`
  )
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      totalPages = resolve.total_pages;
      return resolve.results;
    });
  return shows;
}

// Search
function searchMode(li) {
  showsSection.innerHTML = '';
  document.getElementById('search').value = '';

  if (li.className.includes('search')) {
    searchSection.style.display = 'block';
    pagesSection.style.display = 'none';
  } else {
    searchSection.style.display = 'none';
  }
}

function searchShows() {
  let input = document.getElementById('search').value;

  let shows = fetch(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&language=en&query=${input}&page=${currentPage}`)
    .then(resolve => {
      return resolve.json();
    })
    .then(resolve => {
      totalPages = resolve.total_pages;
      return resolve.results;
    });
  return shows;
}

// Renders shows
function showShows(callback) {
  showsSection.innerHTML = '';

  callback().then(resolve => {
    resolve.forEach(show => {
      showsSection.innerHTML += `<div id="show ${show.name}">
          <a href="show.html"><img src="http://image.tmdb.org/t/p/w300${show.poster_path}" id="${show.id}" class="show-img" onerror="this.src='img/img-not-found.png'; this.className='img-not-found';"></a>
          </div>`;
    });
    pagesSection.style.display = 'block';
  });
}

// Stores show id in session storage
function setShowIdInStorage(e) {
  if (e.target.className.includes('show-img')) {
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
  li.className.includes('latest') ? showShows(getLatest) : null;
  li.className.includes('top-rated') ? showShows(getTopRated) : null;
  li.className.includes('popular') ? showShows(getPopular) : null;
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
    ? showShows(getShowsByGenre)
    : selectedLi.className.includes('search')
    ? showShows(searchShows)
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