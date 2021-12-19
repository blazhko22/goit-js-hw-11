import NewsApiService from './js/news-service';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './sass/main.scss';

const refs = {
  gallery: document.querySelector('.gallery'),
  form: document.querySelector('.search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
};
const lightbox = new SimpleLightbox('.gallery a');
const pixabayApiService = new NewsApiService();
let displayAppeal = 0;

refs.form.addEventListener('submit', onSearch);

refs.loadMoreBtn.addEventListener('click', finisherLoadMore);

async function finisherLoadMore() {
  pixabayApiService.fetchPictures().then(({ totalHits, hits }) => {
    renderPictures(hits);
    lightbox.refresh();
    displayAppeal += hits.length;

    if (displayAppeal >= totalHits) {
      refs.loadMoreBtn.classList.add('is-hidden');
      return Notify.warning('We are sorry, but you have reached the end of search results.');
    }
  });
}
function renderPictures(argument) {
  const markup = argument
    .map(el => {
      return `<div class="photo-card">
      <a href=${el.largeImageURL}><img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" /></a>
      <div class="info">
        <p class="info-item">
          <b>Likes </b> <span>${el.likes}</span>
        </p>
        <p class="info-item">
          <b>Views </b> <span>${el.views}</span>
        </p>
        <p class="info-item">
          <b>Comments </b> <span>${el.comments}</span>
        </p>
        <p class="info-item">
          <b>Downloads </b> <span>${el.downloads}</span>
        </p>
    </div>
  </div>`;
    })
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function onSearch(e) {
  e.preventDefault();

  pixabayApiService.searchQuery = e.currentTarget.elements.searchQuery.value;

  if (pixabayApiService.searchQuery === '') return Notify.warning('Common, type something (=');

  pixabayApiService.resetPage();
  resetGalleryContainer();
  refs.loadMoreBtn.classList.add('is-hidden');

  pixabayApiService.fetchPictures().then(({ totalHits, hits }) => {
    displayAppeal = 0;
    displayAppeal += hits.length;

    if (totalHits === 0)
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );

    renderPictures(hits);
    lightbox.refresh();
    Notify.success(`Hooray! We found ${totalHits} images.`);
    refs.loadMoreBtn.classList.remove('is-hidden');
  });
}

function resetGalleryContainer() {
  refs.gallery.innerHTML = '';
}
