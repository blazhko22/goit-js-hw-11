import axios from 'axios';
axios.defaults.baseURL = `https://pixabay.com/api/`;
const API_KEY = '24810210-2291bc5d9ffb621f951621db6';

export default class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  async fetchPictures() {
    const response = await axios.get(
      `?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`,
    );
    console.log(response);
    this.incrementPage();
    return response.data;
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
  set query(newQuvery) {
    this.searchQuery = newQuvery;
  }
}
