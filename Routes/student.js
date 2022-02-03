const express = require('express')
const router = express.Router()
const Student = require('../models/student.js')
const Class = require('../models/class.js')
const asyncError = require('../utils/asyncError.js')
const myError = require('../utils/myError.js')
const {validateStudent, checkSearch, objectIdMiddleware} = require('../middleware.js')


router.get('/', asyncError(async (req, res) => {
    const {search} = req.query
    const query = checkSearch(search)
    const students = await Student.find(query)
    res.render('student-pages/home', {students, query})
}))

router.post('/', validateStudent, asyncError(async (req, res) => {
    const {student} = req.body
    try {
        const newStudent = new Student(student)
        await newStudent.save()
    }
    catch(e) {
        if (e.message === 'Student validation failed: studentId: Student already exists') {
            req.flash('error', 'Student ID already exists')
        } else {
            req.flash('error', e.message)
        }
        return res.redirect('/student/new')
    }
    req.flash('success', 'Successfully created a new student')
    res.redirect('/student')
}))

router.get('/new', (req, res) => {
    res.render('student-pages/new')
})

router.get('/:id', objectIdMiddleware, asyncError(async (req, res, next) => {
    const {id} = req.params
    const student = await Student.findById(id)
    // This is how you query for documents that have an array of embedded documents where at least one of the sub documents contains our match
    const classes = await Class.find({ 'studentsInClass.student': { $eq: student } })
    if (!student) {
        // return next(new myError(404, "This student does not exist"))
        req.flash('error', 'Student does not exist')
        return res.redirect('/student')
    }
    res.render('student-pages/show', {student, classes})
}))

router.get('/:id/edit', objectIdMiddleware, asyncError(async (req, res) => {
    const {id} = req.params
    const student = await Student.findById(id)
    if (!student) {
        // return next(new myError(404, "This student does not exist"))
        req.flash('error', 'Student does not exist')
        return res.redirect('/student')
    }
    res.render('student-pages/edit', {student})
}))

router.put('/:id', objectIdMiddleware, validateStudent, asyncError(async (req, res) => {
    const {student} = req.body
    const {id} = req.params
    try {
        const updatedStudent = await Student.findByIdAndUpdate(id, student, {runValidators: true, new: true})
    }
    catch(e) {
        if (e.message === 'Validation failed: studentId: Student already exists') {
            req.flash('error', 'Student ID already exists')
        } else {
            req.flash('error', e.message)
        }
        return res.redirect(`/student/${id}/edit`)
    }
    req.flash('success', 'Successfully updated student')
    res.redirect(`/student/${id}`)
}))

router.delete('/:id', objectIdMiddleware, asyncError(async (req, res) => {
    const {id} = req.params
    const deletedStudent = await Student.findByIdAndDelete(id)
    .then(m => console.log('Student Deleted', m))
    req.flash('success', 'Successfully deleted student')
    res.redirect('/student')
}))

module.exports = router