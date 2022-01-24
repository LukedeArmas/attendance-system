const { boolean } = require('joi')
const mongoose = require('mongoose')
const {Schema} = mongoose
const uniqueValidator = require('mongoose-unique-validator')

const replaceWhitespace = function (value) {
            let temp = value
            return temp.replace(/\s+/g, '')
        }

const attendanceSchema = new Schema({
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
    studentsInClass: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Student'
        }
    ],
    attendance: [attendanceSchema]
})

// Index made for composite uniqueness check
classSchema.index({ classCode: 1, section: 1 }, { unique: true })

// Index made for searching classes
classSchema.index({teacher: 'text', className: 'text', classCode: 'text', subject: 'text'})

// If we delete a Class we remove the class from every student's (who is in the class) classesEnrolled array 
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

// Makes the unique attribute a validator
// classSchema.plugin(uniqueValidator, { message: '{PATH} already exists What is happening'})

module.exports = mongoose.model('Class', classSchema)