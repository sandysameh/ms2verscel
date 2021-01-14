const mongoose = require('mongoose');


const courses =mongoose.Schema({

    id:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    name:{
        type:String,
        required:true,
        lowercase:true
    },
    coordinator:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    },
    departments:[{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Department' 
    }],
    teachingassistants:[{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Member' 
    }],
    instructors:[{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Member' 
    }],
    slots:[{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Slot' 
    }]


})
module.exports=mongoose.model('Course',courses);