const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SALT_I = 10;

const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        unique:1
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    token:{
        type:String
    }
});

userSchema.pre('save', function(next) {
    var user = this; //the user that we want to store

    if(user.isModified('password')){
        bcrypt.genSalt(SALT_I, (err, salt) => {
            if(err){
                return next(err);
            }
            
            bcrypt.hash(user.password, salt, (err, hash) => {
                if(err){
                    return next(err);
                }

                user.password = hash;
                next();
            })
        })
    }else{
        next();
    }
});

userSchema.methods.comparePassword = function(possiblePassword, callback){
    bcrypt.compare(possiblePassword, this.password, function(err, isMatch){
        if(err){
            callback(err)
        }
        callback(null, isMatch);
    });
}

userSchema.methods.generateToken = function(callback){
    var user = this;
    var token = jwt.sign(user._id.toHexString(), 'supersecret');

    user.token = token;
    user.save(function(err, user){
        if(err){
            callback(err);
        }

        callback(null, user);
    });
}

userSchema.statics.findByToken = function(token, callback){
    var user = this;
    jwt.verify(token, 'supersecret', function(err, decode){
        user.findOne({_id:decode, token:token}, function(err, user){
            if(err){
                callback(err);
            }

            callback(null, user);
        })
    });
}

const User = mongoose.model('User', userSchema);

module.exports = {User}