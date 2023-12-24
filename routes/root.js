const config = require('../config')
const Post = require('./../models/upload')


const root = (app) => {
    // Define your route handling logic here
    app.get('/', (req, res) => {
      Post.find({}).then((post)=>{
        res.render('index', {
          post: post
        })
      })
      if(config.debug){
        console.log(`[+] Received a get request on root route. (/)`.yellow);
      }
    });
  };
  
module.exports = root;
  