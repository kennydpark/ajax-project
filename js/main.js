var $searchForm = document.querySelector('form');
var $searchBar = document.querySelector('.search-bar');

$searchForm.addEventListener('submit', submitSearch);
function submitSearch(event) {
  event.preventDefault();
  var searchValue = {};
  searchValue.keyword = $searchBar.value;
  searchValue.searchID = data.nextSearchId;
  data.searches.unshift(searchValue);
  data.nextSearchId++;
  apiRequest(data.searches[0].keyword);
}

function apiRequest(search) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://www.omdbapi.com/?apikey=67ac1937' + '&s=' + search);
  xhr.responseType = 'json';
  xhr.addEventListener('load', getMovieData);
  function getMovieData() {
    // console.log(xhr.response.Search);
    // data.searches[0]xhr.response.Search[0].imdbID
  }
  xhr.send();
}

// function apiRequestID(imdbID) {
//   var xhr = new XMLHttpRequest();
//   xhr.open('GET', 'http://www.omdbapi.com/?apikey=67ac1937' + '&i=' + imdbID);
//   xhr.responseType = 'json';
//   // xhr.addEventListener('load', getMovieID);
// }
