const mongoose = require('mongoose');

const requests =mongoose.Schema({

    id:{
        type:String,
        required:true
    },
    reqtype:{
        type:String,
        required:true,
        enum: ['Leave', 'Change day off','Slot-linking','Replacement']
    },
    leavetype:{
        type:String,
        enum: ['Compensation', 'Annual','Sick','Maternity','Accidental']
    },
    status:{
        type:String,
        enum: ['Accepted', 'Pending','Rejected'],
        default:'Pending'
    },
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required:true
    },
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    },    
    replacements:[{ //all replacements requests to be sent with annual leave request
        type: String
    }],
    date:{   //leave day,replacement day
        type: String
    },
    weekday:{   //change day off, slot-linking
        type:String,
        enum: ['Monday', 'Tuesday','Wednesday','Thursday','Saturday','Sunday']
    },
    compensationDate:{   //leave day,replacement day
        type:String
    },
    comment:{   //“change day off/leave”
        type:String
    },
    slottime:{
        type:String,
        enum: ['1st', '2nd','3rd','4th','5th']
    },
    slottype:{
        type:String,
        //required:true,
        enum: ['tutorial', 'lecture','lab']
    },
    course:{    //slot-linking, replacement
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    reason:{    //change day off
        type:String
    },
    document :{
        type: String
    },slottype:{
        type:String,
        //required:true,
        enum: ['tutorial', 'lecture','lab']
    }
    


})
module.exports=mongoose.model('Request',requests);