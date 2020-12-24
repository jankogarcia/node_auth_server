const {User} = require('./../models/user');

let auth = (req, res, next) => {
    let token = req.cookies.auth;    

    User.findByToken(token, (err, user) => {
        if(err){
            return res.status(400).send(err);
        }

        if(!user){
            return res.status(401).send('no access.')
        }

        req.token = token;
        next();
    })    
}

module.exports = {auth}