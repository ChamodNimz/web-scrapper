const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const request = require('request');
const passport = require('passport');
const Profile = require('../../models/Profile');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');


/**
 *  ===========================================================
 *  ROUTES
 *  ===========================================================
 */

/**
 *  Check results GET req
 * 
 *  Check students results according to a provided index no 
 * 
 */
router.route('/results/:id')
    .get(passport.authenticate('jwt', { session: false }), function (req, res) {

        var array = [];
        var isTrue = true;
        var result = {

            subjects: [],
            results: []
        };
        var results = {
            subject: '',
            result: ''
        };

        var array = [];
        request('https://www.nibm.lk/students/exams/results?q=' + req.params.id, function (err, resp, body) {
            if (!err) {
                const $ = cheerio.load(body);
                $('tbody tr td ').each(function (i, el) {
                    var item = $(el).text();
                    if (i % 2 == 1) {
                        isTrue = !isTrue;
                        if (!isTrue) {
                            results.subject = item;
                        } else {
                            results.result = item;
                            array.push(results);
                            results = {};
                        }
                    }
                });
            } else {
                throw err;
            }
            res.send(array);
        });
    });

/**
 *  Authenticate a user/profile
 * 
 * 
 *  */
router.route('/authenticate')
    .post(function (req, res) {

        var email = req.body.email;
        var password = req.body.password;
        Profile.getOneProfile({ email: email }, function (err, profile) {
            if (!err) {
                if (profile) {
                    
                    Profile.comparePassword(password, profile.password, function (err, isMatch) {
                        if (!err) {
                            if (isMatch) {
                                const token = jwt.sign({
                                    id: profile._id,
                                    email: profile.email
                                }, config.secret, {
                                        expiresIn: 604800, // week
                                    });

                                res.send({
                                    success: true,
                                    token: 'Bearer ' + token
                                });
                            }
                            else {
                                res.send({ success: false, data: null, message: 'Password doesn\'t match ...' });
                            }
                        } else {
                            res.send('error ...');
                            throw err;
                        }
                    });
                }
                else {
                    res.send({ success: false, data: null, message: 'No user found ...' });
                    throw err;
                }
            } else {
                res.send({ success: false, message: 'Error occured' });
                throw err;
            }
        });

    });


module.exports = router;