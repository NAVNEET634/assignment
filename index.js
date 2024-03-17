const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Sample user credentials (for demonstration purposes only)
const USER_CREDENTIALS = {
  username: 'admin',
  password: 'password'
};

// Authentication token generation
const generateAuthToken = (username, password) => {
  if (username === USER_CREDENTIALS.username && password === USER_CREDENTIALS.password) {
    return 'your_auth_token';
  } else {
    return null;
  }
};

// Authentication middleware
const requiresAuth = (req, res, next) => {
  const authToken = req.headers.authorization;
  if (!authToken || authToken !== 'Bearer your_auth_token') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

app.use(bodyParser.json());

// API endpoint to generate auth token
app.post('/auth', (req, res) => {
  const { username, password } = req.body;
  const token = generateAuthToken(username, password);
  if (token) {
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// API endpoint to fetch detailed information about a specific country by name
app.get('/country/:name', requiresAuth, async (req, res) => {
  const name = req.params.name;
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/name/${name}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch country information' });
  }
});

// API endpoint to retrieve a list of countries based on filters and sorting
app.get('/countries', requiresAuth, async (req, res) => {
  const { population, area, language, sort, page, limit } = req.query;
  const params = new URLSearchParams({
    population,
    area,
    language,
    sort,
    page,
    limit
  });
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/all?${params}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve country list' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
