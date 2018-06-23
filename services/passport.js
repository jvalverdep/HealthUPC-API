const passport = require('passport');
const User = require('../models/user');
const secret = require('../config').secret;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

module.exports = function(app) {
    const db = app.db;
    const Op = db.Sequelize.Op;

    // Create local strategy
    const localOptions = { usernameField: 'email' };
    passport.use(new LocalStrategy(localOptions, function(email, password, done) {
        // Verify this email and password, call done with the user
        // if it is the correct email and password
        // otherwise, call done with false
        db.user.findOne({ where: { email: { [Op.eq]: email } }})
            .then(user => {
                if (!user) {
                    return done(null, false);
                }
                user.comparePassword(password, function(err, isMatch) {
                    if (err) { return done(err); }
                    if (!isMatch) { return done(null, false); }
        
                    return done(null, user);
                });
            })
            .catch(error => {
                return done(error);
            });
    }));

    // Setup options for JWT Strategy
    const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromHeader('authorization'),
        secretOrKey: secret
    };

    // Create JWT strategy
    passport.use(new JwtStrategy(jwtOptions, function(payload, done) {
        // See if the user ID in the payload exists in our database
        // If it does, call 'done' with that user
        // otherwise, call done without a ubser object
        db.user.findById(payload.sub)
            .then(user => {
                user? done(null, user) : done(null, false);
            })
            .catch(error => {
                return done(error, false);
            });
    }));
}