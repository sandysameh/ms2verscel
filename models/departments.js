const mongoose = require('mongoose');

const departments =mongoose.Schema({

    
    name:{
        type:String,
        lowercase:true,
        unique:true,
        required:true
    },
    faculty:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty'
    },   
    head:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    }

})
module.exports=mongoose.model('Department',departments);