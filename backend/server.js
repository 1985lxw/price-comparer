// backend/server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import authRouter from './api/auth/index.js';
import searchRoutes from "./routes/search.js";
import exportRouter from "./routes/export.js";
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
app.use(express.json());


// __dirname replacement for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------
// API ROUTES
// ---------------------------

// Auth routes
app.use('/api/auth', authRouter);

// Search routes
app.use("/api/search", searchRoutes);

// Export routes (PDF/CSV)
app.use("/api/export", exportRouter);

// Shopping cart routes
import shoppingRouter from "./routes/shopping.js";
app.use("/api/shopping", shoppingRouter);

import cartRouter from "./routes/cart.js";
app.use("/api/cart", cartRouter);

// ---------------------------
// EMAIL ROUTE
// ---------------------------
app.post('/api/email', async (req, res) => {
  const { email, items } = req.body;

  if (!email || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Invalid email or shopping list" });
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Build HTML table of shopping list
    const tableRows = items.map(item => `
      <tr>
        <td>${item.store}</td>
        <td>${item.title}</td>
        <td>${item.qty}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>$${(item.price * item.qty).toFixed(2)}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <h2>Your Shopping List</h2>
      <table border="1" cellpadding="5" cellspacing="0">
        <thead>
          <tr>
            <th>Store</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;

    // Send mail
    await transporter.sendMail({
      from: `"Price Comparer" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Shopping List",
      html: htmlContent
    });

    return res.json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Email error:", err);
    return res.status(500).json({ message: "Failed to send email" });
  }
});

// ---------------------------
// SERVE FRONTEND
// ---------------------------
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

app.get(/.*/, (req, res) => {
  if (req.path.includes('.')) {
    return res.status(404).end();
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
