const config = require('../../config')
const fs = require('fs')
const path = require('path')

const root = (app) => {
    // Define your route handling logic here
    app.get('/register', (req, res) => {
        const pth = path.join(__dirname+"../../../login.json")
        console.log(pth)
        const loginFile = fs.existsSync(pth) 
        if(loginFile){
            res.redirect("/login")
        }else{
            try{
                res.render('register')
            }catch(err){
                console.loge(err);
            }
        }

        if (config.debug) {
            console.log(`[+] Received a get request on register route. (/register)`.yellow);
        }
    });
};

module.exports = root;