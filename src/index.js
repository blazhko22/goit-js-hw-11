// import articlesTpl from './templates/articles.hbs';
// import './sass/main.scss';
// import axios from 'axios';
// import Notiflix from 'notiflix';
// import NewsApiService from './js/news-service';
// import LoadMoreBtn from './js/components/load-more-btn';

// const refs = {
//   searchForm: document.querySelector('.search-form'),
//   articlesContainer: document.querySelector('.gallery'),
// };
// const loadMoreBtn = new LoadMoreBtn({
//   selector: '[data-action="load-more"]',
//   hidden: true,
// });
// const newsApiService = new NewsApiService();

// refs.searchForm.addEventListener('submit', onSearch);
// loadMoreBtn.refs.button.addEventListener('click', fetchArticles);

// function onSearch(e) {
//   e.preventDefault();

//   newsApiService.query = e.currentTarget.elements.query.value;

//   if (newsApiService.query === '') {
//     return alert('Введи что-то нормальное');
//   }

//   loadMoreBtn.show();
//   newsApiService.resetPage();
//   clearArticlesContainer();
//   fetchArticles();
// }

// function fetchArticles() {
//   loadMoreBtn.disable();
//   newsApiService.fetchArticles().then(arr => {
//     appendArticlesMarkup(arr);
//     loadMoreBtn.enable();
//   });
// }

// // function appendArticlesMarkup(articles) {
// //   refs.articlesContainer.insertAdjacentHTML('beforeend', articlesTpl(articles));
// // }
// function appendArticlesMarkup(arr) {
//   const markup = arr
//     .map(el => {
//       return `<div class="photo-card">
//       <a href=${el.largeImageURL}><img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" /></a>
//       <div class="info">
//         <p class="info-item">
//           <b>Likes </b> <span>${el.likes}</span>
//         </p>
//         <p class="info-item">
//           <b>Views </b> <span>${el.views}</span>
//         </p>
//         <p class="info-item">
//           <b>Comments </b> <span>${el.comments}</span>
//         </p>
//         <p class="info-item">
//           <b>Downloads </b> <span>${el.downloads}</span>
//         </p>
//     </div>
//   </div>`;
//     })
//     .join('');

//   refs.gallery.insertAdjacentHTML('beforeend', markup);
// }

// function clearArticlesContainer() {
//   refs.articlesContainer.innerHTML = '';
// }
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
const pixabayApi = new NewsApiService();
let displayedHits = 0;

refs.form.addEventListener('submit', onSubmit);

refs.loadMoreBtn.addEventListener('click', () => {
  pixabayApi.fetchPictures().then(({ totalHits, hits }) => {
    renderPictures(hits);
    lightbox.refresh();
    displayedHits += hits.length;

    if (displayedHits === totalHits) {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notify.warning('We are sorry, but you have reached the end of search results.');
    }
  });
});

function renderPictures(arr) {
  const markup = arr
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

function onSubmit(e) {
  e.preventDefault();

  pixabayApi.searchQuery = e.currentTarget.elements.searchQuery.value;

  if (pixabayApi.searchQuery === '') return Notify.warning('Common, type something (=');

  pixabayApi.resetPage();
  resetGalleryContainer();
  refs.loadMoreBtn.classList.add('is-hidden');

  pixabayApi.fetchPictures().then(({ totalHits, hits }) => {
    displayedHits = 0;
    displayedHits += hits.length;

    if (totalHits === 0)
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );

    renderPictures(hits);
    lightbox.refresh();
    Notify.success(`Hooray! We found ${totalHits} images.`);
    refs.loadMoreBtn.classList.remove('is-hidden');

    if (displayedHits === totalHits) {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notify.warning('We are sorry, but you have reached the end of search results.');
    }
  });
}

function resetGalleryContainer() {
  refs.gallery.innerHTML = '';
}
