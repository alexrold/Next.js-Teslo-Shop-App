import axios from 'axios';

const tesloShopApi = axios.create({
  baseURL: '/api',
});
export default tesloShopApi;