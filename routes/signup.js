const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
var User = mongoose.model('User')
const session = require('express-session')
const CryptoJS = require('crypto-js')
var flash = require('connect-flash')

//Get signup page
router.get('/',(req,res,next) => {
    if(req.session.user){
        req.session.reload(function(err) {
            res.redirect(`/profile/${req.session.user.username}`)//session
        })
    }else{
        msgs = req.flash('err')
        res.render('signup',{messages:msgs})
    }
})

//Post signup page
router.post('/',(req,res,next) => {
    insertUser(req,res)
})

const encryptWithAES = text => {
    const passphrase = '123';
    return CryptoJS.AES.encrypt(text, passphrase).toString();
}
  
  const decryptWithAES = ciphertext => {
    const passphrase = '123';
    const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
}

function insertUser(req,res){

    User.findOne({username:req.body.unm},function(err,userExists){
        if(err) console.log(err)
        if(userExists){
            req.flash('err',"This username is taken. Choose a different one.")
            res.redirect('signup')
        }else{
            if(req.body.pwd === req.body.cpwd){
               
                var user = new User()
                user.username = req.body.unm
                user.passwd = encryptWithAES(req.body.pwd)

                console.log(user)
                //Save the username and password
                user.save((err,doc) => {
                    if (err) return console.log(err)
                })

                req.session.user = user
                req.session.room = req.body.unm
                console.log(`${user.username} is signed up`)//session
                res.redirect(`profile/${user.username}`)//session
            }else{
                req.flash('err',"Password and confirm password did not match. Try again.")
                res.redirect('signup')
            }    
        }
    })

    
}

module.exports = router
