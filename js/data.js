/* exported data */
var data = {
  view: 'search-home',
  searchHistory: [],
  editing: null,
  nextSearchId: 1,
  savedCards: []
};

// window.addEventListener('load', function (event) {
//   var dataJSON = JSON.stringify(data);
//   localStorage.setItem('data-model', dataJSON);
// });

window.addEventListener('beforeunload', beforeUnload);
function beforeUnload(event) {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('data-model', dataJSON);
}

var previousDataJSON = localStorage.getItem('data-model');
if (previousDataJSON) {
  data = JSON.parse(previousDataJSON);
}
