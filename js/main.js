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

switchViews(data.view);

$headerFavorites.addEventListener('click', function (event) {
  switchViews('favorites');
});

$headerLogo.addEventListener('click', function (event) {
  switchViews('main-view');
});

function getRandomImages(amount) {
  for (let i = 0; i < amount; i++) {
    const cellData = {};
    cellData.ID = data.nextID; // The Cell ID
    data.nextID++;
    const cell = createImageCell(cellData.ID, false, false);
    catImages.cells.push(cell);
    const catPhotos = new XMLHttpRequest();
    catPhotos.addEventListener('load', function () {
      const translatedJSON = JSON.parse(this.responseText);
      const $cell = document.getElementById(cellData.ID);
      const $cellImage = $cell.querySelector('.cell-image');
      catImages.entries.push(translatedJSON.file);
      $cellImage.setAttribute('src', translatedJSON.file);

    });
    catPhotos.addEventListener('loadend', function () {
      const $cell = document.getElementById(cellData.ID);
      const $cellLoader = $cell.querySelector('.loading-container');
      const $placeholder = $cell.querySelector('.placeholder');

      $placeholder.setAttribute('class', 'hidden');
      $cellLoader.setAttribute('class', 'hidden');
    });
    catPhotos.addEventListener('error', () => {
      // tba ewrror  picture
    });
    catPhotos.open('GET', 'https://aws.random.cat/meow');
    catPhotos.send();

  }
  if (data.view === 'main-view') {
    assignCellstoColumn(catImages.cells, $imageColumns);
  }
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

function createImageCell(id, url, favorited) {
  const $cell = document.createElement('div');
  const $imageBox = document.createElement('div');
  const $imageOverlay = document.createElement('div');
  const $imgA = document.createElement('a');
  const $image = document.createElement('img');
  const $penA = document.createElement('a');
  const $heartA = document.createElement('a');
  const $pen = document.createElement('i');
  const $heart = document.createElement('i');

  const $imageContainer = document.createElement('div');
  const $loading = document.createElement('div');
  const $loadingSpinner = document.createElement('i');
  const $placeholder = document.createElement('div');

  $cell.setAttribute('class', 'cell');
  $cell.setAttribute('cell-id', id);
  $cell.setAttribute('id', id);
  $imageBox.setAttribute('class', 'image-box');
  $imageOverlay.setAttribute('class', 'image-overlay');
  $image.setAttribute('class', 'cell-image');
  $image.setAttribute('image-id', id);
  $pen.setAttribute('icon', 'edit');
  $heart.setAttribute('icon', 'heart');

  $imageContainer.setAttribute('class', 'image-container');
  $loading.setAttribute('class', 'loading-container');

  if (url) {
    $image.setAttribute('src', url);
    $loading.setAttribute('class', 'loading-container hidden');
  } else {

    $loadingSpinner.setAttribute('class', 'loading-spinner fas fa-fan');
    $placeholder.setAttribute('class', 'placeholder');
  }

  if (favorited) {
    $pen.setAttribute('class', 'fas fa-pen');
    $heart.setAttribute('class', 'fas fa-heart faved');
  } else {
    $pen.setAttribute('class', 'fas fa-pen');
    $heart.setAttribute('class', 'far fa-heart');
  }

  $cell.appendChild($imageBox);
  $imageBox.appendChild($imageContainer);
  $imageContainer.appendChild($imgA);
  $imageBox.appendChild($imageOverlay);
  $imgA.appendChild($image);
  $imgA.appendChild($loading);
  $imgA.appendChild($placeholder);
  $loading.appendChild($loadingSpinner);
  $imageOverlay.appendChild($penA);
  $imageOverlay.appendChild($heartA);
  $penA.appendChild($pen);
  $heartA.appendChild($heart);

  $cell.addEventListener('click', cellEventListener); // listens for clicks on the cell

  return $cell;

}

function cellEventListener(event) {
  const id = event.currentTarget.getAttribute('id');
  if (event.target.getAttribute('icon') === 'heart') {
    const $url = event.currentTarget.querySelector('.cell-image').getAttribute('src');
    for (const i of data.favorites) {
      if (i.image === $url) {
        event.target.classList.remove('fas');
        event.target.classList.add('far');
        event.target.classList.remove('faved');
        unfavoriteHandler(id, $url);
        return;
      }
    }
    event.target.classList.remove('far');
    event.target.classList.add('fas');
    event.target.classList.add('faved');
    favoriteHandler(id, $url);
  } else if (event.target.getAttribute('icon') === 'edit') {
    openPhotoInMemeView(event.currentTarget.querySelector('.cell-image').getAttribute('src'));
  } else if (event.target.getAttribute('src')) {
    whenImageClicked(event.target.getAttribute('src'), event.currentTarget);
  }
}

function favoriteHandler(id, url) {
  data.favorites.push({
    id: id,
    image: url
  });
}

function unfavoriteHandler(id, url) {
  for (const i of data.favorites) {
    if (i.image === url) {
      data.favorites.splice(data.favorites.indexOf(i), 1);
    }
  }
}

function whenImageClicked(url, targetCell) {
  const $heart = $modal.querySelector('.fa-heart');
  $heart.setAttribute('class', `${targetCell.querySelector('.fa-heart').getAttribute('class')}`);

  data.selectedCell = targetCell;
  data.selectedCell.image = url;
  $modal.classList.remove('hidden');
  $modal.querySelector('img').setAttribute('src', url);
}

$modal.addEventListener('click', function (event) {
  const $cellHeart = data.selectedCell.querySelector('.fa-heart');
  const $heart = $modal.querySelector('.fa-heart');

  switch (event.target.getAttribute('data-mod')) {
    case 'cancel':
      $modal.classList.add('hidden');
      break;
    case 'download':
      $modal.querySelector('.download-anchor').setAttribute('href', data.selectedCell.imageURL);
      break;
    case 'pen':
      $modal.classList.add('hidden');
      openPhotoInMemeView(data.selectedCell.imageURL);
      break;
    case 'heart':
      for (const i of data.favorites) {
        if (i.image === data.selectedCell.image) {
          data.favorites.splice(data.favorites.indexOf(i), 1);
          $cellHeart.classList.add('far');
          $cellHeart.classList.remove('fas');
          $cellHeart.classList.remove('faved');
          $heart.classList.add('far');
          $heart.classList.remove('fas');
          $heart.classList.remove('faved');
          return;
        }
      }
      data.favorites.push({
        id: data.selectedCell.getAttribute('id'),
        image: data.selectedCell.image
      });
      $cellHeart.classList.remove('far');
      $cellHeart.classList.add('fas');
      $cellHeart.classList.add('faved');
      $heart.classList.remove('far');
      $heart.classList.add('fas');
      $heart.classList.add('faved');
      break;
  }
});

function switchViews(targetview) {
  data.view = targetview;
  catImages = {
    entries: [],
    cells: []
  };
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
    catImages.entries = data.favorites;
    $headerFavorites.classList.add('favorites-view');
    const favoriteCells = [];
    for (let i = 0; i < data.favorites.length; i++) {
      favoriteCells.push(createImageCell(data.favorites[i].ID, data.favorites[i].image, true));
    }
    assignCellstoColumn(favoriteCells, $favImageColumns);

  } else {
    $headerFavorites.classList.remove('favorites-view');
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
