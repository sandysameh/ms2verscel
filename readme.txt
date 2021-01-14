Functionality: adding the first HR member in a specific location called admission with capacity 25 in the database
Route: http://localhost:10000/addfirsthr
Request type:POST


1.You should run the index file
2.Port:10000
3.we are using this database : const URL = 'mongodb+srv://Martha:Wowzi@cluster0.z3mgg.mongodb.net/projDB?retryWrites=true&w=majority'

Functionality: add location
Route: http://localhost:10000/addlocation
Request type: POST
Header: auth-token : logged in user token..should be the HR
"\"loctype\" must be one of [lecture hall, tutorial room, offices, lab]"
capacity cannot be negative
locname is unique
Request body:   {
        "locname":"C7.204", 
        "capacity":25,
        "loctype": "tutorial room"
    }
Respone:The added location:
{
    "_id": "5fdfd3f3cc9aa622247f0888",
    "locname": "c7.204",
    "capacity": 25,
    "loctype": "tutorial room",
    "__v": 0
}


Functionality: update location
Route: http://localhost:10000/locations/:locname
E.g. http://localhost:10000/locations/c7.204
Request type: PUT
Header: auth-token : logged user token..should be the HR
location should exist and be one of those ['lecture hall', 'tutorial room','offices','lab']
Request body: 
{
    "locname":"H14",
    "loctype":"lecture hall",
    "capacity": 5
}
Response:updated location:{
    "_id": "5fe51247102581388c6ba086",
    "locname": "h14",
    "capacity": 5,
    "loctype": "lecture hall",
    "__v": 0
}


Example for using request parameters:
Functionality: delete location...also deleted from slots and members from tehir office locations
Route: http://localhost:10000/locations/:locname
e.g. http://localhost:10000/locations/c7.204
Request type: DELETE
Headear: auth-token : logged user token..should be the HR
location should exist BEFOREHAND
Response:The deleted location:
{
    "_id": "5fdfd3f3cc9aa622247f0888",
    "locname": "c7.204",
    "capacity": 113,
    "loctype": "tutorial room",
    "__v": 0
}



Functionality: add a faculty to the system
Route: /addfaculty
"\"name\" is required"
Request type: POST
Request body: {"name": "MET"}
Response: added faculty:
{
    "_id": "5fda75a8d8eee408fc8b4fcf",
    "name": "met",
    "__v": 0
}


Functionality: update a faculty in the system (changing the faculty name in the req.params to the name in the req.body)
Route: /faculties/:name
e.g. : http://localhost:10000/faculties/medicine
Request type: PUT
Request body:  {"name": "med"}
Response:Updated name:
{
    "_id": "5fe5ce0be4115c3ab460f85b",
    "name": "med",
    "__v": 0
}

Functionality: delete a faculty in the system
Route: /faculties/:name
e.g. : http://localhost:10000/faculties/medicine
Request type: DELETE

Response: deleted faculty:
{
    "_id": "5fe5ce90e4115c3ab460f85c",
    "name": "medicine",
    "__v": 0
}



Functionality: add a department in the system
Route: http://localhost:10000/adddepartment

Request type: POST 
Request body:{"name":"cs",
"facultyname":"eng"
}


Response: {
    "_id": "5fe5d0ece4115c3ab460f85d",
    "name": "cs",
    "faculty": "5fe5cdf9e4115c3ab460f859",
    "__v": 0
}



Functionality: UPDATE a department in the system
Route: http://localhost:10000/departments/arch
Request type: PUT
Request body:{"name":"newnamed",
"facultyname":"eng"
}

Header: should have an HR token

Response: the updated faculty with name newnamed and faculty is eng
{
    "_id": "5fe5d1a3e4115c3ab460f860",
    "name": "newnamed",
    "faculty": "5fe5cdf9e4115c3ab460f859",
    "__v": 0
}


Functionality: Delete a department in the system
Route:/departments/:name
e.g. http://localhost:10000/departments/newnamed
Request type:Delete
Request Header:should have an HR token
Response:deleted faculty:
{
    "_id": "5fe5d1a3e4115c3ab460f860",
    "name": "newnamed",
    "faculty": "5fe5cdf9e4115c3ab460f859",
    "__v": 0
}

Functionality: Add a course in the system
Route:http://localhost:10000/addcourse
Request type: POST
Request Header:should have an HR token
//please add reference ids of existing departments!
Request body:
{
    "id":"csen1021000",
    "name":"Data Structures",
    "departments_course":["5fe5d147e4115c3ab460f85e","5fe5d0ece4115c3ab460f85d"]
}
Response:Added course:
{
    "departments": [
        "5fe5d147e4115c3ab460f85e",
        "5fe5d0ece4115c3ab460f85d"
    ],
    "teachingassistants": [],
    "instructors": [],
    "slots": [],
    "_id": "5fe61d60a2b0e12324b9c821",
    "id": "csen1021000",
    "name": "data structures",
    "__v": 0
}


Functionality: Update a course in the system
Route:http://localhost:10000/courses/:id
e.g. http://localhost:10000/courses/csen1021000
Request type: PUT
Request Header:should have an HR token
//please add reference ids of existing departments!
Request body:
{
    "id":"csen1021000",
    "name":"new name for course",
    "departments_course":["5fe5d0ece4115c3ab460f85d","5fe5d176e4115c3ab460f85f"]

}
Response:updated course:
{
    "departments": [
        "5fe5d0ece4115c3ab460f85d",
        "5fe5d176e4115c3ab460f85f"
    ],
    "teachingassistants": [],
    "instructors": [],
    "slots": [],
    "_id": "5fe61d60a2b0e12324b9c821",
    "id": "csen1021000",
    "name": "new name for course",
    "__v": 1
}

Functionality: Delete a course in the system
Route:http://localhost:10000/courses/:id
e.g.http://localhost:10000/courses/csen10210001
Request type: Delete
Request Header:should have an HR token

Response:{
    "departments": [
        "5fdb761b4fd67e25c021b327",
        "5fdb763c4fd67e25c021b328"
    ],
    "teachingassistants": [],
    "instructors": [],
    "_id": "5fdb973825db6352785c0f43",
    "id": "csen10210001",
    "name": "new name",
    "slots": [],
    "__v": 0
}


