const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    passwd: {
        type: String,
        required: true
    }, 
    versionKey: false  
})

mongoose.set('useCreateIndex', true)
userSchema.plugin(uniqueValidator)
userSchema.index({ username: 1}, { unique: true })

module.exports = mongoose.model('User',userSchema)
