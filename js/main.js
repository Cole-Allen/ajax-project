var catPhotos = new XMLHttpRequest();
catPhotos.addEventListener('load', loadCatPhotos);
catPhotos.open('GET', 'https://aws.random.cat/meow');
catPhotos.send();

function loadCatPhotos() {
  var tempDataArray = [];
  var translatedJSON = JSON.parse(this.responseText);

  console.log(translatedJSON);
}

function createImageCell(imageURL) {
  var $imageCell = document.createElement('div');
  var $imageBox = document.createElement('div');
  var $imageOverlay = document.createElement('div');
  var $imgA = document.createElement('a');
  var $image = document.createElement('img');
  var $penA = document.createElement('a');
  var $heartA = document.createElement('a');
  var $pen = document.createElement('a');
  var $heart = document.createElement('a');

  $imageCell.setAttribute('class', 'image-cell');
  $imageBox.setAttribute('class', 'image-box');
  $imageOverlay.setAttribute('class', 'image-overlay');
  $image.setAttribute('src', imageURL);

}

var $imagegrid = document.getElementById('grid');

$imagegrid.addEventListener('click', function (event) {
  console.log(event.target);
});
