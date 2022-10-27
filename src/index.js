import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
const axios = require('axios').default;
let page = 1;

const guard = document.querySelector('.guard');
const options = {
  root: null,
  rootMargin: '40px',
  threshold: 1,
};
const observer = new IntersectionObserver(onLoad, options);

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const inputData = form.elements.searchQuery.value.trim();
form.addEventListener('submit', submitClick);

function submitClick(e) {
  e.preventDefault();
  localStorage.clear();
  gallery.innerHTML = '';
  page = 1;
  const inputData = form.elements.searchQuery.value.trim();

  if (!inputData) {
    form.reset();
    return;
  }

  getData();
  form.reset();
}

async function getData() {
  try {
    let inputData = form.elements.searchQuery.value.trim();
    localStorage.setItem('q', inputData);

    const resp = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '30808385-c379b2b58cbf1cf4436fa7149',
        q: `${inputData}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: `${page}`,
        per_page: 40,
      },
    });

    if (resp.data.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notiflix.Notify.success(`Hooray! We found ${resp.data.totalHits} images.`);

    gallery.insertAdjacentHTML('beforeend', createGallery(resp));
    lightbox.refresh();
    observer.observe(guard);
  } catch (err) {
    console.log(err);
  }
}

function createGallery(resp) {
  return resp.data.hits
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

function onLoad(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;

      getNewData(page);

      if (page === 13) {
        observer.unobserve(guard);
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    }
  });
}

async function getNewData() {
  try {
    const inputData = localStorage.getItem('q');
    const resp = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '30808385-c379b2b58cbf1cf4436fa7149',
        q: `${inputData}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: `${page}`,
        per_page: 40,
      },
    });
    gallery.insertAdjacentHTML('beforeend', createGallery(resp));
    lightbox.refresh();
  } catch (err) {
    console.log(err);
  }
}
