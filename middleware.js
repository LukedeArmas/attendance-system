const myError = require('./utils/myError.js')
const {studentSchema, classSchema, attendanceSchema, checkDate } = require('./joi-schemas.js')
const Class = require('./models/class.js')
const moment = require('moment')

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
        return next(new myError(500, "Cannot add zero students"))
    }
    // Checks if there we are adding students that are already in the class (which we cannot allow). Basically every student in the request body is checked to see if they are in the class already
    if (studentList.every(elementId => !(singleClass.studentsInClass.map((entry) => entry.student.toString()).includes(elementId))) === false) {
        return next(new myError(500, "Cannot add student multiple times to the same class"))
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
        return next(new myError(500, "Cannot remove no one from a class"))
    }
    // Check every student in the request body and see if they are in the class. We are only allowed to remove the student if they are already in the class
    if (studentList.every(elementId => singleClass.studentsInClass.map((entry) => entry.student.toString()).includes(elementId)) === false) {
        return next(new myError(500, "Cannot remove students who are not a member of the class"))
    }
    else {
        return next()
    }
}

module.exports.checkSearch = (search) => {
    let query = {}
    if (search) {
        query = {$text: {$search: search}}
    }
    return query
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