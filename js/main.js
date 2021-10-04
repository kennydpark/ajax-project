var $searchFormHome = document.querySelector('.home-form');
var $searchFormResults = document.querySelector('.results-form');
var $searchBarHome = document.querySelector('.search-bar-home');
var $searchBarResults = document.querySelector('.search-bar-results');
var $movieJournalNav = document.querySelector('#movie-journal-nav');
var $myWatchlistNav = document.querySelector('.my-watchlist-anchor');
var $bookmarkIconNav = document.querySelector('#bookmark-icon');
var $allView = document.querySelectorAll('.view');
var responseByIDArray = [];
var $searchMessage = document.querySelector('.search-message');
var $backButtonDetailed = document.querySelector('.back-button');
var $backButtonWatchlist = document.querySelector('.back-button-watchlist');
var $searchResultDetailed = document.querySelector('#search-result-detailed');
var $ulElement = document.querySelector('ul');
var $ulWatchlist = document.querySelector('.ul-watchlist');
var $colNav = document.querySelector('.col-nav');
var $emptyWatchlistCaption = document.querySelector('.empty-watchlist-caption');
var $loadingSpinner = document.querySelector('.loading-spinner');
var $containerModal = document.querySelector('.container-modal');
var $containerModalWindow = document.querySelector('.container-modal-window');

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
  var $allSearchResults = document.querySelectorAll('.search-results-padding');
  for (var i = 0; i < $allSearchResults.length; i++) {
    $allSearchResults[i].remove();
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
  var $allList = document.querySelectorAll('.search-results-padding');
  for (var i = 0; i < $allList.length; i++) {
    $allList[i].remove();
  }
  $searchMessage.textContent = 'Showing results for ' + '\'' + $searchBarResults.value + '\'';
}

function getMovieData(search) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://www.omdbapi.com/?apikey=67ac1937' + '&s=' + search);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    renderMovieDOMTrees(xhr.response.Search);
    $searchMessage.textContent = 'Showing results for ' + '\'' + $searchBarResults.value + '\'';
    $loadingSpinner.className = 'loading-spinner text-center hidden';
  });

  xhr.addEventListener('error', function () {
    $searchMessage.textContent = 'Sorry, there was an error connecting to the network. Please check your internet connection.';
    $loadingSpinner.className = 'loading-spinner text-center hidden';
  });
  xhr.send();
  $loadingSpinner.className = 'loading-spinner text-center';
}

function renderMovieDOMTrees(response) {
  if (response === undefined) {
    $searchMessage.textContent = 'No results. Try a different keyword.';
    $loadingSpinner.className = 'loading-spinner text-center hidden';
  }
  var $allList = document.querySelectorAll('.search-results-padding');
  for (var n = 0; n < $allList.length; n++) {
    $allList[n].remove();
  }
  for (var i = 0; i < response.length; i++) {
    var domTree = renderResponse(response[i]);
    var ulElement = document.querySelector('ul');
    ulElement.appendChild(domTree);
    apiRequestID(response[i].imdbID);
  }
}

function apiRequestID(imdbID) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://www.omdbapi.com/?apikey=67ac1937' + '&i=' + imdbID);
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
      $renderedPosters[x].setAttribute('src', 'images/image-unavailable.jpg');
    }
  }
}

function switchView(view) {
  data.view = view;
  for (var i = 0; i < $allView.length; i++) {
    if (view === $allView[i].getAttribute('data-view')) {
      $allView[i].className = 'view';
    } else {
      $allView[i].className = 'view hidden';
    }
  }
  if (view === 'search-home') {
    $movieJournalNav.className = 'movie-journal-anchor white font-roboto hidden';
    $colNav.className = 'col-nav justify-right';
    var $allSearchResults = document.querySelectorAll('.search-results-padding');
    for (var n = 0; n < $allSearchResults.length; n++) {
      $allSearchResults[n].remove();
    }
  }
  if (view === 'search-results') {
    $colNav.className = 'col-nav justify-right';
  }
  if (view === 'search-result-detailed') {
    $movieJournalNav.className = 'movie-journal-anchor white font-roboto';
    $colNav.className = 'col-nav justify-right';
  }
  if (view === 'watchlist') {
    $movieJournalNav.className = 'movie-journal-anchor white font-roboto';
    $colNav.className = 'col-nav justify-right hidden';
  }
  if (data.savedCards.length === 0) {
    $emptyWatchlistCaption.className = 'empty-watchlist-caption white font-roboto text-center';
  } else {
    $emptyWatchlistCaption.className = 'empty-watchlist-caption white font-roboto text-center hidden';
  }
}

