const originalJoi = require('joi').extend(require('@joi/date'))
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
        firstName: Joi.string().required().escapeHTML(),
        lastName: Joi.string().required().escapeHTML()
    }).required(),
    middleName: Joi.string().required().escapeHTML()
})

module.exports.classSchema = Joi.object({
    myClass: Joi.object({
        teacher: Joi.string().required().escapeHTML(),
        className: Joi.string().required().escapeHTML(),
        classCode: Joi.string().required().escapeHTML(),
        section: Joi.number().required().valid(1,2,3,4),
        subject: Joi.string().required().valid('General','Computer Science', 'Mathematics', 'Political Science', 'History', 'Communications', 'Psychology', 'English', 'Education', 'Physics', 'Music').escapeHTML(),
        year: Joi.number().required().valid(2022, 2023)
    }).required()
})

module.exports.attendanceSchema = Joi.object({
    date: Joi.date().format('MM/DD/YYYY').max('now').required().error(errors => {
    errors.forEach(err => {
      switch (err.code) {
        case "any.empty":
          err.message = "Date must have a value";
          break
        case "date.format":
          err.message = 'A date must be provided and formatted as so: "MM/DD/YYYY"';
          break
        case "date.max":
          err.message = "Attendance can only be taken up until today's date";
          break
        default:
          break
      }
    });
    return errors;
  }),
    studentsPresent: Joi.array()
})

