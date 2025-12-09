import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CX = process.env.GOOGLE_CX;

/**
 * GET /api/search?query=milk&zipcode=10001
 */
router.get('/', async (req, res) => {
  try {
    const { query, zipcode } = req.query;

    if (!query) return res.status(400).json({ error: 'query is required' });

    // Make request to Google Custom Search API
    const googleUrl = 'https://www.googleapis.com/customsearch/v1';
    const params = {
      key: GOOGLE_API_KEY,
      cx: GOOGLE_CX,
      q: `${query} site:amazon.com OR site:bigbasket.com OR site:walmart.com`,
      num: 10
    };

    const response = await axios.get(googleUrl, { params });
    const items = response.data.items || [];

    // Map results
    const results = items.map((item, idx) => ({
      id: `g-${idx}`,
      store: new URL(item.link).hostname,
      title: item.title,
      size: '',       // Google API does not provide size
      unitPrice: '',  // Google API does not provide unit price
      price: Math.floor(Math.random() * 10 + 1), // Mock price
      lastUpdated: new Date().toLocaleString()
    }));

    res.json(results);

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch search results' });
  }
});

export default router;
