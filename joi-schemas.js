const Joi = require('joi')

module.exports.studentSchema = Joi.object({
    student: Joi.object({
        studentId: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required()
    })
})

module.exports.classSchema = Joi.object({
    myClass: Joi.object({
        teacher: Joi.string().required(),
        className: Joi.string().required(),
        classCode: Joi.string().required(),
        section: Joi.number().required().valid(1,2,3,4),
        subject: Joi.string().required().valid('General','Computer Science', 'Mathematics', 'Political Science', 'History')
    })
})