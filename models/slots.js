const mongoose = require('mongoose');

const slots =mongoose.Schema({

    id:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },

    slotday:{
        type:String,
       // required:true,
        enum: ['Monday', 'Tuesday','Wednesday','Thursday','Saturday','Sunday']
    },
    slottime:{
        type:String,
       // required:true,
        enum: ['1st', '2nd','3rd','4th','5th']
    },
    teachingid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    },
    location:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
    },
    slottype:{
        type:String,
        //required:true,
        enum: ['tutorial', 'lecture','lab']
    },
    assigned:{
        type:Boolean,
       // required:true,
        default:false
    },
    courseId:{

        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
       
    },
    replacementId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    },

    replacementDate: {
        type: String 
    }
})

module.exports=mongoose.model('Slot', slots);