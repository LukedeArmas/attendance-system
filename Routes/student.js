const express = require('express')
const router = express.Router()
const Student = require('../models/student.js')
const asyncError = require('../utils/asyncError.js')
const myError = require('../utils/myError.js')
const {validateStudent, checkSearch} = require('../middleware.js')


router.get('/', asyncError(async (req, res) => {
    const {search} = req.query
    const query = checkSearch(search)
    const students = await Student.find(query)
    res.render('student-pages/home', {students, query})
}))

router.post('/', validateStudent, asyncError(async (req, res) => {
    const {student} = req.body
    const newStudent = new Student(student)
    await newStudent.save()
    res.redirect('/student')
}))

router.get('/new', (req, res) => {
    res.render('student-pages/new')
})

router.get('/:id', asyncError(async (req, res, next) => {
    const {id} = req.params
    const student = await Student.findById(id).populate('classesEnrolled')
    if (!student) {
        return next(new myError(404, "This student does not exist"))
    }
    res.render('student-pages/show', {student})
}))

router.get('/:id/edit', asyncError(async (req, res) => {
    const {id} = req.params
    const student = await Student.findById(id)
    res.render('student-pages/edit', {student})
}))

router.put('/:id', validateStudent, asyncError(async (req, res) => {
    const {student} = req.body
    const {id} = req.params
    const updatedStudent = await Student.findByIdAndUpdate(id, student, {runValidators: true, new: true})
    res.redirect(`/student/${id}`)
}))

router.delete('/:id', asyncError(async (req, res) => {
    const {id} = req.params
    const deletedStudent = await Student.findByIdAndDelete(id)
    .then(m => console.log('Student Deleted', m))
    res.redirect('/student')
}))

module.exports = router