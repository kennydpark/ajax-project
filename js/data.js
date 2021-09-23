/* exported data */
var data = {
  view: '',
  searchHistory: [],
  editing: null,
  nextSearchId: 1
};

window.addEventListener('beforeunload', beforeUnload);
function beforeUnload(event) {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('data-model', dataJSON);
}

var previousDataJSON = localStorage.getItem('data-model');
if (previousDataJSON) {
  data = JSON.parse(previousDataJSON);
}
