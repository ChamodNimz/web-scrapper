const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('../config/config');
const Profile = require('../models/Profile');


module.exports = function(passport){

    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = config.secret;
    // opts.issuer = config.issuer;
    // opts.audience = config.audience;
    passport.use(new JwtStrategy(opts,function(jwtPayload,done){   
        Profile.getProfileById(jwtPayload.id,function(err,profile){
            if(err){
                return done(err,false);
            }
            if(profile){
                return done(null,profile);
            }else{
                return done(null,false);
            }
        });
    }));

}    
