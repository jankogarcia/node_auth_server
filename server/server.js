const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose'); 
const {User} = require('./models/user');
const {auth} = require('./middleware/auth');

const mongooseUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/auth';

const app = express();
mongoose.Promise = global.Promise;
mongoose.connect(mongooseUrl, {useNewUrlParser:true, useUnifiedTopology:true, useFindAndModify: false});

app.use(bodyParser.json());
app.use(cookieParser());

const getUser = (req, res) => {
    User.findById(req.params.id, {password:0}, (err, user) => {
        if(err){
            return res.status(400).send(err);
        }
        
        if(user){
            return res.status(200).send(user);
        }
        
        return res.status(200).send({message:'user not found.'}); //no content
    })
}

const postUser = (req, res) => {
    let user = new User({
        email: req.body.email,
        password: req.body.password
    });

    user.save((err, doc) => {
        if(err){
            return res.status(400).send(err);
        }
        return res.status(201).send(doc);
    });
}

const userLogin = (req, res) => {
    User.findOne({email:req.body.email}, (err, user) => {
        if(!user){
            return res.status(400).send({message:'Auth failed, user not found.'});
        }

        user.comparePassword(req.body.password, (err, isMatch) => {
            if(err){
                return res.status(400).send(err);
            }
            if(!isMatch){
                return res.status(400).json({message:"wrong password."})
            }

            user.generateToken((err, user) => {
                if(err){
                    return res.status(400).send(err);
                }
                //set the cookie
                res.cookie('auth', user.token).send('OK');

            });
        })
    });
}

const getProfile = (req, res) => {
    return res.status(200).send(req.token);  
}

app.get('/user/profile', auth, getProfile);
app.get('/api/user/:id', getUser);
app.post('/api/user', postUser);
app.post('/api/user/login', userLogin);


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})