const mongoose = require('mongoose');

const faculties =mongoose.Schema({

    
    name:{
        unique:true,
        type:String,
        lowercase:true
    }

})
module.exports=mongoose.model('Faculty',faculties);