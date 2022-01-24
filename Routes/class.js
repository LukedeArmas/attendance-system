const express = require('express')
const router = express.Router()
const Class = require('../models/class.js')
const Student = require('../models/student.js')
const asyncError = require('../utils/asyncError.js')
const myError = require('../utils/myError.js')
const {validateClass, validateAddStudentToClass, validateRemoveStudentFromClass, checkSearch} = require('../middleware.js')
const moment = require('moment')


router.get('/', asyncError(async (req, res) => {
    const {search} = req.query
    const query = checkSearch(search)
    const classes = await Class.find(query).sort({ classCode: 1 }).populate({
        path: 'attendance',
        populate: {
            path: 'studentsPresent'
        }
    })
    .populate('studentsInClass')
    res.render('class-pages/home', {classes, query})
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

router.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
    next()
})
.get('/:id/addStudent', asyncError(async (req, res) => {
    const {id} = req.params
    const singleClass = await Class.findById(id)
    const students = await Student.find({classesEnrolled: {$ne: id}})
    res.render('class-student-pages/add-student', {singleClass, students})
}))

router.put('/:id/addStudent', validateAddStudentToClass, asyncError(async (req, res, next) => {
    const {id} = req.params
    const {studentList} = req.body
    const singleClass = await Class.findById(id)
    const students = await Student.find({_id: {$in: studentList}})
    singleClass.studentsInClass.push(...students)
    await singleClass.save()
    await Student.updateMany({_id: {$in: studentList}}, {$push: {classesEnrolled: singleClass}} )
    res.redirect(`/class/${id}`)
}))

router.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
    next()
})
.get('/:id/removeStudent', asyncError(async (req, res) => {
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
    res.render('class-student-pages/remove-student', {singleClass})
}))

router.put('/:id/removeStudent', validateRemoveStudentFromClass, asyncError(async (req, res, next) => {
    const {id} = req.params
    const {studentList} = req.body
    const singleClass = await Class.findById(id)
    const students = await Student.find({_id: {$in: studentList}})
    await Class.findByIdAndUpdate(id, {$pull: {studentsInClass: {$in: students}}})
    await Student.updateMany({_id: {$in: studentList}}, {$pull: {classesEnrolled: id}} )
    res.redirect(`/class/${id}`)
}))


router.get('/:id/attendance', asyncError(async (req, res, next) => {
    const { id } = req.params
    const singleClass = await Class.findById(id)
    if (!singleClass) {
        return next(new myError(404, "This class does not exist"))
    }

    res.render('class-pages/attendance-pages/home', {singleClass, moment})
}))

router.get('/:id/attendance/new', asyncError(async (req, res, next) => {
    const { id } = req.params
    const singleClass = await Class.findById(id)
    .populate('studentsInClass')
    if (!singleClass) {
        return next(new myError(404, "This class does not exist"))
    }
    const unformattedDate = Date.now()
    const date = moment(unformattedDate).format('L')
    res.render('class-pages/attendance-pages/new', {singleClass, date})

}))

router.post('/:id/attendance', asyncError(async (req, res, next) => {
    const { id } = req.params
    const { date, attendanceList } = req.body
    const newDate = new Date(date)
    const attendanceObj = {date: newDate, studentsPresent: attendanceList}
    const singleClass = await Class.findOne({ $and: [ { _id: id}, { 'attendance.date': { $ne: newDate } } ] })
    if (singleClass) {
        await singleClass.attendance.push(attendanceObj)
        await singleClass.save()
    }
    else {
        return next(new myError(500, "Cannot mark attendance for the same date"))
    }

    res.redirect(`/class/${id}/attendance`)
}))

router.get('/:id/attendance/:dateId', asyncError(async (req, res, next) => {
    const { id, dateId } = req.params
    const singleClass = await Class.findById(id)
    .populate('studentsInClass')
    if (!singleClass.attendance) {
        return next(new myError(404, "No attendance has been taken yet"))
    }
    else {
        const attendanceDay = singleClass.attendance.find(element => element.id === dateId)
        if (!attendanceDay) {
            return next(new myError(404, "Attendance for this date does not exist"))
        } else {
            res.render('class-pages/attendance-pages/show', { singleClass, attendanceDay, moment })
        }
    }
}))

module.exports = router