Functionality: Add a member in the system
Route:http://localhost:10000/addmember
Request type: POST
Request Header:should have an HR token
//please add the refernce of an existing department as he/she will be assigned as head of this department..This can be done in add or in the update member
//you have to add a department for this member to be HOD
Request body:Assigning an HOD by adding one:
{
    "name":"taa",
    "role":"HOD",
    "email":"EM1@gmail.com",
    "initial_salary":2001,
   "office":"admission",
     "bio":"testing any extra info",
    "gender":"Female",
    "department":"5fe5d176e4115c3ab460f85f"
}
Response:{
    "password": "$2a$10$mdLy02Vama7QSYbBY/sKd.U8uDDva.qYmqS1O7WguryNrUF4c33Mu",
    "dayoff": "Saturday",
    "accidentalLeaveBalance": 6,
    "notifications": [],
    "_id": "5fe5d876e4115c3ab460f86e",
    "id": "ac-2",
    "name": "taa",
    "email": "em1@gmail.com",
    "initial_salary": 2001,
    "role": "HOD",
    "gender": "Female",
    "department": "5fe5d176e4115c3ab460f85f",
    "officelocation": "5fe5caecbebd7915880be56a",
    "bio": "testing any extra info",
    "annualLeaveBalance": 2.5,
    "signinglist": [],
    "__v": 0
}

Adding an HR:
Request body:
{
    "name":"fou hr",
    "role":"HR",
    "email":"Email@gmail.com",
    "initial_salary":2001,
   "office":"admission",
     "bio":"testing any extra info",
    "gender":"Male"
}
Response :the added HR member:
{
    "password": "$2a$10$DyAAn7wVB41pF4yjR6ri5uWF/fABZ9eWC5w9C2IxTg7DkrpC6N9aa",
    "dayoff": "Saturday",
    "accidentalLeaveBalance": 6,
    "notifications": [],
    "_id": "5fe5d520e4115c3ab460f86a",
    "id": "hr-5",
    "name": "fou hr",
    "email": "email@gmail.com",
    "initial_salary": 2001,
    "role": "HR",
    "gender": "Male",
    "officelocation": "5fe5caecbebd7915880be56a",
    "bio": "testing any extra info",
    "annualLeaveBalance": 2.5,
    "signinglist": [],
    "__v": 0
}

Functionality: Update member in the system
Route:http://localhost:10000/updatemember/:id
e.g. http://localhost:10000/updatemember/hr-6
Request type: PUT
Request Header:should have an HR token
//please add an existing Object ID for faculty and department
//you can also assign HOD through updating the member by adding the role as "HOD" and the department as an ObjectID in department field so he will be assigned to it
Request body:{
    "name":"Abla" , 
    "office":"c3.102", 
    "faculty":"5fdbdcde66be1d21e09930f6", 
    "department":"5fdb761b4fd67e25c021b327" ,
    "bio":"this is the updated bio",
    "gender":"Male"
}
Response:
{
    "password": "$2a$10$u/4KDLSc6sF8Sbe2jcj2CeXZ.RZPnIeQ6tadpoHaf1r7KLa1p.yhK",
    "dayoff": "Saturday",
    "accidentalLeaveBalance": 6,
    "notifications": [],
    "_id": "5fe5d6cae4115c3ab460f86d",
    "id": "hr-6",
    "name": "abla",
    "email": "emailhr@gmail.com",
    "initial_salary": 2001,
    "role": "HR",
    "gender": "Male",
    "department": "5fdb761b4fd67e25c021b327",
    "officelocation": "5fe5ccfae4115c3ab460f858",
    "bio": "this is the updated bio",
    "annualLeaveBalance": 2.5,
    "signinglist": [],
    "__v": 0,
    "faculty": "5fdbdcde66be1d21e09930f6"
}
//you can also assign HOD through updating the member by adding the role as "HOD" and the department as an ObjectID in department field so he will be assigned to it
http://localhost:10000/updatemember/ac-8
Request body:{
    
    
    "role":"HOD",
    "department":"5fe62d24ae14044f5c5aa771",
    "bio":"this is the updated bio",
    "gender":"Male"
}
Response:
{
    "password": "$2a$10$nbhWAWXM94dbquCkC6/naOy/Pre1IcPXX0nfhcJV5xZwuSsUNILbW",
    "dayoff": "Sunday",
    "accidentalLeaveBalance": 4,
    "notifications": [
        "Your Leave Request to Id ac-1 On Sun Dec 27 2020 02:00:00 GMT+0200 (Eastern European Standard Time) has been accepted",
        "Your Leave Request to Id ac-1 On Wed Dec 09 2020 00:00:00 GMT+0200 (Eastern European Standard Time) has been accepted",
        "Your Leave Request to Id ac-1 On Tue Sep 07 2021 00:00:00 GMT+0200 (Eastern European Standard Time) has been accepted",
        "Your Leave Request to Id ac-1 On Sun Feb 09 2020 02:00:00 GMT+0200 (Eastern European Standard Time) has been accepted",
        "Your Change Dayoff Request to Id ac-1 to be Sunday has been accepted"
    ],
    "_id": "5fe5e6845cf8e5116860e59c",
    "id": "ac-8",
    "name": "someone",
    "email": "someone@gmail.com",
    "initial_salary": 2001,
    "role": "HOD",
    "gender": "Male",
    "department": "5fe62d24ae14044f5c5aa771",
    "officelocation": "5fe5ccece4115c3ab460f857",
    "bio": "this is the updated bio",
    "annualLeaveBalance": 10.5,
    "signinglist": [],
    "__v": 5
}



Functionality: delete a member in the system
Route:http://localhost:10000/members/:id
e.g. http://localhost:10000/members/hr-6
Request type: DELETE
Request Header:should have an HR token
Response:deleted person:
{
    "password": "$2a$10$u/4KDLSc6sF8Sbe2jcj2CeXZ.RZPnIeQ6tadpoHaf1r7KLa1p.yhK",
    "dayoff": "Saturday",
    "accidentalLeaveBalance": 6,
    "notifications": [],
    "_id": "5fe5d6cae4115c3ab460f86d",
    "id": "hr-6",
    "name": "abla",
    "email": "emailhr@gmail.com",
    "initial_salary": 2001,
    "role": "HR",
    "gender": "Male",
    "department": "5fdb761b4fd67e25c021b327",
    "officelocation": "5fe5ccfae4115c3ab460f858",
    "bio": "this is the updated bio",
    "annualLeaveBalance": 2.5,
    "signinglist": [],
    "__v": 0,
    "faculty": "5fdbdcde66be1d21e09930f6"
}





Functionality: manually add a missing sign in by adding the time of signing in, but not for himself
Route:http://localhost:10000/updatesignin/:id
e.g.http://localhost:10000/updatesignin/hr-1
Request type: PUT
Request Header:should have an HR token
Request body:{
    "month":12,
    "year":2020,
    "day":24,
    "hour":18,
    "min":30
}

