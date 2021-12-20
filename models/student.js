const mongoose = require('mongoose')
const {Schema} = mongoose
const Class = require('./class.js')

const studentSchema = mongoose.Schema({
    studentId:{
        type: String,
        required: true,
        unique: true
    },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    classesEnrolled:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Class'
        }
    ]
})

studentSchema.index({studentId: 'text', firstName: 'text', lastName: 'text'})

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



module.exports = mongoose.model('Student', studentSchema)