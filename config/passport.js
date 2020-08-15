const LocalStrategy = require('passport-local').Strategy;
const RememberMeStrategy = require('passport-remember-me').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../User');

function initialize (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({ email: email })
        .then(user => {
          if (!user) {
            return done(null, false, { message: 'That email is not registered.' })
          }

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Password incorrect.' })
            }
          })
        })
        .catch(err => console.log(err))
    })
  )

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}

function rememberMe (passport) {
  passport.use(new RememberMeStrategy(
    function(token, done) {
      Token.consume(token, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        return done(null, user);
      });
    },
    function(user, done) {
      var token = utils.generateToken(64);
      Token.save(token, { userId: user.id }, function(err) {
        if (err) { return done(err); }
        return done(null, token);
      });
    }
  ));
}

exports.initialize = initialize;
exports.rememberMe = rememberMe;
// module.exports = initialize;
