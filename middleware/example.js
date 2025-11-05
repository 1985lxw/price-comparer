const express = require('express');
const app = express();
app.use(express.json());

// simpler search function
app.get('/api/search', async (req, res) => {
  const q = req.query.q;
  const location = req.query.location;
  if(!q) return res.status(400).json({error: 'q required'});
  res.json({query: q, results: []});
});

app.post('/api/shopping-list', (req,res) => {
  // create or update shopping list for authenticated user (stub)
  res.json({ok: true});
});

app.listen(3000, ()=>console.log('API running on 3000'));