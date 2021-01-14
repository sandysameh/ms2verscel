const Joi = require('joi')
//const PasswordComplexity = require('joi-password-complexity')

const logincheck = Joi.object({


    email: Joi.string().email().required(),
    password: Joi.string().required()


});
const resetFirstPasswordcheck = Joi.object({



    email: Joi.string().email().required(),
    oldPassword: Joi.string().required(),
    newPassword:  Joi.string().required().min(8).max(255).uppercase(1).lowercase(1),
    passwordCheck:Joi.string().required()
    // newPassword:  PasswordComplexity(complexity).required(),
    // passwordCheck:Joi.valid(newPassword).required()


})
const resetPassordCheck =Joi.object({
    oldPassword: Joi.string().required(),
    newPassword:  Joi.string().required().min(8).max(255).uppercase(1).lowercase(1),
    passwordCheck:Joi.string().required()
     //newPassword: new PasswordComplexity(complexity).required(),
     //passwordCheck:Joi.valid(newPassword).required()
})
const attendancecheck = Joi.object({
    month: Joi.number().required().min(1).max(12),
    year: Joi.number().required()

})
const missingdayCheck = Joi.object({
    month: Joi.number().required().min(1).max(12),
    year: Joi.number()

})
const updateProfileCheck = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    id: Joi.string(),
    initial_salary: Joi.number(),
    deducted_salry: Joi.number(),
    faculty: Joi.string().allow(""),
    department: Joi.string().allow(""),
    role: Joi.string().allow(""),
    dayoff: Joi.string().allow(""),
    officelocation: Joi.string(),
    bio: Joi.string().allow(""),
    annualLeaveBalance:Joi.number(),
    accidentalLeaveBalance:Joi.number(),
    notifications: Joi.string(),
    signinglist: Joi.string(),
    gender:Joi.string().valid("Female,Male")





})



module.exports = { logincheck, resetFirstPasswordcheck, attendancecheck, missingdayCheck ,updateProfileCheck,resetPassordCheck}