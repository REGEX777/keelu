const config = require('../../config');
const fs = require('fs');
const path = require('path');
const isLoggedOut = require('../../middleware/isLoggedOut')

const root = (app, isLoggedOut) => {
  app.get('/login', isLoggedOut, (req, res) => {
    const pth = path.join(__dirname, '../../../login.json');
    console.log(pth);
    const loginFile = fs.existsSync(pth);
    if (loginFile) {
      res.render('login');
    } else {
      res.redirect('/register');
    }

    if (config.debug) {
      console.log(`[+] Received a get request on login route. (/login)`.yellow);
    }
  });
};

module.exports = root;
