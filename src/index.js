import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
const axios = require('axios').default;

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
form.addEventListener('submit', submitClick);

async function submitClick(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  const inputData = form.elements.searchQuery.value.trim();

  if (!inputData) {
    form.reset();
    return;
  }

  getData()
    .then(function (arr) {
      if (!arr.data.hits.length) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      gallery.insertAdjacentHTML('beforeend', createGallery(arr));
      lightbox.refresh();
    })
    .catch(function (error) {
      console.log(error);
    });
  form.reset();
}

async function getData() {
  return await axios.get('https://pixabay.com/api/', {
    params: {
      key: '30808385-c379b2b58cbf1cf4436fa7149',
      q: form.elements.searchQuery.value.trim(),
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    },
  });
}

function createGallery(arr) {
  return arr.data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<a class="gallery__item" href="${largeImageURL}">
  <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes:</b> ${likes}
    </p>
    <p class="info-item">
      <b>Views:</b> ${views}
    </p>
    <p class="info-item">
      <b>Comments:</b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads:</b> ${downloads}
    </p>
  </div>
</a>`
    )
    .join('');
}

// function createImage(galleryItems) {
//   return galleryItems
//     .map(({ preview, original, description }) => {
//       return `<a class="gallery__item" href="${original}">
//   <img class="gallery__image" src="${preview}" alt="${description}" />
// </a>`;
//     })
//     .join('');
// }

// const imageContainer = document.querySelector('.gallery');

// imageContainer.insertAdjacentHTML('beforeend', createImage(galleryItems));
