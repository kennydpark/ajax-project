// var $form = document.querySelector('form');
var $searchFormHome = document.querySelector('.home-form');
var $searchFormResults = document.querySelector('.results-form');
var $searchBar = document.querySelector('.search-bar-home');
var $searchBarResults = document.querySelector('.search-bar-results');
// var $homeView = document.querySelector('#home-content');
var $movieJournalNav = document.querySelector('#movie-journal-nav');
var $allView = document.querySelectorAll('.view');

$searchFormHome.addEventListener('submit', submitSearch);
function submitSearch(event) {
  event.preventDefault();
  switchView('search-results');
  $movieJournalNav.setAttribute('class', 'movie-journal-anchor white font-roboto');
  // $searchBarResults.value = $searchBar.value;
  var searchValue = {};
  searchValue.keyword = $searchBar.value;
  searchValue.searchID = data.nextSearchId;
  data.searches.unshift(searchValue);
  data.nextSearchId++;
  apiRequest(data.searches[0].keyword);
}

$searchFormResults.addEventListener('submit', submitSearchResults);
function submitSearchResults(event) {
  event.preventDefault();
  // switchView('search-results');
  // $movieJournalNav.setAttribute('class', 'movie-journal-anchor white font-roboto');
  // $searchBarResults.value = $searchBar.value;
  var searchValue = {};
  searchValue.keyword = $searchBarResults.value;
  searchValue.searchID = data.nextSearchId;
  data.searches.unshift(searchValue);
  data.nextSearchId++;

  apiRequest(data.searches[0].keyword);
  var $allList = document.querySelectorAll('li');
  for (var i = 0; i < $allList.length; i++) {
    $allList[i].remove();
  }
}

function apiRequest(search) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://www.omdbapi.com/?apikey=67ac1937' + '&s=' + search);
  xhr.responseType = 'json';
  xhr.addEventListener('load', getMovieData);
  function getMovieData() {
    // console.log(xhr.response.Search);
    // apiRequestID(xhr.response.imdbID);
    var ulElement = document.querySelector('ul');
    for (var i = 0; i < xhr.response.Search.length; i++) {
      var domTree = renderSearchResults(xhr.response.Search[i]);
      ulElement.appendChild(domTree);
    }
  }
  xhr.send();
}

// function apiRequestID(imdbID) {
//   var xhr = new XMLHttpRequest();
//   xhr.open('GET', 'http://www.omdbapi.com/?apikey=67ac1937' + '&i=' + imdbID);
//   xhr.responseType = 'json';
//   xhr.addEventListener('load', getMovieID);
//   function getMovieData() {
//     console.log(xhr.response);
//     // for (var i = 0; i < xhr.response.)
//   }
//   xhr.send();
// }

// DOM TREE
/* <li class="search-results-padding">
  <div class="row search-result-card">
    <div class="column-one-half-poster">
      <img class="poster-small" src="images/avengers-poster.jpg">
    </div>
    <div class="column-one-half white font-roboto">

      <div class="row row-icon justify-right">
        <i class="fas fa-plus-circle search-result-plus-icon"></i>
      </div>
      <div class="row">
        <h3 class="search-result-title">The Avengers The Avengers The Avengers</h3>
      </div>
      <div class="row">
        <p class="search-result-year">2012</p>
      </div>
      <div class="row">
        <p class="search-result-genre">Action, Adventure, Sci-Fi</p>
      </div>
    </div>
  </div>
</li> */

function switchView(view) {
  for (var i = 0; i < $allView.length; i++) {
    if (view === $allView[i].getAttribute('data-view')) {
      $allView[i].className = 'view';
    } else {
      $allView[i].className = 'view hidden';
    }
  }
  $searchFormResults.value = $searchFormHome.value;
}

function renderSearchResults(entry) {
  var $resultCard = document.createElement('li');
  var $rowCard = document.createElement('div');
  var $columnPoster = document.createElement('div');
  var $imgPoster = document.createElement('img');
  var $columnOneHalf = document.createElement('div');
  var $rowIcon = document.createElement('div');
  var $plusIcon = document.createElement('i');
  var $rowTitle = document.createElement('div');
  var $h3Title = document.createElement('h3');
  var $rowYear = document.createElement('div');
  var $pYear = document.createElement('p');
  var $pGenre = document.createElement('p');
  var $rowGenre = document.createElement('div');
  $resultCard.setAttribute('class', 'search-results-padding');
  $rowCard.setAttribute('class', 'row search-result-card');
  $columnPoster.setAttribute('class', 'column-one-half-poster');
  $imgPoster.setAttribute('class', 'poster-small');
  $imgPoster.setAttribute('src', entry.Poster);
  $columnOneHalf.setAttribute('class', 'column-one-half white font-roboto');
  $rowIcon.setAttribute('class', 'row row-icon justify-right');
  $plusIcon.setAttribute('class', 'fas fa-plus-circle search-result-plus-icon');
  $h3Title.setAttribute('class', 'search-result-title');
  $pYear.setAttribute('class', 'search-result-year');
  $pGenre.setAttribute('class', 'search-result-genre');
  $h3Title.textContent = entry.Title;
  $pYear.textContent = entry.Year;
  $resultCard.appendChild($rowCard);
  $rowCard.appendChild($columnPoster);
  $columnPoster.appendChild($imgPoster);
  $rowCard.appendChild($columnOneHalf);
  $columnOneHalf.appendChild($rowIcon);
  $rowIcon.appendChild($plusIcon);
  $columnOneHalf.appendChild($rowTitle);
  $rowTitle.appendChild($h3Title);
  $columnOneHalf.appendChild($rowYear);
  $rowYear.appendChild($pYear);
  $columnOneHalf.appendChild($rowGenre);
  $rowGenre.appendChild($pGenre);
  return $resultCard;
}

// Poster: "https://m.media-amazon.com/images/M/MV5BOTY4YjI2N2MtYmFlMC00ZjcyLTg3YjEtMDQyM2ZjYzQ5YWFkXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg"
// Title: "Batman Begins"
// Type: "movie"
// Year: "2005"
// imdbID: "tt0372784"
