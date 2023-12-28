const config = require('../../config');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');

const root = (app) => {
  app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true
  }));

  app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send('Username and password are required.');
    }

    const loginFilePath = path.join(__dirname, '../../login.json');

    if (!fs.existsSync(loginFilePath)) {
      return res.status(403).send('No accounts found. Please register first.');
    }
    const userData = JSON.parse(fs.readFileSync(loginFilePath, 'utf-8'));
    // Compare the provided username with the stored username and hashed password
    if (userData.username === username) {
      bcrypt.compare(password, userData.passhash, (err, result) => {
        if (err || !result) {
          return res.status(403).send('Invalid username or password. 222');
        }
        req.session.username = username; // Start session for the authenticated user
        return res.status(200).send('Login successful. Session started.');
      });
    } else {
      return res.status(403).send('Invalid username or password. 3333');
    }
  });
};

module.exports = root;
