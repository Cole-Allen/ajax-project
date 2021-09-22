/* exported data */
var data = {
  entries: [],
  favorites: [],
  nextID: 0
};

window.addEventListener('beforeunload', function (event) {

  var dataStringified = JSON.stringify(data);
  localStorage.setItem('cat-data', dataStringified);
});

var previousData = localStorage.getItem('cat-data');

if (previousData) {
  data = JSON.parse(previousData);
  data.entries = [];
}
