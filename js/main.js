var $searchForm = document.querySelector('form');
var $searchBar = document.querySelector('.search-bar');
// var $searchIcon = document.querySelector('#search-icon');

$searchForm.addEventListener('submit', submitSearch);
function submitSearch(event) {
  // event.preventDefault();
  var searchValue = $searchBar.value;
  data.searches.unshift(searchValue);
  data.nextSearchId++;
}

// window.addEventListener('submit', function (event) {
//   console.log('okok');
// });
