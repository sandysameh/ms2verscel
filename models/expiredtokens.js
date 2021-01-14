const mongoose =require('mongoose');
const expiredtokens = mongoose.Schema({
   expired:String
   
})

module.exports=mongoose.model('Expiredtoken',expiredtokens)