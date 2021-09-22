var $imagegrid = document.querySelector('.grid');
var $modal = document.querySelector('.modal');

for (var i = 0; i < 20; i++) {
  var catPhotos = new XMLHttpRequest();
  catPhotos.addEventListener('load', loadCatPhotos);
  catPhotos.open('GET', 'https://aws.random.cat/meow');
  catPhotos.send();

}

function loadCatPhotos() {
  var translatedJSON = JSON.parse(this.responseText);
  var cellData = createImageCell(translatedJSON.file, data.nextID);

  data.entries.push(cellData);
  data.entries[data.nextID].cell.addEventListener('click', cellEventListener);
  data.nextID++;

  $imagegrid.appendChild(cellData.cell);

}

function createImageCell(imageURL, id) {
  var cellData = {};
  cellData.imageURL = imageURL;
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
  $image.setAttribute('image-id', id);
  $pen.setAttribute('icon', 'edit');
  $heart.setAttribute('icon', 'heart');
  $pen.setAttribute('class', 'fas fa-pen');
  $heart.setAttribute('class', 'far fa-heart');

  $cell.appendChild($imageBox);
  $imageBox.appendChild($imgA);
  $imageBox.appendChild($imageOverlay);
  $imgA.appendChild($image);
  $imageOverlay.appendChild($penA);
  $imageOverlay.appendChild($heartA);
  $penA.appendChild($pen);
  $heartA.appendChild($heart);
  cellData.ID = id;
  cellData.cell = $cell;
  cellData.favorite = false;

  return cellData;

}

function cellEventListener(event) {
  console.log(event.currentTarget);

  // Handle favorites in 'cell' view
  if (event.target.getAttribute('icon') === 'heart') {
    for (var i = 0; i < data.entries.length; i++) {
      if (data.entries[i].ID.toString() === event.currentTarget.getAttribute('cell-id') && !data.favorites.includes(data.entries[i])) {
        data.favorites.push(data.entries[i]);
        event.target.classList.remove('far');
        event.target.classList.add('fas');
      } else if (data.entries[i].ID.toString() === event.currentTarget.getAttribute('cell-id') && data.favorites.includes(data.entries[i])) {
        data.favorites.splice(data.favorites.indexOf(data.entries[i]), 1);
        event.target.classList.remove('fas');
        event.target.classList.add('far');
      }
    }
  } else if (event.target.getAttribute('image-id')) {
    for (var j = 0; j < data.entries.length; j++) {
      if (event.currentTarget.getAttribute('cell-id') === data.entries[j].ID.toString()) {
        whenImageClicked(event.target.getAttribute('src'), data.entries[j]);
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
  $modal.addEventListener('click', function (event) {
    if (event.target === $modal.querySelector('.fa-times-circle')) {
      $modal.classList.add('hidden');
    }
    if (event.target === $heart && !data.favorites.includes(targetCell)) {
      data.favorites.push(targetCell);
      $heart.classList.remove('far');
      $heart.classList.add('fas');
    } else if (event.target === $heart && data.favorites.includes(targetCell)) {
      data.favorites.splice(data.favorites.indexOf(targetCell), 1);
      $heart.classList.add('far');
      $heart.classList.remove('fas');
    }
  });
}
