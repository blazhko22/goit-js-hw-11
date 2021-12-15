const API_KEY = '24810210-2291bc5d9ffb621f951621db6';
const BASE_URL = 'https://pixabay.com/api/';

export default class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchArticles() {
    const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type='photo'&orientation='horizontal'&safe_search='true'&page=${this.page}&per_page=40`;

    const response = await fetch(url);
    this.incrementPage();
    return await response.json();
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
