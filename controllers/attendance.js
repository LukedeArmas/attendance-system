const Class = require('../models/class.js')
const Attendance = require('../models/attendance.js')
const moment = require('moment')


module.exports.home = async (req, res, next) => {
    const { id } = req.params
    const singleClass = await Class.findById(id)
    if (!singleClass) {
        // return next(new myError(404, "This class does not exist"))
        req.flash('error', 'Class does not exist' )
        return res.redirect('/class')
    }
    const attendances = await Attendance.find({ class: singleClass._id })
    // We only access the object on b because that is the current value. a is the previous value (which is the building sum) and starts with the value of 0. So if we tried to access an object from 0 it will result in NaN
    const averageClassAttendance = Number(Math.round( (attendances.reduce((a, b) => {
        return a + 100*(b.numStudentsPresent /
        singleClass.numStudentsInClass) 
    }, 0) / attendances.length) + 'e2') + 'e-2')
    res.render('attendance-pages/home', {singleClass, attendances, moment, averageClassAttendance})
}

module.exports.post = async (req, res, next) => {
    const { id } = req.params
    const { date, studentsPresent } = req.body
    const newDate = new Date(date)
    // Checks if the attendance date for this class exists already
    if (await Attendance.exists({ class: id, date: newDate })) {
        // return next(new myError(400, "Cannot mark attendance for the same date"))
        req.flash('error', 'Attendance has already been recorded for this date')
        return res.redirect(`/class/${id}/attendance/new`)
    }
    const nowDate = new Date(Date.now())
    const singleClass = await Class.findById(id)
    if (singleClass.studentsInClass.length < 1) {
        // return next(new myError(400, "There are no students in this class"))
        req.flash('error', 'There are no students in this class')
        return res.redirect(`/class/${id}`)
    }
    const attendanceObj = { class: id, dateUpdated: nowDate, date: newDate, studentsPresent: studentsPresent }
    // Try catch handles if user tries to put information other than student object ids in the studentsPresent array
    try {
        const newAttendance = await new Attendance(attendanceObj)
        await newAttendance.save()
        singleClass.numAttendancesTaken++
        if (studentsPresent) {
            for (let studentEntry of singleClass.studentsInClass) {
                if (studentsPresent.includes(studentEntry.student.toString())) {
                    studentEntry.numAttendancesPresent++
                }
            }
        }
        await singleClass.save()
    }
    catch(e) {
        // return next(new myError(400, "The list of students present must contain students"))
        req.flash('error', 'Attendance record must contain students')
        return res.redirect(`/class/${id}/attendance/new`)
    }
    req.flash('success', 'Successfully recorded attendance')
    res.redirect(`/class/${id}/attendance`)
}

module.exports.new = async (req, res, next) => {
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
    if (!singleClass) {
        // return next(new myError(404, "This class does not exist"))
        req.flash('error', 'Class does not exist' )
        return res.redirect('/class')
    }    
    const attendances = await Attendance.find({ class: singleClass._id })
    if (attendances) {
        notValidDates = attendances.map(entry => moment(entry.date).format('L') )
    }
    const unformattedDate = Date.now()
    const date = moment(unformattedDate).format('L')
    res.render('attendance-pages/new', {singleClass, date, notValidDates})
}

module.exports.show = async (req, res, next) => {
    const { id, dateId } = req.params
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
    const attendanceDay = await Attendance.findById(dateId)
    if (!attendanceDay) {
        // return next(new myError(404, "No attendance has been taken yet for this date"))
        req.flash('error', 'Attendance record does not exist' )
        return res.redirect(`/class/${id}/attendance`)
    }
    res.render('attendance-pages/show', { singleClass, attendanceDay, moment })
}

module.exports.edit = async (req, res, next) => {
    const { id, dateId } = req.params
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
    const attendanceDay = await Attendance.findById(dateId)
    if (!attendanceDay) {
        // return next(new myError(404, "No attendance has been taken yet for this date"))
        req.flash('error', 'Attendance record does not exist' )
        return res.redirect(`/class/${id}/attendance`)
    }
    res.render('attendance-pages/edit', { singleClass, attendanceDay, moment })
}

module.exports.put = async (req, res, next) => {
    const { id, dateId } = req.params
    const { studentsPresent } = req.body
    const singleClass = await Class.findById(id)
    const attendanceDay = await Attendance.findById(dateId)
    if (!attendanceDay) {
        // return next(new myError(404, "Cannot edit attendance for a date that has not been recorded yet"))
        req.flash('error', 'Attendance record does not exist')
        return res.redirect(`/class/${id}/attendance`)
    }
    try {
        attendanceDay.studentsPresent = studentsPresent
        await attendanceDay.save()
        for (let studentEntry of singleClass.studentsInClass) {
            studentEntry.numAttendancesPresent = await Attendance.find({ studentsPresent: { $eq: studentEntry.student }}).count()
        }
        await singleClass.save()
    }
    catch(e) {
        // return next(new myError(400, "The list of students must contain students"))
        req.flash('error', 'Attendance record must contain students')
        return res.redirect(`/class/${id}/attendance/${dateId}/edit`)
    }
    req.flash('success', 'Successfully updated attendance record')
    return res.redirect(`/class/${id}/attendance/${dateId}`) 
}

module.exports.delete = async (req, res, next) => {
    const { id, dateId } = req.params
    const singleClass = await Class.findById(id)
    const attendance = await Attendance.findByIdAndDelete(dateId)
    singleClass.numAttendancesTaken--
    for (let studentEntry of singleClass.studentsInClass) {
        if (attendance.studentsPresent.includes(studentEntry.student)) {
            studentEntry.numAttendancesPresent--
        }
    }
    await singleClass.save()
    req.flash('success', 'Successfully deleted attendance record')
    res.redirect(`/class/${id}/attendance`)
}