let catImages = {
  entries: [],
  cells: [],
  unfaved: []
};

const randAmount = 20;

const $views = document.querySelectorAll('.view');

const $headerLogo = document.querySelector('.header-logo');
const $headerFavorites = document.querySelector('.header-favorites');

const $imageColumns = document.querySelectorAll('.main-view .column');
const $favImageColumns = document.querySelectorAll('.fav-view .column');
const $modal = document.querySelector('.modal');

const $memeImageSize = document.querySelector('.meme-image');
const $memeImage = document.querySelector('.meme-image img');

const $memeTopText = document.querySelector('.top-text');
const $memeBottomText = document.querySelector('.bottom-text');

const $memeTopInput = document.getElementById('top-text');
const $memeBottomInput = document.getElementById('bottom-text');

const $canvas = document.querySelector('canvas');
const $memeSaveButton = document.querySelector('.meme-form .download-meme');

const ctx = $canvas.getContext('2d');
const loadingModal = document.querySelector('.loading-modal');
let errorCount = 0;

switchViews(data.view);

$headerFavorites.addEventListener('click', function (event) {
  switchViews('favorites');
});

$headerLogo.addEventListener('click', function (event) {
  switchViews('main-view');
});

function getRandomImages(amount) {
  for (let i = 0; i < amount; i++) {
    const catPhotos = new XMLHttpRequest();
    catPhotos.addEventListener('load', function () {
      loadCatPhotos(this);
      if (i === randAmount - 1) {
        loadingModal.classList.add('hidden');
      }
    });
    catPhotos.addEventListener('error', () => {
      if (errorCount === 0) {
        const err = document.createElement('div');
        err.textContent = 'You are not connected to the internet';
        loadingModal.querySelector('.loading-icon').appendChild(err);
        errorCount++;
      }

    });
    catPhotos.open('GET', 'https://aws.random.cat/meow');
    catPhotos.send();

  }
  if (data.view === 'main-view') {
    assignCellstoColumn(catImages.entries, $imageColumns);
  }
}

function loadCatPhotos(e) {

  const translatedJSON = JSON.parse(e.responseText);

  const cellData = {};
  cellData.ID = data.nextID; // The Cell ID
  cellData.imageURL = translatedJSON.file; // The Image URL
  for (let i = 0; i < data.favorites.length; i++) {
    if (cellData.imageURL === data.favorites[i].imageURL) {
      cellData.favorited = true;
      break;
    } else {
      cellData.favorited = false;
    }
  }
  const cell = createImageCell(translatedJSON.file, data.nextID, cellData.favorited);
  cellData.cell = cell; // The cell that shows up on the grid.Needed to get the heart on the grid view

  catImages.entries.push(cellData); // Shows current random entries. Length should not be larger than the amount parameter of the getRandomIMages function
  catImages.cells.push(cell);
  data.nextID++; // Makes sure no cells share the same id

  // $imagegrid.appendChild(cell); // Adds the Cell to the grid view
  assignCellstoColumn(catImages.cells, $imageColumns);
}

