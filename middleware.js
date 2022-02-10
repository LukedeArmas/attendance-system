const myError = require('./utils/myError.js')
const {studentSchema, classSchema, attendanceSchema } = require('./joi-schemas.js')
const Class = require('./models/class.js')
const Teacher = require('./models/teacher.js')
const mongoose = require("mongoose")


module.exports.validateStudent = (req, res, next) => {
    const {error} = studentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        return next(new myError(400, msg))
    }
    else {
        return next()
    }
};

module.exports.validateClass = (req, res, next) => {
    const {error} = classSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        return next(new myError(400, msg))
    }
    else {
        return next()
    }
};

module.exports.validateAddStudentToClass = async (req, res, next) => {
    const {id} = req.params
    const {studentList} = req.body
    const singleClass = await Class.findById(id)
    if (!studentList) {
        // return next(new myError(500, "Cannot add zero students"))
        req.flash('error', 'Cannot add zero students to a class')
        return res.redirect(`/class/${id}`)
    }
    // Checks if there we are adding students that are already in the class (which we cannot allow). Basically every student in the request body is checked to see if they are in the class already
    if (studentList.every(elementId => !(singleClass.studentsInClass.map((entry) => entry.student.toString()).includes(elementId))) === false) {
        return next(new myError(400, "Cannot add student multiple times to the same class"))
    }
    else {
        return next()
    }
}

module.exports.validateRemoveStudentFromClass = async (req, res, next) => {
    const {id} = req.params
    const {studentList} = req.body
    const singleClass = await Class.findById(id)
    if (!studentList) {
        req.flash('error', 'Cannot remove zero students from a class')
        return res.redirect(`/class/${id}`)        
    }
    // Check every student in the request body and see if they are in the class. We are only allowed to remove the student if they are already in the class
    if (studentList.every(elementId => singleClass.studentsInClass.map((entry) => entry.student.toString()).includes(elementId)) === false) {
        return next(new myError(400, "Cannot remove students who are not a member of the class"))
    }
    else {
        return next()
    }
}

module.exports.validateAttendance = async (req, res, next) => {
    const {error} = attendanceSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        return next(new myError(400, msg))
    }
    else {
        return next()
    }
}

module.exports.objectIdMiddleware = function (req, res, next) {
    try {
        var paramKeys = Object.keys(req.params)
        var validKeys = paramKeys.filter(function (key) {
            var validKey = key.substring(key.lastIndexOf("_") + 1)
            return validKey == "id" || "Id"
        })
        for (let key of validKeys) {
            if (!req.params[key] || !mongoose.Types.ObjectId.isValid(req.params[key])) {
                throw new Error()
            }
        }
    } catch (error) {
        req.flash('error', 'Page cannot be found')
        return res.redirect('/')
    }
    return next()
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // We actually don't need to redirect the user back to their original URL because the user can only use the application if they are logged in
        // req.session.oldUrl = req.originalUrl
        if (req.originalUrl !== '/') {
            req.flash('error', 'You must be logged in!')
        }
        return res.redirect('/login')
    }
    return next()
}

module.exports.verifyTeacher = async (req, res, next) => {
    const { id } = req.params
    const singleClass = await Class.findById(id)
    if (!singleClass) {
        req.flash('error', 'Class does not exist' )
        return res.redirect('/class')
    }
    if (!singleClass.teacher.equals(req.user._id) && req.user.username !== 'admin') {
        req.flash('error', 'Access to this class is denied')
        return res.redirect('/class')
    }
    return next()
}

module.exports.isAdmin = (req, res, next) => {
    if (req.user.username !== 'admin') {
        req.flash('error', 'This is an admin privilege')
        return res.redirect('/')
    }
    return next()
}

module.exports.teacherExists = async (req, res, next) => {
    const teachers = await Teacher.find({ username: { $ne: 'admin' } })
    if (teachers.length < 1) {
        req.flash('error', 'A teacher must be added before a class can be added')
        return res.redirect('/')
    }
    return next()
}