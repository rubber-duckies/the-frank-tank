const LocalStrategy   = require('passport-local').Strategy;
const db = require('./db');
const bcrypt   = require('bcrypt-nodejs');

var passport = require('passport');
/*
  ***********************************************************************

  Passport config for local sing in

  ***********************************************************************
*/
passport.use(new LocalStrategy(
  function(username, password, done) {
  db.findUser(username)
    .then(user =>{
      if (!user) {
        //return done(null, false, { message: 'Incorrect username.' });
        return done('Incorrect username.', false);
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return done('Incorrect password.', false);
      }
      return done(null, user);
    });
  }
));

/*
  ***********************************************************************

  Passport config for local sing up

  ***********************************************************************
*/
passport.use('local-signup', new LocalStrategy({
        passReqToCallback : true 
    },
  function(req, username, password, done) {
    process.nextTick(function() {
      return db.findUser(username)
      .then((user) => {
        if(user){
          return done('That username is already taken.', false);
        } else {
          var hashPassword =  bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
          db.addUser(username, hashPassword)
          .then((user)=>{
            return done(null, user[0]); 
          });
        }
      })
    })
  })
);

/*
  ***********************************************************************

  Passport config: only save username as session info.

  ***********************************************************************
*/
passport.serializeUser(function (user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(user, done) {
  console.log("DESERIALIZE", JSON.stringify(user));
    db.findUser(user)
    .then((user,err)=>{
        done(err, user);
    });
    //done(user);
});


module.exports = passport;