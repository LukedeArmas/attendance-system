const mongoose = require('mongoose')
const {Schema} = mongoose
const passportLocalMongoose = require('passport-local-mongoose')

const capitalize = function (value) {
            let temp = value
            return temp.charAt(0).toUpperCase() + temp.slice(1)
        }

const teacherSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        set: capitalize
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        set: capitalize
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
})

teacherSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`
})

// If we delete a Teacher we delete all the classes taught by that teacher 
// We have to delete the classes one by one so the findOneAndDelete Class middleware runs. This middleware deletes all attendance records associated with the deleted Class
teacherSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        const classes = await mongoose.model('Class').find({ teacher: doc })
        for (let singleClass of classes) {
            await mongoose.model('Class').findByIdAndDelete(singleClass._id)
        }
    }
})

teacherSchema.plugin(passportLocalMongoose)


module.exports = mongoose.model('Teacher', teacherSchema)