function renderResponse(entry) {
  var $resultCard = document.createElement('li');
  var $rowCard = document.createElement('div');
  var $columnPoster = document.createElement('div');
  var $imgPoster = document.createElement('img');
  var $columnCardInfo = document.createElement('div');
  var $rowIcon = document.createElement('div');
  var $rowTitle = document.createElement('div');
  var $h3Title = document.createElement('h3');
  var $rowYear = document.createElement('div');
  var $pYear = document.createElement('p');
  var $pGenre = document.createElement('p');
  var $rowGenre = document.createElement('div');
  var $pHiddenID = document.createElement('p');
  $resultCard.setAttribute('class', 'search-results-padding');
  $resultCard.setAttribute('imdbid', entry.imdbID);
  $rowCard.setAttribute('class', 'row search-result-card grow');
  $columnPoster.setAttribute('class', 'column-card-poster');
  $imgPoster.setAttribute('class', 'poster-small');
  $imgPoster.setAttribute('src', entry.Poster);
  $columnCardInfo.setAttribute('class', 'column-card-info white font-roboto');
  $rowIcon.setAttribute('class', 'row row-icon justify-right');
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
  $columnCardInfo.appendChild($rowTitle);
  $rowTitle.appendChild($h3Title);
  $columnCardInfo.appendChild($rowYear);
  $rowYear.appendChild($pYear);
  $columnCardInfo.appendChild($rowGenre);
  $rowGenre.appendChild($pGenre);
  $columnCardInfo.appendChild($pHiddenID);
  return $resultCard;
}

