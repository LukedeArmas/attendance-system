const mongoose = require('mongoose')
const {Schema} = mongoose


const attendanceSchema = new Schema({
    class: {
        type: Schema.Types.ObjectId,
        ref: 'Class'
    },
    dateUpdated: {
        type: Date,
        required: true
    },
    date: {
            type: Date,
            required: true
        },
    studentsPresent: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Student'
        }
    ]
})

attendanceSchema.set('toJSON', { virtuals: true })
attendanceSchema.set('toObject', { virtuals: true })

attendanceSchema.virtual('numStudentsPresent').get(function () {
    return this.studentsPresent.length
})


module.exports = mongoose.model('Attendance', attendanceSchema)