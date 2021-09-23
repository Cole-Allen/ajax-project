var catImages = {
  entries: [],
  cells: [],
  unfaved: []
};

var randAmount = 20;

var $headerLogo = document.querySelector('.header-logo');
var $headerFavorites = document.querySelector('.header-favorites');

var $imageColumns = document.querySelectorAll('.column');
var $modal = document.querySelector('.modal');

switchViews(data.view);

$headerFavorites.addEventListener('click', function (event) {
  data.view = 'favorites';
  switchViews('favorites');
});

$headerLogo.addEventListener('click', function (event) {
  switchViews('buit');
  data.view = 'grid';
});

function getRandomImages(amount) {
  for (var i = 0; i < amount; i++) {
    var catPhotos = new XMLHttpRequest();
    catPhotos.addEventListener('load', loadCatPhotos);
    catPhotos.open('GET', 'https://aws.random.cat/meow');
    catPhotos.send();

  }
  assignCellstoColumn(catImages.entries);
}

function loadCatPhotos() {

  var translatedJSON = JSON.parse(this.responseText);

  var cellData = {};
  cellData.ID = data.nextID; // The Cell ID
  cellData.imageURL = translatedJSON.file; // The Image URL
  for (var i = 0; i < data.favorites.length; i++) {
    if (cellData.imageURL === data.favorites[i].imageURL) {
      cellData.favorited = true;
      break;
    } else {
      cellData.favorited = false;
    }
  }
  var cell = createImageCell(translatedJSON.file, data.nextID, cellData.favorited);
  cellData.cell = cell; // The cell that shows up on the grid.Needed to get the heart on the grid view

  catImages.entries.push(cellData); // Shows current random entries. Length should not be larger than the amount parameter of the getRandomIMages function
  catImages.cells.push(cell);
  data.nextID++; // Makes sure no cells share the same id

  // $imagegrid.appendChild(cell); // Adds the Cell to the grid view
  assignCellstoColumn(catImages.cells);
}

function assignCellstoColumn(cellArray) {
  var column = 0;
  for (var i = 0; i < cellArray.length; i++) {
    var cell = cellArray[i];
    switch (column) {
      case 0:
        $imageColumns[0].appendChild(cell);
        column++;
        break;
      case 1:
        $imageColumns[1].appendChild(cell);
        column++;
        break;
      case 2:
        $imageColumns[2].appendChild(cell);
        column++;
        break;
      case 3:
        $imageColumns[3].appendChild(cell);
        column = 0;
        break;
    }
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
    $heart.setAttribute('class', 'fas fa-heart faved');
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

function cellEventListener(event) {

  if (event.target.getAttribute('icon') === 'heart') {
    for (var i = 0; i < data.favorites.length; i++) {
      if (data.favorites[i].ID.toString() === event.currentTarget.getAttribute('cell-id')) {
        unfavoriteHandler(event);
        return;
      }
    }
    favoriteHandler(event);
  } else if (event.target.getAttribute('src')) {
    whenImageClicked(event.target.getAttribute('src'), event.currentTarget);
  }
}

function favoriteHandler(event) {
  for (var i = 0; i < catImages.entries.length; i++) {
    if (event.currentTarget.getAttribute('cell-id') === catImages.entries[i].ID.toString()) {
      catImages.entries[i].favorited = true;
      data.favorites.push(catImages.entries[i]);
      event.target.classList.remove('far');
      event.target.classList.add('fas');
      event.target.classList.add('faved');
    }
  }
}

function unfavoriteHandler(event) {

  for (var i = 0; i < data.favorites.length; i++) {
    if (event.currentTarget.getAttribute('cell-id') === data.favorites[i].ID.toString()) {
      data.favorites[i].favorited = false;
      data.favorites.splice(data.favorites.indexOf(data.favorites[i]), 1);
      event.target.classList.remove('fas');
      event.target.classList.add('far');
      event.target.classList.remove('faved');
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
  var $cellHeart = targetCell.querySelector('.fa-heart'); // Links the heart effect to the grid view cell
  if (data.favorites.includes(targetCell)) {
    $heart.classList.remove('far');
    $heart.classList.add('fas');
    $heart.classList.add('faved');
  } else {
    $heart.classList.remove('fas');
    $heart.classList.remove('faved');
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
      $cellHeart.classList.add('faved');
      $heart.classList.remove('far');
      $heart.classList.add('fas');
      $heart.classList.add('faved');
    } else if (event.target === $heart && data.favorites.includes(targetCell)) {
      event.target.favorited = false;
      data.favorites.splice(data.favorites.indexOf(targetCell), 1);
      $cellHeart.classList.add('far');
      $cellHeart.classList.remove('fas');
      $cellHeart.classList.remove('faved');
      $heart.classList.add('far');
      $heart.classList.remove('fas');
      $heart.classList.remove('faved');
    }
  });
}

function switchViews(targetview) {
  for (var d = 0; d < $imageColumns.length; d++) {
    while ($imageColumns[d].firstChild) {
      $imageColumns[d].removeChild($imageColumns[d].firstChild);
    }
  }
  if (targetview === 'favorites') {
    $headerFavorites.classList.add('favorites-view');
    var favoriteCells = [];
    for (var i = 0; i < data.favorites.length; i++) {
      favoriteCells.push(createImageCell(data.favorites[i].imageURL, data.favorites[i].ID, data.favorites[i].favorited));
    }
    assignCellstoColumn(favoriteCells);
  } else {
    $headerFavorites.classList.remove('favorites-view');
    catImages = {
      entries: [],
      cells: []
    };
    getRandomImages(randAmount);
  }
}
