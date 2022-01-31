const mongoose = require('mongoose')
const {Schema} = mongoose
const asyncError = require('../utils/asyncError.js')
const uniqueValidator = require('mongoose-unique-validator')

const replaceWhitespace = function (value) {
            let temp = value
            return temp.replace(/\s+/g, '')
        }

const classSchema = new Schema({
    teacher: {
        type: String,
        required: true,
        trim: true
    },
    className: {
        type: String,
        required: true,
        trim: true
    },
    classCode: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        set: replaceWhitespace
    },
    section: {
        type: Number,
        required: true,
        enum: [1,2,3,4]
    },
    subject: {
        type: String,
        required: true,
        enum: ['General','Computer Science', 'Mathematics', 'Political Science', 'History']
    },
    studentsInClass: [{
    student: {
        type: Schema.Types.ObjectId,
        ref: 'Student'
    },
    attendancePercentage: {
        type: Number,
        default: 0
    }
}]
})

classSchema.virtual('numStudentsInClass').get(function () {
    return this.studentsInClass.length
})


// Index made for composite uniqueness check
classSchema.index({ classCode: 1, section: 1 }, { unique: true })

// Index made for searching classes
classSchema.index({teacher: 'text', className: 'text', classCode: 'text', subject: 'text'})

// If we delete a Class we delete all the attendances associated with this class
classSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await mongoose.model('Attendance').deleteMany({ class: doc }).then(m => console.log("All of the attendances associated with this class were deleted after this class was deleted"))
    }
})

module.exports = mongoose.model('Class', classSchema)