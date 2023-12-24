require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const colors = require('colors');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const {
  v4: uuidv4
} = require('uuid');





mongoose.connect(process.env.mongoURI).then(() => console.log(`[INFORMATION]> Connection to DB was succesful`.green)).catch(err => console.log(err));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const extension = file.originalname.split('.').pop();
    const name = `${uuidv4()}.${extension}`;
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

// Function to include route handlers from all directories and subdirectories
const includeRoutes = (dir) => {
  fs.readdirSync(dir).forEach(file => {
    const routePath = path.join(dir, file);
    if (fs.lstatSync(routePath).isDirectory()) {
      includeRoutes(routePath); // If it's a directory, traverse it recursively
    } else {
      const route = require(routePath);
      if (typeof route === 'function') {
        route(app, upload);
      } else {
        console.error(`[-] Error: ${file} does not export a valid route function.`.red);
      }
    }
  });
};

// Include route handlers from the main routes directory and its subdirectories
includeRoutes(routesDirectory);

app.listen(port, () => {
  console.log(`[+] Server started on port ${port}.`.green);
});
