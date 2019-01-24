const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const request = require('request');
const passport = require('passport');
const Profile = require('../../models/Profile');
const Modules = require('../../models/Modules');
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


/**
 *  calculate GPA 
 * 
 */

router.route('/gpa')
    .post((req, res) => {
        const suggestions = [];
        let modules = req.body.modules;
        let sigmaGpCp = 0; // Sigma of Gradepoint and Creditpoint
        let sigmaCp = 0;
        processGpa(0);

        function processGpa(i) {
            if (i < modules.length) {
                Modules.getOneModuleByName(modules[i], (err, data) => {
                    if (!err) {
                        modules[i].credit = data.credit;
                        let gradePoint = filterByResult(modules[i].result);
                        let credit = parseInt(data.credit);
                        sigmaGpCp += parseFloat(gradePoint) * credit;
                        sigmaCp += credit;
                        processGpa(i + 1);
                    } else {
                        res.status(500).send({ success: false, data: null });
                        throw err;
                    }
                });
            } else {
                let gpa = sigmaGpCp / sigmaCp;
                analyze(gpa, modules);
                res.send({ success: true, data: gpa, suggestions: suggestions });
                
            }
        }

        function analyze(gpa, modules) {
            let minResult = 1; //minimun result of the array
            let minObj = { subject: '', minResult: 1 };
        
            //Diploma
            if (gpa < 3.3) {
                for (let mdl of modules) {
                    if (config.getIntVal(mdl.result) > minObj.minResult) {
                        minObj.minResult = config.getIntVal(mdl.result);
                        minObj.subject = mdl.subject;
                        if (!suggestions.includes(minObj.subject.toString())) {
                            suggestions.push(minObj.subject);
                        }
                    }
                }
        
        
                modules.filter((iteration) => {
                    if (iteration.subject == minObj.subject) {
                        iteration.result = config.getStringVal(config.getIntVal(iteration.result) - 1);
                    }
        
        
                });
                reCalculateGpa(modules);
        
            }
            //Higher diploma
            else if (gpa < 2.7) {
        
            } else {
                //console.log(suggestions);
                return true;
            }
        
        
        }
        
        function reCalculateGpa(modules) {
            let sigmaGpCp = null;
            let sigmaCp = null;
            let gpa = null;
            for (let mdl of modules) {
        
                let gradePoint = filterByResult(mdl.result);
                //console.log(gradePoint);
                let credit = parseInt(mdl.credit);
                sigmaGpCp += parseFloat(gradePoint) * credit;
                sigmaCp += credit;
                gpa = sigmaGpCp / sigmaCp;
                //console.log(gpa);
        
            }
            analyze(gpa, modules);
        }
        
    });


function filterByResult(string) {
    if (string == "A+" || string == "A") {
        return 4.0;
    } else if (string == "A-") {
        return 3.7;
    } else if (string == "B+") {
        return 3.3;
    } else if (string == "B") {
        return 3.0;
    } else if (string == "B-") {
        return 2.7;
    } else if (string == "C+") {
        return 2.3;
    } else if (string == "C") {
        return 2.0;
    } else if (string == "C-") {
        return 1.7;
    } else if (string == "D+") {
        return 1.3;
    } else if (string == "D") {
        return 1.0;
    } else if (string == "E") {
        return 0;
    }
}



module.exports = router;