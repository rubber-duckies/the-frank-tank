const LocalStrategy   = require('passport-local').Strategy;
const db = require('./db');
const bcrypt   = require('bcrypt-nodejs');

var passport = require('passport');
/*
  *******************
  PASSPORT CONFIG
  *******************
*/
passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log("PASSPORT FIND USER", username, password);
  //   db.findUser(username, function(err, result){;
  //     var user = result[0]
  //     console.log("PASSPORT FOUND USER", user);
  //     if (!user) {
  //       return done(null, false, { message: 'Incorrect username.' });
  //     }
  //     if (!bcrypt.compareSync(password, user.password)) {
  //       return done(null, false, { message: 'Incorrect password.' });
  //     }
  //     return done(null, user);
  //   });
  // }
  db.findUser(username)
    .then(user =>{
      console.log("PASSPORT FOUND USER", user, user.username, user.password);
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

passport.use('local-signup', new LocalStrategy({
        passReqToCallback : true 
    },
  function(req, username, password, done) {
    console.log("PASSPORT LOCAL SIGNUP", username, password)
    process.nextTick(function() {
      console.log("PASSPORT LOCAL SIGNUP", username, password)
      return db.findUser(username)
      .then((user) => {
        if(user){
          return done(null, false, { message: 'That username is already taken.'});
        } else {
          var hashPassword =  bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
          db.addUser(username, hashPassword)
          .then((user)=>{
            console.log("PASSPORT ADDED USER", user)
            return done(null, user); 
          });
        }
      })
      // .then((user)=>{
      //   console.log("PASSPORT ADDED USER", user)
      //   return done(null, user); 
      // })
    })
  })
);

passport.serializeUser(function (user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(username, done) {
    db.findUser(username)
    .then((user,err)=>{
        done(err, user);
    });
    //done(null, user);
});


module.exports = passport;