const mongoose = require('mongoose');

const locations =mongoose.Schema({

    locname:{
        type:String,
        required:true,
        lowercase:true,
        unique:true
    },
    capacity:{
        type:Number,
        required:true
    },
    loctype:{
        type:String,
        required:true,
        enum: ['lecture hall', 'tutorial room','offices','lab']

    }


})
module.exports=mongoose.model('Location',locations);