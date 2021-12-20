const mongoose = require('mongoose')
const {Schema} = mongoose

const classSchema = new Schema({
    teacher: {
        type: String,
        required: true
    },
    className: {
        type: String,
        required: true,
        unique: true
    },
    classCode: {
        type: String,
        required: true,
        unique: true
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
    studentsInClass: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Student'
        }
    ],
    attendance: [
        {
            date: {
                type: Date,
                required: true
            },
            studentsPresent: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'Student',
                }
            ]
        }
    ]
})

classSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await mongoose.model('Student').updateMany({
            _id: {
                $in: doc.studentsInClass
            }
        },
        {$pull: {classesEnrolled: doc._id}}
        )
        .then(m => console.log("The Class was removed from our student after we deleted the class", m))
    }
})


module.exports = mongoose.model('Class', classSchema)