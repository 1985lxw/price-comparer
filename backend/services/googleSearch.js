const axios = require('axios');
const GOOGLE_KEY = process.env.GOOGLE_API_KEY;
const CX = process.env.GOOGLE_CX;

if (!GOOGLE_KEY || !CX) {
  console.warn('GOOGLE_API_KEY or GOOGLE_CX not set in env');
}

async function customSearch(query, options = {}) {
  const params = {
    key: GOOGLE_KEY,
    cx: CX,
    q: query,
    num: options.num || 5,
    start: options.start || 1,
  };
  if (options.site) params.q = `site:${options.site} ${query}`;
  const url = 'https://www.googleapis.com/customsearch/v1';
  const res = await axios.get(url, { params });
  return res.data; // items[] 
}

module.exports = { customSearch };
