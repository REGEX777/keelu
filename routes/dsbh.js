const config = require('../config')

const dashboard = (app) => {
    // Define your route handling logic here
    app.get('/dashboard', (req, res) => {
      res.send('This is an example route');
      if(config.debug){
        console.log(`[+] Received a get request on dashboard route. (/dashboard)`.yellow);
      }
    });
  };
  
module.exports = dashboard;
  