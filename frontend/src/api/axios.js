// src/api/axios.js

import axios from 'axios';

const api = axios.create({

  // FIXED URL
  baseURL: 'http://localhost:5000/api',

  headers: {
    'Content-Type': 'application/json',
  },

});

export default api;