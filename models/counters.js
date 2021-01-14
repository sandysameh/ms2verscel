const mongoose = require('mongoose');

const counters =mongoose.Schema({
    idtype:String,
    count:Number
})
module.exports=mongoose.model('Count',counters);