Response:sign list now has added sign in
{
    "password": "$2a$10$QvG3innewbqZik/0ytnXqOfsSgZrJtli3Nc2VPq4nYnX.YDdjb33i",
    "dayoff": "Saturday",
    "missing_hrs": 0,
    "missing_days": 0,
    "accidentalLeaveBalance": 6,
    "notifications": [],
    "_id": "5fe45e23b926f73c3c4c9b01",
    "id": "hr-1",
    "name": "first hr",
    "email": "hr-1@gmail.com",
    "initial_salary": 12994,
    "role": "HR",
    "gender": "Female",
    "officelocation": "5fe45e22b926f73c3c4c9b00",
    "attendance": [],
    "signinglist": [
        {
            "_id": "5fe473fb2769523994050688",
            "signtype": "signin",
            "created": "2020-12-24T12:56"
        },
        {
            "_id": "5fe47448c6748e43a43b2bd9",
            "signtype": "signout",
            "created": "2020-12-24T12:58"
        },
        {
            "_id": "5fe4747ac6748e43a43b2bda",
            "signtype": "signin",
            "created": "2020-12-24T12:59"
        },
        {
            "_id": "5fe476c1c6748e43a43b2bdb",
            "signtype": "signout",
            "created": "2020-12-24T13:08"
        },
        {
            "_id": "5fe47713c6748e43a43b2bdc",
            "signtype": "signin",
            "created": "2020-12-24T13:10"
        },
        {
            "_id": "5fe4e93aab00d42350ea031e",
            "signtype": "signout",
            "created": "2020-12-24T18:01"
        },
        {
            "_id": "5fe4eb10604ed536e8faa71e",
            "signtype": "signin",
            "created": "2020-12-24T18:30"
        }
    ],
    "__v": 13,
    "history": [],
    "bio": "ayoooooooooooo2"
}



Functionality: manually add a missing sign out by adding the exact time of signing out, but not for himself
Route:http://localhost:10000/updatesignout/:id
e.g.http://localhost:10000/updatesignout/hr-1
Request type: PUT
Request Header:should have an HR token
Request body:{
    "month":12,
    "year":2020,
    "day":24,
    "hour":16,
    "min":30
}

Response:signlist now has the added signout
{
    "password": "$2a$10$QvG3innewbqZik/0ytnXqOfsSgZrJtli3Nc2VPq4nYnX.YDdjb33i",
    "dayoff": "Saturday",
    "missing_hrs": 0,
    "missing_days": 0,
    "accidentalLeaveBalance": 6,
    "notifications": [],
    "_id": "5fe45e23b926f73c3c4c9b01",
    "id": "hr-1",
    "name": "first hr",
    "email": "hr-1@gmail.com",
    "initial_salary": 12994,
    "role": "HR",
    "gender": "Female",
    "officelocation": "5fe45e22b926f73c3c4c9b00",
    "attendance": [],
    "signinglist": [
        {
            "_id": "5fe473fb2769523994050688",
            "signtype": "signin",
            "created": "2020-12-24T12:56"
        },
        {
            "_id": "5fe47448c6748e43a43b2bd9",
            "signtype": "signout",
            "created": "2020-12-24T12:58"
        },
        {
            "_id": "5fe4747ac6748e43a43b2bda",
            "signtype": "signin",
            "created": "2020-12-24T12:59"
        },
        {
            "_id": "5fe476c1c6748e43a43b2bdb",
            "signtype": "signout",
            "created": "2020-12-24T13:08"
        },
        {
            "_id": "5fe47713c6748e43a43b2bdc",
            "signtype": "signin",
            "created": "2020-12-24T13:10"
        },
        {
            "_id": "5fe4e93aab00d42350ea031e",
            "signtype": "signout",
            "created": "2020-12-24T18:01"
        },
        {
            "_id": "5fe4eb10604ed536e8faa71e",
            "signtype": "signin",
            "created": "2020-12-24T18:30"
        },
        {
            "_id": "5fe4ec9d604ed536e8faa71f",
            "signtype": "signout",
            "created": "2020-12-24T19:00"
        },
        {
            "_id": "5fe53420798bf6248ce0c63a",
            "signtype": "signin",
            "created": "2020-12-24T18:30"
        },
        {
            "_id": "5fe53442798bf6248ce0c63b",
            "signtype": "signout",
            "created": "2020-12-24T16:30"
        }
    ],
    "__v": 16,
    "history": [],
    "bio": "ayoooooooooooo2"
}

Functionality: get attendance record of a member
Route:http://localhost:10000/attendance/:id
e.g. http://localhost:10000/attendance/ac-1
Request type: GET
Response: The array of sign in and out list of this member:
[
    {
        "_id": "5fdcf2a60d45110410cc5ef7",
        "signinglist": [
            {
                "_id": "5fe0de242080ba5d24d03cfb",
                "signtype": "signin",
                "created": "2020-12-21T19:40"
            },
            {
                "_id": "5fe0df61fd159a40c465a807",
                "signtype": "signout",
                "created": "2020-12-21T19:46"
            },
            {
                "_id": "5fe0e32f214f6d24b061d4cf",
                "signtype": "signin",
                "created": "2020-12-21T20:02"
            }
        ]
    }
]

Functionality: View staff members with missing hours
Route:  http://localhost:10000/members/misseshrs
Request body:{"month":12,
"year":2020}
Request type: GET
Response: Array of member with missing hours now containing only one member:


[
    {
        "password": "$2a$10$QvG3innewbqZik/0ytnXqOfsSgZrJtli3Nc2VPq4nYnX.YDdjb33i",
        "dayoff": "Saturday",
        "missing_hrs": 0,
        "missing_days": 0,
        "accidentalLeaveBalance": 6,
        "notifications": [],
        "_id": "5fe45e23b926f73c3c4c9b01",
        "id": "hr-1",
        "name": "first hr",
        "email": "hr-1@gmail.com",
        "initial_salary": 12994,
        "role": "HR",
        "gender": "Female",
        "officelocation": "5fe45e22b926f73c3c4c9b00",
        "attendance": [],
        "signinglist": [
            {
                "_id": "5fe473fb2769523994050688",
                "signtype": "signin",
                "created": "2020-12-24T12:56"
            },
            {
                "_id": "5fe47448c6748e43a43b2bd9",
                "signtype": "signout",
                "created": "2020-12-24T12:58"
            },
            {
                "_id": "5fe4747ac6748e43a43b2bda",
                "signtype": "signin",
                "created": "2020-12-24T12:59"
            },
            {
                "_id": "5fe476c1c6748e43a43b2bdb",
                "signtype": "signout",
                "created": "2020-12-24T13:08"
            },
            {
                "_id": "5fe47713c6748e43a43b2bdc",
                "signtype": "signin",
                "created": "2020-12-24T13:10"
            }
        ],
        "__v": 11,
        "history": [],
        "bio": "ayoooooooooooo2"
    }
]








