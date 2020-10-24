const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
const mongoosePaginate = require('mongoose-paginate');

var chatSchema = new mongoose.Schema({
    room: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    }, 
    receiver: {
        type: String,
        required: false
    },
    timestamp: {
        type: String,
        required: true
    }, 
    message: {
        type: String
    }, 
    versionKey: false  
})

chatSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Chat',chatSchema)
