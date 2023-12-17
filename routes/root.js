const config = require('../config')

const root = (app) => {
    // Define your route handling logic here
    app.get('/', (req, res) => {
      res.render('index')
      if(config.debug){
        console.log(`[+] Received a get request on root route. (/)`.yellow);
      }
    });
  };
  
module.exports = root;
  