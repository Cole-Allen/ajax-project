var $imagegrid = document.querySelector('.grid');
var $modal = document.querySelector('.modal');
var $allCells = document.querySelectorAll('.image-cell');

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
  data.nextID++;

  $imagegrid.appendChild(cellData.cell);
}

function createImageCell(imageURL, id) {
  var cellData = {};
  cellData.imageURL = imageURL;
  var $imageCell = document.createElement('div');
  var $imageBox = document.createElement('div');
  var $imageOverlay = document.createElement('div');
  var $imgA = document.createElement('a');
  var $image = document.createElement('img');
  var $penA = document.createElement('a');
  var $heartA = document.createElement('a');
  var $pen = document.createElement('i');
  var $heart = document.createElement('i');

  $imageCell.setAttribute('class', 'image-cell');
  $imageCell.setAttribute('cell-id', id);
  $imageBox.setAttribute('class', 'image-box');
  $imageOverlay.setAttribute('class', 'image-overlay');
  $image.setAttribute('src', imageURL);
  $pen.setAttribute('icon', 'edit');
  $heart.setAttribute('icon', 'heart');
  $pen.setAttribute('class', 'fas fa-pen');
  $heart.setAttribute('class', 'far fa-heart');

  $imageCell.appendChild($imageBox);
  $imageBox.appendChild($imgA);
  $imageBox.appendChild($imageOverlay);
  $imgA.appendChild($image);
  $imageOverlay.appendChild($penA);
  $imageOverlay.appendChild($heartA);
  $penA.appendChild($pen);
  $heartA.appendChild($heart);
  cellData.ID = id;
  cellData.cell = $imageCell;
  cellData.favorite = false;

  return cellData;

}

$imagegrid.addEventListener('click', function (event) {
  var selectedCell = null;
  console.log(event.target);

  for (var i = 0; i < $allCells.length; i++) {
    if (event.target.parentNode.parentNode.parentNode.parentNode.getAttribute('cell-id') === data.entries[i].ID.toString()) {
      selectedCell = data.entries[i];
    }
  }
  if (event.target === 'balah') {
    var $modalImage = $modal.querySelector('img');
    $modalImage.setAttribute('src', selectedCell.imageURL);
    modalHandler(selectedCell);
    $modal.classList.remove('hidden');
  }

  console.log(selectedCell);
  if (event.target.getAttribute('icon') === 'heart' && !data.favorites.includes(selectedCell)) {

    data.favorites.push(selectedCell);
    event.target.classList.remove('far');
    event.target.classList.add('fas');
  } else if (event.target.getAttribute('icon') === 'heart' && data.favorites.includes(selectedCell)) {
    for (var j = 0; j < data.favorites.length; j++) {
      console.log(data.favorites[j].ID);
      if (data.favorites[j].ID === selectedCell.ID) {
        data.favorites.splice(j, 1);
      }
    }
    event.target.classList.remove('fas');
    event.target.classList.add('far');
  }
});

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
      $heart.classList.add('far');
      $heart.classList.remove('fas');
    }
  });
}
