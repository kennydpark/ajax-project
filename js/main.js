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
var $searchResultsContent = document.querySelector('#search-results-content');
var $searchResultDetailed = document.querySelector('#search-result-detailed');

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
  $resultCard.setAttribute('imdbid', entry.imdbID);
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

/* <div class="detailed-card font-roboto">
      <div class="row row-card-poster">
          <img class="poster-big" src="images/avengers-poster.jpg">
      </div>
      <div class="container-card-info">
          <div class="row row-card-title white">
              <div class="column-title-detailed">
                  <h2 class="detailed-title">The Avengers</h2>
              </div>
              <div class="column-year-detailed">
                  <p class="detailed-year">2012</p>
              </div>
          </div>
          <div class="row">
              <div class="column-half">
                  <div class="row row-card-genre white">
                      <p class="detailed-genre">Action, Adventure, Sci-Fi</p>
                  </div>
                  <div class="row row-card-director white">
                      <p class="detailed-director">Director: <span class="bold">Joss Whedon</span></p>
                  </div>
                  <div class="row row-card-cast white">
                      <p class="detailed-cast">Cast: <span class="bold">Robert Downey Jr., Chris Evans, Scarlett Johansson</span></p>
                  </div>
              </div>
              <div class="column-half">
                  <div class="row row-card-plot white">
                      <p class="detailed-plot">Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.
                      </p>
                  </div>
              </div>
          </div>
          <div class="row row-card-add white">
              <div class="column-big-plus">
                  <button class="plus-button-big" type="button"><i type="button" class="fas fa-plus-circle plus-icon-big white"></i></button>
              </div>
              <div class="column-add-caption text-center">
                  <h1 class="add-caption">Add to Watchlist</h1>
              </div>
          </div>
      </div>
  </div> */

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

  $detailedCard.setAttribute('class', 'detailed-card font-roboto');
  $rowCardPoster.setAttribute('class', 'row row-card-poster');
  $imgPosterBig.setAttribute('class', 'poster-big');
  $imgPosterBig.setAttribute('src', entry.Poster);
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

  $detailedTitle.textContent = entry.Title;
  $detailedYear.textContent = entry.Year;
  $detailedGenre.textContent = entry.Genre;
  $detailedDirector.textContent = entry.Director;
  $detailedCast.textContent = entry.Actors;
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

$searchResultsContent.addEventListener('click', selectCard);
function selectCard(event) {
  var imdbID = event.target.closest('li').getAttribute('imdbid');
  // console.log(event.target.closest('li').getAttribute('imdbid'));
  apiRequestIDDetailed(imdbID);
  switchView('search-result-detailed');
}

function apiRequestIDDetailed(imdbID) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://www.omdbapi.com/?apikey=67ac1937' + '&i=' + imdbID);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    getResponseForDetailed(xhr.response);
  });
  xhr.send();
}

function getResponseForDetailed(response) {
  // console.log(response);
  $searchResultDetailed.appendChild(renderDetailed(response));
}

// Actors: "Gerard Butler, Lena Headey, David Wenham"
// Awards: "19 wins & 55 nominations"
// BoxOffice: "$210,614,939"
// Country: "United States, Canada, Bulgaria, Australia"
// DVD: "31 Jul 2007"
// Director: "Zack Snyder"
// Genre: "Action, Drama"
// Language: "English"
// Metascore: "52"
// Plot: "King Leonidas of Sparta and a force of 300 men fight the Persians at Thermopylae in 480 B.C."
// Poster: "https://m.media-amazon.com/images/M/MV5BNWMxYTZlOTUtZDExMi00YzZmLTkwYTMtZmM2MmRjZmQ3OGY4XkEyXkFqcGdeQXVyMTAwMzUyMzUy._V1_SX300.jpg"
// Production: "Atmosphere Entertainment MM LLC, Legendary Pictures, Virtual Studios, Warner Bros."
// Rated: "R"
// Ratings: (3)[{… }, {… }, {… }]
// Released: "09 Mar 2007"
// Response: "True"
// Runtime: "117 min"
// Title: "300"
// Type: "movie"
// Website: "N/A"
// Writer: "Zack Snyder, Kurt Johnstad, Michael B. Gordon"
// Year: "2006"
// imdbID: "tt0416449"
// imdbRating: "7.6"
