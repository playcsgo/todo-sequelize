const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const FacebookStrategy = require('passport-facebook')
require('dotenv').config()

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())
  // LocalStrategy
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ where: { email} })
      .then(user => {
        if (!user) {
          // req.flash('warning_msg', 'Email is not registered.') 可能是版本不同, LocalStrategy 不能加req
          return done(null, false, { message: 'Email is not registered.' })
        }
        return bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch){
            // req.flash('warning_msg', 'Email or Password incorrect.')
            return done(null, false, { message: 'Email or Password incorrect.' })
          }
          return done(null, user)
        })
      })
      .catch(err => done(err, false))
  } ))

  // FacebookStrategy
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  },
  function(accessToken, refreshToken, profile, done) {
    const { name, email } = profile._json
    User.findOne({ where: {email } })
      .then(user => {
        if (user) return done(null, user)
        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name,
            email,
            password: hash
          }))
          .then(user => done(null, user))
          .catch(err => done(err, false))
      })
    }))

  // serialize
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then(user => {
        user = user.toJSON()
        done(null, user)
      })
  })
}