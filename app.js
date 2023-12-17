require('dotenv').config();
//config init
const config = require('./config')
const express = require('express');
const fs = require('fs');
const path = require('path');
const colors = require('colors');
const ejs = require('ejs')

const app = express();
const port = config.port;
const debug = true;
const routesDirectory = path.join(__dirname, 'routes');

app.set('view engine', 'ejs')
app.use(express.static("public"));

fs.readdirSync(routesDirectory).forEach(file => {
  const routePath = path.join(routesDirectory, file);
  const route = require(routePath);
  
  // Ensure that the imported route is a function that accepts the Express app object
  if (typeof route === 'function') {
    route(app); // Invoke the function passing the Express app
  } else {
    console.error(`[-] Error: ${file} does not export a valid route function.`.red);
  }
});



app.listen(port, () => {
  console.log(`[+] Server started on port ${port}.`.green);
});
