const Joi = require('joi')

const sendslotlinking = Joi.object({
    reqtype:Joi.string().valid( 'Leave', 'Change day off','Slot-linking','Replacement'), 
    slotday: Joi.string().valid('Monday', 'Tuesday','Wednesday','Thursday','Saturday','Sunday'), 
    slottime : Joi.string().valid('1st', '2nd','3rd','4th','5th'), 
    course : Joi.string().allow('') , 
    slottype:  Joi.string().valid('tutorial', 'lecture','lab')
})


const sendChangeDayOff = Joi.object({
    reqtype:Joi.string().valid( 'Leave', 'Change day off','Slot-linking','Replacement'), 
    weekday: Joi.string().valid('Monday', 'Tuesday','Wednesday','Thursday','Saturday','Sunday'), 
    reason : Joi.string().allow('')
})   


const sendSlotReplacement = Joi.object({
    reqtype:Joi.string().valid( 'Leave', 'Change day off','Slot-linking','Replacement'), 
    receiver: Joi.string().allow(''),
    date: Joi.string().allow(''),
    weekday: Joi.string().valid('Monday', 'Tuesday','Wednesday','Thursday','Saturday','Sunday'), 
    slottime : Joi.string().valid('1st', '2nd','3rd','4th','5th'), 
    course : Joi.string().allow('') , 
})


const acceptReplacemant = Joi.object({
    
    requestId : Joi.string() , 
   
})

const rejectReplacemant = Joi.object({
    
    requestId : Joi.string() , 
   
})

const sendLeave = Joi.object({
    reqtype:Joi.string().valid( 'Leave', 'Change day off','Slot-linking','Replacement'), 
    leavetype: Joi.string().valid('Compensation', 'Annual','Sick','Maternity','Accidental'),
    compensationDate: Joi.string().allow(''),
    date: Joi.string().allow(''),
    reason : Joi.string().allow(''), 
    document : Joi.string().allow(''), 
    replacement : Joi.array().items(Joi.string()).allow(''), 
})

const cancelRequest = Joi.object({
    
    requestId : Joi.string() , 
   
})


module.exports ={sendslotlinking , sendChangeDayOff, sendSlotReplacement , acceptReplacemant , rejectReplacemant , sendLeave , cancelRequest}