function renderDetailed(entry) {
  var $detailedCard = document.createElement('div');
  var $rowCardPoster = document.createElement('div');
  var $imgPosterBig = document.createElement('img');
  var $containerCardInfo = document.createElement('div');
  var $rowCardTitle = document.createElement('div');
  var $columnTitleDetailed = document.createElement('div');
  var $detailedTitle = document.createElement('h2');
  var $columnYearDetailed = document.createElement('div');
  var $detailedYear = document.createElement('p');
  var $row = document.createElement('div');
  var $columnHalfInfo = document.createElement('div');
  var $rowCardGenre = document.createElement('div');
  var $detailedGenre = document.createElement('p');
  var $rowCardDirector = document.createElement('div');
  var $detailedDirector = document.createElement('p');
  var $rowCardCast = document.createElement('div');
  var $detailedCast = document.createElement('p');
  var $columnHalfPlot = document.createElement('div');
  var $rowCardPlot = document.createElement('div');
  var $detailedPlot = document.createElement('p');
  var $rowCardAdd = document.createElement('div');
  var $columnBigPlus = document.createElement('div');
  var $plusButtonBig = document.createElement('button');
  var $plusIconBig = document.createElement('i');
  var $columnAddCaption = document.createElement('div');
  var $addCaption = document.createElement('h1');
  var $spanDirector = document.createElement('span');
  var $spanCast = document.createElement('span');
  var $pHiddenID = document.createElement('p');
  $detailedCard.setAttribute('class', 'detailed-card font-roboto');
  $rowCardPoster.setAttribute('class', 'row row-card-poster');
  $imgPosterBig.setAttribute('class', 'poster-big');
  $imgPosterBig.setAttribute('src', entry.Poster);
  if (entry.Poster === 'N/A') {
    $imgPosterBig.setAttribute('src', 'images/image-unavailable.jpg');
  }
  $containerCardInfo.setAttribute('class', 'container-card-info');
  $rowCardTitle.setAttribute('class', 'row row-card-title white');
  $columnTitleDetailed.setAttribute('class', 'column-title-detailed');
  $detailedTitle.setAttribute('class', 'detailed-title');
  $columnYearDetailed.setAttribute('class', 'column-year-detailed');
  $detailedYear.setAttribute('class', 'detailed-year');
  $row.setAttribute('class', 'row');
  $columnHalfInfo.setAttribute('class', 'column-half');
  $rowCardGenre.setAttribute('class', 'row row-card-genre white');
  $detailedGenre.setAttribute('class', 'detailed-genre');
  $rowCardDirector.setAttribute('class', 'row row-card-director white');
  $detailedDirector.setAttribute('class', 'detailed-director');
  $rowCardCast.setAttribute('class', 'row row-card-cast white');
  $detailedCast.setAttribute('class', 'detailed-cast');
  $columnHalfPlot.setAttribute('class', 'column-half');
  $rowCardPlot.setAttribute('class', 'row row-card-plot white');
  $detailedPlot.setAttribute('class', 'detailed-plot');
  $rowCardAdd.setAttribute('class', 'row row-card-add white');
  $columnBigPlus.setAttribute('class', 'column-big-plus');
  $plusButtonBig.setAttribute('class', 'plus-button-big');
  $plusButtonBig.setAttribute('type', 'button');
  $plusIconBig.setAttribute('type', 'button');
  $plusIconBig.setAttribute('class', 'fas fa-plus-circle plus-icon-big white');
  $columnAddCaption.setAttribute('class', 'column-add-caption text-center');
  $addCaption.setAttribute('class', 'add-caption');
  $spanDirector.setAttribute('class', 'bold');
  $spanCast.setAttribute('class', 'bold');
  $pHiddenID.setAttribute('class', 'detailed-id hidden');
  $pHiddenID.textContent = entry.imdbID;
  $containerCardInfo.appendChild($pHiddenID);
  $detailedTitle.textContent = entry.Title;
  $detailedYear.textContent = entry.Year;
  $detailedGenre.textContent = entry.Genre;
  $spanDirector.textContent = entry.Director;
  $detailedDirector.textContent = 'Director: ';
  $detailedDirector.append($spanDirector);
  $spanCast.textContent = entry.Actors;
  $detailedCast.textContent = 'Cast: ';
  $detailedCast.append($spanCast);
  $detailedPlot.textContent = entry.Plot;
  $addCaption.textContent = 'Add to Watchlist';
  $detailedCard.appendChild($rowCardPoster);
  $rowCardPoster.appendChild($imgPosterBig);
  $detailedCard.appendChild($containerCardInfo);
  $containerCardInfo.appendChild($rowCardTitle);
  $rowCardTitle.appendChild($columnTitleDetailed);
  $columnTitleDetailed.appendChild($detailedTitle);
  $rowCardTitle.appendChild($columnYearDetailed);
  $columnYearDetailed.appendChild($detailedYear);
  $containerCardInfo.appendChild($row);
  $row.appendChild($columnHalfInfo);
  $columnHalfInfo.appendChild($rowCardGenre);
  $rowCardGenre.appendChild($detailedGenre);
  $columnHalfInfo.appendChild($rowCardDirector);
  $rowCardDirector.appendChild($detailedDirector);
  $columnHalfInfo.appendChild($rowCardCast);
  $rowCardCast.appendChild($detailedCast);
  $row.appendChild($columnHalfPlot);
  $columnHalfPlot.appendChild($rowCardPlot);
  $rowCardPlot.appendChild($detailedPlot);
  $containerCardInfo.appendChild($rowCardAdd);
  $rowCardAdd.appendChild($columnBigPlus);
  $columnBigPlus.appendChild($plusButtonBig);
  $plusButtonBig.appendChild($plusIconBig);
  $rowCardAdd.appendChild($columnAddCaption);
  $columnAddCaption.appendChild($addCaption);
  return $detailedCard;
}

