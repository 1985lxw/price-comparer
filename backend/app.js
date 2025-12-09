// backend/app.js
require('dotenv').config();
const express = require('express');
const app = express();
const searchRouter = require('./routes/search');

app.use(express.json());
app.use('/', searchRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Price comparer (CSE) listening ${port}`));
