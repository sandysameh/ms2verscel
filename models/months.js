const mongoose = require('mongoose');

const months =mongoose.Schema({
    id:String,
    month:Number,//Months start from 1-->Jan 12-->Dec
    year:Number,
    attendeddays:{type:Number,default:0},
    attendedhrsinMin:{type:Number,default:0},
    acceptedleavescount:[{type:Number,default:0}],
    acceptedCompensationscount:[{type:Number,default:0}]

})
module.exports=mongoose.model('Month',months);