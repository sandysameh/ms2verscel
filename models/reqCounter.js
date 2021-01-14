const mongoose = require('mongoose');

const reqCounter =mongoose.Schema({

    
    counter:{
        unique:true,
        type:Number,
    }

})
module.exports=mongoose.model('ReqCounter',reqCounter);