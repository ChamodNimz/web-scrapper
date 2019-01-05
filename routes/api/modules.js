const express = require('express');
const router = express.Router();
const Modules = require('../../models/Modules');
const passport = require('passport');
const config = require('../../config/config');

router.route('/modules')

    // create a profile
    .post((req, res) => {
        Modules.insertModule(req.body, function (err, data) {
            if (!err) {
                res.send({ data: data, success: true });
            } else {
                res.status(500).send({ success: false, error: 'ExeptionOccured', message: 'Error occured' });
                throw err;
            }
        });

    })

module.exports = router;