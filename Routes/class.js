const express = require('express')
const router = express.Router()
const Class = require('../models/class.js')
const Student = require('../models/student.js')
const Attendance = require('../models/attendance.js')
const asyncError = require('../utils/asyncError.js')
const myError = require('../utils/myError.js')
const {validateClass, validateAddStudentToClass, validateRemoveStudentFromClass, checkSearch, validateAttendance, objectIdMiddleware } = require('../middleware.js')
const moment = require('moment')


router.get('/', asyncError(async (req, res) => {
    const {search} = req.query
    const query = checkSearch(search)
    const classes = await Class.find(query).sort({ classCode: 1 })
    .populate('studentsInClass')
    res.render('class-pages/home', {classes, query})
}))

router.post('/', validateClass, asyncError(async (req, res, next) => {
    const {myClass} = req.body
    try {
        const addClass = new Class(myClass)
        await addClass.save()
    }
    catch(e) {
        // return next(new myError(400, "This Class already exists"))
        if (e.message === 'E11000 duplicate key error collection: attendance.classes index: classCode_1_section_1 dup key: { classCode: "TESTING", section: 1 }') {
            req.flash('error', 'This class already exists')
        }
        else {
            req.flash('error', e.message)
        }
        return res.redirect('/class/new')
    }
    req.flash('success', 'Successfully created a new class')
    res.redirect('/class')
}))

router.get('/new', (req, res) => {
    res.render('class-pages/new')
})

router.get('/:id', objectIdMiddleware, asyncError(async (req, res, next) => {
    const {id} = req.params
    const singleClass = await Class.findById(id)
    .populate({
        path: 'studentsInClass',
        populate: {
            path: 'student',
            model: 'Student'
        }
    })
    if (!singleClass) {
        // return next(new myError(404, "This class does not exist"))
        req.flash('error', 'Class does not exist' )
        return res.redirect('/class')
    }
    res.render('class-pages/show', {singleClass})
}))

router.get('/:id/edit', objectIdMiddleware, asyncError(async (req, res) => {
    const {id} = req.params
    const singleClass = await Class.findById(id)
    if (!singleClass) {
        req.flash('error', 'Class does not exist' )
        return res.redirect('/class')
    }
    res.render('class-pages/edit', {singleClass})
}))

router.put('/:id', objectIdMiddleware, validateClass, asyncError(async (req, res) => {
    const {myClass} = req.body
    const {id} = req.params
    try {
        await Class.findByIdAndUpdate(id, myClass, {runValidators: true, new: true})
    }
    catch(e) {
        if (e.message === 'Plan executor error during findAndModify :: caused by :: E11000 duplicate key error collection: attendance.classes index: classCode_1_section_1 dup key: { classCode: "TESTING", section: 1 }') {
            req.flash('error', 'This class already exists')
        }
        else {
            req.flash('error', e.message)
        }
        return res.redirect(`/class/${id}/edit`)
    }
    req.flash('success', 'Successfully updated class')
    res.redirect(`/class/${id}`)
}))

router.delete('/:id', objectIdMiddleware, asyncError(async (req, res) => {
    const {id} = req.params
    const deletedClass = await Class.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted class')
    res.redirect('/class')
}))



// Stops caching so the page is refreshed if the user clicks the back arrow to go back to this page
router.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
    next()
})
.get('/:id/addStudent', objectIdMiddleware, asyncError(async (req, res) => {
    const {id} = req.params
    const singleClass = await Class.findById(id)
    if (!singleClass) {
        req.flash('error', 'Class does not exist' )
        return res.redirect('/class')
    }
    const students = await Student.find({ _id: {$nin: singleClass.studentsInClass.map(entry => entry.student) }})
    res.render('class-student-pages/add-student', {singleClass, students})
}))


router.put('/:id/addStudent', objectIdMiddleware, validateAddStudentToClass, asyncError(async (req, res, next) => {
    const {id} = req.params
    const {studentList} = req.body
    const singleClass = await Class.findById(id)
    const students = await Student.find({_id: {$in: studentList}})
    for (let i=0; i < students.length; i++) {
        singleClass.studentsInClass.push({student: students[i], attendancePercentage: 0})
    }
    await singleClass.save()
    req.flash('success', 'Successfully added students to class')
    res.redirect(`/class/${id}`)
}))

router.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
    next()
})
.get('/:id/removeStudent', objectIdMiddleware, asyncError(async (req, res) => {
    const {id} = req.params
    const singleClass = await Class.findById(id)
    .populate({
        path: 'studentsInClass',
        populate: {
            path: 'student',
            model: 'Student'
        }
    })
    if (!singleClass) {
        req.flash('error', 'Class does not exist' )
        return res.redirect('/class')
    }
    res.render('class-student-pages/remove-student', {singleClass})
}))

router.put('/:id/removeStudent', objectIdMiddleware, validateRemoveStudentFromClass, asyncError(async (req, res, next) => {
    const {id} = req.params
    const {studentList} = req.body
    const singleClass = await Class.findById(id)
    const students = await Student.find({_id: {$in: studentList}})
    await Class.findByIdAndUpdate(id, {$pull: {studentsInClass: { student: {$in: students}}}})
    req.flash('success', 'Successfully removed students from class')
    res.redirect(`/class/${id}`)
}))


module.exports = router