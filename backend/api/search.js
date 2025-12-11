import express from "express";
import axios from "axios";
import validateSession from "../middleware/auth.js";

const router = express.Router();

// router.use(validateSession);

router.get("/", async (req, res) => {
  const query = req.query.q;

  if (!query) return res.json({ success: false, error: "Missing query" });

  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    const cx = process.env.GOOGLE_CX;

    const url = "https://www.googleapis.com/customsearch/v1";

    const resp = await axios.get(url, {
      params: {
        key: apiKey,
        cx,
        q: query
      }
    });

    const results = resp.data.items?.map(item => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet
    })) || [];

    res.json({
      success: true,
      query,
      count: results.length,
      results
    });

  } catch (err) {
    console.error(err);
    res.json({ success: false, error: err.message });
  }
});

export default router;
