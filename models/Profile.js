const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const fs = require('fs');

// Profile Schema 
const ProfileSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    index: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    course_name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const Profile = module.exports = mongoose.model('profile', ProfileSchema, 'profile');

/**
 *  Create a new profile 
 * 
 */
module.exports.createProfile = function (body, callback) {
    // password hash 
    bcrypt.genSalt(10, function (err, salt) {
        if (!err) {
            bcrypt.hash(body.password, salt, function (err, hash) {
                if (!err) {
                    body.password = hash; // override body password with hash

                    // let bitmap = new Buffer(body.photo, 'base64');
                    // let path ='./uploads/' + Date.now() + body.first_name + '.jpg';
                    // try {
                    //     fs.writeFileSync(path, bitmap);
                    // } catch (error) {
                    //     throw error;
                    // }
                    let profile = new Profile({
                        first_name: body.first_name,
                        last_name: body.last_name,
                        email: body.email,
                        index: body.index,
                        course_name: body.course_name,
                        //photo: path,
                        password: body.password
                    });
                    profile.save(callback);
                }
                else {
                    callback(err, null);
                }
            });
        }
        else {
            callback(err, null);
        }
    });

}

/**
 *  Compare password for authentication
 * 
 */
module.exports.comparePassword = function (password, hash, callback) {
    bcrypt.compare(password, hash, function (err, isMatch) {
        if (err) callback(err, null);
        callback(null, isMatch);

    });
}


/**
 * get all profiles  
 * 
 */
module.exports.getAllProfiles = function (callback) {
    Profile.find(callback);
}

/**
 * get all profiles  
 * 
 */
module.exports.getOneProfile = function (params, callback) {
    Profile.findOne({ email: params.email }, callback);
}


/**
 * get a profile by id   
 * 
 */
module.exports.getProfileById = function (id, callback) {

    Profile.find({ _id: id }, callback);
    
}

/**
 *  Authenticate a user/profile
 * 
 */
module.exports.authenticate = function () {

}


  