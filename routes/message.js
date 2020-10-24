const express = require('express')
const router = express.Router()
//const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
const mongoose = require('mongoose')
var Chat = mongoose.model('Chat')
const datetime = require('node-datetime')
var localStorage = require('localStorage')

//Get messenger page
router.get('/',async (req,res,next) => {
    var today = new Date()
    var date =  datetime.create().format('W, D n')

    Chat.paginate({$or: [{sender: req.session.user.username},{receiver:req.session.user.username}]}, { page: 1, limit: limChat }, function(err, posts) {
        res.render("message",{username:req.session.user.username,date:date,room:req.session.room,chats:posts.docs,time1:datetime.create().format('n D Y I:M p'),time2:""})
    })

})


module.exports = router