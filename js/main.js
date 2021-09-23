var $searchFormHome = document.querySelector('.home-form');
var $searchFormResults = document.querySelector('.results-form');
var $searchBarHome = document.querySelector('.search-bar-home');
var $searchBarResults = document.querySelector('.search-bar-results');
var $movieJournalNav = document.querySelector('#movie-journal-nav');
var $allView = document.querySelectorAll('.view');
var responseByIDArray = [];
var $searchMessage = document.querySelector('.search-message');
var $backButton = document.querySelector('.back-button');
var $rowCardAdd = document.querySelector('.row-card-add');
var $plusButtonBig = document.querySelector('.plus-button-big');
var $plusIconBig = document.querySelector('.plus-icon-big');
var $addToWatchlist = document.querySelector('.add-caption');

$searchFormHome.addEventListener('submit', submitSearch);
function submitSearch(event) {
  event.preventDefault();
  switchView('search-results');
  $movieJournalNav.setAttribute('class', 'movie-journal-anchor white font-roboto');
  $searchBarResults.value = $searchBarHome.value;
  var searchValue = {};
  searchValue.keyword = $searchBarHome.value;
  searchValue.searchID = data.nextSearchId;
  data.searchHistory.unshift(searchValue);
  data.nextSearchId++;
  getMovieData(data.searchHistory[0].keyword);
  var $allList = document.querySelectorAll('li');
  for (var i = 0; i < $allList.length; i++) {
    $allList[i].remove();
  }
  $searchMessage.textContent = 'Showing results for ' + '\'' + $searchBarHome.value + '\'';
}

$searchFormResults.addEventListener('submit', submitSearchResults);
function submitSearchResults(event) {
  event.preventDefault();
  var searchValue = {};
  searchValue.keyword = $searchBarResults.value;
  searchValue.searchID = data.nextSearchId;
  data.searchHistory.unshift(searchValue);
  data.nextSearchId++;

  getMovieData(data.searchHistory[0].keyword);
  var $allList = document.querySelectorAll('li');
  for (var i = 0; i < $allList.length; i++) {
    $allList[i].remove();
  }
  $searchMessage.textContent = 'Showing results for ' + '\'' + $searchBarResults.value + '\'';
}

function getMovieData(search) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://www.omdbapi.com/?apikey=67ac1937' + '&s=' + search);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    renderMovieDOMTrees(xhr.response.Search);
  });
  xhr.send();
}

function renderMovieDOMTrees(response) {
  for (var i = 0; i < response.length; i++) {
    var domTree = renderResponse(response[i]);
    var ulElement = document.querySelector('ul');
    ulElement.appendChild(domTree);
    apiRequestID(response[i].imdbID);
  }
}

function apiRequestID(imdbID) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://www.omdbapi.com/?apikey=67ac1937' + '&i=' + imdbID);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    getResponseByID(xhr.response);
  });
  xhr.send();
}

function getResponseByID(response) {
  var responseByIDData = {};
  responseByIDData.title = response.Title;
  responseByIDData.id = response.imdbID;
  responseByIDData.genre = response.Genre;
  responseByIDArray.push(responseByIDData);
  var $pGenre = document.querySelectorAll('.search-result-genre');
  var $renderedPosters = document.querySelectorAll('.poster-small');
  for (var i = 0; i < responseByIDArray.length; i++) {
    for (var n = 0; n < $pGenre.length; n++) {
      if (responseByIDArray[i].id === $pGenre[n].textContent) {
        $pGenre[n].textContent = responseByIDArray[i].genre;
      }
    }
  }
  for (var x = 0; x < $renderedPosters.length; x++) {
    if ($renderedPosters[x].getAttribute('src') === 'N/A') {
      $renderedPosters[x].setAttribute('src', '../images/image-unavailable.jpg');
    }
  }
}

function switchView(view) {
  for (var i = 0; i < $allView.length; i++) {
    if (view === $allView[i].getAttribute('data-view')) {
      $allView[i].className = 'view';
    } else {
      $allView[i].className = 'view hidden';
    }
  }
  if (view === 'search-home') {
    $movieJournalNav.setAttribute('class', 'movie-journal-anchor white font-roboto hidden');
  }
  if (view === 'search-result-detailed') {
    $movieJournalNav.setAttribute('class', 'movie-journal-anchor white font-roboto');

  }
}

function renderResponse(entry) {
  var $resultCard = document.createElement('li');
  var $rowCard = document.createElement('div');
  var $columnPoster = document.createElement('div');
  var $imgPoster = document.createElement('img');
  var $columnCardInfo = document.createElement('div');
  var $rowIcon = document.createElement('div');
  var $plusIcon = document.createElement('i');
  var $rowTitle = document.createElement('div');
  var $h3Title = document.createElement('h3');
  var $rowYear = document.createElement('div');
  var $pYear = document.createElement('p');
  var $pGenre = document.createElement('p');
  var $rowGenre = document.createElement('div');
  var $pHiddenID = document.createElement('p');

  $resultCard.setAttribute('class', 'search-results-padding');
  $rowCard.setAttribute('class', 'row search-result-card');
  $columnPoster.setAttribute('class', 'column-card-poster');
  $imgPoster.setAttribute('class', 'poster-small');
  $imgPoster.setAttribute('src', entry.Poster);
  $columnCardInfo.setAttribute('class', 'column-card-info white font-roboto');
  $rowIcon.setAttribute('class', 'row row-icon justify-right');
  $plusIcon.setAttribute('class', 'fas fa-plus-circle search-result-plus-icon');
  $h3Title.setAttribute('class', 'search-result-title');
  $pYear.setAttribute('class', 'search-result-year');
  $pGenre.setAttribute('class', 'search-result-genre');
  $pHiddenID.setAttribute('class', 'hidden');

  $h3Title.textContent = entry.Title;
  $pYear.textContent = entry.Year;
  $pGenre.textContent = entry.imdbID;
  $pHiddenID.textContent = entry.imdbID;
  $resultCard.appendChild($rowCard);
  $rowCard.appendChild($columnPoster);
  $columnPoster.appendChild($imgPoster);
  $rowCard.appendChild($columnCardInfo);
  $columnCardInfo.appendChild($rowIcon);
  $rowIcon.appendChild($plusIcon);
  $columnCardInfo.appendChild($rowTitle);
  $rowTitle.appendChild($h3Title);
  $columnCardInfo.appendChild($rowYear);
  $rowYear.appendChild($pYear);
  $columnCardInfo.appendChild($rowGenre);
  $rowGenre.appendChild($pGenre);
  $columnCardInfo.appendChild($pHiddenID);
  return $resultCard;
}

$movieJournalNav.addEventListener('click', goHome);
function goHome(event) {
  switchView('search-home');
  $searchFormHome.reset();
}

$backButton.addEventListener('click', goBack);
function goBack(event) {
  switchView('search-results');
}

$rowCardAdd.addEventListener('click', buttonGreen);
function buttonGreen(event) {
  if ((event.target === $plusButtonBig) || (event.target === $plusIconBig) || (event.target === $addToWatchlist)) {
    $plusIconBig.className = 'fas fa-check-circle plus-icon-big green';
    $addToWatchlist.textContent = 'Added to Watchlist!';
  }
}
