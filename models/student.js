const mongoose = require('mongoose')
const {Schema} = mongoose
const Class = require('./class.js')
const Attendance = require('./attendance.js')
const uniqueValidator = require('mongoose-unique-validator')

const replaceWhitespace = function (value) {
            let temp = value
            return temp.replace(/\s+/g, '')
        }

const replaceWhitespaceAndCapitalize = function (value) {
    let temp = value
    temp = temp.replace(/\s+/g, '')
    return temp.charAt(0).toUpperCase() + temp.slice(1)
}

const studentSchema = mongoose.Schema({
    studentId:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        set: replaceWhitespace
    },
    firstName:{
        type: String,
        required: true,
        trim: true,
        set: replaceWhitespaceAndCapitalize
    },
    lastName:{
        type: String,
        required: true,
        trim: true,
        set: replaceWhitespaceAndCapitalize
    }
})

// Index made for searching students
studentSchema.index({studentId: 'text', firstName: 'text', lastName: 'text'})

// If we delete a student we remove the student from all of his or her classes and attendance records
studentSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Class.updateMany({
            'studentsInClass.student': {
                $eq: doc
            }
        },
        { $pull: { studentsInClass: { student: { $eq: doc } } } },
        {runValidators: true, new: true}
        )
        await Attendance.updateMany({
            studentsPresent: {
                $eq: doc
            }
        },
        { $pull: { studentsPresent: doc._id } },
        {runValidators: true, new: true}
        )
    }
})

studentSchema.plugin(uniqueValidator, { message: 'Student already exists'})

module.exports = mongoose.model('Student', studentSchema)