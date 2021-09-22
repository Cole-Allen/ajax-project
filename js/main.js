var catImages = {
  entries: []
};

var column = 0;

var $headerLogo = document.querySelector('.header-logo');
var $headerFavorites = document.querySelector('.header-favorites');

var $imagegrid = document.querySelector('.grid');
var $imageColumns = document.querySelectorAll('.column');
var $modal = document.querySelector('.modal');

getRandomImages(20); // Populates the page with 20 random images from the API

$headerFavorites.addEventListener('click', function (event) {
  switchViews('favorites');
});

$headerLogo.addEventListener('click', function (event) {
  switchViews('buit');
});

function getRandomImages(amount) {
  for (var i = 0; i < amount; i++) {
    var catPhotos = new XMLHttpRequest();
    catPhotos.addEventListener('load', loadCatPhotos);
    catPhotos.open('GET', 'https://aws.random.cat/meow');
    catPhotos.send();

  }
}

function loadCatPhotos() {

  var translatedJSON = JSON.parse(this.responseText);
  var cell = createImageCell(translatedJSON.file, data.nextID, false);
  var cellData = {};
  cellData.ID = data.nextID; // The Cell ID
  cellData.imageURL = translatedJSON.file; // The Image URL
  cellData.favorited = false; // Lets the page know if the hearts should already be filled in
  cellData.cell = cell; // The cell that shows up on the grid.Needed to get the heart on the grid view

  catImages.entries.push(cellData); // Shows current random entries. Length should not be larger than the amount parameter of the getRandomIMages function

  data.nextID++; // Makes sure no cells share the same id

  // $imagegrid.appendChild(cell); // Adds the Cell to the grid view

  switch (column) {
    case 0:
      $imageColumns[0].appendChild(cell);
      console.log('1');
      column++;
      break;
    case 1:
      $imageColumns[1].appendChild(cell);
      console.log('2');
      column++;
      break;
    case 2:
      $imageColumns[2].appendChild(cell);
      console.log('3');
      column++;
      break;
    case 3:
      $imageColumns[3].appendChild(cell);
      console.log('4');
      column = 0;
      break;
  }

}

// Creates the Cell container in the DOM

function createImageCell(imageURL, id, favorited) {
  var $cell = document.createElement('div');
  var $imageBox = document.createElement('div');
  var $imageOverlay = document.createElement('div');
  var $imgA = document.createElement('a');
  var $image = document.createElement('img');
  var $penA = document.createElement('a');
  var $heartA = document.createElement('a');
  var $pen = document.createElement('i');
  var $heart = document.createElement('i');

  $cell.setAttribute('class', 'cell');
  $cell.setAttribute('cell-id', id);
  $imageBox.setAttribute('class', 'image-box');
  $imageOverlay.setAttribute('class', 'image-overlay');
  $image.setAttribute('src', imageURL);
  $image.setAttribute('class', 'cell-image');
  $image.setAttribute('image-id', id);
  $pen.setAttribute('icon', 'edit');
  $heart.setAttribute('icon', 'heart');

  if (favorited) {
    $pen.setAttribute('class', 'fas fa-pen');
    $heart.setAttribute('class', 'fas fa-heart');
  } else {
    $pen.setAttribute('class', 'fas fa-pen');
    $heart.setAttribute('class', 'far fa-heart');
  }

  $cell.appendChild($imageBox);
  $imageBox.appendChild($imgA);
  $imageBox.appendChild($imageOverlay);
  $imgA.appendChild($image);
  $imageOverlay.appendChild($penA);
  $imageOverlay.appendChild($heartA);
  $penA.appendChild($pen);
  $heartA.appendChild($heart);

  $cell.addEventListener('click', cellEventListener); // listens for clicks on the cell

  return $cell;

}

function cellEventListener(event) { //! !!!!! Need to fix so that it works without relying on data.entries!!!!!!!!!!!
  // Handle favorites in 'cell' view
  if (event.target.getAttribute('icon') === 'heart') {
    for (var i = 0; i < catImages.entries.length; i++) {
      if (catImages.entries[i].ID.toString() === event.currentTarget.getAttribute('cell-id') && !data.favorites.includes(catImages.entries[i])) {
        data.favorites.push(catImages.entries[i]);
        catImages.entries[i].favorited = true;
        event.target.classList.remove('far');
        event.target.classList.add('fas');
      } else if (catImages.entries[i].ID.toString() === event.currentTarget.getAttribute('cell-id') && data.favorites.includes(catImages.entries[i])) {
        data.favorites.splice(data.favorites.indexOf(catImages.entries[i]), 1);
        catImages.entries[i].favorited = false;
        event.target.classList.remove('fas');
        event.target.classList.add('far');
      }
    }
  } else if (event.target.getAttribute('image-id')) {
    for (var j = 0; j < catImages.entries.length; j++) {
      if (event.currentTarget.getAttribute('cell-id') === catImages.entries[j].ID.toString()) {
        whenImageClicked(event.target.getAttribute('src'), catImages.entries[j]);
      }
    }

  }
}

function whenImageClicked(url, targetCell) {
  $modal.classList.remove('hidden');
  $modal.querySelector('img').setAttribute('src', url);
  modalHandler(targetCell);

}

function modalHandler(targetCell) {
  var $heart = $modal.querySelector('.fa-heart');
  var $cellHeart = targetCell.cell.querySelector('.fa-heart'); // Links the heart effect to the grid view cell
  if (data.favorites.includes(targetCell)) {
    $heart.classList.remove('far');
    $heart.classList.add('fas');
  } else {
    $heart.classList.remove('fas');
    $heart.classList.add('far');
  }
  $modal.addEventListener('click', function (event) {
    if (event.target === $modal.querySelector('.fa-times-circle')) {
      $modal.classList.add('hidden');
    }
    if (event.target === $heart && !data.favorites.includes(targetCell)) {
      data.favorites.push(targetCell);
      event.target.favorited = true;
      $cellHeart.classList.remove('far');
      $cellHeart.classList.add('fas');
      $heart.classList.remove('far');
      $heart.classList.add('fas');
    } else if (event.target === $heart && data.favorites.includes(targetCell)) {
      event.target.favorited = false;
      data.favorites.splice(data.favorites.indexOf(targetCell), 1);
      $heart.classList.add('far');
      $heart.classList.remove('fas');
    }
  });
}

function switchViews(targetview) {
  while ($imagegrid.firstChild) {
    $imagegrid.removeChild($imagegrid.firstChild);
  }
  if (targetview === 'favorites') {
    for (var i = 0; i < data.favorites.length; i++) {
      $imagegrid.appendChild(createImageCell(data.favorites[i].imageURL, data.favorites[i].ID, data.favorites[i].favorited));
    }
  } else {
    getRandomImages(20);
  }
}
