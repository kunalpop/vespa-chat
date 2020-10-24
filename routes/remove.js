const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
var User = mongoose.model('User')

//Remove
router.get('/',async(req,res)=>{
    if(req.session.user){
        console.log(`Deleted user: ${req.session.user.username}`)
        try{
            await User.deleteOne({username:req.session.user.username})
        }catch(err){
            res.send(err)
        }
        req.session.destroy((err) => {
            res.redirect('/') 
        })
    }
    
})

module.exports = router