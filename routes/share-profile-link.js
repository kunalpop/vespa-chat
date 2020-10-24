const express = require('express')
const router = express.Router()
var ip = require('ip')

//Get share-link page
router.get('/',(req,res,next) => {

    if(req.session.user){
        lnk = `${ip.address()}:5000/login/${req.session.room}`
        res.render('share-profile-link',{link:lnk,username:req.session.user.username,room:req.session.room})
    }

    res.redirect('/home')
})

module.exports = router