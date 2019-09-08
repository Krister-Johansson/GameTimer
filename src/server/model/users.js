let mongoose = require('mongoose')
let validator = require('validator')

let userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            validate: value => {
                return validator.isEmail(value)
            },
        },
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            validate: value => {
                return validator.isMobilePhone(value)
            },
        },
        time: {
            type: Number,
        },
        company: {
            type: String,
            required: true,
        },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

module.exports = mongoose.model('User', userSchema)
