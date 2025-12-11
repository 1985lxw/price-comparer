import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CX = process.env.GOOGLE_CX;

// LIST OF SUPPORTED WEBSITES

const SEARCH_SITES = [
  "amazon.com",
  "walmart.com",
  "target.com",
  "costco.com",
  "instacart.com",
  "aldi.us",
  "bigbasket.com",
  "flipkart.com"
];


function getSitesForZip(zip) {
  if (!zip) return SEARCH_SITES;

  if (/^\d{6}$/.test(zip)) {
    return ["bigbasket.com", "flipkart.com"];
  }

  if (/^\d{5}$/.test(zip)) {
    return [
      //"amazon.com",
      "walmart.com",
      "target.com",
      "costco.com",
      "instacart.com",
      "aldi.us"
    ];
  }

  return SEARCH_SITES;
}

// SEARCH ROUTE
router.get('/', async (req, res) => {
  try {
    const { query, zipcode } = req.query;

    if (!query) {
      return res.status(400).json({ error: "query is required" });
    }

    const sitesToSearch = getSitesForZip(zipcode);

    const siteFilter = sitesToSearch.map(s => `site:${s}`).join(" OR ");

    // Google CSE API request
    const googleUrl = "https://www.googleapis.com/customsearch/v1";

    const params = {
      key: GOOGLE_API_KEY,
      cx: GOOGLE_CX,
      q: `${query} ${siteFilter}`,
      num: 10
    };

    const googleResponse = await axios.get(googleUrl, { params });

    const items = googleResponse.data.items || [];

    // Formatting search results
    const results = items.map((item, i) => {
      let hostname = "";

      try {
        hostname = new URL(item.link).hostname.replace("www.", "");
      } catch {
        hostname = "unknown";
      }

      return {
        id: `g-${i}`,
        store: hostname,
        title: item.title || "Unknown Item",
        size: "",
        unitPrice: "",
        price: Math.floor(Math.random() * 10 + 1),  // mock price
        lastUpdated: new Date().toISOString()
      };
    });

    res.json(results);

  } catch (err) {
    console.error("SEARCH ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch search results" });
  }
});

export default router;