Functionality: View staff members with missing days.
Route: http://localhost:10000/members/missesdays

Request type: GET
Request body:{"month":12,
"year":2020}
Response:Array of members with missing days now containing only one:
[
    {
        "password": "$2a$10$QvG3innewbqZik/0ytnXqOfsSgZrJtli3Nc2VPq4nYnX.YDdjb33i",
        "dayoff": "Saturday",
        "missing_hrs": 0,
        "missing_days": 0,
        "accidentalLeaveBalance": 6,
        "notifications": [],
        "_id": "5fe45e23b926f73c3c4c9b01",
        "id": "hr-1",
        "name": "first hr",
        "email": "hr-1@gmail.com",
        "initial_salary": 12994,
        "role": "HR",
        "gender": "Female",
        "officelocation": "5fe45e22b926f73c3c4c9b00",
        "attendance": [],
        "signinglist": [
            {
                "_id": "5fe473fb2769523994050688",
                "signtype": "signin",
                "created": "2020-12-24T12:56"
            },
            {
                "_id": "5fe47448c6748e43a43b2bd9",
                "signtype": "signout",
                "created": "2020-12-24T12:58"
            },
            {
                "_id": "5fe4747ac6748e43a43b2bda",
                "signtype": "signin",
                "created": "2020-12-24T12:59"
            },
            {
                "_id": "5fe476c1c6748e43a43b2bdb",
                "signtype": "signout",
                "created": "2020-12-24T13:08"
            },
            {
                "_id": "5fe47713c6748e43a43b2bdc",
                "signtype": "signin",
                "created": "2020-12-24T13:10"
            }
        ],
        "__v": 11,
        "history": [],
        "bio": "ayoooooooooooo2"
    }
]


Functionality: Update salary of member in the system
Route:http://localhost:10000/salary/:id
e.g. http://localhost:10000/salary/ac-4
Request type: PUT
Request Header:should have an HR token
Request body:{
    "salary":4000
}
Response: member with updated salary
{
    "password": "$2a$10$h1dlKvxyVPn2PW669/JdQe8eZAz9Y.9iuLxiFwqfpCIzUrJI1LIe6",
    "dayoff": "Saturday",
    "accidentalLeaveBalance": 6,
    "notifications": [],
    "_id": "5fe5e5e05cf8e5116860e598",
    "id": "ac-4",
    "name": "farah",
    "email": "farah@gmail.com",
    "initial_salary": 4000,
    "role": "Course Instructor",
    "gender": "Female",
    "department": "5fe5d0ece4115c3ab460f85d",
    "officelocation": "5fe5ccece4115c3ab460f857",
    "bio": "testing any extra info",
    "annualLeaveBalance": 12.5,
    "signinglist": [],
    "__v": 0
}



//////////////////////////



Course Instructor Functionalities




Functionality: View the coverage of course(s) he/she is assigned to.
Route: /viewcoverage
Request type: GET
Response: Array of course id and the course coverage percentage .
 Example : [
    {
        "courseid": "csen101",
        "coverage percentage": 80
    },
    {
        "courseid": "dmet502",
        "coverage percentage": 0
    }
]




________________






Functionality: View the slots’ assignment of course(s) he/she is assigned to..
Route: /viewslots
Request type: GET
Response: Array of the course id and name and the assigned slots with its details 
of slots with its details 


 Example  :[
    {
        "slots": [
            {
                "assigned": true,
                "id": "s0",
                "slotday": "Sunday",
                "slottype": "tutorial",
                "slottime": "1st",
                "teachingid": {
                    "id": "ac-15",
                    "name": "s"
                }
            },
            {
                "assigned": true,
                "id": "s1",
                "slotday": "Sunday",
                "slottype": "tutorial",
                "slottime": "2nd",
                "teachingid": {
                    "id": "ac-15",
                    "name": "s"
                }
            },
            {
                "assigned": true,
                "id": "s3",
                "slotday": "Sunday",
                "slottype": "tutorial",
                "slottime": "2nd",
                "teachingid": {
                    "id": "ac-14",
                    "name": "someoneelse1"
                }
            },
            {
                "assigned": true,
                "id": "s4",
                "slotday": "Monday",
                "slottype": "tutorial",
                "slottime": "2nd",
                "teachingid": {
                    "id": "ac-14",
                    "name": "someoneelse1"
                }
            },
            {
                "assigned": false,
                "id": "s5",
                "slotday": "Monday",
                "slottype": "tutorial",
                "slottime": "2nd"
            }
        ],
        "id": "csen101",
        "name": "data structures"
    },
    {
        "slots": [],
        "id": "dmet502",
        "name": "graphics"
    }
]




________________




Functionality:View all the staff in his/her department or per course along with their profiles. 
Route: /viewstaff
Request type: GET
Response: Array of all the instructors , teaching assistants and coordinators per course
With their profile (name , id , email , day off, gender , office location) 
 Example:


[
    {
        "teachingassistants": [
            {
                "dayoff": "Saturday",
                "id": "ac-15",
                "name": "s",
                "email": "s@gmail.com",
                "gender": "Female"
            },
            {
                "dayoff": "Saturday",
                "id": "ac-14",
                "name": "someoneelse1",
                "email": "someoneelse1@gmail.com",
                "gender": "Female",
                "officelocation": {
                    "locname": "c3.101"
                }
            }
        ],
        "instructors": [
            {
                "dayoff": "Saturday",
                "id": "ac-6",
                "name": "sandy",
                "email": "sandy@gmail.com",
                "gender": "Female",
                "officelocation": {
                    "locname": "c3.102"
                }
            }
        ],
        "id": "csen101",
        "name": "data structures",
        "coordinator": {
            "dayoff": "Saturday",
            "id": "ac-15",
            "name": "s",
            "email": "s@gmail.com",
            "gender": "Female"
        }
    },
    {
        "teachingassistants": [],
        "instructors": [
            {
                "dayoff": "Saturday",
                "id": "ac-6",
                "name": "sandy",
                "email": "sandy@gmail.com",
                "gender": "Female",
                "officelocation": {
                    "locname": "c3.102"
                }
            }
        ],
        "id": "dmet502",
        "name": "graphics"
    }
]


