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
        ],
       percentagePresent: {
           type: Number,
           default: 0,
           required: true
       },
    //    We're including this in case we add students mid way through the course. It would affect the percentage of students present if we used the number of students currently in the class instead of the number of students in the class when the attendance was taken (this honestly may be beyond the scope of this project but we'll see. There's the whole other issue of tracking an individual student's attendance if they are added midway through the course. This may not be feasible which is why colleges usually don't start attendance until the student list is finalized)
       numStudentsInClass: {
           type: Number,
           required: true
       }
})

module.exports = mongoose.model('Attendance', attendanceSchema)