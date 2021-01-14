const mongoose = require('mongoose');



const signinglist = mongoose.Schema({
    signtype:{type:String,enum:["signin","signout"]},
    created:String
   
})

const members =mongoose.Schema({
name:{
    type:String,
    required:true,
    lowercase:true
},
email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true
},
id:{
    type:String,
    required:true,
    unique:true,
    lowercase:true

},
password:{
    type:String,
    default:'123456',
    minLength:6
},
gender:{
    type: String,
    required: true,
    enum :['Female' , 'Male'],
   // lowercase: true

},
initial_salary:{
    type:Number,
    min:0
},
role:{
    type:String,
    enum: ['Teaching assistant', 'Course Instructor','HOD','Course coordinator','HR']//?? remove hod , course co.
},
dayoff:{
    type:String,
    enum: ['Monday', 'Tuesday','Wednesday','Thursday','Saturday','Sunday'],
    default: 'Saturday'
},
officelocation:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
},
faculty:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty'
},
department:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
},
deducted_salry:{
    type:Number,
    min: 0
},
bio:{
    type:String
},
annualLeaveBalance: {
    type : Number , 
    min : 0
},
accidentalLeaveBalance: {
    type : Number , 
    default:6,
    min : 0
},
notifications :[{
    type : String 
}],
signinglist:[signinglist],
});

module.exports=mongoose.model('Member',members);