const express = require('express')
const router = express.Router()
const session = require('express-session');
const CryptoJS = require('crypto-js');


//Get home page
router.get('/',(req,res,next) => {
    if(req.session.user){
        res.redirect(`profile/${req.session.user.username}`)
    }else{
        res.render('index')
    }
})

const decryptWithAES = ciphertext => {
    const passphrase = '123';
    const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
}

module.exports = router