const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
var User = mongoose.model('User')
const session = require('express-session');
const CryptoJS = require('crypto-js');

//Get profile page
router.get('/:name/',(req,res,next) => {
    res.render('profile',{username:req.session.user.username,passwd:decryptWithAES(req.session.user.passwd),room:req.session.room})
})

router.post('/:name',async(req,res)=>{
    try{
        unm = req.params.name
        pwd = encryptWithAES(req.body.npwd)
        if(req.session.user){
            req.session.user.passwd = pwd

        await User.updateOne({username:unm}, { passwd: pwd })
    }
    }catch(err){
        console.log(err)
    }

    res.redirect(`/profile/${req.params.name}`)
})


function changePassword(req,res){

    User.updateOne({username: unm}, {
        username: unm, 
        password: pwd, 
    }, function(err, numberAffected, rawResponse) {
       //handle it
    })
}


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

module.exports = router
