const originalJoi = require('joi')
const sanitizeHTML = require('sanitize-html')

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                })
                if (clean !== value) return helpers.error('string.escapeHTML', {value})
                return clean
            }
        }
    }
})

const Joi = originalJoi.extend(extension)


module.exports.studentSchema = Joi.object({
    student: Joi.object({
        studentId: Joi.string().required().escapeHTML(),
        firstName: Joi.string().required().escapeHTML(),
        lastName: Joi.string().required().escapeHTML()
    })
})

module.exports.classSchema = Joi.object({
    myClass: Joi.object({
        teacher: Joi.string().required().escapeHTML(),
        className: Joi.string().required().escapeHTML(),
        classCode: Joi.string().required().escapeHTML(),
        section: Joi.number().required().valid(1,2,3,4),
        subject: Joi.string().required().valid('General','Computer Science', 'Mathematics', 'Political Science', 'History').escapeHTML()
    })
})