function assignCellstoColumn(cellArray, columns) {
  let column = 0;
  for (let i = 0; i < cellArray.length; i++) {
    const cell = cellArray[i];
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
  const $cell = document.createElement('div');
  const $imageBox = document.createElement('div');
  const $imageOverlay = document.createElement('div');
  const $imgA = document.createElement('a');
  const $image = document.createElement('img');
  const $penA = document.createElement('a');
  const $heartA = document.createElement('a');
  const $pen = document.createElement('i');
  const $heart = document.createElement('i');

  $cell.setAttribute('class', 'cell');
  $cell.setAttribute('cell-id', id);
  $imageBox.setAttribute('class', 'image-box');
  $imageOverlay.setAttribute('class', 'image-overlay');
  $image.setAttribute('src', imageURL || './images/times-circle.svg');
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
    for (let i = 0; i < data.favorites.length; i++) {
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
  for (let i = 0; i < catImages.entries.length; i++) {
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

  for (let i = 0; i < data.favorites.length; i++) {
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
  let cellDataM = null;
  const $heart = $modal.querySelector('.fa-heart');
  const $cellHeart = targetCell.querySelector('.fa-heart'); // Links the heart effect to the grid view cell
  for (let p = 0; p < catImages.entries.length; p++) {
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
      $modal.classList.add('hidden');
      openPhotoInMemeView(targetCell.querySelector('.cell-image').getAttribute('src'));
    } else if (event.target === $modal.querySelector('.fa-download')) {
      $modal.querySelector('.download-anchor').setAttribute('href', cellDataM.imageURL);
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
  for (let d = 0; d < $imageColumns.length; d++) {
    while ($imageColumns[d].firstChild) {
      $imageColumns[d].removeChild($imageColumns[d].firstChild);
    }
  }

  for (let a = 0; a < $favImageColumns.length; a++) {
    while ($favImageColumns[a].firstChild) {
      $favImageColumns[a].removeChild($favImageColumns[a].firstChild);
    }
  }

  for (let i = 0; i < $views.length; i++) {
    $views[i].classList.add('hidden');
    if ($views[i].getAttribute('data-view') === targetview) {
      $views[i].classList.remove('hidden');
    }
  }
  if (targetview === 'favorites') {
    $headerFavorites.classList.add('favorites-view');
    const favoriteCells = [];
    for (let j = 0; j < data.favorites.length; j++) {
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

if (data.meme) {
  $memeImage.setAttribute('src', data.meme);
}

calculateFontSize($memeTopText, $memeTopText.textContent.length);
calculateFontSize($memeBottomText, $memeBottomText.textContent.length);

window.addEventListener('resize', function (event) {
  calculateFontSize($memeTopText, $memeTopText.textContent.length);
  calculateFontSize($memeBottomText, $memeBottomText.textContent.length);
  draw();
});

$memeTopInput.addEventListener('input', function (event) {
  $memeTopText.textContent = $memeTopInput.value;
  calculateFontSize($memeTopText, $memeTopText.textContent.length);
  draw();

});

$memeBottomInput.addEventListener('input', function (event) {
  $memeBottomText.textContent = $memeBottomInput.value;
  calculateFontSize($memeBottomText, $memeBottomText.textContent.length);
  draw();
});

function calculateFontSize(textNode, textLength) {
  if (textLength <= 15) {
    textNode.style.fontSize = 'min(calc(' + $memeImageSize.clientWidth + 'px / ' + textLength + '), 3rem)'; // Will need to change the max so that it will work on VERY large monitors
  }
}

function openPhotoInMemeView(photoURL) {
  data.meme = photoURL;
  $memeImage.setAttribute('src', data.meme);
  loadImage();
  switchViews('meme-view');
}

function loadImage() {
  const img = new Image();
  img.src = data.meme;
  img.addEventListener('load', draw);
}

loadImage();

function draw() {

  $canvas.setAttribute('width', $memeImage.width);
  $canvas.setAttribute('height', $memeImage.height);
  ctx.clearRect(0, 0, $canvas.width, $canvas.height);
  // ctx.drawImage(img, 0, 0, $memeImageSize.clientWidth, $memeImageSize.clientHeight);
  ctx.lineWidth = 10;
  ctx.strokeStyle = 'black';
  ctx.font = '3rem sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.miterLimit = 2;
  ctx.strokeText($memeTopInput.value, $memeImage.clientWidth / 2, 50, $memeImage.clientWidth);
  ctx.fillText($memeTopInput.value, $memeImage.clientWidth / 2, 50, $memeImage.clientWidth);

  ctx.strokeText($memeBottomInput.value, $memeImage.clientWidth / 2, $memeImage.clientHeight - 20, $memeImage.clientWidth);
  ctx.fillText($memeBottomInput.value, $memeImage.clientWidth / 2, $memeImage.clientHeight - 20, $memeImage.clientWidth);

}

$memeSaveButton.addEventListener('click', function () {
  $memeSaveButton.setAttribute('href', $canvas.toDataURL());
});

const $darkToggle = document.querySelector('.switch input');
const $body = document.querySelector('body');

if (data.dark) {
  $darkToggle.checked = true;
  $body.style.background = '#242e30';
}

$darkToggle.addEventListener('change', function (event) {
  if ($darkToggle.checked) {
    $body.style.background = '#242e30';
    data.dark = true;
  } else {
    $body.style.background = '#c9f6d2';
    data.dark = false;
  }
});
