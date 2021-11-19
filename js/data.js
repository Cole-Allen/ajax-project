/* exported data */

let data = {
  favorites: [],
  nextID: 0,
  view: 'main-view',
  meme: null,
  dark: false
};

window.addEventListener('beforeunload', function (event) {

  const dataStringified = JSON.stringify(data);
  localStorage.setItem('cat-data', dataStringified);
});

const previousData = localStorage.getItem('cat-data');

if (previousData) {
  data = JSON.parse(previousData);
}
