const Joi = require('joi');
const schemaslot = Joi.object({ 

   
    slotday:Joi.string().valid('Monday', 'Tuesday','Wednesday','Thursday','Saturday','Sunday').required(),
slottime:Joi.string().valid( '1st', '2nd','3rd','4th','5th').required(),
slottype:Joi.string().valid( 'tutorial', 'lecture','lab').required(),

assigned:Joi.boolean(),
replacementDate:Joi.date(),

locname:Joi.string().required(),
courseid:Joi.string().required(),



}); 



const schemaslot2 = Joi.object({ 

    id: Joi.string().case('lower'),
    slotday:Joi.string().valid('Monday', 'Tuesday','Wednesday','Thursday','Saturday','Sunday'),
slottime:Joi.string().valid( '1st', '2nd','3rd','4th','5th'),
slottype:Joi.string().valid( 'tutorial', 'lecture','lab'),

assigned:Joi.boolean(),
replacementDate:Joi.date(),




locname:Joi.string(),
courseid:Joi.string(),





}); 

module.exports = {schemaslot,schemaslot2}

