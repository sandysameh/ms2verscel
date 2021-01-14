const Joi = require('joi');
const assigninstructor = Joi.object({ 

    instructor: Joi.string().required(),
    courseid: Joi.string().required()
}); 


const updateinstructorcourse =  Joi.object({ 

    instructor: Joi.string().required(),
    oldcourse: Joi.string().required(),
    newcourse: Joi.string().required()
}); 


const viewStaffinDepartment =  Joi.object({ 
    courseid: Joi.string()
}); 

const viewDayoff =  Joi.object({ 
    staffid: Joi.string()
}); 

const acceptLeaveRequest =  Joi.object({ 
    request_id: Joi.string().required()
}); 
const rejectHODRequest =  Joi.object({ 
    request_id: Joi.string().required(),
    comment:Joi.string().allow('')
}); 
module.exports = {
    assigninstructor,
    updateinstructorcourse,
    viewStaffinDepartment,
    viewDayoff,
    acceptLeaveRequest,
    rejectHODRequest
};