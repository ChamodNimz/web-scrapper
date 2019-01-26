const express = require('express');
const router = express.Router();
const Profile = require('../../models/Profile');
const passport = require('passport');
const config = require('../../config/config');
const base64image = require('base64-img');

router.route('/profile')

    // Get all roles
    .get(function (req, res) {
        Profile.getAllProfiles((err, data) => {
            if (!err) {
                res.send({ success: true, data: data });
            } else {
                res.statu(500).send({ success: false, data: null });
            }
        });
    })

    // create a profile
    .post((req, res) => {
        Profile.createProfile(req.body, function (err, data) {
            if (!err) {
                res.send({ data: data, success: true });
            } else {
                res.status(500).send({ success: false, error: 'ExeptionOccured', message: 'Error occured' });
                throw err;
            }
        });

    })

router.route('/profile/myProfile')

    // Get one profile according to email 
    .get((req, res) => {
        // get payload from jwt and get session data to log
        var user = JSON.parse(config.base64Decode(req.headers.authorization.split(" ")[1].split(".")[1]));
        Profile.getOneProfile({ email: user.email }, (err, profile) => {
            if (!err) {
                //profile.photo = base64image.base64Sync(profile.photo);
                //profile.photo = profile.photo.split(',')[1];
                res.send({ success: true, data: profile });
            } else {
                res.status(500).send({ success: false });
            }
        });
    })


module.exports = router;