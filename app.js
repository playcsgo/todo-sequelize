const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')
const app = express()
const PORT = 3000
const db = require('./models')
const Todo = db.Todo
const User = db.User
const session = require('express-session')
const usePassport = require('./config/passport.js')
const passport = require('passport')
const routes = require('./routes')
const flash = require('connect-flash')
if (process.env.NODE_ENV !== 'product') {
  require('dotenv').config()
}

//handlebars
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(flash())

app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))
usePassport(app)

app.use((req, res, next) => {
  res.locals.isAuthenticated =req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})



app.use(routes)
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
// app.get('/', (req, res) => {
//   return Todo.findAll({
//     raw: true,
//     nest: true
//   })
//     .then((todos) => { return res.render('index', {todos: todos }) })
//     .catch(err => { return res.status(422).jason(err) })
// })

// app.get('/todos/:id', (req, res) => {
//   const id = req.params.id
//   return Todo.findByPk(id)
//     .then(todo => res.render('detail', { todo: todo.toJSON() }) )
//     .catch(err => console.log(err))
// })

// app.get('/users/login', (req, res) => {
//   res.render('login')
// })

// app.post('/users/login', passport.authenticate('local', {
//   successRedirect: '/',
//   failureRedirect: '/users/login'
// }))

// app.get('/users/register', (req, res) => {
//   res.render('register')
// })

// app.post('/users/register', (req, res) => {
//   const { name, email, password, confirmPassword } =req. body
//   User.findOne({ where: { email } }).then(user => {
//     if (user) {
//       console.log('User already exists')
//       return res.render('register', {
//         name,
//         email,
//         password
//       })
//     }
//     return bcrypt
//       .genSalt(10)
//       .then(salt => bcrypt.hash(password, salt))
//       .then(hash => User.create({
//         name,
//         email,
//         password: hash
//       }))
//       .then(() => res.redirect('/'))
//       .catch(err => console.log(err))
//   })
// })

// app.get('/users/logout', (req, res) => {
//   res.send('logout')
// })