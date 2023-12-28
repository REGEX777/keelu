require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const colors = require('colors');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const randomstring = require('randomstring');
const session = require('express-session')



mongoose.connect(process.env.mongoURI).then(() => console.log(`[INFORMATION]> Connection to DB was succesful`.green)).catch(err => console.log(err));



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const extension = file.originalname.split('.').pop();
    const name = `${randomstring.generate({length: 6,charset: 'alphanumeric'})}.${extension}`;
    console.log(name);
    cb(null, name);
  }
});
const upload = multer({
  storage: storage
});

const app = express();
const config = require('./config');
const port = config.port;
const debug = true;
const routesDirectory = path.join(__dirname, 'routes');

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: "ghinawan",
  resave: false,
  saveUninitialized: true
}));


// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.session && req.session.username) {
    // If session exists, proceed to the next middleware/route
    next();
  } else {
    // If session doesn't exist, redirect to login page or return an error
    res.status(401).send('You are not logged in.');
  }
};



const loginPath = path.join(__dirname, "login.json");



const includeRoutes = (dir) => {
  fs.readdirSync(dir).forEach(file => {
    const routePath = path.join(dir, file);
    if (fs.lstatSync(routePath).isDirectory()) {
      includeRoutes(routePath);
    } else {
      const route = require(routePath);
      if (typeof route === 'function') {
        route(app, upload, isLoggedIn);
      } else {
        console.error(`[-] Error: ${file} does not export a valid route function.`.red);
      }
    }
  });
};

includeRoutes(routesDirectory);


app.listen(port, () => {
  console.log(`[+] Server started on port ${port}.`.green);
});
