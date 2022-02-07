const mongoose = require('mongoose')
const {Schema} = mongoose
const passportLocalMongoose = require('passport-local-mongoose')

const capitalize = function (value) {
            let temp = value
            return temp.charAt(0).toUpperCase() + temp.slice(1)
        }

const userSchema = new Schema({
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

userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', userSchema)
