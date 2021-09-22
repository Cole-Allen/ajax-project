/* exported data */

var data = {
  favorites: [],
  nextID: 0,
  view: null
};

window.addEventListener('beforeunload', function (event) {

  var dataStringified = JSON.stringify(data);
  localStorage.setItem('cat-data', dataStringified);
});

var previousData = localStorage.getItem('cat-data');

if (previousData) {
  data = JSON.parse(previousData);
}
