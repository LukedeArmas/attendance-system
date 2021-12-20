const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Class = require('../models/class.js')
const Student = require('../models/student.js')
const asyncError = require('../utils/asyncError.js')
const myError = require('../utils/myError.js')
const {validateClass} = require('../middleware.js')
const { studentSchema } = require('../joi-schemas.js')
const { updateMany } = require('../models/class.js')


router.get('/', asyncError(async (req, res) => {
    const classes = await Class.find().populate({
        path: 'attendance',
        populate: {
            path: 'studentsPresent'
        }
    })
    .populate('studentsInClass')
    res.render('class-pages/home', {classes})
}))

router.post('/', validateClass, asyncError(async (req, res) => {
    const {myClass} = req.body
    const addClass = new Class(myClass)
    await addClass.save()
    res.redirect('/class')
}))

router.get('/new', (req, res) => {
    res.render('class-pages/new')
})

router.get('/:id', asyncError(async (req, res, next) => {
    const {id} = req.params
    const singleClass = await Class.findById(id).populate({
        path: 'attendance',
        populate: {
            path: 'studentsPresent'
        }
    })
    .populate('studentsInClass')
    if (!singleClass) {
        return next(new myError(404, "This class does not exist"))
    }
    res.render('class-pages/show', {singleClass})
}))

router.get('/:id/edit', asyncError(async (req, res) => {
    const {id} = req.params
    const singleClass = await Class.findById(id)
    res.render('class-pages/edit', {singleClass})
}))

router.put('/:id', validateClass, asyncError(async (req, res) => {
    const {myClass} = req.body
    const {id} = req.params
    await Class.findByIdAndUpdate(id, myClass, {runValidators: true, new: true})
    res.redirect(`/class/${id}`)
}))

router.delete('/:id', asyncError(async (req, res) => {
    const {id} = req.params
    const deletedClass = await Class.findByIdAndDelete(id)
    .then(m => console.log('Deleted Class', m))
    res.redirect('/class')
}))

router.get('/:id/addStudent', asyncError(async (req, res) => {
    const {id} = req.params
    const singleClass = await Class.findById(id)
    const students = await Student.find({classesEnrolled: {$ne: id}})
    res.render('class-pages/class-student-pages/add-student', {singleClass, students})
}))

router.put('/:id/addStudent', asyncError(async (req, res) => {
    const {id} = req.params
    const {studentList} = req.body
    const singleClass = await Class.findById(id)
    const students = await Student.find({_id: {$in: studentList}})
    singleClass.studentsInClass.push(...students)
    await singleClass.save()
    await Student.updateMany({_id: {$in: studentList}}, {$push: {classesEnrolled: singleClass}} )
    res.redirect(`/class/${id}`)
}))

router.get('/:id/removeStudent', asyncError(async (req, res) => {
    const {id} = req.params
    const singleClass = await Class.findById(id).populate({
        path: 'attendance',
        populate: {
            path: 'studentsPresent'
        }
    })
    .populate('studentsInClass')
    if (!singleClass) {
        return next(new myError(404, "This class does not exist"))
    }
    res.render('class-pages/class-student-pages/remove-student', {singleClass})
}))

router.put('/:id/removeStudent', asyncError(async (req, res) => {
    const {id} = req.params
    const {studentList} = req.body
    const singleClass = await Class.findById(id)
    const students = await Student.find({_id: {$in: studentList}})
    await Class.findByIdAndUpdate(id, {$pull: {studentsInClass: {$in: students}}})
    await Student.updateMany({_id: {$in: studentList}}, {$pull: {classesEnrolled: id}} )
    res.redirect(`/class/${id}`)
}))

module.exports = router