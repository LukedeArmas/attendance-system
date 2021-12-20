const express = require('express')
const path = require('path')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const studentRoutes = require('./Routes/student.js')
const classRoutes = require('./Routes/class.js')
const myError = require('./utils/myError.js')


const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/attendance')
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
// app.use(express.json())

app.use('/student', studentRoutes)
app.use('/class', classRoutes)


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

app.listen(3000, () => {
    console.log('Connected to localhost')
})