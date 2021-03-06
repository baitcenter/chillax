import axios from 'axios';
import store from '@/store';
import app from '../app';
import Wellcome from '@/pages/Wellcome';

export default () => {
  const token = store.getters.getToken;

  const apiClient = axios.create({
    baseURL: 'https://chillax-server.herokuapp.com',
    headers: { 
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: token || undefined
    }
  });

  apiClient.interceptors.response.use(response => {
    return Promise.resolve(response);
    // return response
  },
    error => {
      if (error.response.status === 401) {
        store.dispatch('setUser', {
          token: '',
          userId: ''
        })
        app.$goToPage(Wellcome)
      }
      return Promise.reject(error);
    }
  );

  return apiClient;
}