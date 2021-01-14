const mongoose = require('mongoose');

const slotsCounter =mongoose.Schema({

    
    counter:{
        unique:true,
        type:Number,
    }

})
module.exports=mongoose.model('SlotsCounter',slotsCounter);