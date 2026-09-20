require('dotenv').config();
const express = require('express');
const axios = require('axios');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('node-uuid');

const app = express();
app.use(express.json());

// !! HARDCODED SECRET - JAS Secrets Detection will catch this
const JWT_SECRET = 'super_secret_key_1234';
const DB_PASSWORD = 'admin:password123@mongodb://localhost:27017';
const AWS_ACCESS_KEY = 'AKIAIOSFODNN7EXAMPLE';
const AWS_SECRET_KEY = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';

// !! PROTOTYPE POLLUTION - lodash merge with user input
app.post('/api/merge', (req, res) => {
  const userInput = req.body;
  const config = {};
  _.merge(config, userInput); // dangerous - allows __proto__ pollution
  res.json({ result: config });
});

// !! SSRF via axios - user controls the URL
app.get('/api/fetch', async (req, res) => {
  const { url } = req.query;
  try {
    const response = await axios.get(url); // no URL validation
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// !! WEAK JWT - uses hardcoded secret and allows none algorithm
app.post('/api/login', (req, res) => {
  const { username } = req.body;
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.get('/api/verify', (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256', 'none'] }); // allows none!
    res.json({ decoded });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// !! PATH TRAVERSAL - user controls file path
const fs = require('fs');
app.get('/api/file', (req, res) => {
  const { path: filePath } = req.query;
  try {
    const content = fs.readFileSync(filePath, 'utf8'); // no path sanitization
    res.send(content);
  } catch (err) {
    res.status(404).json({ error: 'File not found' });
  }
});

// !! DEPENDENCY CONFUSION bait - internal package name
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    id: uuidv4(),
    env: process.env.NODE_ENV
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
