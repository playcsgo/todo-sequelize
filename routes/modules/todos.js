const express = require('express')
const router = express.Router()
const db = require('../../models')
const User = db.User
const Todo = db.Todo

// create - 1
router.get('/new', (req, res) => {
  res.render('new')
})

// create - 2
router.post('/create', (req, res) => {
  console.log(req.user);
  const UserId = req.user.id
  const name = req.body.name
  Todo.create({ UserId, name })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// Read
router.get('/:id', (req, res) => {
  const UserId = req.user.id
  const TodoId = Number(req.params.id)
  Todo.findOne({ where: {UserId, id: TodoId} })
    .then(todo => {
      res.render('detail', { todo: todo.toJSON() })
    })
    .catch(err => console.log(err))
})

// Update - 1
router.get('/:id/edit', (req, res) => {
  const UserId = req.user.id
  const TodoId = req.params.id
  Todo.findOne({ where: {UserId, id: TodoId} })
    .then(todo => res.render('edit', { todo: todo.toJSON() }))
})

// update - 2
router.put('/:id', (req, res) => {
  const UserId = req.user.id
  const TodoId = req.params.id
  const { name, isDone } = req.body
  console.log(req.body);
  Todo.update(
    {name: name, isDone: isDone === 'on' },
    { where: {id: TodoId} },
  )
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// delete
router.delete('/:id', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  Todo.destroy(
    {where: { id, UserId }}
  )
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

module.exports = router