const myError = require('./utils/myError.js')
const {studentSchema} = require('./joi-schemas.js')
const {classSchema} = require('./joi-schemas.js')
const Class = require('./models/class.js')

module.exports.validateStudent = (req, res, next) => {
    const {error} = studentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new myError(400, msg);
    }
    else {
        return next()
    }
};

module.exports.validateClass = (req, res, next) => {
    const {error} = classSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new myError(400, msg);
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
    if (studentList.every(elementId => !(singleClass.studentsInClass.includes(elementId))) === false) {
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
    if (studentList.every(elementId => singleClass.studentsInClass.includes(elementId)) === false) {
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