function renderWatchlist(entry) {
  var $watchlistCard = document.createElement('li');
  var $rowWatchlistCard = document.createElement('div');
  var $columnCardPoster = document.createElement('div');
  var $imgPosterSmall = document.createElement('img');
  var $columnCardInfo = document.createElement('div');
  var $rowIcon = document.createElement('div');
  var $rowTitle = document.createElement('div');
  var $h3Title = document.createElement('h3');
  var $rowYear = document.createElement('div');
  var $pYear = document.createElement('p');
  var $rowGenre = document.createElement('div');
  var $rowBottom = document.createElement('div');
  var $pGenre = document.createElement('p');
  var $rowRemove = document.createElement('div');
  var $removeButton = document.createElement('button');
  var $removeIcon = document.createElement('i');
  var $pHidden = document.createElement('p');
  $watchlistCard.setAttribute('class', 'watchlist-cards-list-padding');
  $watchlistCard.setAttribute('imdbid', entry.id);
  $rowWatchlistCard.setAttribute('class', 'row watchlist-list-card grow');
  $columnCardPoster.setAttribute('class', 'column-card-poster');
  $imgPosterSmall.setAttribute('class', 'poster-small');
  $imgPosterSmall.setAttribute('src', entry.posterURL);
  $columnCardInfo.setAttribute('class', 'column-card-info white font-roboto');
  $rowIcon.setAttribute('class', 'row row-icon justify-right');
  $rowTitle.setAttribute('class', 'watchlist-row-title');
  $h3Title.setAttribute('class', 'watchlist-list-title');
  $h3Title.textContent = entry.title;
  $rowYear.setAttribute('class', 'watchlist-row-year');
  $pYear.setAttribute('class', 'watchlist-list-year');
  $pYear.textContent = entry.year;
  $rowGenre.setAttribute('class', 'watchlist-row-genre');
  $pGenre.setAttribute('class', 'watchlist-list-genre');
  $rowBottom.setAttribute('class', 'watchlist-row-bottom');
  $rowRemove.setAttribute('class', 'watchlist-row-remove text-right');
  $removeButton.setAttribute('class', 'remove-button grow-icon');
  $removeIcon.setAttribute('class', 'fas fa-minus-circle remove-icon');
  $pGenre.textContent = entry.genre;
  $pHidden.setAttribute('class', 'hidden');
  $pHidden.textContent = entry.id;
  $watchlistCard.appendChild($rowWatchlistCard);
  $rowWatchlistCard.appendChild($columnCardPoster);
  $columnCardPoster.appendChild($imgPosterSmall);
  $rowWatchlistCard.appendChild($columnCardInfo);
  $columnCardInfo.appendChild($rowIcon);
  $columnCardInfo.appendChild($rowTitle);
  $rowTitle.appendChild($h3Title);
  $columnCardInfo.appendChild($rowYear);
  $rowYear.appendChild($pYear);
  $columnCardInfo.appendChild($rowGenre);
  $rowGenre.appendChild($pGenre);
  $columnCardInfo.appendChild($pHidden);
  $rowGenre.appendChild($rowRemove);
  $rowRemove.appendChild($removeButton);
  $removeButton.appendChild($removeIcon);
  return $watchlistCard;
}

$ulElement.addEventListener('click', selectCard);
function selectCard(event) {
  var $allDetailedCards = document.querySelectorAll('.detailed-card');
  for (var i = 0; i < $allDetailedCards.length; i++) {
    $allDetailedCards[i].remove();
  }
  var imdbID = event.target.closest('li').getAttribute('imdbid');

  apiRequestIDDetailed(imdbID);
  switchView('search-result-detailed');
  $backButtonDetailed.className = 'back-button';
  data.selectedCardID = imdbID;
}

function apiRequestIDDetailed(imdbID) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://www.omdbapi.com/?apikey=67ac1937' + '&i=' + imdbID);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    getResponseForDetailed(xhr.response);
  });
  xhr.send();
}

function getResponseForDetailed(response) {
  $searchResultDetailed.appendChild(renderDetailed(response));
  var $addToWatchlist = document.querySelector('.add-caption');
  var $plusIconBig = document.querySelector('.plus-icon-big');
  for (var n = 0; n < data.savedCards.length; n++) {
    if (data.selectedCardID === data.savedCards[n].id) {
      $addToWatchlist.textContent = 'In Watchlist';
      $plusIconBig.className = 'fas fa-check-circle plus-icon-big green';
    }
  }
}

$movieJournalNav.addEventListener('click', goHome);
function goHome(event) {
  switchView('search-home');
  $searchFormHome.reset();
}

$myWatchlistNav.addEventListener('click', goWatchlist);
$bookmarkIconNav.addEventListener('click', goWatchlist);
function goWatchlist(event) {
  switchView('watchlist');
  $backButtonWatchlist.className = 'back-button-watchlist';
}

$backButtonDetailed.addEventListener('click', goBack);
$backButtonWatchlist.addEventListener('click', goBack);
function goBack(event) {
  if ($searchBarResults.value === '') {
    switchView('search-home');
    $searchMessage.textContent = 'Showing results for ' + '\'' + $searchBarResults.value + '\'';
  } else {
    switchView('search-results');
  }
}

