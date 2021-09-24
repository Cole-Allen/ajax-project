var catImages = {
  entries: [],
  cells: [],
  unfaved: []
};

var randAmount = 20;

var $views = document.querySelectorAll('.view');

var $headerLogo = document.querySelector('.header-logo');
var $headerFavorites = document.querySelector('.header-favorites');

var $imageColumns = document.querySelectorAll('.main-view .column');
var $favImageColumns = document.querySelectorAll('.fav-view .column');
var $modal = document.querySelector('.modal');

switchViews(data.view);

$headerFavorites.addEventListener('click', function (event) {
  switchViews('favorites');
});

$headerLogo.addEventListener('click', function (event) {
  switchViews('main-view');
});

function getRandomImages(amount) {
  for (var i = 0; i < amount; i++) {
    var catPhotos = new XMLHttpRequest();
    catPhotos.addEventListener('load', loadCatPhotos);
    catPhotos.open('GET', 'https://aws.random.cat/meow');
    catPhotos.send();

  }
  if (data.view === 'main-view') {
    assignCellstoColumn(catImages.entries, $imageColumns);
  }
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
  assignCellstoColumn(catImages.cells, $imageColumns);
}

function assignCellstoColumn(cellArray, columns) {
  var column = 0;
  for (var i = 0; i < cellArray.length; i++) {
    var cell = cellArray[i];
    switch (column) {
      case 0:
        columns[0].appendChild(cell);
        column++;
        break;
      case 1:
        columns[1].appendChild(cell);
        column++;
        break;
      case 2:
        columns[2].appendChild(cell);
        column++;
        break;
      case 3:
        columns[3].appendChild(cell);
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
  } else if (event.target.getAttribute('icon') === 'edit') {
    openPhotoInMemeView(event.currentTarget.querySelector('.cell-image').getAttribute('src'));
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
  var cellDataM = null;
  var $heart = $modal.querySelector('.fa-heart');
  var $cellHeart = targetCell.querySelector('.fa-heart'); // Links the heart effect to the grid view cell
  for (var p = 0; p < catImages.entries.length; p++) {
    if (catImages.entries[p].ID.toString() === targetCell.getAttribute('cell-id')) {
      cellDataM = catImages.entries[p];
    }
  }

  if (cellDataM.favorited) {
    $heart.classList.remove('far');
    $heart.classList.add('fas');
    $heart.classList.add('faved');
  } else {
    $heart.classList.add('far');
    $heart.classList.remove('fas');
    $heart.classList.remove('faved');
  }

  $modal.addEventListener('click', function (event) {
    if (event.target === $modal.querySelector('.fa-times-circle')) {
      $modal.classList.add('hidden');
    } else if (event.target === $modal.querySelector('.fa-pen')) {
      console.log(targetCell);
      $modal.classList.add('hidden');
      openPhotoInMemeView(targetCell.querySelector('.cell-image').getAttribute('src'));
    } else if (event.target === $heart) {
      if (data.favorites.includes(cellDataM)) {
        cellDataM.favorited = false;
        data.favorites.splice(data.favorites.indexOf(cellDataM), 1);
        $cellHeart.classList.add('far');
        $cellHeart.classList.remove('fas');
        $cellHeart.classList.remove('faved');
        $heart.classList.add('far');
        $heart.classList.remove('fas');
        $heart.classList.remove('faved');
      } else {
        cellDataM.favorited = true;
        data.favorites.push(cellDataM);
        $cellHeart.classList.remove('far');
        $cellHeart.classList.add('fas');
        $cellHeart.classList.add('faved');
        $heart.classList.remove('far');
        $heart.classList.add('fas');
        $heart.classList.add('faved');
      }
    }
  });
}

function switchViews(targetview) {
  data.view = targetview;
  for (var d = 0; d < $imageColumns.length; d++) {
    while ($imageColumns[d].firstChild) {
      $imageColumns[d].removeChild($imageColumns[d].firstChild);
    }
  }

  for (var a = 0; a < $favImageColumns.length; a++) {
    while ($favImageColumns[a].firstChild) {
      $favImageColumns[a].removeChild($favImageColumns[a].firstChild);
    }
  }

  for (var i = 0; i < $views.length; i++) {
    $views[i].classList.add('hidden');
    if ($views[i].getAttribute('data-view') === targetview) {
      $views[i].classList.remove('hidden');
    }
  }
  if (targetview === 'favorites') {
    $headerFavorites.classList.add('favorites-view');
    var favoriteCells = [];
    for (var j = 0; j < data.favorites.length; j++) {
      favoriteCells.push(createImageCell(data.favorites[j].imageURL, data.favorites[j].ID, data.favorites[j].favorited));
    }
    assignCellstoColumn(favoriteCells, $favImageColumns);
  } else {
    $headerFavorites.classList.remove('favorites-view');
    catImages = {
      entries: [],
      cells: []
    };
    getRandomImages(randAmount);
  }
}

var $memeImageSize = document.querySelector('.meme-image');
var $memeImage = document.querySelector('.meme-image img');

if (data.meme) {
  $memeImage.setAttribute('src', data.meme);
}

var $memeTopText = document.querySelector('.top-text');
var $memeBottomText = document.querySelector('.bottom-text');

var $memeTopInput = document.getElementById('top-text');
var $memeBottomInput = document.getElementById('bottom-text');
calculateFontSize($memeTopText, $memeTopText.textContent.length);
calculateFontSize($memeBottomText, $memeBottomText.textContent.length);

window.addEventListener('resize', function (event) {
  calculateFontSize($memeTopText, $memeTopText.textContent.length);
  calculateFontSize($memeBottomText, $memeBottomText.textContent.length);
});

$memeTopInput.addEventListener('input', function (event) {
  $memeTopText.textContent = $memeTopInput.value;
  calculateFontSize($memeTopText, $memeTopText.textContent.length);

});

$memeBottomInput.addEventListener('input', function (event) {
  $memeBottomText.textContent = $memeBottomInput.value;
  calculateFontSize($memeBottomText, $memeBottomText.textContent.length);
});

function calculateFontSize(textNode, textLength) {
  if (textLength <= 12) {
    textNode.style.fontSize = 'min(calc(' + $memeImageSize.clientWidth + 'px / ' + textLength + ' * 1.2), 8rem)'; // Will need to change the max so that it will work on VERY large monitors
  }
}

function openPhotoInMemeView(photoURL) {
  console.log(photoURL);
  data.meme = photoURL;
  $memeImage.setAttribute('src', data.meme);
  switchViews('meme-view');
}