________________






(This route functionality when it assign academic member to the slot it also automatically assign the academic member to the course of the slot and  it will add the academic member to be one of the teaching assistant to the course )


Functionality:Assign an academic member to an unassigned slots in course(s) he/she is assigned to.
Route: /assignslot/:id/:idslot
(id in route represent id of the academic member)
Example of how to call the route: /assignslot/ac-7/s8
Request type: POST
Response: “done”


________________






Functionality:delete assignment of academic member in course(s) he/she is assigned to.
Route: /deleteassigncourse/:id/:idcourse


(id in route represent id of the academic member)


(This route functionality it deletes the assignment of this academic member to the course {no longer a teaching assistant or the coordinator of the course} and delete any assignments of this member to any slots of this course)


Example of how to call the route: /deleteassigncourse/ac-13/csen102
Request type: DELETE
Response: “done”




________________




Functionality:update assignment of academic member in course(s) he/she is assigned to.
Route: /updateassigncourse/:id/:idcourseold/:idcourse


(id in route represent id of the academic member and  idcourseold is id of the course you want to remove academic member assignment and idcourse is the new course you want the academic member to be assigned to )


(This route functionality it deletes the assignment of this academic member to the old course (no longer a teaching assistant or the coordinator of the course) and delete any assignments of this member to any slots of this course and assign the academic member to the new course and is added to be one of teaching assistance of the course)


Example of how to call the route: /updateassigncourse/ac-15/csen102/csen702
Request type: POST
Response: “done”




________________






Functionality:Assign an academic member in each of his/her course(s) to be a course coordinator.
Route: '/coursecoordinator/:id/:idcourse'




(This route functionality it assign this academic member to be the course coordinator of the course of your selection and it also automatically assign the academic member to the course  and  it will add the academic member to be one of the teaching assistant to the course 
 )


Example of how to call the route: /coursecoordinator/ac-15/csen101
Request type: POST
Response: “done”






________________
























































Course Coordinator Functionalities


Functionality:• View “slot linking” request(s) from academic members linked to his/her course
Route: /viewslotlinkingrequest
Request type: GET
Response: Array of the request with its details
 Example:
[
    {
        "status": "Pending",
        "_id": "5fe619918e3481306838bb04",
        "id": "31",
        "reqtype": "Slot-linking",
        "slottime": "3rd",
        "course": csen101,
        "sender": {
            "id": "ac-8",
            "name": "someone",
            "email": "someone@gmail.com"
        },
        "receiver": {
            "id": "ac-15",
            "name": "s",
            "email": "s@gmail.com"
        }
    },
    {
        "status": "Pending",
        "_id": "5fe6223d069213339035288a",
        "id": "38",
        "reqtype": "Slot-linking",
        "slottime": "4th",
        "course": dmet502,
        "sender": {
            "id": "ac-14",
            "name": "someoneelse1",
            "email": "someoneelse1@gmail.com"
        },
        "receiver": {
            "id": "ac-15",
            "name": "s",
            "email": "s@gmail.com"
        }
    }
]






________________






Functionality:• Accept “slot linking” requests from academic members linked to his/her course.
Route: /acceptslotlinking/:id
(id represent request id)


Request type: POST
Example of how to call the route: /acceptslotlinking/38
Response: “done”






________________






Functionality:• Reject “slot linking” requests from academic members linked to his/her course.
Route: /rejectslotlinking/:id
(id represent request id)
Request type: POST
Example of how to call the route: /rejectslotlinking/39
Response: “done”






________________








Functionality: Add course slot(s) in his/her course
Route: /addslot
Request type: POST
Request body: {
"id": "s5",
"slotday": "Monday",
"slottype": "tutorial",
"slottime": "2nd",
"courseid": "csen101",
"locname":"c4.103"


}
Response: “done”




________________








(you can update any attribute of the slot) 


Functionality: Add course slot(s) in his/her course
Route:/updateslot/:idslot


Request type: POST
Request body:
 {
"slotday": "Sunday",
"slottype": "tutorial",
"slottime": "3rd",
"courseid": "csen102",
"locname":"c2.205"
}
OR
 {
"locname":"c5.105"
}
OR
 {
"slottype": "lab"
}




Example of how to call the route: /updateslot/s1
Response: “done”




________________










Functionality: delete course slot(s) in his/her course
Route: /deleteslot/:idslot
Request type: DELETE
Example of how to call the route: /deleteslot/s1
Response: “done”




/////////////////////



•	Assign a course instructor for each course in his department
Functionality: Assign a course instructor for each course in his department
Route: /assigninstructor
Request type: PUT
Request body: {"instructor":"ac-6", "courseid":"csen702"}
Response: Success message. "Instructor assigned successfully".

•	delete a course instructor for each course in his department
Functionality: delete a course instructor for each course in his department
Route: /removeinstructorfromcourse
Request type: DELETE
Request body: {"instructor":"ac-6", "courseid":"csen702"}
Response: Success message. "Instructor removed from course successfully"

•	update a course instructor for each course in his department
Functionality: update a course instructor for each course in his department
Route: /updateinstructorcourses
Request type: PUT
Request body: {"instructor":"ac-6", "oldcourse":"csen702", "newcourse":"csen101"}
Response: Success message. "Instructor courses updated successfully"

•	View all the staff in his/her department or per course along with their profiles.
Functionality: View all the staff in his/her department or per course along with their profiles.
Route: /viewStaffinDepartment
Request type: PUT
Request body (optional): {"courseid":"csen101"}
Response: Array of members. Example of an array of a single member: [ { "dayoff": "Saturday","accidentalLeaveBalance": 6, "notifications": [], "id": "ac-6", "name": "sandy", "email": "sandy@gmail.com","initial_salary": 2001,"role": "Course Instructor",  "gender": "Female", "department": {  "name": "cs"}, "officelocation": { "locname": "c3.102"}, "bio": "testing any extra info", "annualLeaveBalance": 12.5, "signinglist": []}]

