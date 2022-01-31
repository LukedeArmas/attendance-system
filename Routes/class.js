const express = require('express')
const router = express.Router()
const Class = require('../models/class.js')
const Student = require('../models/student.js')
const Attendance = require('../models/attendance.js')
const asyncError = require('../utils/asyncError.js')
const myError = require('../utils/myError.js')
const {validateClass, validateAddStudentToClass, validateRemoveStudentFromClass, checkSearch, validateAttendance} = require('../middleware.js')
const moment = require('moment')


router.get('/', asyncError(async (req, res) => {
    const {search} = req.query
    const query = checkSearch(search)
    const classes = await Class.find(query).sort({ classCode: 1 })
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

// Checked
router.get('/:id', asyncError(async (req, res, next) => {
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

// Checked for student model change
// Stops caching so the page is refreshed if the user clicks the back arrow to go back to this page
router.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
    next()
})
.get('/:id/addStudent', asyncError(async (req, res) => {
    const {id} = req.params
    const singleClass = await Class.findById(id)
    const students = await Student.find({ _id: {$nin: singleClass.studentsInClass.map(entry => entry.student) }})
    res.render('class-student-pages/add-student', {singleClass, students})
}))


// Checked
// Checked for student model change
router.put('/:id/addStudent', validateAddStudentToClass, asyncError(async (req, res, next) => {
    const {id} = req.params
    const {studentList} = req.body
    const singleClass = await Class.findById(id)
    const students = await Student.find({_id: {$in: studentList}})
    for (let i=0; i < students.length; i++) {
        singleClass.studentsInClass.push({student: students[i], attendancePercentage: 0})
    }
    await singleClass.save()
    res.redirect(`/class/${id}`)
}))

// Checked
router.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
    next()
})
.get('/:id/removeStudent', asyncError(async (req, res) => {
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
        return next(new myError(404, "This class does not exist"))
    }
    res.render('class-student-pages/remove-student', {singleClass})
}))

// Checked
// Checked for student model change
router.put('/:id/removeStudent', validateRemoveStudentFromClass, asyncError(async (req, res, next) => {
    const {id} = req.params
    const {studentList} = req.body
    const singleClass = await Class.findById(id)
    const students = await Student.find({_id: {$in: studentList}})
    await Class.findByIdAndUpdate(id, {$pull: {studentsInClass: { student: {$in: students}}}})
    res.redirect(`/class/${id}`)
}))


router.get('/:id/attendance', asyncError(async (req, res, next) => {
    const { id } = req.params
    const singleClass = await Class.findById(id)
    const attendances = await Attendance.find({ class: singleClass._id })
    // We only access the object on b because that is the current value. a is the previous value (which is the building sum) and starts with the value of 0. So if we tried to access an object from 0 it will result in NaN
    const averageClassAttendance = Number(Math.round( (attendances.reduce((a, b) => {
        return a + b.percentagePresent 
    }, 0) / attendances.length) + 'e2') + 'e-2')
    if (!singleClass) {
        return next(new myError(404, "This class does not exist"))
    }

    res.render('class-pages/attendance-pages/home', {singleClass, attendances, moment, averageClassAttendance})
}))

// Checked
router.get('/:id/attendance/new', asyncError(async (req, res, next) => {
    const { id } = req.params
    let notValidDates = []
    const singleClass = await Class.findById(id)
    .populate({
        path: 'studentsInClass',
        populate: {
            path: 'student',
            model: 'Student'
        }
    })
    const attendances = await Attendance.find({ class: singleClass._id })
    if (!singleClass) {
        return next(new myError(404, "This class does not exist"))
    }
    if (attendances) {
        notValidDates = attendances.map(entry => moment(entry.date).format('L') )
    }
    const unformattedDate = Date.now()
    const date = moment(unformattedDate).format('L')
    res.render('class-pages/attendance-pages/new', {singleClass, date, notValidDates})

}))

// Checked
router.post('/:id/attendance', validateAttendance, asyncError(async (req, res, next) => {
    const { id } = req.params
    const { date, studentsPresent } = req.body
    const newDate = new Date(date)
    // Checks if the attendance date for this class exists already
    if (!(await Attendance.exists({ class: id, date: newDate }))) {
        const nowDate = new Date(Date.now())
        const singleClass = await Class.findById(id)
        const attendanceObj = { class: id, dateUpdated: nowDate, date: newDate, studentsPresent: studentsPresent, percentagePresent: studentsPresent ? 100*(studentsPresent.length / singleClass.studentsInClass.length) : 0, numStudentsInClass: singleClass.studentsInClass.length }
        // Try catch handles if user tries to put information other than student object ids in the studentsPresent array
        try {
            const newAttendance = await new Attendance(attendanceObj)
            await newAttendance.save()
        }
        catch(e) {
            return next(new myError(400, "The list of students present must contain students"))
        }

    }
    else {
        return next(new myError(500, "Cannot mark attendance for the same date"))
    }

    res.redirect(`/class/${id}/attendance`)
}))

// Checked
router.get('/:id/attendance/:dateId', asyncError(async (req, res, next) => {
    const { id, dateId } = req.params
    const singleClass = await Class.findById(id)
    .populate({
        path: 'studentsInClass',
        populate: {
            path: 'student',
            model: 'Student'
        }
    })
    const attendanceDay = await Attendance.findById(dateId)
    if (!attendanceDay) {
        return next(new myError(404, "No attendance has been taken yet for this date"))
    }
    res.render('class-pages/attendance-pages/show', { singleClass, attendanceDay, moment })
}))

// Checked
router.get('/:id/attendance/:dateId/edit', asyncError(async (req, res, next) => {
    const { id, dateId } = req.params
    const singleClass = await Class.findById(id)
    .populate({
        path: 'studentsInClass',
        populate: {
            path: 'student',
            model: 'Student'
        }
    })
    const attendanceDay = await Attendance.findById(dateId)
    if (!attendanceDay) {
        return next(new myError(404, "No attendance has been taken yet for this date"))
    }
    res.render('class-pages/attendance-pages/edit', { singleClass, attendanceDay, moment })
}))

// Checked
router.put('/:id/attendance/:dateId', asyncError(async (req, res, next) => {
    const { id, dateId } = req.params
    const { studentsPresent } = req.body
    const attendanceDay = await Attendance.findById(dateId)
    if (!attendanceDay) {
        return next(new myError(404, "Cannot edit attendance for a date that has not been recorded yet"))
    }
    else {
            try {
                attendanceDay.studentsPresent = studentsPresent
                attendanceDay.percentagePresent = studentsPresent ? 100*(studentsPresent.length / attendanceDay.numStudentsInClass) : 0
                await attendanceDay.save()
            }
            catch(e) {
                return next(new myError(400, "The list of students must contain students"))
            }
            return res.redirect(`/class/${id}/attendance`) 
        }
}))

router.delete('/:id/attendance/:dateId', asyncError(async (req, res, next) => {
    const { id, dateId } = req.params
    await Attendance.findByIdAndDelete(dateId)
    res.redirect(`/class/${id}/attendance`)
}))


module.exports = router