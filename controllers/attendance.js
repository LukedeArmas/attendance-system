const Class = require('../models/class.js')
const Attendance = require('../models/attendance.js')
const moment = require('moment')
const { sortAlphabetically } = require('../helperFunctions')


module.exports.home = async (req, res, next) => {
    const { id } = req.params
    const singleClass = await Class.findById(id)
    if (!singleClass) {
        req.flash('error', 'Class does not exist' )
        return res.redirect('/class')
    }
    // Find all attendances for the specific class
    const attendances = await Attendance.find({ class: singleClass._id })
    // Reduce function calculates the class average for attendance and rounds to the second decimal
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
    const nowDate = new Date(Date.now())
    // Checks if the attendance date for this class exists already
    if (await Attendance.exists({ class: id, date: newDate })) {
        req.flash('error', 'Attendance has already been recorded for this date')
        return res.redirect(`/class/${id}/attendance/new`)
    }
    const singleClass = await Class.findById(id)
    // Checks if there are any students in the class
    if (singleClass.studentsInClass.length < 1) {
        req.flash('error', 'There are no students in this class')
        return res.redirect(`/class/${id}`)
    }
    const attendanceObj = { class: id, dateUpdated: nowDate, date: newDate, studentsPresent: studentsPresent }
    // Try catch handles if user tries to put information other than student object ids in the studentsPresent array
    try {
        const newAttendance = await new Attendance(attendanceObj)
        await newAttendance.save()
        // Adds 1 to the number of attendances taken for the class
        singleClass.numAttendancesTaken++
        // Adds 1 to the numAttendancesPresent property of every student that was present in this attendance record
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
        req.flash('error', 'Class does not exist' )
        return res.redirect('/class')
    }
    singleClass.studentsInClass = sortAlphabetically(singleClass.studentsInClass)   
    const attendances = await Attendance.find({ class: singleClass._id })
    // Creates a list of the dates the user will not be able to record an attendance record for (because a record has already been recorded for all of these dates)
    if (attendances) {
        notValidDates = attendances.map(entry => moment(entry.date).format('L') )
    }
    // Gets today's date
    const unformattedDate = new Date(Date.now())
    unformattedDate.setDate(unformattedDate.getDate() - 1)
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
        req.flash('error', 'Class does not exist' )
        return res.redirect('/class')
    }
    singleClass.studentsInClass = sortAlphabetically(singleClass.studentsInClass)   
    const attendanceDay = await Attendance.findById(dateId)
    if (!attendanceDay) {
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
        req.flash('error', 'Class does not exist' )
        return res.redirect('/class')
    }
    singleClass.studentsInClass = sortAlphabetically(singleClass.studentsInClass)   
    const attendanceDay = await Attendance.findById(dateId)
    if (!attendanceDay) {
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
        req.flash('error', 'Attendance record does not exist')
        return res.redirect(`/class/${id}/attendance`)
    }
    // Try catch handles if user tries to put information other than student object ids in the studentsPresent array
    try {
        attendanceDay.studentsPresent = studentsPresent
        await attendanceDay.save()
        // Update the numAttendancesPresent property of every student (after we update the attendance record)
        for (let studentEntry of singleClass.studentsInClass) {
            // Find the count of all attendance records of this class where the current student was present 
            studentEntry.numAttendancesPresent = await Attendance.find({ class: singleClass._id, studentsPresent: { $eq: studentEntry.student }}).count()
        }
        await singleClass.save()
    }
    catch(e) {
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
    // Subtract 1 from the number of attendances taken for a class
    singleClass.numAttendancesTaken--
    // Subtract 1 from the numAttendancesPresent property of all students who were present in this deleted attendance record
    for (let studentEntry of singleClass.studentsInClass) {
        if (attendance.studentsPresent.includes(studentEntry.student)) {
            studentEntry.numAttendancesPresent--
        }
    }
    await singleClass.save()
    req.flash('success', 'Successfully deleted attendance record')
    res.redirect(`/class/${id}/attendance`)
}