•	View the day off of all the staff/ a single staff in his/her department.
Functionality: View the day off of all the staff/ a single staff in his/her department.
Route: /viewDayoff
Request type: PUT
Request body (Optional): {"staffid":"ac-1"}
Response: 
In case a body with "staffid" is not provided then response is : An array of arrays where each array holds id, name, dayoff. Example:[[ "ac-8", "someone", "Sunday" ], [ "ac-9", "someonee","Saturday"]
In case a body with "staffid" is provided then response is : String indicating dayoff. Example: "Saturday"

•	View all the requests “change day off/leave” sent by staff members in his/her department.
Functionality: View all the requests “change day off/leave” sent by staff members in his/her department.
Route: /viewHodRequests
Request type: GET
Response:{ "Leave":[array of leave requests], "Change day off":[array of Change day off requests]} . Example:
{ "Leave": [ { "status": "Pending", "replacements": [],  "id": "4", "reqtype": "Leave", "leavetype": "Annual",  "date": "2020-12-25T22:00:00.000Z",   "sender": {  "id": "ac-8",  "name": "someone" } ], "Change day off": [{ "status": "Accepted","replacements": [], "id": "32", "reqtype": "Change day off", "weekday": "Sunday", "reason": "training", "sender": { "id": "ac-8", "name": "someone"}},{"status": "Pending",  "replacements": [],  "id": "37", "reqtype": "Change day off",  "weekday": "Monday",  "reason": "sleep", "sender": { "id": "ac-14",  "name": "someoneelse1"}}]}

•	Accept Leave Request
Functionality: Accept Leave Request
Route: /acceptLeaveRequest
Request type: PUT
Request body: {" requestid":"1"}
Response: Success message.  "Request Accepted"

•	Accept Change Day off Request
Functionality: Accept Change Day off Request
Route: /acceptDayoffRequest
Request type: PUT
Request body: {"requestid":"2"}
Response: Success message.  "Request Accepted"

•	Reject a request, and optionally leave a comment as to why this request was rejected.
Functionality: HOD rejects a “leave” or “change day off” request
Route: /rejectHodRequest
Request type: PUT
Request body: {"requestid":"1", "comment":"I rejected the request because …" }
Response: Success message.  "Request Rejected"

•	View the coverage of each course in his/her department.
Functionality: View the coverage of each course in his/her department.
Route: /viewdepartmentcoverage
Request type: GET
Response: Array of objects that indicated course id and coverge. Example: [{"courseid": "csen101","coverage precentage": 80 }, {"courseid": "csen702","coverage precentage": 0 }]

•	View teaching assignments (which staff members teach which slots) of course offered by his department.
Functionality: View teaching assignments (which staff members teach which slots) of course offered by his department.
Route: /viewdepartmentslots
Request type: GET
Response: Array of courses. Example of array with single course: [{"slots": [{"slotday": "Sunday","slottype": "tutorial","slottime": "1st","teachingid": { "id": "ac-15","name": "s" }},{"slotday": "Sunday", "slottype": "tutorial","slottime": "2nd","teachingid": {"id": "ac-15","name": "s"}}]



////////////////////////////

Academic member Functionalities


In all APIs Dates should be inputted as “yyyy-mm-dd” as 2020-05-21


Functionality:  Submit any type of “leave” request
Route: /sendLeave         
Request type:  POST 
Request body( Compenstation Leave ): 
{


"reqtype" : "Leave", 
"leavetype": "Compensation", 
"date" : "2020-12-27" ,
"compensationDate" : "2020-12-26", 
"reason": "msh 3ayz agy"


}


Response (the created request): 
{
    "status": "Pending",
    "replacements": [],
    "_id": "5fe60955e518c42ec0ab7161",
    "id": "29",
    "reqtype": "Leave",
    "leavetype": "Compensation",
    "date": "2020-12-27T00:00:00.000Z",
    "compensationDate": "2020-12-26T00:00:00.000Z",
    "reason": "msh 3ayz agy",
    "sender": "5fe5e6845cf8e5116860e59c",
    "receiver": "5fe5d63de4115c3ab460f86c",
    "__v": 0
}
Request body( Sick Leave ): 
{


"reqtype" : "Leave", 
"leavetype": "Sick", 
"date" : "2020-12-27" ,
"document" : "docs"






}






Response (the created request): 
{
    "status": "Pending",
    "replacements": [],
    "_id": "5fe60a0ce518c42ec0ab7163",
    "id": "30",
    "reqtype": "Leave",
    "leavetype": "Sick",
    "date": "2020-12-27T00:00:00.000Z",
    "document": "docs",
    "sender": "5fe5e6845cf8e5116860e59c",
    "receiver": "5fe5d63de4115c3ab460f86c",
    "__v": 0
}


Request body( Annual Leave ): 
{
 
"reqtype" : "Leave", 
"leavetype": "Annual", 
"date" : "2020-12-27" ,
"replacement" : [ "48"  , "47" ]


 
}


Response (the created request): 
{
    "status": "Pending",
    "replacements": [
        "48",
        "47"
    ],
    "_id": "5fe64b1c2ad5ff33cca3382f",
    "id": "57",
    "reqtype": "Leave",
    "leavetype": "Annual",
    "date": "2020-12-27T00:00:00.000Z",
    "sender": "5fe5eb0bad89401da4a0068f",
    "receiver": "5fe5d63de4115c3ab460f86c",
    "__v": 0
}






________________




Functionality:  Cancel a still pending request or a request whose day is yet to come.
Route: /cancelRequest 
Request type: DELETE
Request body: { "requestId" : "21" }


Response : deleted request: {
    "status": "Pending",
    "replacements": [],
    "_id": "5fe5f8d7f108291688765176",
    "id": "21",
    "reqtype": "Leave",
    "leavetype": "Compensation",
    "date": "2020-12-27T22:00:00.000Z",
    "compensationDate": "2020-12-25T22:00:00.000Z",
    "reason": "msh 3ayz agy",
    "sender": "5fe5e6845cf8e5116860e59c",
    "receiver": "5fe5d63de4115c3ab460f86c",
    "__v": 0
}


________________










Functionality:  View the status of all submitted requests. They can also view only the accepted requests, only the pending requests or only the rejected requests.
Route: /viewSentRequests/
Request type: PUT
Request body (or empty body for showing all sent requests):                                    { "status" : "Accepted" }
Response: Array of requests. Example of a single request: 
{
        "status": "Accepted",
        "replacements": [],
        "_id": "5fe5f1a64b3ddf349c9216a0",
        "id": "9",
        "reqtype": "Leave",
        "leavetype": "Accidental",
        "date": "2020-12-08T22:00:00.000Z",
        "sender": "5fe5e6845cf8e5116860e59c",
        "receiver": "5fe5d63de4115c3ab460f86c",
        "__v": 0
  }


________________






Functionality:  Send a “slot linking” request
Route: /sendSlotLinking
Request type: POST
Request body:
{
"reqtype" :"Slot-linking", 
"slotday": "Sunday", 
"slottime": "3rd", 
"course" : "csen102", 
"slottype": "tutorial"
}
Response:
{
    "status": "Pending",
    "replacements": [],
    "_id": "5fe619918e3481306838bb04",
    "id": "31",
    "reqtype": "Slot-linking",
    "slottime": "3rd",
    "course": "5fe5d30be4115c3ab460f861",
    "sender": "5fe5e6845cf8e5116860e59c",
    "receiver": "5fe5eb0bad89401da4a0068f",
    "__v": 0
}
________________




Functionality:   sending a “change day off” request
Route: /sendChangeDayOff 
Request type: POST
Request body:
{
"reqtype" :"Change day off", 
"weekday": "Sunday", 
"reason": "training"
}


Response: 
{
    "status": "Pending",
    "replacements": [],
    "_id": "5fe61c11069213339035287e",
    "id": "32",
    "reqtype": "Change day off",
    "weekday": "Sunday",
    "reason": "training",
    "sender": "5fe5e6845cf8e5116860e59c",
    "receiver": "5fe5d63de4115c3ab460f86c",
    "__v": 0
}


________________




Functionality:  View their schedule. Schedule should show teaching activities and replacements if present.
Route: /viewMySchedule
Request type: GET 
Request body: { }
Response: Array of  slots & Array of replacements . Example of a single  slot: 
  {
            "_id": "5fe6c36fb0829833c468f681",
            "slotday": "Monday",
            "slottype": "tutorial",
            "slottime": "2nd",
            "courseId": "5fe5d33fe4115c3ab460f862",
            "location": "5fe62759ae14044f5c5aa76c"
   }
Example of a single Replacement :
{
            "_id": "5fe6c167921b6c37c827feca",
            "slotday": "Sunday",
            "slottype": "tutorial",
            "slottime": "1st",
            "courseId": "5fe5d33fe4115c3ab460f862",
            "location": "5fe6277dae14044f5c5aa76e",
            "replacementDate": "2020-12-29T00:00:00.000Z"
        }


________________


Functionality:  Send “replacement” request .
Route: /sendSlotReplacement
Request type:  POST
Request body: 
{
     "reqtype" :"Replacement", 
     "receiver" : "ac-14" , 
     "date" : "2020-12-29", 
     "weekday" :"Sunday" , 
     "slottime" :"2nd" , 
     "course" : "csen101"




}
Response: the created replacement request 
{
    "status": "Pending",
    "replacements": [],
    "_id": "5fe64295aabdc71f4c56efb6",
    "id": "47",
    "reqtype": "Replacement",
    "date": "2020-12-29T00:00:00.000Z",
    "slottime": "2nd",
    "weekday": "Sunday",
    "course": "5fe5d33fe4115c3ab460f862",
    "sender": "5fe5eb0bad89401da4a0068f",
    "receiver": "5fe5e6fc5cf8e5116860e5a2",
    "__v": 0
}


________________




Functionality: view received “replacement” request(s) .
Route: /viewReceivedReplacements
Request type:  GET
Request body: { }
Response: Array of replacement sent to me . Example of a single replacement: 
[ {
        "status": "Pending",
        "replacements": [],
        "_id": "5fe630413a72750d6c4523cc",
        "id": "40",
        "reqtype": "Replacement",
        "date": "2020-05-12T00:00:00.000Z",
        "slottime": "2nd",
        "weekday": "Sunday",
        "course": "5fe5d30be4115c3ab460f861",
        "sender": "5fe5e6fc5cf8e5116860e5a2",
        "receiver": "5fe5eb0bad89401da4a0068f",
        "__v": 0
    } ]
________________


Functionality: accept received “replacement” request .
Route: /acceptReplacemant
Request type:  PUT
Request body: 


{
  "requestId" : "48"
}


Response: The accepted request . 
{
    "status": "Accepted",
    "replacements": [],
    "_id": "5fe642e3aabdc71f4c56efb8",
    "id": "48",
    "reqtype": "Replacement",
    "date": "2020-12-29T00:00:00.000Z",
    "slottime": "1st",
    "weekday": "Sunday",
    "course": "5fe5d33fe4115c3ab460f862",
    "sender": "5fe5eb0bad89401da4a0068f",
    "receiver": "5fe5e6fc5cf8e5116860e5a2",
    "__v": 0
}


________________


Functionality: reject received “replacement” request .
Route: /rejectReplacemant
Request type:  PUT
Request body: 
{
  "requestId" : "47"
}


Response: The rejected request  . 
{
    "status": "Rejected",
    "replacements": [],
    "_id": "5fe64295aabdc71f4c56efb6",
    "id": "47",
    "reqtype": "Replacement",
    "date": "2020-12-29T00:00:00.000Z",
    "slottime": "2nd",
    "weekday": "Sunday",
    "course": "5fe5d33fe4115c3ab460f862",
    "sender": "5fe5eb0bad89401da4a0068f",
    "receiver": "5fe5e6fc5cf8e5116860e5a2",
    "__v": 0
}


///////////////////////////

GUC Staff Members Functionalities
* Log in with a unique email and a password
Functionality: Allowing A GUC staff member to login in to the system
Route: /login
Request type: POST
Request body: {“email”:”hr-1@gmail.com”,”password”:”123456”}
Res : if this is the first time lodding in the res will be 
{ "msg": "This is your Firsttime logging in please reset your password"}
But if this isn’t the first time logging in 
{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFjLTEiLCJ0b2tlbnJvbGUiOiJIT0QiLCJpYXQiOjE2MDg5MDAxNzR9.nuDAdWPw37J3XGRG-BAulykZ3GbBs_pCp2my99iqb_M",
 "user": {
        "email": "emailhod@gmail.com",
        "id": "5fe5d63de4115c3ab460f86c"
    },
    "msg": "You are logged in succesfully"
}




* Log out from the system.
Functionality: Allowing A GUC staff member to Logout  of the system//blacklisting the token
Route: /logout
Request type: GET
Request body: 
RES: LoggedOut !
* View their profile.
Functionality: Allowing A GUC staff member to view his Profile 
Route: /viewProfile
Request type: GET
Request body: 
RES:
{
    "dayoff": "Saturday",
    "accidentalLeaveBalance": 6,
    "notifications": [],
    "id": "hr-3",
    "name": "thr hr",
    "email": "em@gmail.com",
    "initial_salary": 2001,
    "role": "HR",
    "gender": "Female",
    "officelocation": {
        "locname": "admission"
    },
    "bio": "testing any extra info",
    "annualLeaveBalance": 22.5,
    "signinglist": [],
    "__v": 0
}


And if i am using an expired token my result will be 
This token is expired


* Update their profile except for the id and the name. Academic members can't update their salary, faculty and department.


Functionality: Allowing A GUC staff member to Update certain attributes in his profile
Route: /updatemyProfile
Request type: PUT
Request body: //There are many ways for the req body one can put {“name”:”Sandy”,”email”:”sandy@gmail.com”,“id”:”ac-1”,”bio”:”Sandy,”annualLeaveBalance”:5 , fifth settlement ”,”initial_salary”:500,”deducted_salry”:450,”faculty”:”MET”,”departement:”CSEN”}


--Example for Req body:{"bio":"This is my Updated Bio"}
--Res :{
    "dayoff": "Saturday",
    "accidentalLeaveBalance": 6,
    "notifications": [],
    "id": "hr-2",
    "name": "sec hr",
    "email": "e@gmail.com",
    "initial_salary": 2001,
    "role": "HR",
    "gender": "Female",
    "officelocation": {
        "locname": "admission"
    },
    "bio": "This is my Updated Bio",
    "annualLeaveBalance": 22.5,
    "signinglist": [],
    "__v": 0
}




Req bodyexample:
//None of those are required and non of those will be allowed to change depending on my role ! P.S:any user can update his BIO


* Reset their passwords.
Functionality: Prompting A GUC staff member to Reset his FIRST PASSWORD and allows him to login providing a token //thefirst reset password must take place here 
Route: /resetFirstPassword
Request type: PUT
Request body: {


"email":"emailhod@gmail.com",
"oldPassword":"123456",
"newPassword":"123456Hod1",
"passwordCheck":"123456Hod1"
}


Res body:{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFjLTEiLCJ0b2tlbnJvbGUiOiJIT0QiLCJpYXQiOjE2MDg5MDAwMDN9.zo2LzYqavS5EPFPkbCWXI-gzb6nrtGkwF1z1zdFecOQ",
    "user": {
        "email": "emailhod@gmail.com",
        "id": "5fe5d63de4115c3ab460f86c"
    },
    "msg": "You are logged in succesfully and changed Password for first time"
}






Functionality: allowing A GUC staff member to Reset his password when logged in 
Route: /resetPassword
Request type: PUT
Request body: {”oldPassword:”CHRISTmas*71”,”newPassword”:”CHILLbro_CHILL”,”passwordCheck”:”CHILLbro_CHILL”}
RES BODY:Password Updated!


* Sign in. This should simulate a staff signing in(entering the campus).


Functionality: signing in A GUC staff member by keeping records of his Signin time 
Route: /signin
Request type: GET
Request body: 
Res
{
    "dayoff": "Saturday",
    "accidentalLeaveBalance": 6,
    "notifications": [],
    "_id": "5fe5d4f3e4115c3ab460f867",
    "id": "hr-2",
    "name": "sec hr",
    "email": "e@gmail.com",
    "initial_salary": 2001,
    "role": "HR",
    "gender": "Female",
    "bio": "This is my Updated Bio",
    "annualLeaveBalance": 22.5,
    "signinglist": [
        {
            "_id": "5fe5fc5e994d6835085bb9db",
            "signtype": "signin",
            "created": "2020-12-25T14:51:00.000Z"
        },
        {
            "_id": "5fe5fcd17c71b83540b3094f",
            "signtype": "signout",
            "created": "2020-12-25T14:53:00.000Z"
        },
        {
            "_id": "5fe5fcfba0733c26f03da315",
            "signtype": "signin",
            "created": "2020-12-25T14:53:00.000Z"
        }
    ],
    "__v": 3
}


* Sign out. This should simulate a staff signing out(entering the campus).


Functionality: signing out A GUC staff member by keeping records of his signout time and checking the correct time to add a sign out and calculate his missing hrs 
Route: /signout
Request type: GET
Request body: 
RES:
{
    "dayoff": "Saturday",
    "accidentalLeaveBalance": 6,
    "notifications": [],
    "_id": "5fe5d4f3e4115c3ab460f867",
    "id": "hr-2",
    "name": "sec hr",
    "email": "e@gmail.com",
    "initial_salary": 2001,
    "role": "HR",
    "gender": "Female",
    "bio": "This is my Updated Bio",
    "annualLeaveBalance": 22.5,
    "signinglist": [
        {
            "_id": "5fe5fc5e994d6835085bb9db",
            "signtype": "signin",
            "created": "2020-12-25T14:51:00.000Z"
        },
        {
            "_id": "5fe5fcd17c71b83540b3094f",
            "signtype": "signout",
            "created": "2020-12-25T14:53:00.000Z"
        },
        {
            "_id": "5fe5fcfba0733c26f03da315",
            "signtype": "signin",
            "created": "2020-12-25T14:53:00.000Z"
        },
        {
            "_id": "5fe5fec8a0733c26f03da316",
            "signtype": "signout",
            "created": "2020-12-25T15:01:00.000Z"
        }
    ],
    "__v": 4
}




• View all their attendance records, or they can specify exactly which month to view
Functionality: View the attendance of just one class
Route: /viewAttendence
Request type: PUT
Request body:{“month”:12,”year:2020} //you can add these too in the req.body but if you add one .. you add both
RES
[
    {
        "_id": "5fe5fc5e994d6835085bb9db",
        "signtype": "signin",
        "created": "2020-12-25T14:51:00.000Z"
    },
    {
        "_id": "5fe5fcd17c71b83540b3094f",
        "signtype": "signout",
        "created": "2020-12-25T14:53:00.000Z"
    },
    {
        "_id": "5fe5fcfba0733c26f03da315",
        "signtype": "signin",
        "created": "2020-12-25T14:53:00.000Z"
    },
    {
        "_id": "5fe5fec8a0733c26f03da316",
        "signtype": "signout",
        "created": "2020-12-25T15:01:00.000Z"
    }
]


* View if they have missing days. Missing days are days where the sta
member don't haveany attendance record




Functionality: the ability of GUC staff member to view his missing hrs to know where he stands Route: /viewMissinghrs


Request type: PUT
Request body:{“month”:12,”year”:2020}: 
//if there are Extra Hrs it will be 
Extra Hrs =0:11
//if Missing hrs 
Missing Hrs =4:10
____________________________


Functionality: the ability of GUC staff member to view his missed days to know where he stands Route: /viewMissingDays


Request type: PUT
Request body:{“month”:12,”year”:2020}: 
RES My missing days are 10

