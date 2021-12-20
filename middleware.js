const myError = require('./utils/myError.js')
const {studentSchema} = require('./joi-schemas.js')
const {classSchema} = require('./joi-schemas.js')

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