const Class = require('../models/class.js')
const Student = require('../models/student.js')
const Attendance = require('../models/attendance.js')
const Teacher = require('../models/teacher.js')
const { sortAlphabetically } = require('../helperFunctions')


module.exports.home = async (req, res) => {
    // If a teacher is logged in only show classes that they teach
    res.render('class-pages/home', { classes: res.paginatedData, pageLimit: res.pageLimit, count: res.count, page: res.page })
}

module.exports.post = async (req, res, next) => {
    const {myClass} = req.body
    // Add new class
    try {
        const addClass = new Class(myClass)
        await addClass.save()
    }
    catch(e) {
        // Custom error message if the class already exists
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
}

module.exports.new = async (req, res, next) => {
    // Find all teachers that are not the admin so the admin can pick which teacher will be teaching the class
    const teachers = await Teacher.find({ username: { $ne: 'admin' } }).sort({ lastName: 1 })
    res.render('class-pages/new', { teachers })
}

module.exports.show = async (req, res, next) => {
    const {id} = req.params
    // We already check if the class exists in the verifyTeacher middleware
    const singleClass = await Class.findById(id)
    .populate('teacher')
    .populate({
        path: 'studentsInClass', 
        populate: {
            path: 'student',
            model: 'Student'
        }
    })
    singleClass.studentsInClass = sortAlphabetically(singleClass.studentsInClass)
    res.render('class-pages/show', {singleClass})
}

module.exports.edit = async (req, res) => {
    const {id} = req.params
    const singleClass = await Class.findById(id)
    // Find all teachers that are not the admin so the admin can pick which teacher will be teaching the class
    const teachers = await Teacher.find({ username: { $ne: 'admin' } }).sort({ lastName: 1 })
    if (!singleClass) {
        req.flash('error', 'Class does not exist' )
        return res.redirect('/class')
    }
    res.render('class-pages/edit', {singleClass, teachers})
}

module.exports.put = async (req, res) => {
    const {myClass} = req.body
    const {id} = req.params
    try {
        await Class.findByIdAndUpdate(id, myClass, {runValidators: true, new: true})
    }
    catch(e) {
        // Custom error message if the class already exists
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
}

module.exports.delete = async (req, res) => {
    const {id} = req.params
    const deletedClass = await Class.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted class')
    res.redirect('/class')
}

// Stops caching so the page is refreshed if the user clicks the back arrow to go back to this page
module.exports.reloadPage = function(req, res, next) {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
        next()
    }

module.exports.addStudentGet = async (req, res) => {
    const {id} = req.params
    const singleClass = await Class.findById(id)
    if (!singleClass) {
        req.flash('error', 'Class does not exist' )
        return res.redirect('/class')
    }
    // Find all students that are not already in the class (because we only want to add students who are not currently in the class)
    const students = await Student.find({ _id: {$nin: singleClass.studentsInClass.map(entry => entry.student) }}).sort({ studentId: 1 })
    res.render('class-pages/add-students', {singleClass, students })
}

module.exports.addStudentPut = async (req, res, next) => {
    const {id} = req.params
    const {studentList} = req.body
    const singleClass = await Class.findById(id)
    // Add students that were submitted by the admin into the class
    const students = await Student.find({_id: {$in: studentList}})
    for (let i=0; i < students.length; i++) {
        singleClass.studentsInClass.push({student: students[i], attendancePercentage: 0})
    }
    await singleClass.save()
    req.flash('success', 'Successfully added students to class')
    res.redirect(`/class/${id}`)
}

module.exports.removeStudentGet = async (req, res) => {
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
    singleClass.studentsInClass = sortAlphabetically(singleClass.studentsInClass)
    res.render('class-pages/remove-students', {singleClass})
}

module.exports.removeStudentPut = async (req, res, next) => {
    const {id} = req.params
    const {studentList} = req.body
    const singleClass = await Class.findById(id)
    // Remove students from all the attendances of the Class that include the students
    const removeStudentAttendances = await Attendance.find({ class: singleClass._id, studentsPresent: {  $in: studentList } } )
    for (let attendance of removeStudentAttendances) {
        attendance.studentsPresent = attendance.studentsPresent.filter(student => !studentList.includes(student.toString()))
        await attendance.save()
    }
    // Remove students from the Class
    const classAfter = await Class.findByIdAndUpdate(id, {$pull: {studentsInClass: { student: {$in: studentList}}}}, {runValidators: true, new: true})
    // If all students are removed from the class we delete all attendance records from the class
    if (classAfter.studentsInClass.length < 1) {
        await Attendance.deleteMany({ class: classAfter._id })
        classAfter.numAttendancesTaken = 0
        await classAfter.save()
    }
    req.flash('success', 'Successfully removed students from class')
    res.redirect(`/class/${id}`)
}
