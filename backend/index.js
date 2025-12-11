import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

import {registerMiddleware, notFoundHandler, errorHandler,} from './middleware/example.js';

dotenv.config();

const app = express();

// Register all global middleware (CORS, body parsing, logging)
registerMiddleware(app);

//app.use(express.json());

// Connect to Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// test route
app.get("/test", (req, res) => {
  res.send("API is working");
});

app.get('/api/prices', async (_req, res, next) => {
  try {const { data, error } = await supabase.from('prices').select( "*");
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err); // Pass to errorHandler
  }
});
// 404 error handling for any unknown route
app.use(notFoundHandler);

// Central error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
