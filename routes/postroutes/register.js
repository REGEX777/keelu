const config = require('../../config');
const fs = require('fs');
const path = require('path');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt')

const root = (app) => {
  app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true
  }));

  app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send('Username and password are required.');
    }

    const loginFilePath = path.join(__dirname, '../../login.json');

    if (fs.existsSync(loginFilePath)) {
      return res.status(403).send('Account already exists. Please delete login.json file to create a new account.');
    }

    const passhash = await bcrypt.hash(password, 10)
    console.log(password, passhash)
    const user = { username, passhash };
    console.log(user)
    fs.writeFile(loginFilePath, JSON.stringify(user), (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return res.status(500).send('Error registering user. Please try again.');
      }
      req.session.username = username;
      res.status(200).redirect("/")
    });

    if (config.debug) {
      console.log(`[+] Received a post request on register route. (/register)`.yellow);
    }
  });
};

module.exports = root;
