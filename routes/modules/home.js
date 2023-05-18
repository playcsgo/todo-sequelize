const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo
const User = db.User

router.get('/', (req, res) => {
  if (!req.user) {
    return res.redirect('/users/login')
  }
  
  return Todo.findAll({
    raw: true,
    nest: true,
    where: { UserId: req.user.id}
  })
    .then(todos => res.render('index', { todos }))
    .catch(err => console.log(err))
})

// router.get('/', (req, res) => {
//   User.findByPk(req.user.id)
//     .then(user => {
//       return Todo.findAll({
//         raw: true,
//         nest: true,
//         where: { UserId: req.user.id }
//       })
//     })
//     .then(todos => res.render('index', { todos }))
//     .catch(err => console.log(err))
// })

module.exports = router