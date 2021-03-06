const mongoose = require('mongoose')
const {Schema} = mongoose

const replaceWhitespace = function (value) {
            let temp = value
            return temp.replace(/\s+/g, '')
        }

const classSchema = new Schema({
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher'
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
    year: {
        type: Number,
        require: true,
        enum: [2022, 2023]
    },
    subject: {
        type: String,
        required: true,
        enum: ['General','Computer Science', 'Mathematics', 'Political Science', 'History', 'Communications', 'Psychology', 'English', 'Education', 'Physics', 'Music']
    },
    studentsInClass: [{
    student: {
        type: Schema.Types.ObjectId,
        ref: 'Student'
    },
    numAttendancesPresent: {
        type: Number,
        default: 0
    }
}],
    numAttendancesTaken: {
        type: Number,
        default: 0
    }
})

classSchema.virtual('numStudentsInClass').get(function () {
    return this.studentsInClass.length
})

// Index made so two classes cannot have same classCode and section
classSchema.index({ classCode: 1, section: 1 }, { unique: true })

// If we delete a Class we delete all the attendances associated with this class
classSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await mongoose.model('Attendance').deleteMany({ class: doc })
    }
})


module.exports = mongoose.model('Class', classSchema)