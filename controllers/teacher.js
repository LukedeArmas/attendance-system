const Class = require('../models/class.js')
const Teacher = require('../models/teacher.js')


module.exports.home = async (req, res, next) => {
    // Find all teachers that are not the admin and sort by last name alphabetically
    const teachers = await Teacher.find({ username: { $ne: 'admin' } }).sort({ lastName: 1 })
    res.render('teacher-pages/home', { teachers })
}

module.exports.post = async (req, res, next) => {
    try {
        const { firstName, lastName, email, username, password } = req.body
        const teacher = new Teacher({ firstName, lastName, email, username })
        // Register method (from passport) creates a hashed password and stores it in the database along with the other properties
        await Teacher.register(teacher, password)
    }
    catch(e) {
        // Custom message if email already exists
        // Duplicate username is already handled by passport
        if (e.message.includes('E11000 duplicate key error collection: attendance.teachers index: email_1 dup key:')) {
            req.flash('error', 'Email already exists')
        } else {
            req.flash('error', e.message)
        }
        return res.redirect('/teacher/new')
    }
    req.flash('success', 'Successfully added teacher')
    res.redirect('/teacher')
}

module.exports.new = (req, res, next) => {
    res.render('teacher-pages/new')
}

module.exports.show = async (req, res, next) => {
    const { id } = req.params
    const teacher = await Teacher.findById(id)
    if (!teacher) {
        req.flash('error', 'Teacher does not exist')
        return res.redirect('/teacher')
    }
    // Find all classes the teacher teaches
    const classes = await Class.find({ teacher: teacher._id })
    res.render('teacher-pages/show', { teacher, classes })
}

module.exports.edit = async (req, res, next) => {
    const { id } = req.params
    const teacher = await Teacher.findById(id)
    if (!teacher) {
        req.flash('error', 'Teacher does not exist')
        return res.redirect('/teacher')
    }
    res.render('teacher-pages/edit', { teacher })
}

module.exports.put = async (req, res, next) => {
    const { id } = req.params
    const { firstName, lastName, email, username } = req.body
    try {
        await Teacher.findByIdAndUpdate(id, { firstName: firstName, lastName: lastName, email: email, username: username}, {runValidators: true, new: true })
    }
    // Custom error messages for duplicate email or username
    catch(e) {
        if (e.message.includes('Plan executor error during findAndModify :: caused by :: E11000 duplicate key error collection: attendance.teachers index: email_1 dup key:')) {
            req.flash('error', 'Email already exists')
        } else if (e.message.includes('Plan executor error during findAndModify :: caused by :: E11000 duplicate key error collection: attendance.teachers index: username_1 dup key:')) {
            req.flash('error', 'Username already exists')
        } else {
            req.flash('error', e.message)
        }
        return res.redirect(`/teacher/${id}/edit`)
    }
    req.flash('success', 'Successfully updated teacher')
    res.redirect(`/teacher/${id}`)
}

module.exports.delete = async (req, res, next) => {
    const {id} = req.params
    await Teacher.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted teacher')
    res.redirect('/teacher')
}