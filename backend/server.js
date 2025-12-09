// backend/server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import authRouter from './api/auth/index.js'; // your auth routes
import { join } from 'path';
dotenv.config();
import searchRoutes from "./routes/search.js";
const app = express();
app.use(express.json());

import exportRouter from "./routes/export.js";
app.use("/api/export", exportRouter);


// __dirname replacement for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------
// API ROUTES
// ---------------------------
// Expose auth routes under /api/auth
app.use('/api/auth', authRouter);
app.use("/api/search", searchRoutes);

// ---------------------------
// SERVE FRONTEND
// ---------------------------
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// SPA fallback route
// app.get(/.*/, (req, res) => {
//   res.sendFile(path.join(frontendPath, 'index.html'));
// });
// Serve index.html only for routes that are not files
app.get(/.*/, (req, res) => {
  if (req.path.includes('.')) {
    return res.status(404).end(); // do NOT send index.html
  }
  res.sendFile(path.join(frontendPath, 'index.html'));
});


// ---------------------------
// START SERVER
// ---------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

