const express = require('express')
const router = express.Router()
const session = require('express-session')
const path = require('path')

//Get Checkout
router.get('/',(req,res,next) => {
    res.sendFile(path.join(__dirname, '../views', 'checkout.html'))
})

module.exports = router