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
const mongoSanitize = require('express-mongo-sanitize')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('connect-flash')
// const User = require('./models/user')
// const passport = require('passport')
// const passportLocal = require('passport-local')
const databaseUrl = process.env.DB_URL || 'mongodb://localhost:27017/attendance'
const MongoStore = require('connect-mongo')

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

// app.use(passport.initialize())
// app.use(passport.session())
// passport.use(new passportLocal(User.authenticate()))
// passport.serializeUser(User.serializeUser())
// passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.message = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/student', studentRoutes)
app.use('/class', classRoutes)
app.use('/class/:id/attendance', attendanceRoutes)

app.get('/', async (req, res, next) => {
    const numStudents = await Student.countDocuments()
    const numClasses = await Class.countDocuments()
    const numSubjects = await Class.schema.path('subject').enumValues.length
    const teachers = await Class.find().distinct('teacher')
    const numTeachers = teachers.length

    res.render('home.ejs', {numStudents, numClasses, numSubjects, numTeachers})
})

app.get('/error', (req, res, next) => {
    next(new myError(500,"Testing express error class"))
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