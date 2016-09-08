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
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: 'Incorrect password.' });
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
    console.log("req/user/pass: ", req, username, password);
    process.nextTick(function() {
      return db.findUser(username)
      .then((user) => {
        if(user){
          return done(null, false, { message: 'That username is already taken.'});
        } else {
          var hashPassword =  bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
          db.addUser(username, hashPassword)
          .then((user)=>{
            console.log("LOCAL SIGNUP", user)
            return done(null, user); 
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
  console.log("SERIALIZE", JSON.stringify(user));
    done(null, user[0].username);
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