var $searchForm = document.querySelector('form');
var $searchBar = document.querySelector('.search-bar');

$searchForm.addEventListener('submit', submitSearch);
function submitSearch(event) {
  event.preventDefault();
  var searchValue = $searchBar.value;
  data.searches.unshift(searchValue);
  data.nextSearchId++;
  apiRequest(data.searches[0]);
}

function apiRequest(search) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://www.omdbapi.com/?apikey=67ac1937' + '&s=' + search);
  xhr.responseType = 'json';
  xhr.addEventListener('load', getMovieData);
  function getMovieData() {
  }
  xhr.send();
}
