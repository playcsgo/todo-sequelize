const express = require('express')
const router = express.Router()
const db = require('../../models')
const User = db.User
const bcrypt = require('bcryptjs')
const passport = require('passport')

// register - 1 
router.get('/register', (req, res) => {
  res.render('register')
})

// register -2 
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  // 沒有填寫, 或是字符不符合的處理, 
  // 前端使用required 以及使用紅色*註解, 後端可使用express-validator
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: 'no empty grid' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: 'confirm password incorrect' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password
    })
  }
  // email已存在
  User.findOne({ where: { email } }).then(user => {
    if (user) {
      errors.push({ message: 'this eamil has been registerd' })
      return res.render('register', {
        errors,
        name,
        email,
        password
      })
    }
    // bcrypt序列化後存入
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    User.create({
      name,
      email,
      password: hash
    })
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
})

// login - 1
router.get('/login', (req, res) => {
  res.render('login')
})

// login - 2
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

// logout
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '已成功登出')
  res.redirect('/users/login')
})

module.exports = router