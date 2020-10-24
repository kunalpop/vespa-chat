const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
var User = mongoose.model('User')
const session = require('express-session')
const CryptoJS = require('crypto-js')
var flash = require('connect-flash')
const uuid = require('uuid')

var room = ""

//Get Login
router.get('/:room',(req,res,next) => {
    room = req.params.room
    if(req.session.user){
        res.redirect(`/profile/${req.session.user.username}`)//session
    }else{
        res.render('login',{messages:[]})
    }
})

//Get Login
router.get('/',(req,res,next) => {
    room = ""
    if(req.session.user){
        res.redirect(`/profile/${req.session.user.username}`)//session
    }else{
        msgs = req.flash('err')
        console.log(msgs)
        res.render('login',{messages:msgs})
    }
})

//Post login page
router.post('/',(req,res,next) => {
    validateUser(req,res)
})

const decryptWithAES = ciphertext => {
    const passphrase = '123';
    const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
}

function validateUser(req,res){
    
    User.findOne({username:req.body.unm},function(err,userExists){
        if(err){
            req.flash('err',"Entered username does not exist. Please sign up!")
            res.redirect('login')
        } 
        if(userExists){
            if(req.body.pwd == decryptWithAES(userExists.passwd)){
                req.session.user = userExists
                if(room==""){
                    roomID = uuid.v1()
                    req.session.room = roomID
                }else{
                    req.session.room = room
                }
                console.log(`User: ${userExists.username}, logged in room: ${req.session.room}`)//session
                res.redirect(`profile/${userExists.username}`)
            }else{
                req.flash('err',"Login credentials are inconsistent. Please check!")
                res.redirect('login')
            }
        }else{
            req.flash('err',"Entered username does not exist. Please sign up!")
            res.redirect('login')
        }
    })
}

function getNewRoomID(rooms){
    n = Math.round(Math.random()*1000)
    if(rooms.includes(n)){
        getNewRoomID(rooms)
    }else{
        return(n)
    }
}

module.exports = router