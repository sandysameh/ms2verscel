const Joi = require('joi')

const schemamember = Joi.object({

    name: Joi.string().required(),
    email: Joi.string().email().required(),
    id: Joi.string(),
    password: Joi.string(),
    initial_salary: Joi.number().min(0),
    gender: Joi.string().valid('Female', 'Male').required(),
    role: Joi.string().valid('Teaching assistant', 'Course Instructor', 'HOD', 'Course coordinator', 'HR').required(),
    dayoff: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday', 'Sunday'),
    deducted_salry: Joi.number().min(0),
    bio: Joi.string().allow(""),
    office: Joi.string(),
    faculty: Joi.string().allow(""),
    department: Joi.string().allow(""),

});



const schemamember2 = Joi.object({

    name: Joi.string().allow(''),
    gender: Joi.string().valid('Female', 'Male').allow(''),
    role: Joi.string().valid('Teaching assistant', 'Course Instructor', 'HOD', 'Course coordinator', 'HR').allow(''),
    office: Joi.string().allow(''),
    bio: Joi.string().allow(''),
    faculty: Joi.string().allow(''),
    department: Joi.string().allow(''),
    salary: Joi.number()

});


const schemalocation = Joi.object({


    locname: Joi.string().required(),
    capacity: Joi.number().required(),
    loctype: Joi.string().valid('lecture hall', 'tutorial room','offices','lab').required(),


});
const schemalocation2 = Joi.object({


    locname: Joi.string().allow(""),
    capacity: Joi.number().min(0),
    loctype: Joi.string().valid('lecture hall', 'tutorial room','offices','lab'),


});

const schemafaculty = Joi.object({


    name: Joi.string().required(),



});




const schemadepartment = Joi.object({


    name: Joi.string().required(),
    facultyname: Joi.string(),
    // head: Joi.string(),


});
const schemadepartment2 = Joi.object({


    name: Joi.string().allow(""),
    facultyname: Joi.string(),
   // head: Joi.string(),


});



const schemacourse = Joi.object({


    id: Joi.string().required(),
    name: Joi.string().required(),
    departments_course:Joi.array().items(Joi.string()),



});



const schemacourse2 = Joi.object({


    id: Joi.string().allow(""),
    name: Joi.string(),
    departments_course:Joi.array().items(Joi.string()),


});


const schemamiss = Joi.object({


    month: Joi.number().required().min(1).max(12),
    year: Joi.number().required()


});


const schemasalary = Joi.object({


    salary: Joi.number().required(),



});


const schemasign = Joi.object({


    month: Joi.number().required().min(1).max(12),
    year: Joi.number().required(),
    day:Joi.number().required().min(1).max(31),
    hour:Joi.number().required().min(7).max(19),
    min:Joi.number().required().min(0).max(59),


});






module.exports ={schemamember,schemamember2,schemalocation,schemalocation2,schemafaculty,schemadepartment,schemadepartment2,schemacourse,schemacourse2,schemamiss,schemasalary,schemasign}