function viewWatchlistCaptionUpdate() {
  var $addToWatchlist = document.querySelector('.add-caption');
  $addToWatchlist.textContent = 'View Watchlist';
}

window.addEventListener('click', addToSavedInData);
function addToSavedInData(event) {
  var $plusButtonBig = document.querySelector('.plus-button-big');
  var $plusIconBig = document.querySelector('.plus-icon-big');
  var $addToWatchlist = document.querySelector('.add-caption');
  var $posterElement = document.querySelector('.poster-big');
  var $titleElement = document.querySelector('.detailed-title');
  var $yearElement = document.querySelector('.detailed-year');
  var $genreElement = document.querySelector('.detailed-genre');
  var $directorElement = document.querySelector('.detailed-director');
  var $castElement = document.querySelector('.detailed-cast');
  var $plotElement = document.querySelector('.detailed-plot');
  var $idElement = document.querySelector('.detailed-id');
  if ((event.target === $plusButtonBig) || (event.target === $plusIconBig) || (event.target === $addToWatchlist)) {
    if ($addToWatchlist.textContent === 'Add to Watchlist') {
      $plusIconBig.className = 'fas fa-check-circle plus-icon-big green';
      $addToWatchlist.textContent = 'Added!';
      setTimeout(viewWatchlistCaptionUpdate, 1000);
      var cardDataForWatchlist = {};
      cardDataForWatchlist.posterURL = $posterElement.getAttribute('src');
      cardDataForWatchlist.title = $titleElement.textContent;
      cardDataForWatchlist.year = $yearElement.textContent;
      cardDataForWatchlist.genre = $genreElement.textContent;
      cardDataForWatchlist.director = $directorElement.textContent;
      cardDataForWatchlist.cast = $castElement.textContent;
      cardDataForWatchlist.plot = $plotElement.textContent;
      cardDataForWatchlist.id = $idElement.textContent;
      data.savedCards.unshift(cardDataForWatchlist);
      var watchlistNewCard = renderWatchlist(data.savedCards[0]);
      $ulWatchlist.prepend(watchlistNewCard);
    } else if ($addToWatchlist.textContent === 'View Watchlist') {
      switchView('watchlist');
      $backButtonWatchlist.className = 'back-button-watchlist';
    }
  }
}

document.addEventListener('DOMContentLoaded', loadedPage);
function loadedPage(event) {
  switchView(data.view);
  if (data.view === 'search-results') {
    $movieJournalNav.className = 'movie-journal-anchor white font-roboto';
    $searchBarResults.value = data.searchHistory[0].keyword;
    getMovieData(data.searchHistory[0].keyword);
  }
  if (data.view === 'search-result-detailed') {
    apiRequestIDDetailed(data.selectedCardID);
  }
  for (var n = 0; n < data.savedCards.length; n++) {
    var watchlistDomTree = renderWatchlist(data.savedCards[n]);
    $ulWatchlist.appendChild(watchlistDomTree);
  }
}

$ulWatchlist.addEventListener('click', removeButtonHandler);
function removeButtonHandler(event) {
  if (event.target.className === 'fas fa-minus-circle remove-icon') {
    $containerModal.className = 'container-modal overlay';
    $containerModalWindow.className = 'container-modal-window';
    data.removing = event.target.closest('li').getAttribute('imdbid');
  }
}

$containerModalWindow.addEventListener('click', buttonModalHandler);
function buttonModalHandler(event) {
  var $allWatchlistCards = document.querySelectorAll('.watchlist-cards-list-padding');
  if (event.target.className === 'cancel-button-modal white font-roboto') {
    $containerModal.className = 'container-modal hidden';
    $containerModalWindow.className = 'container-modal-window hidden';
  } else if (event.target.className === 'remove-button-modal white font-roboto') {
    for (var i = 0; i < $allWatchlistCards.length; i++) {
      if ($allWatchlistCards[i].getAttribute('imdbid') === data.removing) {
        $allWatchlistCards[i].remove();
      }
    }
    for (var n = 0; n < data.savedCards.length; n++) {
      if (data.savedCards[n].id === data.removing) {
        data.savedCards.splice(n, 1);
      }
    }
    $containerModal.className = 'container-modal hidden';
    $containerModalWindow.className = 'container-modal-window hidden';
  }
}
