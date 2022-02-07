const Student = require('../models/student.js')
const Class = require('../models/class.js')
const { checkSearch } = require('../helperFunctions.js')


module.exports.home = async (req, res) => {
    const {search} = req.query
    const query = checkSearch(search)
    const students = await Student.find(query)
    res.render('student-pages/home', {students, query})
}

module.exports.post = async (req, res) => {
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
}

module.exports.new =  (req, res) => {
    res.render('student-pages/new')
}

module.exports.show = async (req, res, next) => {
    const {id} = req.params
    const student = await Student.findById(id)
    // This is how you query for documents that have an array of embedded documents where at least one of the sub documents contains our match
    const classes = await Class.find({ 'studentsInClass.student': { $eq: student } }).populate('teacher')
    if (!student) {
        // return next(new myError(404, "This student does not exist"))
        req.flash('error', 'Student does not exist')
        return res.redirect('/student')
    }
    res.render('student-pages/show', {student, classes})
}

module.exports.edit = async (req, res) => {
    const {id} = req.params
    const student = await Student.findById(id)
    if (!student) {
        // return next(new myError(404, "This student does not exist"))
        req.flash('error', 'Student does not exist')
        return res.redirect('/student')
    }
    res.render('student-pages/edit', {student})
}

module.exports.put = async (req, res) => {
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
}

module.exports.delete = async (req, res) => {
    const {id} = req.params
    const deletedStudent = await Student.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted student')
    res.redirect('/student')
}