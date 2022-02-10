if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const express = require('express')
const path = require('path')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const studentRoutes = require('./Routes/student.js')
const classRoutes = require('./Routes/class.js')
const attendanceRoutes = require('./Routes/attendance.js')
const myError = require('./utils/myError.js')
const Student = require('./models/student')
const Class = require('./models/class')
const asyncError = require('./utils/asyncError.js')
const mongoSanitize = require('express-mongo-sanitize')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('connect-flash')
const User = require('./models/user')
const passport = require('passport')
const passportLocal = require('passport-local')
// const databaseUrl = process.env.DB_URL || 'mongodb://localhost:27017/attendance'
const databaseUrl = 'mongodb://localhost:27017/attendance'
const MongoStore = require('connect-mongo')
const { isAdmin, isLoggedIn } = require('./middleware.js')

const mongoose = require('mongoose')
mongoose.connect(databaseUrl)
.catch(e => console.log('Error', e))

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database Connected")
})
const app = express()


app.engine('ejs', ejsMate)
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
app.use(express.urlencoded( {extended: true}))
app.use(
    mongoSanitize({
        replaceWith: '_'
    }))
app.use(cookieParser())

const secret = process.env.SECRET || 'temporarysecret'

const sessionConfig = {
    name: 'mySession',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    store: MongoStore.create({
        mongoUrl: databaseUrl,
        secret,
        touchAfter: 24 * 60 * 60
    })
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new passportLocal(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.url = req.url
    res.locals.currentUser = req.user
    res.locals.message = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/student', studentRoutes)
app.use('/class', classRoutes)
app.use('/class/:id/attendance', attendanceRoutes)

app.get('/', isLoggedIn, asyncError(async (req, res, next) => {
    const numClasses = req.user.username === 'admin' ? await Class.countDocuments() : await Class.find({ teacher: req.user._id }).count()
    const numStudents = await Student.countDocuments()
    const numSubjects = await Class.schema.path('subject').enumValues.length
    const numTeachers = await User.find({ username: { $ne: 'admin' }}).countDocuments()

    res.render('home.ejs', {numStudents, numClasses, numSubjects, numTeachers })
}))

app.get('/register', isLoggedIn, isAdmin, (req, res, next) => {
    res.render('auth/register')
})

app.post('/register', isLoggedIn, isAdmin, asyncError(async (req, res, next) => {
    try {
        const { firstName, lastName, email, username, password } = req.body
        const user = new User({ firstName, lastName, email, username })
        const newUser = await User.register(user, password)
        req.flash('success', 'Successfully added student')
        res.redirect('/')
    }
    catch(e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}))

app.get('/login', (req, res, next) => {
    res.render('auth/login', {login: true})
})

app.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res, next) => {
    // We actually don't need to redirect the user back to their original URL because the user can only use the application if they are logged in
    // const urlRedirect = req.session.oldUrl || '/'
    req.flash('success', 'Welcome Back!')
    res.redirect('/')
})

app.get('/logout', (req, res, next) => {
    req.logout()
    req.flash('success', 'Goodbye!')
    res.redirect('/login')
})

app.get('*', (req, res, next) => {
    next(new myError(404,"Page Not Found"))
})

app.use((err, req, res, next) => {
    const {status = 500, message = "Unknown error occurred"} = err
    res.status(status).render('error', {err})
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('Connected to localhost')
})