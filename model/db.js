const mongoose = require('mongoose')

require('./chat.model')
require('./user.model')

mongoose.connect("mongodb://localhost:27017/VespachatDB",{useNewUrlParser:true,useUnifiedTopology:true}, (err) => {
    if(!err){
        console.log('Mongodb connection succeeded.')
    }else{
        console.log('Error in db connection:'+err)
    }
})



