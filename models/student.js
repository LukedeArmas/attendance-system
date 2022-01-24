const mongoose = require('mongoose')
const {Schema} = mongoose
const Class = require('./class.js')
const uniqueValidator = require('mongoose-unique-validator')

const replaceWhitespace = function (value) {
            let temp = value
            return temp.replace(/\s+/g, '')
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
        set: replaceWhitespace
    },
    lastName:{
        type: String,
        required: true,
        trim: true,
        set: replaceWhitespace
    },
    classesEnrolled:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Class'
        }
    ]
})

// Index made for searching students
studentSchema.index({studentId: 'text', firstName: 'text', lastName: 'text'})

// If we delete a student we remove the student from all of his or her classes
studentSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Class.updateMany({
            _id: {
                $in: doc.classesEnrolled
            }
        },
        {$pull: {studentsInClass: doc._id}}
        )
        .then(m => console.log("The student was deleted from all its classes after we deleted the student", m))
    }
})

studentSchema.plugin(uniqueValidator, { message: 'Student already exists'})

module.exports = mongoose.model('Student', studentSchema)