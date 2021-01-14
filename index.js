const express = require("express");
var cors = require("cors");
const app = express();
const path = require("path");
app.use(cors());
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//MODELS
const members = require("./models/members");
const courses = require("./models/courses");
const requests = require("./models/requests");
const expiredtoken = require("./models/expiredtokens");
const months = require("./models/months");
const locations = require("./models/locations");
const faculties = require("./models/faculties");
const departments = require("./models/departments");
const slots = require("./models/slots");
const counters = require("./models/counters");
const reqCounter = require("./models/reqCounter");

const dotenv = require("dotenv");
dotenv.config();

const JWT_PASSWORD = "}TWLr:NsZtR5,q<J";

var moment = require("moment");
const jwt = require("jsonwebtoken");
//JOI
const {
  assigninstructor,
  updateinstructorcourse,
  viewStaffinDepartment,
  viewDayoff,
  acceptLeaveRequest,
  rejectHODRequest,
} = require("./joi/hod_joi");
const { schemaslot, schemaslot2 } = require("./joi/farah_joi");
const {
  sendslotlinking,
  sendChangeDayOff,
  sendSlotReplacement,
  acceptReplacemant,
  rejectReplacemant,
  sendLeave,
  cancelRequest,
} = require("./joi/ac_joi");
const {
  schemamember,
  schemamember2,
  schemalocation,
  schemalocation2,
  schemafaculty,
  schemadepartment,
  schemadepartment2,
  schemacourse,
  schemacourse2,
  schemamiss,
  schemasalary,
  schemasign,
} = require("./joi/hr_joi");
const {
  logincheck,
  resetFirstPasswordcheck,
  attendancecheck,
  missingdayCheck,
  updateProfileCheck,
  resetPassordCheck,
} = require("./joi/staff_joi");
const { date } = require("joi");
const slotsCounter = require("./models/slotsCounter");

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //both convert to json
const connectionParams = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

const URL =
  "mongodb+srv://Martha:Wowzi@cluster0.z3mgg.mongodb.net/projDB?retryWrites=true&w=majority";

mongoose
  .connect(
    URL,
    connectionParams
  )
  .then(() => {
    console.log("Db is connected");
  })
  .catch(() => {
    console.log("Db is not connected");
  });

console.log("here");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "build")));

  console.log("here");

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html")); // relative path
  });
  console.log("here");
}

const Port = process.env.PORT || 10000;

app.listen(Port, () => {
  console.log(`This server is running on  ${Port}`);
});
////////////////////////////////////////////////////////////////////////////FUNCTIONS//////////////////////////
function calcBusinessDays(startDate, endDate, dayoff, leavelist) {
  //var day = moment(startDate).format();
  var businessDays = 0;

  while (
    moment(moment(startDate).format()).isSameOrBefore(
      moment(endDate).format(),
      "day"
    )
  ) {
    if (
      moment(startDate).day() != dayoff &&
      moment(startDate).day() != 5 &&
      !leavelist.includes(moment(startDate).date())
    )
      businessDays++;
    //console.log(startDate=moment(startDate).add(1,'d'))
    //moment(startDate).add(1,'d')

    startDate = moment(startDate).add(1, "d");
  }
  return businessDays;
}

function dateDifference(startDate, endDate) {
  return moment(startDate).diff(moment(endDate), "minutes");
}

const auth = async (req, res, next) => {
  try {
    const token = req.header("auth-token");
    console.log(token);
    const exptoken = await expiredtoken.findOne({ expired: token });
    if (exptoken) {
      return res.json({ msg: "This token is expired" });
    }
    if (!token) {
      return res.json({ msg: "not authorized" });
    }
    const verified = jwt.verify(token, JWT_PASSWORD); // verfiy begeb id user
    if (!verified) {
      return res.json({ msg: "not authorized 2" });
    }
    req.id = verified.id;
    req.tokenrole = verified.tokenrole;

    next();

    //middleware function lazem teroh 3al function tanya
  } catch (error) {
    res.json({ msg: error.message });
  }
};

//////////////////////////////////////////////////ROUTES//////////////////////////////////////////////////

/////////////////////////////////////////////////////SANDY/////////////////////////////////////////////////////
/////////////////////////////////////////////////////SANDY/////////////////////////////////////////////////////
/////////////////////////////////////////////////////STAFF/////////////////////////////////////////////////////

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const check = {
    email: email,
    password: password,
  };
  const result = logincheck.validate(check);

  const { value, error } = result;
  const valid = error == null;
  if (!valid) {
    return res.json({ msg: error.details[0].message });
  }

  if (!email || !password) {
    return res.json({ msg: "Please enter valid email and password" });
  }
  const existinguser = await members.findOne({ email: email });

  try {
    if (!existinguser) {
      return res.json({ msg: "Your not registered" });
    }

    const ismatched = await bcrypt.compare(password, existinguser.password);
    if (!ismatched) {
      return res.json({ msg: "password wrong" });
    }
    if (password === "123456" && ismatched) {
      return res.json({
        msg: "This is your Firsttime logging in please reset your password",
      });
    }

    //cont user={id:existinuser.id}
    const token = jwt.sign(
      { id: existinguser.id, tokenrole: existinguser.role },
      JWT_PASSWORD
    );
    res.header("auth-token", token);
    res.setHeader("auth-token", token);

    tokenrole = existinguser.role;

    res.json({
      token,
      user: {
        email: existinguser.email,
        id: existinguser._id,
      },
      tokenrole,

      //msg: "You are logged in succesfully",
    });
  } catch (error) {
    //important
    res.json({ msg: error.message });
  }
});

app.put("/resetFirstPassword", async (req, res) => {
  const { email, oldPassword, newPassword, passwordCheck } = req.body;

  const check = {
    email: email,
    oldPassword: oldPassword,
    newPassword: newPassword,
    passwordCheck: passwordCheck,
  };
  const result = resetFirstPasswordcheck.validate(check);

  const { value, error } = result;
  const valid = error == null;
  if (!valid) {
    return res.json({ msg: error.details[0].message });
  }
  if (!email || !oldPassword || !newPassword) {
    return res.json({ msg: "Please enter valid email and password" });
  }
  const existinguser = await members.findOne({ email: email });

  try {
    if (!existinguser) {
      return res.json({ msg: "Your not registered" });
    }
    //FirstReset
    const ismatched = await bcrypt.compare(oldPassword, existinguser.password);
    if (!ismatched) {
      return res.json({ msg: "password wrong" });
    }
    if (oldPassword === "123456" && ismatched) {
      if (newPassword === "123456") {
        return res.json({ msg: " Please change this default password" });
      }
      if (newPassword.length < 5) {
        return res.json({ msg: "Password must be at least 5 chars" });
      }
      if (newPassword != passwordCheck) {
        return res.json({ msg: "Password must match" });
      }
      const salt = await bcrypt.genSalt(); //salt is random text
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      const updatepass = await members.updateOne(
        { email: email },
        { password: hashedPassword }
      );
      // res.send(updatepass);

      const token = jwt.sign(
        { id: existinguser.id, tokenrole: existinguser.role },
        JWT_PASSWORD
      );
      res.header("auth-token", token);
      res.setHeader("auth-token", token);

      tokenrole = existinguser.role;

      res.json({
        token,
        user: {
          email: existinguser.email,
          id: existinguser._id,
        },
        tokenrole,

        //msg: "You are logged in succesfully",
      });
    } else {
      return res.json({
        msg:
          "This is not your first time changing password you need to login first :)",
      });
    }
  } catch (error) {
    //important
    res.json({ msg: error.message });
  }
});
app.get("/viewNotifications", auth, async (req, res) => {
  try {
    const existingUser = await members
      .findOne({ id: req.id })
      .select(["notifications", "-_id"]);
    if (!existingUser) {
      return res.json({ msg: "This User doesn't Exist in my Database" });
    }

    res.send({ existingUser });
  } catch (error) {
    res.json({ msg: error.message });
  }
});

app.get("/viewProfile", auth, async (req, res) => {
  try {
    const existingUser = await await members
      .findOne({ id: req.id })
      .select(["-password", "-_id"])
      .populate({ path: "officelocation", select: { _id: 0, locname: 1 } })
      .populate({ path: "department", select: { _id: 0, name: 1 } })
      .populate({ path: "faculty", select: { _id: 0, name: 1 } });
    if (!existingUser) {
      return res.json({ msg: "This User doesn't Exist in my Database" });
    }

    res.send({ existingUser });
  } catch (error) {
    res.json({ msg: error.message });
  }
});
app.put("/viewAttendence", auth, async (req, res) => {
  try {
    const existingUser = await members
      .findOne({ id: req.id })
      .select(["-password", "-_id"]);
    if (!existingUser) {
      return res.json({ msg: "This User doesn't Exist in my Database" });
    }
    var my2ndmonth;
    var secondyear = year;
    var { month, year } = req.body;
    const check = {
      month: month,
      year: year,
    };
    const result = attendancecheck.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }

    if (typeof month === "string") {
      month = parseInt(month);
    }
    // if(typeof year==="string"){
    //     year= parseInt(year);
    //  }

    //    var attendmonth=month;
    //         var attendedyear=year
    //         if(day<11){
    //             if(month===1){
    //                 attendmonth=12;
    //                 attendedyear=year-1;
    //             }else{

    //                 attendmonth=month;
    //             }
    //         }

    const signlistarray = existingUser.signinglist; // list of signs
    // a list of all the days in december starting the 10th of december
    if (month === 12) {
      my2ndmonth = 1;
      secondyear = year + 1;
    } else {
      my2ndmonth = month + 1;
    }

    //moment(elem.created).isSame(moment().date(),'day')
    const signlistMonthinBody = signlistarray.filter(
      (elem) =>
        moment(elem.created).month() + 1 === month &&
        moment(elem.created).date() > 10 &&
        moment(elem.created).year() === year
    );
    const signlist2ndMonthinBody = signlistarray.filter(
      (elem) =>
        moment(elem.created).month() + 1 === my2ndmonth &&
        moment(elem.created).date() < 11 &&
        moment(elem.created).year() === secondyear
    );
    const joined = signlistMonthinBody.concat(signlist2ndMonthinBody);

    if (req.body.month) {
      return res.send({ joined });
    } else {
      return res.send(existingUser.signinglist);
    }
  } catch (error) {
    res.json({ msg: error.message });
  }
});

//am i supposed to make him check and calculate all his missing days here ??
app.put("/viewMissingDays", auth, async (req, res) => {
  try {
    var { month, year } = req.body;

    const check = {
      month: month,
      year: year,
    };
    const result = missingdayCheck.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }

    if (typeof month === "string") {
      month = parseInt(month);
    }
    if (typeof year === "string") {
      year = parseInt(year);
    }
    const existingUser = await members
      .findOne({ id: req.id })
      .select(["-password", "-_id"]);
    if (!existingUser) {
      return res.json({ msg: "This User doesn't Exist in my Database" });
    }
    //12,2020
    const monthly = await months.findOne({
      id: req.id,
      month: month,
      year: year,
    });
    // res.send(monthly + monthly.year)
    if (!monthly) {
      return res.json({ msg: "Couldn't find the record Not yet calculated" });
    }
    //console.log(mymissinghrs)
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const dayoffindex = weekdays.indexOf(existingUser.dayoff);
    //console.log(dayoffindex)
    var month2 = month + 1;
    var year2 = year;
    if (month === 12) {
      month2 = 1;
      year2 = year + 1;
    }
    var daystoattend = 0;
    //12,2020
    //   console.log(moment(`${year2}-${month2}-${10}`,"YYYY-MM-DD").isAfter(moment().format("YYYY-MM-DD"),'day'))

    if (
      moment(`${year2}-${month2}-${10}`, "YYYY-MM-DD").isAfter(
        moment().format("YYYY-MM-DD"),
        "day"
      )
    ) {
      let y = `${moment().year()}`;
      let m = `${moment().month() + 1}`;
      let d = `${moment().date()}`;
      daystoattend = calcBusinessDays(
        `${year}-${month}-${11}`,
        `${y}-${m}-${d}`,
        dayoffindex,
        monthly.acceptedleavescount
      );
    } else {
      daystoattend = calcBusinessDays(
        moment(`${year}-${month}-${11}`, "YYYY-MM-DD"),
        moment(`${year2}-${month2}-${10}`, "YYYY-MM-DD"),
        dayoffindex,
        monthly.acceptedleavescount
      );
    }

    //console.log(daystoattend+" "+ monthly.attendeddays)
    var missingdays = daystoattend - monthly.attendeddays;

    res.json({ missingdays });
  } catch (error) {
    res.json({ msg: error.message });
  }
});

app.put("/viewMissinghrs", auth, async (req, res) => {
  try {
    var { month, year } = req.body;
    // var { month, year } = req.body;

    const check = {
      month: month,
      year: year,
    };
    const result = missingdayCheck.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }
    if (typeof month === "string") {
      month = parseInt(month);
    }
    if (typeof year === "string") {
      year = parseInt(year);
    }
    const existingUser = await members
      .findOne({ id: req.id })
      .select(["-password", "-_id"]);
    if (!existingUser) {
      return res.json({ msg: "This User doesn't Exist in my Database" });
    }
    const monthly = await months.findOne({
      id: req.id,
      month: month,
      year: year,
    });
    if (!monthly) {
      return res.json({ msg: "Couldn't find the record Not yet calculated" });
    }
    // console.log(mymissinghrs)
    var mymissinghrs = monthly.attendedhrsinMin - 504 * monthly.attendeddays;
    res.json({ mymissinghrs });
    // if (mymissinghrs > 0) {
    //   res.send(
    //     "Extra Hrs =" +
    //     Math.floor(mymissinghrs / 60) +
    //     ":" +
    //     (mymissinghrs % 60)
    //   );
    // } else {
    //   mymissinghrs = mymissinghrs * -1;
    //   res.send(
    //     "Missing Hrs =" +
    //     Math.floor(mymissinghrs / 60) +
    //     ":" +
    //     (mymissinghrs % 60)
    //   );
    // }
  } catch (error) {
    res.json({ msg: error.message });
  }
});

app.put("/helpsalary", auth, async (req, res) => {
  try {
    var { month, year } = req.body;
    // var { month, year } = req.body;

    const check = {
      month: month,
      year: year,
    };
    const result = missingdayCheck.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }
    if (typeof month === "string") {
      month = parseInt(month);
    }
    if (typeof year === "string") {
      year = parseInt(year);
    }
    const existingUser = await members
      .findOne({ id: req.id })
      .select(["-password", "-_id"]);
    if (!existingUser) {
      return res.json({ msg: "This User doesn't Exist in my Database" });
    }
    const monthly = await months.findOne({
      id: req.id,
      month: month,
      year: year,
    });
    if (!monthly) {
      return res.json({ msg: "Couldn't find the record Not yet calculated" });
    }
    let output = [];
    var mymissinghrs = monthly.attendedhrsinMin - 504 * monthly.attendeddays;
    output.push(mymissinghrs);

    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const dayoffindex = weekdays.indexOf(existingUser.dayoff);
    //console.log(dayoffindex)
    var month2 = month + 1;
    var year2 = year;
    if (month === 12) {
      month2 = 1;
      year2 = year + 1;
    }
    var daystoattend = 0;
    //12,2020
    //   console.log(moment(`${year2}-${month2}-${10}`,"YYYY-MM-DD").isAfter(moment().format("YYYY-MM-DD"),'day'))

    if (
      moment(`${year2}-${month2}-${10}`, "YYYY-MM-DD").isAfter(
        moment().format("YYYY-MM-DD"),
        "day"
      )
    ) {
      let y = `${moment().year()}`;
      let m = `${moment().month() + 1}`;
      let d = `${moment().date()}`;
      daystoattend = calcBusinessDays(
        `${year}-${month}-${11}`,
        `${y}-${m}-${d}`,
        dayoffindex,
        monthly.acceptedleavescount
      );
    } else {
      daystoattend = calcBusinessDays(
        moment(`${year}-${month}-${11}`, "YYYY-MM-DD"),
        moment(`${year2}-${month2}-${10}`, "YYYY-MM-DD"),
        dayoffindex,
        monthly.acceptedleavescount
      );
    }

    //console.log(daystoattend+" "+ monthly.attendeddays)
    var missingdays = daystoattend - monthly.attendeddays;
    //output=[missinghrs,missingdays,init salary]

    output.push(missingdays);
    output.push(existingUser.initial_salary);
    res.send({ output });
  } catch (error) {
    res.json({ msg: error.message });
  }
});
//I want to restrict that no one can update his days off location and etc

app.put("/updatemyProfile", auth, async (req, res) => {
  try {
    let {
      name,
      email,
      id,
      initial_salary,
      deducted_salry,
      faculty,
      department,
      role,
      dayoff,
      officelocation,
      bio,
      annualLeaveBalance,
      accidentalLeaveBalance,
      notifications,
      signinglist,
    } = req.body;

    const check = {
      name: name,
      email: email,
      id: id,
      initial_salary: initial_salary,
      deducted_salry: deducted_salry,
      faculty: faculty,
      department: department,
      role: role,
      dayoff: dayoff,
      officelocation: officelocation,
      bio: bio,
      annualLeaveBalance: annualLeaveBalance,
      accidentalLeaveBalance: accidentalLeaveBalance,
      notifications: notifications,
      signinglist: signinglist,
    };
    const result = updateProfileCheck.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }

    const existingUser = await members.findOne({ id: req.id });
    if (!existingUser) {
      return res.json({ msg: "This User doesn't Exist in my Database" });
    }

    if (
      req.body.name ||
      req.body.id ||
      req.body.email ||
      req.body.annualLeaveBalance ||
      req.body.accidentalLeaveBalance ||
      req.body.notifications ||
      req.body.signinglist
    ) {
      return res.json({ msg: "You are not allowed to do this" });
    }

    if (req.tokenrole != "HR") {
      if (
        req.body.initial_salary ||
        req.body.deducted_salry ||
        req.body.faculty ||
        req.body.department ||
        req.body.role ||
        req.body.dayoff ||
        req.body.officelocation
      ) {
        return res.json({ msg: "You are not authorized to to this" });
      } else {
        // res.send("herenotHR");
        const updateduser = await members.findOneAndUpdate(
          { id: req.id },
          req.body,
          { upsert: true }
        );
        res.send(updateduser); //byb2a updated bas msh hena
      }
    }
    if (req.tokenrole === "HR") {
      //res.send("hereHR");
      //faculty
      if (req.body.faculty) {
        const facId = await faculties.findOne({ name: req.body.faculty });
        if (!facId) {
          return res.json({ msg: "This faculty doesn't exist in my db" });
        }

        existingUser.faculty = facId._id;
      }
      if (req.body.department) {
        const depId = await departments.findOne({ name: req.body.department });
        if (!depId) {
          return res.json({ msg: "This dep doesn't exist in my db" });
        }

        existingUser.department = depId._id;
      }
      if (req.body.officelocation) {
        const locId = await locations.findOne({
          name: req.body.officelocation,
        });
        if (!locId) {
          return res.json({ msg: "This location doesn't exist in my db" });
        }
        return res.send(
          "Please Update your location through Update memeber in Hr :)"
        );
      }
      if (req.body.deducted_salry) {
        existingUser.deducted_salry = req.body.deducted_salry;
      }
      if (req.body.initial_salary) {
        existingUser.initial_salary = req.body.initial_salary;
      }
      if (req.body.dayoff) {
        existingUser.dayoff = req.body.dayoff;
      }
      if (req.body.role) {
        existingUser.role = req.body.role;
      }
      if (req.body.bio) {
        existingUser.bio = req.body.bio;
      }
      if (req.body.gender) {
        existingUser.gender = req.body.gender;
      }
      const updateduser = await existingUser.save();
      const myuser = await await members
        .findOne({ id: req.id })
        .select(["-password", "-_id"])
        .populate({ path: "officelocation", select: { _id: 0, locname: 1 } })
        .populate({ path: "department", select: { _id: 0, name: 1 } })
        .populate({ path: "faculty", select: { _id: 0, name: 1 } });

      //res.json({myuser});
      res.json({ msg: "User Updated Successfully" }); //byb2a updated bas msh hena
    }
  } catch (error) {
    res.json({ msg: error.message });
  }
});

app.put("/resetPassword", auth, async (req, res) => {
  try {
    const existingUser = await members.findOne({ id: req.id });
    if (!existingUser) {
      return res.json({ msg: "This User doesn't Exist in my Database" });
    }
    let { oldPassword, newPassword, passwordCheck } = req.body;
    const check = {
      oldPassword: oldPassword,
      newPassword: newPassword,
      passwordCheck: passwordCheck,
    };
    const result = resetPassordCheck.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }
    if (oldPassword === "123456") {
      return res.json({
        msg:
          "This is your First time reseting your password please refer to the /resetFirstPassword",
      });
    }

    const ismatched = await bcrypt.compare(oldPassword, existingUser.password);
    if (!ismatched) {
      return res.json({
        msg: "Your Current Password doesn't match ur password",
      });
    }

    if (ismatched && newPassword === oldPassword) {
      return res.json({ msg: "You didn't change the password" });
    }

    if (newPassword === "123456") {
      return res.json({
        msg: "You aren't allowed to go back to the default password",
      });
    }

    if (newPassword != passwordCheck) {
      return res.json({ msg: "Password must match" });
    }
    const salt = await bcrypt.genSalt(); //salt is random text
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatepass = await members.updateOne(
      { id: req.id },
      { password: hashedPassword }
    );

    return res.json({ msg: "Password Updated!" });
  } catch (error) {
    res.json({ msg: error.message });
  }
});

// app.get('/logout', (req, res) => {
//  res.send("this is the role before clear "+req.tokenrole+"and this is subosdedly the token" +req.token+"the hearder "+req.header('auth-token'))
// req.header('auth-token')='';
// res.send("This is my role after i logged out ?? "+req.tokenrole)

// })

app.get("/signin", auth, async (req, res) => {
  try {
    const existingUser = await await members
      .findOne({ id: req.id })
      .select(["-password", "-faculty", "-department", "-officelocation"]);
    if (!existingUser) {
      return res.json({ msg: "This User doesn't Exist in my Database" });
    }

    // existingUser.signinglist.pop();

    //get last element shof hya sign in wala sign out w law f nafs el yom
    //if i just signed in w ba-sign in tani f nafs el yom

    const signlistarray = existingUser.signinglist;

    const signinlist = signlistarray.filter(
      (elem) =>
        elem.signtype === "signin" &&
        moment(elem.created).isSame(moment().format(), "day")
    );

    var signoutlist = signlistarray.filter(
      (elem) =>
        elem.signtype === "signout" &&
        moment(elem.created).isSame(moment().format(), "day")
    );
    const difference = signinlist.length - signoutlist.length; //0

    // const difference =signinlist.length-signlistarray.length;//0

    if (signinlist.length != 0 && difference != 0) {
      return res.json({
        msg:
          "You are trying to sign in again within the same day without signing out!!!",
      });
    }

    // //sign in 3altool
    let hour = `${
      moment().hour() < 7
        ? "07"
        : moment().hour() >= 7 && moment().hour() < 10
        ? "0" + moment().hour()
        : moment().hour()
    }`;
    //Any signin before 7 is considered 7 and ZERO minutes
    let min = `${
      moment().hour() < 7
        ? "00"
        : moment().minute() < 10
        ? "0" + moment().minute()
        : moment().minute()
    }`;
    let day = `${
      moment().date() < 10 ? "0" + moment().date() : moment().date()
    }`;
    //.month() function returns the month-1

    let month = `${
      moment().month() + 1 < 10
        ? "0" + (moment().month() + 1)
        : moment().month() + 1
    }`;
    let year = `${moment().year()}`;

    existingUser.signinglist.push({
      signtype: "signin",
      created: `${year}-${month}-${day}T${hour}:${min}`,
    });
    await existingUser.save();
    console.log();
    res.json({ msg: "Sucessfully signed in" });
    res.json({ existingUser });
  } catch (error) {
    res.json({ msg: error.message });
  }
});

app.get("/signout", auth, async (req, res) => {
  try {
    const existingUser = await await members
      .findOne({ id: req.id })
      .select(["-password", "-faculty", "-department", "-officelocation"]);
    if (!existingUser) {
      return res.json({ msg: "This User doesn't Exist in my Database" });
    }
    let hour = `${
      moment().hour() > 19
        ? "19"
        : moment().hour() >= 7 && moment().hour() < 10
        ? "0" + moment().hour()
        : moment().hour()
    }`;
    //Any signin before 7 is considered 7 and ZERO minutes
    let min = `${
      moment().hour() >= 19
        ? "00"
        : moment().minute() < 10
        ? "0" + moment().minute()
        : moment().minute()
    }`;
    let day = `${
      moment().date() < 10 ? "0" + moment().date() : moment().date()
    }`;
    //.month() function returns the month-1
    let month = `${
      moment().month() + 1 < 10
        ? "0" + (moment().month() + 1)
        : moment().month() + 1
    }`;
    let year = `${moment().year()}`;

    const signlistarray = existingUser.signinglist;

    const signinlist = signlistarray.filter(
      (elem) =>
        elem.signtype === "signin" &&
        moment(moment(elem.created).format()).isSame(moment().format(), "day")
    );
    var signoutlist = signlistarray.filter(
      (elem) =>
        elem.signtype === "signout" &&
        moment(moment(elem.created).format()).isSame(moment().format(), "day")
    );
    const difference = signinlist.length - signoutlist.length; //0

    if (signinlist.length === 0) {
      return res.json({ msg: "You can't signout because u didn't sign in " });
    }
    if (signinlist.length === signoutlist.length) {
      return res.json({
        msg:
          "You can't signout because there are only equal number of signins and outs",
      });
    }

    var attendmonth = parseInt(month);
    var attendedyear = year;
    if (parseInt(day) < 11) {
      if (parseInt(month) === 1) {
        attendmonth = 12;
        attendedyear = year - 1;
      } else {
        attendmonth = parseInt(month) - 1;
      }
    }
    var attendedmonthstring =
      attendmonth < 10 ? "0" + attendmonth : attendmonth;

    const monthlyrecord = await months.findOne({
      id: req.id,
      month: attendmonth,
      year: attendedyear,
    });
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let holiday =
      existingUser.dayoff === weekdays[moment().day()] || moment().day() === 5
        ? 0
        : 1;
    if (!monthlyrecord) {
      //console.log("here?")
      //if attended month is
      const hrspent = dateDifference(
        moment(`${year}-${month}-${day}T${hour}:${min}`),
        moment(signinlist[0].created)
      );

      const newrecord = new months({
        id: req.id,
        month: attendmonth,
        year: attendedyear,
        attendeddays: holiday,
        attendedhrsinMin: hrspent,
        acceptedleavescount: [],
        acceptedCompensationscount: [],
      });
      await newrecord.save();
    } else {
      monthlyrecord.attendedhrsinMin =
        monthlyrecord.attendedhrsinMin +
        dateDifference(
          moment(`${year}-${month}-${day}T${hour}:${min}`),
          moment(signinlist[signinlist.length - 1].created)
        );

      // console.log(signoutlist.length)

      if (signoutlist.length === 0) {
        //if enharda included f leave list then holiday bzero
        if (monthlyrecord.acceptedleavescount.includes(moment().date())) {
          holiday = 0;
        }
        if (
          monthlyrecord.acceptedCompensationscount.includes(
            moment().date() && existingUser.dayoff === weekdays[moment().day()]
          )
        ) {
          holiday = 1;
        }
        monthlyrecord.attendeddays = monthlyrecord.attendeddays + holiday;
      }

      await monthlyrecord.save();
    }

    existingUser.signinglist.push({
      signtype: "signout",
      created: `${year}-${month}-${day}T${hour}:${min}`,
    });
    await existingUser.save();
    res.json({ msg: "You have signed out sucessfully" });
    res.json({ existingUser });
  } catch (error) {
    res.json({ msg: error.message });
  }
});

app.get("/logout", auth, async (req, res) => {
  try {
    const authtoken = req.header("auth-token");
    const token = new expiredtoken({
      expired: authtoken,
    });
    await token.save();

    res.send("LoggedOut !");
  } catch (error) {
    //important
    res.json({ msg: error.message });
  }
});

//////////// SANDYY NEW ROUTESS//////////

app.get("/viewNotifications", auth, async (req, res) => {
  try {
    const existingUser = await members
      .findOne({ id: req.id })
      .select(["notifications", "-_id"]);
    if (!existingUser) {
      return res.status(400).send("This User doesn't Exist in my Database");
    }

    res.send(existingUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/////////////////////////////////////////////////////MARTHA/////////////////////////////////////////////////////
/////////////////////////////////////////////////////MARTHA/////////////////////////////////////////////////////
/////////////////////////////////////////////////////HR/////////////////////////////////////////////////////
app.get("/viewLocations", auth, async (req, res) => {
  try {
    const existingUser = await members
      .findOne({ id: req.id })
      .select(["notifications", "-_id"]);
    if (!existingUser) {
      return res.json({ msg: "This User doesn't Exist in my Database" });
    }
    if (req.tokenrole != "HR") {
      return res.json({ msg: "You are not authorized to do this" });
    }

    const existingLocation = await locations.find();
    res.send({ existingLocation });
  } catch (error) {
    res.json({ msg: error.message });
  }
});

app.post("/addlocation", auth, async (req, res) => {
  try {
    const mawgood = await members.findOne({ id: req.id });
    if (!mawgood) {
      return res.json({
        msg: "This User(token) making the request doesn't Exist in my Database",
      });
    }

    if (req.tokenrole != "HR") {
      return res.json({ msg: "You are not authorized to do this" });
    }

    let { locname, capacity, loctype } = req.body; //cannot be const 3ashan bghyar el value bta3et displanyName

    const check = {
      locname: locname,
      capacity: capacity,
      loctype: loctype,
    };

    const result = schemalocation.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }

    if (!locname) {
      return res.json({ msg: "Please enter a name" });
    }
    if (!capacity) {
      return res.json({ msg: "Please enter a capacity" });
    }
    if (capacity < 0) {
      return res.json({ msg: "Please enter a valid capacity" });
    }
    if (!loctype) {
      return res.json({ msg: "Please enter a location type" });
    }

    const existingLocation = await locations.findOne({ locname: locname });
    if (existingLocation) {
      return res.json({ msg: "Location already exists" });
    }

    const newLoc = new locations({
      locname: locname,
      capacity,
      capacity,
      loctype: loctype,
    });
    const savedLoc = await newLoc.save();
    res.json({ savedLoc });
  } catch (error) {
    //important
    res.json({ msg: error.message });
  }
});

app.put("/locations/:locname", auth, async (req, res) => {
  try {
    const mawgood = await members.findOne({ id: req.id });
    if (!mawgood) {
      return res.json({
        msg: "This User(token) making the request doesn't Exist in my Database",
      });
    }
    if (req.tokenrole != "HR") {
      return res.json({ msg: "You are not authorized to do this" });
    }
    let { locname, capacity, loctype } = req.body;

    const check = {
      locname: locname,
      capacity: capacity,
      loctype: loctype,
    };

    const result = schemalocation2.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }

    const existingloc = await locations.findOne({
      locname: req.params.locname,
    });
    if (!existingloc) {
      return res.json({ msg: "location not found" });
    }

    if (loctype != null) {
      var amaken = ["lecture hall", "tutorial room", "offices", "lab"];
      var n = amaken.includes(loctype);
      if (!n)
        return res.json({
          msg:
            "Please enter a correct location type from these ['lecture hall', 'tutorial room','offices','lab']",
        });
    }

    if (locname) {
      const existingloc2 = await locations.findOne({ locname: locname });
      if (existingloc2) {
        return res.json({ msg: "location already exists" });
      }
      existingloc.locname = locname;
    }
    if (capacity) {
      existingloc.capacity = capacity;
    }
    if (loctype) {
      existingloc.loctype = loctype;
    }
    const savedLoc = await existingloc.save();
    res.json(savedLoc);
  } catch (error) {
    //important
    res.json({ msg: error.message });
  }
});

app.delete("/locations/:locname", auth, async (req, res) => {
  try {
    const mawgood = await members.findOne({ id: req.id });
    if (!mawgood) {
      return res.json({
        msg: "This User(token) making the request doesn't Exist in my Database",
      });
    }

    if (req.tokenrole != "HR") {
      return res.json({ msg: "You are not authorized to do this" });
    }
    const existingloc = await locations.findOne({
      locname: req.params.locname,
    });
    if (!existingloc) {
      return res.json({ msg: "location not found" });
    }

    const removedLoc = await locations.findOneAndRemove({
      locname: req.params.locname,
    });

    let arrayOfmems = await members
      .find({ officelocation: removedLoc._id })
      .exec();

    var i;
    for (i = 0; i < (await arrayOfmems).length; i++) {
      let oldmem = arrayOfmems[i];
      oldmem.officelocation = undefined;
      await oldmem.save();
    }

    let arrayOfslots = await slots.find({ location: removedLoc._id }).exec();

    var i;
    for (i = 0; i < (await arrayOfslots).length; i++) {
      let oldslot = arrayOfslots[i];
      oldslot.location = undefined;
      await oldslot.save();
    }
    res.json({ removedLoc });
  } catch (error) {
    //important
    res.json({ msg: error.message });
  }
});

////////////////////////////////////////////
app.get("/viewFaculties", auth, async (req, res) => {
  try {
    const existingUser = await members
      .findOne({ id: req.id })
      .select(["notifications", "-_id"]);
    if (!existingUser) {
      return res.json({ msg: "This User doesn't Exist in my Database" });
    }
    if (req.tokenrole != "HR") {
      return res.json({ msg: "You are not authorized to do this" });
    }

    const existingFaculty = await faculties.find();
    res.send({ existingFaculty });
  } catch (error) {
    res.json({ msg: error.message });
  }
});

app.post("/addfaculty", auth, async (req, res) => {
  try {
    const mawgood = await members.findOne({ id: req.id });
    if (!mawgood) {
      return res.json({
        msg: "This User(token) making the request doesn't Exist in my Database",
      });
    }

    if (req.tokenrole != "HR") {
      return res.json({ msg: "You are not authorized to do this" });
    }

    let { name } = req.body; //cannot be const 3ashan bghyar el value bta3et

    const check = {
      name: name,
    };

    const result = schemafaculty.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }

    if (!name) {
      return res.json({ msg: "Please enter a name" });
    }

    const existingFaculty = await faculties.findOne({ name: name });
    if (existingFaculty) {
      return res.json({ msg: "faculty already exists" });
    }

    const newFac = new faculties({
      name: name,
    });
    const savedFac = await newFac.save();
    res.json(savedFac);
  } catch (error) {
    //important
    res.json({ msg: error.message });
  }
});

app.put("/faculties/:name", auth, async (req, res) => {
  try {
    const mawgood = await members.findOne({ id: req.id });
    if (!mawgood) {
      return res.json({
        msg: "This User(token) making the request doesn't Exist in my Database",
      });
    }
    if (req.tokenrole != "HR") {
      return res.json({ msg: "You are not authorized to do this" });
    }
    let { name } = req.body;

    const check = {
      name: name,
    };

    const result = schemafaculty.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }

    const existingfac = await faculties.findOne({ name: req.params.name });
    if (!existingfac) {
      return res.json({ msg: "faculty not found" });
    }
    if (!name) {
      return res.json({ msg: "please enter a new name" });
    }
    const repeatedFac = await faculties.findOne({ name: name });
    if (repeatedFac) {
      return res.json({
        msg: "Cannot use this name as it already exists in system",
      });
    }

    faculties.findOne({ name: req.params.name }).then((fac) => {
      fac.name = name;
      fac.save();
      res.json(fac);
    });
  } catch (error) {
    //important
    res.json({ msg: error.message });
  }
});

app.delete("/faculties/:name", auth, async (req, res) => {
  try {
    const mawgood = await members.findOne({ id: req.id });
    if (!mawgood) {
      return res.json({
        msg: "This User(token) making the request doesn't Exist in my Database",
      });
    }

    if (req.tokenrole != "HR") {
      return res.json({ msg: "You are not authorized to do this" });
    }
    const existingfac = await faculties.findOne({ name: req.params.name });
    if (!existingfac) {
      return res.json({ msg: "faculty not found in system" });
    }

    const removedFac = await faculties.findOneAndRemove({
      name: req.params.name,
    });

    // await departments.deleteMany({faculty:removedFac._id});

    let arrayOfdeps = await departments
      .find({ faculty: removedFac._id })
      .exec();

    var i;
    for (i = 0; i < (await arrayOfdeps).length; i++) {
      let olddep = arrayOfdeps[i];
      olddep.faculty = undefined;
      await olddep.save();
    }

    ////

    let arrayOfmems = await members.find({ faculty: removedFac._id }).exec();

    var i;
    for (i = 0; i < (await arrayOfmems).length; i++) {
      let oldmem = arrayOfmems[i];
      oldmem.faculty = undefined;
      await oldmem.save();
    }

    res.json(removedFac);
  } catch (error) {
    //important
    res.json({ msg: error.message });
  }
});

///////////////////////////////
app.get("/viewDepartments", auth, async (req, res) => {
  try {
    const existingUser = await members
      .findOne({ id: req.id })
      .select(["notifications", "-_id"]);
    if (!existingUser) {
      return res.json({ msg: "This User doesn't Exist in my Database" });
    }
    if (req.tokenrole != "HR") {
      return res.json({ msg: "You are not authorized to do this" });
    }

    const existingDepartment = await departments
      .find()
      .populate({ path: "faculty", select: { _id: 0, name: 1 } })
      .populate({ path: "head", select: { _id: 0, name: 1 } });

    res.send({ existingDepartment });
  } catch (error) {
    res.json({ msg: error.message });
  }
});

app.post("/adddepartment", auth, async (req, res) => {
  try {
    const mawgood = await members.findOne({ id: req.id });
    if (!mawgood) {
      return res.json({
        msg: "This User(token) making the request doesn't Exist in my Database",
      });
    }
    if (req.tokenrole != "HR") {
      return res.json({ msg: "You are not authorized to to this" });
    }

    let { name, facultyname, head } = req.body;

    if (!facultyname) {
      return res.json({ msg: "Please enter a faculty" });
    }
    let facultyfinder = await faculties.findOne({ name: facultyname });
    if (!facultyfinder) {
      return res.json({ msg: "Please enter an existing faculty" });
    }
    let faculty = facultyfinder._id;

    //console.log(faculty)
    const check = {
      name: name,
      facultyname: facultyname,
      // head: head,
    };

    const result = schemadepartment.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }

    if (!name) {
      return res.json({ msg: "Please enter a name" });
    }

    const existingdep = await departments.findOne({ name: name });
    if (existingdep) {
      return res.json({ msg: "department already exists" });
    }
    if (head) {
      return res.json({
        msg: "You can only assign head through update member's role",
      });
    }
    const newdep = new departments({
      name: name,
      faculty: faculty,
      head: head,
    });
    const saveddep = await newdep.save();
    res.json(saveddep);
  } catch (error) {
    //important
    res.json({ msg: error.message });
  }
});

app.put("/departments/:name", auth, async (req, res) => {
  try {
    const mawgood = await members.findOne({ id: req.id });
    if (!mawgood) {
      return res.json({
        msg: "This User(token) making the request doesn't Exist in my Database",
      });
    }
    if (req.tokenrole != "HR") {
      return res.json({ msg: "You are not authorized to do this" });
    }
    let { name, facultyname, head } = req.body;
    let faculty;
    if (facultyname) {
      let facultyfinder = await faculties.findOne({ name: facultyname });

      if (!facultyfinder) {
        return res.json({ msg: "This is a non existing faculty" });
      }

      faculty = facultyfinder._id;
    }

    const check = {
      name: name,
      facultyname: facultyname,
    };

    const result = schemadepartment2.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }

    if (head) {
      return res.json({
        msg: "You can only assign head through update member's role",
      });
    }

    const existingdep = await departments.findOne({ name: req.params.name });
    if (!existingdep) {
      return res.json({ msg: "department not found" });
    }
    if (name) {
      const repeateddep = await departments.findOne({ name: name });
      if (repeateddep) {
        return res.json({
          msg: "Cannot use this name as it already exists in system",
        });
      }
      existingdep.name = name;
    }
    if (faculty) {
      existingdep.faculty = faculty;
    }
    if (head) {
      existingdep.head = head;
    }

    const saveddep = await existingdep.save();
    res.json(saveddep);
  } catch (error) {
    //important
    res.json({ msg: error.message });
  }
});

app.delete("/departments/:name", auth, async (req, res) => {
  try {
    const mawgood = await members.findOne({ id: req.id });
    if (!mawgood) {
      return res.json({
        msg: "This User(token) making the request doesn't Exist in my Database",
      });
    }

    if (req.tokenrole != "HR") {
      return res.json({ msg: "You are not authorized to do this" });
    }
    const existingdep = await departments.findOne({ name: req.params.name });
    if (!existingdep) {
      return res.json({ msg: "Department not found in system" });
    }

    const removedDep = await departments.findOneAndRemove({
      name: req.params.name,
    });

    let arrayOfmems = await members.find({ department: removedDep._id }).exec();

    var i;
    for (i = 0; i < (await arrayOfmems).length; i++) {
      let oldmem = arrayOfmems[i];
      oldmem.department = undefined;
      await oldmem.save();
    }

    let arrayOfCourses1 = await courses
      .find({ departments: removedDep._id })
      .exec();

    var i;
    for (i = 0; i < (await arrayOfCourses1).length; i++) {
      let oldCourse1 = arrayOfCourses1[i];
      const ind = oldCourse1.departments.indexOf(removedDep._id);
      oldCourse1.departments.splice(ind, 1);
      await oldCourse1.save();
    }

    res.json(removedDep);
  } catch (error) {
    //important
    res.json({ msg: error.message });
  }
});

///////////////////Courses
app.get("/viewCourses", auth, async (req, res) => {
  try {
    const existingUser = await members
      .findOne({ id: req.id })
      .select(["notifications", "-_id"]);
    if (!existingUser) {
      return res.json({ msg: "This User doesn't Exist in my Database" });
    }
    if (req.tokenrole != "HR") {
      return res.json({ msg: "You are not authorized to do this" });
    }

    const existingCourse = await courses
      .find()
      .populate({ path: "departments", select: { _id: 0, name: 1 } });

    res.send({ existingCourse });
  } catch (error) {
    res.json({ msg: error.message });
  }
});

app.post("/addcourse", auth, async (req, res) => {
  try {
    //res.json(req.tokenrole+" "+req.id)
    const mawgood = await members.findOne({ id: req.id });
    if (!mawgood) {
      return res.json({
        msg: "This User(token) making the request doesn't Exist in my Database",
      });
    }

    if (req.tokenrole != "HR") {
      return res.json({ msg: "You are not authorized to do this" });
    }

    //whyyyyyyyyyyyyyyyyyyy

    let {
      id,
      name,
      coordinator,
      departments_course,
      teachingassistants,
      instructors,
      slots,
    } = req.body;

    const check = {
      id: id,
      name: name,
      departments_course: departments_course,
    };

    const result = schemacourse.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }
    let d = [];
    if (departments_course) {
      var i;
      for (i = 0; i < (await departments_course).length; i++) {
        let dep = departments_course[i];

        const depch = await departments.findOne({ name: dep });
        if (!depch) {
          return res.json({ msg: "There is a non existing department" });
        }
        d.push(depch._id);
      }
    }

    if (!id) {
      return res.json({ msg: "Please enter an id" });
    }
    if (!name) {
      return res.json({ msg: "Please enter a name" });
    }
    if (coordinator) {
      return res.json({ msg: "Only course instructors can add coordinator" });
    }
    if (instructors) {
      return res.json({ msg: "HR cannot assign course members, instructors" });
    }
    if (teachingassistants) {
      return res.json({ msg: "HR cannot assign course members,TAs" });
    }
    if (slots) {
      return res.json({ msg: "HR cannot assign course members,TAs" });
    }

    const existingCourse = await courses.findOne({ id: id });
    if (existingCourse) {
      return res.json({ msg: "Course already exists" });
    }
    // whyyyyyyyyyyyyyyyyyyyyy

    const newC = new courses({
      id: id,
      name: name,
      departments: d,
    });
    const savedc = await newC.save();
    res.json(savedc);
  } catch (error) {
    //important
    res.json({ msg: error.message });
  }
});

app.put("/courses/:id", auth, async (req, res) => {
  try {
    const mawgood = await members.findOne({ id: req.id });
    if (!mawgood) {
      return res.json({
        msg: "This User(token) making the request doesn't Exist in my Database",
      });
    }
    if (req.tokenrole != "HR") {
      return res.json({ msg: "You are not authorized to do this" });
    }

    let {
      id,
      name,
      coordinator,
      departments_course,
      teachingassistants,
      instructors,
    } = req.body;

    const check = {
      id: id,
      name: name,
      departments_course: departments_course,
    };

    const result = schemacourse2.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }
    let d = [];
    if (departments_course) {
      var i;
      for (i = 0; i < (await departments_course).length; i++) {
        let dep = departments_course[i];

        const depch = await departments.findOne({ name: dep });
        if (!depch) {
          return res.json({ msg: "There is a non existing department" });
        }
        d.push(depch._id);
      }
    }

    const existingCourse = await courses.findOne({ id: id });
    if (existingCourse) {
      return res.json({ msg: "Course already exists" });
    }

    if (coordinator) {
      return res.json({ msg: "Only course instructors can add coordinator" });
    }
    if (instructors) {
      return res.json({ msg: "HR cannot assign instructors" });
    }
    if (teachingassistants) {
      return res.json({ msg: "HR does not assign TAs" });
    }

    const updatedCourse = await courses.findOne({ id: req.params.id });
    if (!updatedCourse) {
      return res.json({ msg: "This course does not exist" });
    }
    if (id) {
      updatedCourse.id = id;
    }
    if (name) {
      updatedCourse.name = name;
    }
    if (departments_course) {
      updatedCourse.departments = d;
    }

    const savedCourse = await updatedCourse.save();
    res.json(savedCourse);
  } catch (error) {
    //important
    res.json({ msg: error.message });
  }
});

app.delete("/courses/:id", auth, async (req, res) => {
  try {
    const mawgood = await members.findOne({ id: req.id });
    if (!mawgood) {
      return res.json({
        msg: "This User(token) making the request doesn't Exist in my Database",
      });
    }

    if (req.tokenrole != "HR") {
      return res.json({ msg: "You are not authorized to do this" });
    }
    const existingC = await courses.findOne({ id: req.params.id });
    if (!existingC) {
      return res.json({ msg: "Course not found in system" });
    }

    const removedc = await courses.findOneAndRemove({ id: req.params.id });
    // let arrayOfslots=await slots.find({ courseId: removedc._id}).exec();

    // var i;
    // for(i=0;i<(await arrayOfslots).length;i++){
    //     let oldslot=arrayOfslots[i];
    //     oldslot.courseId=undefined
    //     await oldslot.save()

    // }
    await slots.deleteMany({ courseId: removedc._id });
    res.json(removedc);
  } catch (error) {
    //important
    res.json({ msg: error.message });
  }
});

/////Members

app.get("/viewmember/:id", auth, async (req, res) => {
  try {
    const existingUser = await members
      .findOne({ id: req.id })
      .select(["notifications", "-_id"]);
    if (!existingUser) {
      return res.json({ msg: "This User doesn't Exist in my Database" });
    }
    if (req.tokenrole != "HR") {
      return res.json({ msg: "You are not authorized to do this" });
    }

    if (!req.params.id) {
      return res.json({ msg: "Please Enter the members id" });
    }
    if (req.params.id === "") {
      return res.json({ msg: "Please Enter the members id" });
    }

    const m = await members.findOne({ id: req.params.id });
    if (!m) {
      return res.json({ msg: "This member doesn't exist in my db" });
    }
    const member = await members
      .findOne({ id: req.params.id })
      .populate({ path: "officelocation", select: { _id: 0, locname: 1 } })
      .populate({ path: "department", select: { _id: 0, name: 1 } })
      .populate({ path: "faculty", select: { _id: 0, name: 1 } });

    res.send({ member });
  } catch (error) {
    res.json({ msg: error.message });
  }
});
app.post("/addmember", auth, async (req, res) => {
  try {
    const mawgood = await members.findOne({ id: req.id });
    if (!mawgood) {
      return res.json({
        msg: "This User(token) making the request doesn't Exist in my Database",
      });
    }
    if (req.tokenrole != "HR") {
      return res.json({ msg: "You are not authorized to do this" });
    }

    let {
      name,
      email,
      initial_salary,
      role,
      dayoff,
      office,
      faculty,
      department,
      deducted_salry,
      bio,
      gender,
    } = req.body; //cannot be const 3ashan bghyar el value bta3et displanyName
    if (!office) {
      return res.json({ msg: "Please enter an office location" });
    }
    let officelocationfinder = await locations.findOne({ locname: office });
    if (!officelocationfinder) {
      return res.json({
        msg: "Please enter a valid office location for this member that exists",
      });
    }
    let officelocation = officelocationfinder._id;
    if (officelocationfinder.loctype != "offices") {
      return res.json({
        msg:
          "Please enter a valid office location for this member that is an office",
      });
    }
    let f, d;
    if (department) {
      const depch = await departments.findOne({ name: department });
      if (!depch) {
        return res.json({ msg: "This department does not exist" });
      }
      d = depch._id;
    }

    if (faculty) {
      const fac = await faculties.findOne({ name: faculty });
      if (!fac) {
        return res.json({ msg: "This Faculty does not exist" });
      }
      f = fac._id;
    }

    const check = {
      gender: gender,
      name: name,
      email: email,
      dayoff: dayoff,
      gender: gender,
      initial_salary: initial_salary,
      role: role,
      faculty: faculty,
      department: department,
      office: office,
      bio: bio,
    };

    const result = schemamember.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }

    if (!gender) {
      return res.json({ msg: "Please enter a gender" });
    }
    if (gender != null) {
      var amaken = ["Female", "Male"];
      var n = amaken.includes(gender);
      if (!n)
        return res.json({
          msg: "Please enter a correct gender from these ['Female' , 'Male']",
        });
    }
    if (!name) {
      return res.json({ msg: "Please enter a name" });
    }
    if (!role) {
      return res.json({ msg: "Please enter a role" });
    }
    if (role == "HOD" && !department) {
      return res.json({
        msg: "Please enter a department for member to be head",
      });
    }
    if (!email) {
      return res.json({ msg: "Please enter valid email" });
    }

    if (!initial_salary) {
      return res.json({ msg: "Please enter an initial_salary" });
    }

    var nasfeloffice = 0;
    nasfeloffice = (await members.find({ officelocation: officelocation }))
      .length;

    const existingLocation = await locations.findOne({ locname: office });

    if (nasfeloffice == existingLocation.capacity) {
      return res.json({
        msg:
          "Cannot add member to this office, full capacity reached " +
          nasfeloffice +
          " in capacity " +
          existingLocation.capacity +
          "",
      });
    }

    if (nasfeloffice > existingLocation.capacity) {
      return res.json({
        msg:
          "Cannot add member to this office, full capacity reached " +
          nasfeloffice +
          " in capacity " +
          existingLocation.capacity +
          "",
      });
    }

    if (initial_salary < 0) {
      return res.json({ msg: "Please enter a valid initial_salary" });
    }
    const existingUser2 = await members.findOne({ email: email });
    if (existingUser2) {
      return res.json({ msg: "This email is already registered" });
    }
    let id = "";
    if (role == "HR") {
      dayoff = "Saturday";
      let index = await counters.findOne({ idtype: "hr-" });

      if (!index) {
        const newCount = new counters({
          idtype: "hr-",
          count: 0,
        });
        await newCount.save();
      }
      let index2 = await counters.findOne({ idtype: "hr-" });
      let newmemNum = index2.count + 1;

      id = index2.idtype + "" + newmemNum;
    }
    if (role != "HR") {
      dayoff = "Saturday";

      let index = await counters.findOne({ idtype: "ac-" });

      if (!index) {
        const newCount = new counters({
          idtype: "ac-",
          count: 0,
        });
        await newCount.save();
      }
      let index2 = await counters.findOne({ idtype: "ac-" });
      let newmemNum = index2.count + 1;

      id = index2.idtype + "" + newmemNum;
    }

    // //         let count=0;
    //         let id="";
    //        if(role=='HR'){

    // //        count=  (await members.find({role:role})).length+1

    //               id="hr-"
    //            dayoff="Saturday"

    //       }
    //         if(role!='HR'){

    // //             count=  (await members.find({role:role})).length+1

    //             dayoff="Saturday"
    //              id="ac-"
    //       }

    //    let count=1;

    //  id2=id+count

    //         while(await members.findOne({ id: id2 }))
    //        {    count=count+1;
    //             id2=id+count

    //         }
    //         id=id2

    let annualLeaveBalance = 2.5;
    let accidentalLeaves = 6;
    let password = "123456";
    const salt = await bcrypt.genSalt(); //salt is random text
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new members({
      id: id,
      name: name,
      email: email,
      password: hashedPassword,
      initial_salary: initial_salary,
      dayoff: dayoff,
      role: role,
      gender: gender,
      faculty: f,
      department: d,
      deducted_salry: deducted_salry,
      officelocation: officelocation,
      bio: bio,
      annualLeaveBalance: annualLeaveBalance,
      accidentalLeaves: accidentalLeaves,
    });
    const savedUser = await newUser.save();
    res.json({ savedUser });
    if (savedUser.role == "HR") {
      let updatecount = await counters.findOne({ idtype: "hr-" });
      updatecount.count += 1;

      await updatecount.save();
    }
    if (savedUser.role != "HR") {
      let updatecount = await counters.findOne({ idtype: "ac-" });
      updatecount.count += 1;

      await updatecount.save();
    }

    if (savedUser.role == "HOD") {
      departments.findOne({ _id: d }).then((dep) => {
        dep.head = savedUser._id;
        dep.save();
      });
    }
  } catch (error) {
    //important
    res.json({ msg: error.message });
  }
});

app.delete("/members/:id", auth, async (req, res) => {
  try {
    // req.id=undefined
    // res.json(req.tokenrole+" "+req.id)
    const mawgood = await members.findOne({ id: req.id });
    if (!mawgood) {
      return res.json({
        msg: "This User(token) making the request doesn't Exist in my Database",
      });
    }
    if (req.tokenrole != "HR") {
      return res.json({ msg: "You are not authorized to do this" });
    }
    const existingM = await members.findOne({ id: req.params.id });
    if (!existingM) {
      return res.json({ msg: "Member not found in system" });
    }

    const removedc = await members.findOneAndRemove({ id: req.params.id });

    await months.deleteMany({
      id: req.params.id,
    });

    let arrayOfCourses = await courses
      .find({ coordinator: removedc._id })
      .exec();

    var i;
    for (i = 0; i < (await arrayOfCourses).length; i++) {
      let oldCourse = arrayOfCourses[i];
      oldCourse.coordinator = undefined;
      await oldCourse.save();
    }

    let arrayOfCourses1 = await courses
      .find({ instructors: removedc._id })
      .exec();

    var i;
    for (i = 0; i < (await arrayOfCourses1).length; i++) {
      let oldCourse1 = arrayOfCourses1[i];
      const ind = oldCourse1.instructors.indexOf(removedc._id);
      oldCourse1.instructors.splice(ind, 1);
      await oldCourse1.save();
    }

    let arrayOfCourses2 = await courses
      .find({ teachingassistants: removedc._id })
      .exec();

    var i;
    for (i = 0; i < (await arrayOfCourses2).length; i++) {
      let oldCourse2 = arrayOfCourses2[i];
      const ind = oldCourse2.teachingassistants.indexOf(removedc._id);
      oldCourse2.teachingassistants.splice(ind, 1);
      await oldCourse2.save();
    }

    let arrayOfdeps = await departments.find({ head: removedc._id }).exec();

    var i;
    for (i = 0; i < (await arrayOfdeps).length; i++) {
      let olddep = arrayOfdeps[i];
      olddep.head = undefined;
      await olddep.save();
    }
    let arrayOfslots = await slots.find({ teachingid: removedc._id }).exec();

    var i;
    for (i = 0; i < (await arrayOfslots).length; i++) {
      let oldslot = arrayOfslots[i];
      oldslot.teachingid = undefined;
      oldslot.assigned = false;
      await oldslot.save();
    }

    // courses.update( { coordinator: removedc }, { $unset: {"coordinator": ""}},{ multi: true });
    res.json({ success: "This User has been removed !" });
    res.json(removedc);
  } catch (error) {
    //important
    res.json({ msg: error.message });
  }
});

app.get("/attendance/:id", auth, async (req, res) => {
  try {
    const mawgood = await members.findOne({ id: req.id });
    if (!mawgood) {
      return res.json({
        msg: "This User(token) making the request doesn't Exist in my Database",
      });
    }
    if (req.tokenrole != "HR") {
      return res.json({ msg: "You are not authorized to do this" });
    }

    const fetchedMembers = await members
      .findOne({ id: req.params.id })
      .select("signinglist");

    res.json({ fetchedMembers });
  } catch (error) {
    res.json({ msg: error.message });
  }
});
//Need to Modify??
app.put("/members/missesdays", auth, async (req, res) => {
  try {
    const existingUser = await members.findOne({ id: req.id });
    if (!existingUser) {
      return res.json({ msg: "This User doesn't Exist in my Database" });
    }
    if (req.tokenrole != "HR") {
      return res.json({ msg: "You are not authorized to do this" });
    }
    var { month, year } = req.body;

    const check = {
      month: month,
      year: year,
    };

    const result = schemamiss.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }

    if (!month) {
      return res.json({ msg: "Please enter a month and year" });
    }
    if (!year) {
      return res.json({ msg: "Please enter a month and year" });
    }
    if (typeof month === "string") {
      month = parseInt(month);
    }
    if (typeof year === "string") {
      year = parseInt(year);
    }
    let monthly = await months.find({ month: month, year: year }).exec();
    if (!monthly) {
      return res.json({ msg: "Couldn't find the record Not yet calculated" });
    }

    var output = [];
    var i;
    for (i = 0; i < (await monthly).length; i++) {
      const weekdays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      console.log(monthly[i].dayoff);
      const dayoffindex = weekdays.indexOf(monthly[i].dayoff);
      console.log(dayoffindex);
      var month2 = month + 1;
      var year2 = year;

      if (month === 12) {
        month2 = 1;
        year2 = year + 1;
      }

      var daystoattend = 0;
      //   console.log(moment(`${year2}-${month2}-${10}`,"YYYY-MM-DD").isAfter(moment().format("YYYY-MM-DD"),'day'))
      console.log("!!!hena");
      if (
        moment(`${year2}-${month2}-${10}`, "YYYY-MM-DD").isAfter(
          moment().format("YYYY-MM-DD"),
          "day"
        )
      ) {
        let y = `${moment().year()}`;
        let m = `${moment().month() + 1}`;
        let d = `${moment().date()}`;

        if (month < 10) {
          month = "0" + month;
        }
        if (m < 10) {
          m = "0" + month;
        }

        console.log("++!hena");
        daystoattend = calcBusinessDays(
          `${year}-${month}-${11}`,
          `${y}-${m}-${d}`,
          dayoffindex,
          monthly[i].acceptedleavescount
        );
        console.log("hena");
      } else {
        daystoattend = calcBusinessDays(
          moment(`${year}-${month}-${11}`, "YYYY-MM-DD"),
          moment(`${year2}-${month2}-${10}`, "YYYY-MM-DD"),
          dayoffindex,
          monthly[i].acceptedleavescount
        );
        console.log("?");
      }

      //console.log(daystoattend+" "+ monthly.attendeddays)
      var missingdays = daystoattend - monthly[i].attendeddays;

      if (missingdays > 0) {
        output.push(await members.findOne({ id: monthly[i].id }));
      }
    }
    res.json({ output });
  } catch (error) {
    res.json({ error: error.message });
  }
});
///

app.put("/members/misseshrs", auth, async (req, res) => {
  try {
    const existingUser = await members.findOne({ id: req.id });
    if (!existingUser) {
      return res.json({ msg: "This User doesn't Exist in my Database" });
    }
    if (req.tokenrole != "HR") {
      return res.json({ msg: "You are not authorized to do this" });
    }
    var { month, year } = req.body;

    const check = {
      month: month,
      year: year,
    };

    const result = schemamiss.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }

    if (!month) {
      return res.json({ msg: "Please enter a month and year" });
    }
    if (!year) {
      return res.json({ msg: "Please enter a month and year" });
    }
    if (typeof month === "string") {
      month = parseInt(month);
    }
    if (typeof year === "string") {
      year = parseInt(year);
    }
    let monthly = await months.find({ month: month, year: year }).exec();
    if (!monthly) {
      return res.json({ msg: "Couldn't find the record Not yet calculated" });
    }
    var output = [];
    var i;
    for (i = 0; i < (await monthly).length; i++) {
      var mymissinghrs =
        monthly[i].attendedhrsinMin - 504 * monthly[i].attendeddays;

      if (mymissinghrs < 0) {
        output.push(await members.findOne({ id: monthly[i].id }));
      }
    }
    res.send({ output });
  } catch (error) {
    res.json({ msg: error.message });
  }
});

///Ask Martha??
app.put("/salary/:id", auth, async (req, res) => {
  try {
    const mawgood = await members.findOne({ id: req.id });
    if (!mawgood) {
      return res
        .status(400)
        .send(
          "This User(token) making the request doesn't Exist in my Database"
        );
    }

    if (req.tokenrole != "HR") {
      return res.status(400).json({ msg: "You are not authorized to do this" });
    }
    let { salary } = req.body;
    const checker = await members.findOne({ id: req.params.id });
    if (!checker) {
      return res.status(400).json({ msg: "this id does not exist" });
    }
    const check = {
      salary: salary,
    };

    const result = schemasalary.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.status(400).json(error.details[0].message);
    }

    if (!salary) {
      return res.status(400).json({ msg: "Please enter the new salary" });
    }
    if (salary < 0) {
      return res
        .status(400)
        .json({ msg: "Please enter a valid initial_salary" });
    }
    const updatedmem = await members.findOne({ id: req.params.id });
    updatedmem.initial_salary = salary;
    const savedm = await updatedmem.save();
    res.json(savedm);
  } catch (error) {
    //important
    res.status(500).json({ error: error.message });
  }
});

//probably needs modification
app.put("/updatesignout/:id", auth, async (req, res) => {
  try {
    const mawgood = await members.findOne({ id: req.id });
    if (!mawgood) {
      return res.json({
        msg: "This User(token) making the request doesn't Exist in my Database",
      });
    }

    if (req.tokenrole != "HR") {
      return res.json({ msg: "You are not authorized to do this" });
    }
    if (req.id == req.params.id) {
      return res.json({
        msg: "You are not authorized to edit your own sign in and out",
      });
    }
    const existinguser = await members.findOne({ id: req.params.id });
    if (!existinguser) {
      return res.json({ msg: "This user is not found" });
    }
    let { month, year, hour, day, min } = req.body;

    const check = {
      month: month,
      year: year,
      hour: hour,
      day: day,
      min: min,
    };

    const result = schemasign.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }

    // if (!month) {
    //     return res.status(400).json({ msg: "Please enter a month" });
    // }
    // if (!year) {
    //     return res.status(400).json({ msg: "Please enter a year" });
    // }
    // if (!hour) {
    //     return res.status(400).json({ msg: "Please enter a hour" });
    // }
    // if (!day) {
    //     return res.status(400).json({ msg: "Please enter a day" });
    // }
    // if (!min) {
    //     return res.status(400).json({ msg: "Please enter a min" });
    // }

    const signinglist = existinguser.signinglist;

    // let signoutmoment = moment(sign_out);
    let signouthour = `${hour >= 0 && hour < 10 ? "0" + hour : hour}`;
    //.month() function returns the month-1
    let signoutmin = `${
      hour >= 19 ? "00" : min >= 0 && min < 10 ? "0" + min : min
    }`;
    let signoutday = `${day < 10 ? "0" + day : day}`;
    //.month() function returns the month-1
    let signoutmonth = `${month < 10 ? "0" + month : month}`;
    let signoutyear = `${year}`;
    let dayindex = moment(
      `${signoutyear}-${signoutmonth}-${signoutday}T${signouthour}:${signoutmin}`
    ).day();
    console.log("my day index is" + dayindex);
    const signinlist = signinglist.filter(
      (elem) =>
        elem.signtype === "signin" &&
        moment(elem.created).isSame(
          moment(
            `${signoutyear}-${signoutmonth}-${signoutday}T${signouthour}:${signoutmin}`
          ),
          "day"
        )
    );
    const signoutlist = signinglist.filter(
      (elem) =>
        elem.signtype === "signout" &&
        moment(elem.created).isSame(
          moment(
            `${signoutyear}-${signoutmonth}-${signoutday}T${signouthour}:${signoutmin}`
          ),
          "day"
        )
    );

    if (signinlist.length === signoutlist.length || signinlist.length === 0) {
      return res.json({
        msg: "You can't manually add a signout with out signing in ?? ",
      });
    }

    // let monthly=await months.findOne({month:signinmonth,year:signinyear,id:req.params.id})
    // if (!monthly) {
    //    return res.status(400).send("Couldn't find the record Not yet calculated You meed to aleast Sign in")
    // }
    //console.log(signoutlist.length)
    //const weekday=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

    var attendmonth = parseInt(signoutmonth);
    var attendedyear = signoutyear;
    if (parseInt(signoutday) < 11) {
      if (parseInt(signoutmonth) === 1) {
        attendmonth = 12;
        attendedyear = signoutyear - 1;
      } else {
        attendmonth = parseInt(signoutmonth) - 1;
      }
    }
    const monthlyrecord = await months.findOne({
      id: req.params.id,
      month: attendmonth,
      year: attendedyear,
    });
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let holiday =
      existinguser.dayoff === weekdays[dayindex] || dayindex === 5 ? 0 : 1;
    if (!monthlyrecord) {
      //console.log("here?")
      const hrspent = dateDifference(
        moment(
          `${signoutyear}-${signoutmonth}-${signoutday}T${signouthour}:${signoutmin}`
        ),
        moment(signinlist[0].created)
      );

      const newrecord = new months({
        id: req.params.id,
        month: attendmonth,
        year: attendedyear,
        attendeddays: holiday,
        attendedhrsinMin: hrspent,
        acceptedleavescount: 0,
      });
      await newrecord.save();
    } else {
      monthlyrecord.attendedhrsinMin =
        monthlyrecord.attendedhrsinMin +
        dateDifference(
          moment(
            `${signoutyear}-${signoutmonth}-${signoutday}T${signouthour}:${signoutmin}`
          ),
          moment(signinlist[signinlist.length - 1].created)
        );

      // console.log(signinlist.length+"")

      if (signoutlist.length === 0) {
        //if enharda included f leave list then holiday bzero
        if (monthlyrecord.acceptedleavescount.includes(moment().date())) {
          holiday = 0;
        }
        if (
          monthlyrecord.acceptedCompensationscount.includes(
            moment().date() && existinguser.dayoff === weekdays[moment().day()]
          )
        ) {
          holiday = 1;
        }
        monthlyrecord.attendeddays = monthlyrecord.attendeddays + holiday;
      }

      await monthlyrecord.save();
    }

    // if(signoutlist.length!=0 || (existinguser.dayoff===weekday[moment(`${signinyear}-${signinmonth}-${signinday}T${signinhour}:${signinmin}`).day()]) || moment(`${signinyear}-${signinmonth}-${signinday}T${signinhour}:${signinmin}`).day()==5){
    // monthly.attendedhrsinMin=monthly.attendedhrsinMin+dateDifference(moment(`${signoutyear}-${signoutmonth}-${signoutday}T${signouthour}:${signoutmin}`),moment(`${signinyear}-${signinmonth}-${signinday}T${signinhour}:${signinmin}`))

    // }
    // else{
    //     if(signoutlist.length==0){

    //         monthly.attendedhrsinMin=monthly.attendedhrsinMin+dateDifference( moment(`${signoutyear}-${signoutmonth}-${signoutday}T${signouthour}:${signoutmin}`),moment(`${signinyear}-${signinmonth}-${signinday}T${signinhour}:${signinmin}`))
    //        // console.log(monthly.attendeddays)

    //         monthly.attendeddays=monthly.attendeddays+1
    //     }
    // }
    // signinglist.push({signtype:"signout",created:`${signoutyear}-${signoutmonth}-${signoutday}T${signouthour}:${signoutmin}`})

    // if(signoutlist.length==0){

    //     monthly.attendedhrsinMin=monthly.attendedhrsinMin+dateDifference( moment(`${signoutyear}-${signoutmonth}-${signoutday}T${signouthour}:${signoutmin}`),moment(`${signinyear}-${signinmonth}-${signinday}T${signinhour}:${signinmin}`))
    //    // console.log(monthly.attendeddays)

    //     monthly.attendeddays=monthly.attendeddays+1
    // }

    //     const att=existinguser.attendance
    //     var i;
    //     var j;
    // //  res.json(att[0].signlist[0].sign_in+" " +sign_in)
    //     for (i=0;i<att.length;i++) {
    //         for (j=0;j<att[i].signlist.length;j++) {
    //           if(sign_in==att[i].signlist[j].sign_in){
    //            //   res.json("found")
    //             att[i].signlist[j]={sign_in,sign_out}
    //           }
    //           if(sign_out==att[i].signlist[j].sign_out){
    //             att[i].signlist[j]={sign_in,sign_out}
    //           }

    //         }
    //       }
    // res.json(att[0].signlist[0].sign_in)
    // var ind = att[0].signlist.indexOf(sign_in);

    //if(!ind){
    //    ind = existinguser.attendance.signlist.indexOf({undefined,sign_out});
    //}
    //  await monthly.save()
    //    await existinguser.save()
    signinglist.push({
      signtype: "signout",
      created: `${signoutyear}-${signoutmonth}-${signoutday}T${signouthour}:${signoutmin}`,
    });
    await existinguser.save();
    res.json({ existinguser });
  } catch (error) {
    //important
    res.json({ msg: error.message });
  }
});

app.put("/updatemember/:id", auth, async (req, res) => {
  try {
    const mawgood = await members.findOne({ id: req.id });
    if (!mawgood) {
      return res.json({
        msg: "This User(token) making the request doesn't Exist in my Database",
      });
    }
    if (req.tokenrole != "HR") {
      return res.json({ msg: "You are not authorized to do this" });
    }
    let {
      name,
      role,
      office,
      faculty,
      department,
      bio,
      gender,
      salary,
    } = req.body;
    if (role == "HOD" && !department) {
      return res.json({ msg: "Please enter a department" });
    }
    let depID;
    if (department) {
      const depch = await departments.findOne({ name: department });
      if (!depch) {
        return res.json({ msg: "This department does not exist" });
      }
      depID = depch._id;
    }
    let facultyID;
    if (faculty) {
      const facch = await faculties.findOne({ name: faculty });
      if (!facch) {
        return res.json({ msg: "This faculty does not exist" });
      }
      facultyID = facch._id;
    }

    let officelocationfinder = await locations.findOne({ locname: office });
    let officelocation;
    if (officelocationfinder) {
      officelocation = (await officelocationfinder)._id;
      if (officelocationfinder.loctype != "offices") {
        return res.json({
          msg:
            "Please enter a valid office location for this member that is an office",
        });
      }
    }

    const check = {
      gender: gender,
      name: name,
      role: role,
      faculty: faculty,
      department: department,
      office: office,
      bio: bio,
      salary: salary,
    };

    const result = schemamember2.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }

    const updatedmem = await members.findOne({ id: req.params.id });
    if (!updatedmem) {
      return res.json({ msg: "Member not found" });
    }
    if (gender != null) {
      var amaken = ["Female", "Male", ""];
      var n = amaken.includes(gender);
      if (!n)
        return res.json({
          msg: "Please enter a correct gender from these ['Female' , 'Male']",
        });
    }
    if (name) {
      updatedmem.name = name;
    }

    if (role) {
      updatedmem.role = role;
      if (role == "HOD") {
        departments.findOne({ _id: department }).then((dep) => {
          dep.head = updatedmem._id;
          dep.save();
        });
      }
    }
    if (faculty) {
      updatedmem.faculty = facultyID;
    }
    if (department) {
      updatedmem.department = depID;
    }
    if (gender) {
      updatedmem.gender = gender;
    }

    if (bio) {
      updatedmem.bio = bio;
    }
    if (officelocation) {
      var nasfeloffice = 0;
      nasfeloffice = (await members.find({ officelocation: officelocation }))
        .length;

      const existingLocation = await locations.findOne({ _id: officelocation });

      if (nasfeloffice == existingLocation.capacity) {
        return res.json({
          msg:
            "Cannot add member to this office, full capacity reached " +
            nasfeloffice +
            " in capacity " +
            existingLocation.capacity +
            "",
        });
      }

      if (nasfeloffice > existingLocation.capacity) {
        return res.json({
          msg:
            "Cannot add member to this office, full capacity reached " +
            nasfeloffice +
            " in capacity " +
            existingLocation.capacity +
            "",
        });
      }
      updatedmem.officelocation = officelocation;
    }

    if (salary < 0) {
      return res.json({ msg: "Please enter a valid initial_salary" });
    }
    // const updatedmem = await members.findOne({ id: req.params.id });
    updatedmem.initial_salary = salary;
    //  const savedm = await updatedmem.save();

    const savedm = await updatedmem.save();
    res.json(savedm);
  } catch (error) {
    //important
    res.status(500).json({ msg: error.message });
  }
});

app.post("/addfirsthr", async (req, res) => {
  try {
    let deducted_salry;
    let annualLeaveBalance = 2.5;
    let accidentalLeaves = 6;
    let name = "First HR";
    let email = "hr-1@gmail.com";
    let initial_salary = 500;
    let role = "HR";
    let dayoff = "Saturday";
    let gender = "Female";
    let id = "";
    if (role == "HR") {
      let index = await counters.findOne({ idtype: "hr-" });
      if (!index) {
        const newCount = new counters({
          idtype: "hr-",
          count: 0,
        });
        await newCount.save();
      }
      let index2 = await counters.findOne({ idtype: "hr-" });
      let newmemNum = index2.count + 1;

      id = index2.idtype + "" + newmemNum;
    }
    let locname = "Admission";
    let capacity = 25;
    let loctype = "offices";

    const newLoc = new locations({
      locname: locname,
      capacity,
      capacity,
      loctype: loctype,
    });
    const savedLoc = await newLoc.save();

    let officelocation = savedLoc._id; //cannot be const 3ashan bghyar el value bta3et displanyName

    let password = "123456";
    const salt = await bcrypt.genSalt(); //salt is random text
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new members({
      id: id,
      name: name,
      email: email,
      password: hashedPassword,
      initial_salary: initial_salary,
      dayoff: dayoff,
      role: role,
      deducted_salry: deducted_salry,
      gender: gender,
      officelocation: officelocation,
      annualLeaveBalance: annualLeaveBalance,
      accidentalLeaves: accidentalLeaves,
    });

    const savedUser = await newUser.save();

    if (savedUser.role == "HR") {
      let updatecount = await counters.findOne({ idtype: "hr-" });
      updatecount.count += 1;

      await updatecount.save();
    }
    res.json(savedUser);
  } catch (error) {
    //important
    res.status(500).json({ error: error.message });
  }
});

//////////////////////////////
app.put("/updatesignin/:id", auth, async (req, res) => {
  try {
    const mawgood = await members.findOne({ id: req.id });
    if (!mawgood) {
      return res.json({
        msg: "This User(token) making the request doesn't Exist in my Database",
      });
    }

    if (req.tokenrole != "HR") {
      return res.json({ msg: "You are not authorized to do this" });
    }
    if (req.id == req.params.id) {
      return res.json({
        msg: "You are not authorized to edit your own sign in and out",
      });
    }
    const existinguser = await members.findOne({ id: req.params.id });
    if (!existinguser) {
      return res.json({ msg: "This user is not found" });
    }
    // let { sign_in } = req.body;
    // if (!sign_in) {
    //     return res.status(400).json({ msg: "Please enter a sign in time" });

    // }
    let { month, year, hour, day, min } = req.body;

    const check = {
      month: month,
      year: year,
      hour: hour,
      day: day,
      min: min,
    };

    const result = schemasign.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }

    const signinglist = existinguser.signinglist;
    //let signinmoment = moment(sign_in);
    let signinhour = `${hour >= 0 && hour < 10 ? "0" + hour : hour}`;
    //.month() function returns the month-1
    let signinmin = `${min >= 0 && min < 10 ? "0" + min : min}`;
    let signinday = `${day < 10 ? "0" + day : day}`;
    //.month() function returns the month-1
    let signinmonth = `${month < 10 ? "0" + month : month}`;
    let signinyear = `${year}`;

    const signinlist = signinglist.filter(
      (elem) =>
        elem.signtype === "signin" &&
        moment(moment(elem.created).format()).isSame(
          moment(
            `${signinyear}-${signinmonth}-${signinday}T${signinhour}:${signinmin}`
          ),
          "day"
        )
    );

    const signoutlist = signinglist.filter(
      (elem) =>
        elem.signtype === "signout" &&
        moment(moment(elem.created).format()).isSame(
          moment(
            `${signinyear}-${signinmonth}-${signinday}T${signinhour}:${signinmin}`
          ),
          "day"
        )
    );
    const difference = signinlist.length - signoutlist.length;

    if (signinlist.length != 0 && difference != 0) {
      return res.json({
        msg:
          "you can't manually sign in with out signing out there is a missing sign outt",
      });
    }
    signinglist.push({
      signtype: "signin",
      created: `${signinyear}-${signinmonth}-${signinday}T${signinhour}:${signinmin}`,
    });

    await existinguser.save();
    res.json({ existinguser });
  } catch (error) {
    //important
    res.json({ msg: error.message });
  }
});

/////////////////////////////////////////////////////MONICA/////////////////////////////////////////////////////
/////////////////////////////////////////////////////MONICA/////////////////////////////////////////////////////
/////////////////////////////////////////////////////HOD/////////////////////////////////////////////////////

app.put("/assigninstructor", auth, async (req, res) => {
  try {
    if (req.tokenrole != "HOD") {
      return res.json({ msg: "You are not authorized to do this" });
    }
    const hod = await members.findOne({ id: req.id });
    const hodDep = hod.department;

    let { instructor, courseid } = req.body;

    const check = {
      instructor: instructor,
      courseid: courseid,
    };

    const result = assigninstructor.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }

    const existinguser = await members.findOne({ id: instructor });

    if (!existinguser) {
      return res.json({ msg: "The instructor id does not exist" });
    }
    const roleuser = existinguser.role;

    if (roleuser != "Course Instructor" && instructor != req.id) {
      return res.json({ msg: "the id must belong to course instructor" });
    }
    const instDep = existinguser.department;
    console.log(instDep);
    console.log(hodDep);
    console.log(hodDep.equals(instDep));
    if (!instDep.equals(hodDep)) {
      return res.json({ msg: "Instructor does not belong to your department" });
    }
    const idconstructor = existinguser._id;

    const foundcourse = await courses.findOne({ id: courseid });

    if (foundcourse) {
      const courseInDep = foundcourse.departments.includes(hodDep);
      if (!courseInDep) {
        return res.json({ msg: "Course is not in your deparment" });
      }

      const foundin = foundcourse.instructors.includes(idconstructor);

      if (foundin) {
        return res.json({
          msg: "the instructor is already assigned to the course ",
        });
      } else {
        foundcourse.instructors.push(idconstructor);
        const savedcourse1 = await foundcourse.save();
        res.json("Instructor assigned successfully");
      }
    } else {
      //********* */
      return res.json({ msg: "Course not found" });
    }
  } catch (error) {
    res.json({ msg: error.message });
  }
});

app.delete("/removeinstructorfromcourse", auth, async (req, res) => {
  //input: course id, instructor id
  //check token is hod / check course exists/check instructor id in course
  //check course in hod dep / remove
  try {
    if (req.tokenrole != "HOD") {
      return res.json({ msg: "You are not authorized to do this" });
    }
    const hod = await members.findOne({ id: req.id });
    const hodDep = hod.department;

    let { instructor, courseid } = req.body;
    const check = {
      instructor: instructor,
      courseid: courseid,
    };
    const result = assigninstructor.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }

    const existinguser = await members.findOne({ id: instructor });
    if (!existinguser) {
      return res.json({ msg: "The instructor id does not exist" });
    }
    const roleuser = existinguser.role;
    if (roleuser != "Course Instructor" && instructor != req.id) {
      return res.json({ msg: "the id must belong to course instructor" });
    }
    const instDep = existinguser.department;
    if (!instDep.equals(hodDep)) {
      return res.json({ msg: "Instructor does not belong to your department" });
    }
    const idinstructor = existinguser._id;

    const foundcourse = await courses.findOne({ id: courseid });

    if (foundcourse) {
      const courseInDep = foundcourse.departments.includes(hodDep);
      if (!courseInDep) {
        return res.json({ msg: "Course is not in your deparment" });
      }

      const foundin = foundcourse.instructors.includes(idinstructor);

      if (!foundin) {
        return res.json({
          msg: "the instructor is not assigned to the course ",
        });
      } else {
        const ind = foundcourse.instructors.indexOf(idinstructor);
        foundcourse.instructors.splice(ind, 1);
        //remove instructor from slots in this course
        const courseslots = foundcourse.slots;
        for (const slotid of courseslots) {
          const slot = await slots.findById(slotid);
          if (slot.teachingid.equals(idinstructor)) {
            slot.teachingid = undefined;
          }
          await slot.save();
        }
        const savedcourse1 = await foundcourse.save();
        res.json("Instructor removed from course successfully");
      }
    } else {
      //********* */
      return res.json({ msg: "Course not found" });
    }
  } catch (error) {
    res.json({ msg: error.message });
  }
});

app.put("/updateinstructorcourses", auth, async (req, res) => {
  try {
    if (req.tokenrole != "HOD") {
      return res.json({ msg: "You are not authorized to do this" });
    }
    const hod = await members.findOne({ id: req.id });
    const hodDep = hod.department;

    let { instructor, oldcourse, newcourse } = req.body;

    const check = {
      instructor: instructor,
      oldcourse: oldcourse,
      newcourse: newcourse,
    };

    const result = updateinstructorcourse.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }

    const existinguser = await members.findOne({ id: instructor });

    if (!existinguser) {
      return res.json({ msg: "The instructor id does not exist" });
    }
    const roleuser = existinguser.role;

    if (roleuser != "Course Instructor" && instructor != req.id) {
      return res.json({ msg: "the id must belong to course instructor" });
    }
    const instDep = existinguser.department;
    if (!instDep.equals(hodDep)) {
      return res.json({ msg: "Instructor does not belong to your department" });
    }
    const idinstructor = existinguser._id;

    const oldCourse = await courses.findOne({ id: oldcourse });

    if (oldCourse) {
      const newCourse = await courses.findOne({ id: newcourse });
      if (newCourse) {
        const oldcourseInDep = oldCourse.departments.includes(hodDep);
        if (!oldcourseInDep) {
          return res.json({ msg: "Old Course is not in your deparment" });
        }
        const newcourseInDep = newCourse.departments.includes(hodDep);
        if (!newcourseInDep) {
          return res.json({ msg: "New Course is not in your deparment" });
        }

        const foundin = oldCourse.instructors.includes(idinstructor);

        if (!foundin) {
          return res.json({
            msg: "the instructor is not assigned to the old course ",
          });
        } else {
          const newfoundin = newCourse.instructors.includes(idinstructor);

          if (newfoundin) {
            return res.json({
              msg: "the instructor is already assigned to the new course ",
            });
          }
          const ind = oldCourse.instructors.indexOf(idinstructor);
          oldCourse.instructors.splice(ind, 1);
          const courseslots = oldCourse.slots;
          for (const slotid of courseslots) {
            const slot = await slots.findById(slotid);

            if (slot.teachingid.equals(idinstructor)) {
              slot.teachingid = undefined;
            }
            await slot.save();
          }
          const savedcourse1 = await oldCourse.save();

          newCourse.instructors.push(idinstructor);
          const savedcourse2 = await newCourse.save();
          res.json("Instructor courses updated successfully");
        }
      } else {
        return res.json({ msg: "New Course not found" });
      }
    } else {
      //********* */
      return res.json({ msg: "Old Course not found" });
    }
  } catch (error) {
    res.json({ msg: error.message });
  }
});

app.put("/viewStaffinDepartment", auth, async (req, res) => {
  //needs test
  //check tokenrole - get hod deparment
  //if no input course => view all staff in hod deparment
  //else=> get course - check course in hod dep -
  try {
    if (req.tokenrole != "HOD") {
      return res.json({ msg: "You are not authorized to do this" });
    }
    const hod = await members.findOne({ id: req.id });
    const hodDep = hod.department;

    const { courseid } = req.body;

    const check = {
      courseid: courseid,
    };

    const result = viewStaffinDepartment.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }

    if (!courseid) {
      const staffinDep = await members
        .find({ department: hodDep })
        .select(["-password", "-_id"])
        .populate({ path: "department", select: { _id: 0, name: 1 } })
        .populate({ path: "officelocation", select: { _id: 0, locname: 1 } })
        .populate({ path: "faculty", select: { _id: 0, name: 1 } });
      res.json(staffinDep);
    } else {
      const course = await courses.findOne({ id: courseid });
      if (!course) {
        return res.json({ msg: "Course not found" });
      }
      const courseindep = course.departments.includes(hodDep);

      if (!courseindep) {
        return res.json({ msg: "Course not in your department" });
      } else {
        const allStaff = [];
        const instructors = course.instructors;
        for (const instId of instructors) {
          const inst = await members
            .findById(instId)
            .select(["-password", "-_id"])
            .populate({
              path: "department",
              match: { _id: hodDep },
              select: { _id: 0, name: 1 },
            })
            .populate({
              path: "officelocation",
              select: { _id: 0, locname: 1 },
            });

          allStaff.push(inst);
        }
        const tas = course.teachingassistants;
        for (const taId of tas) {
          const ta = await members
            .findById(taId)
            .select(["-password", "-_id"])
            .populate({
              path: "department",
              match: { _id: hodDep },
              select: { _id: 0, name: 1 },
            })
            .populate({
              path: "officelocation",
              select: { _id: 0, locname: 1 },
            });
          allStaff.push(ta);
        }
        // const coordinator = await members.findById(course.coordinator).select(['-password','-_id'])
        // .populate({path:'department',match: { _id: hodDep },select:{'_id':0,'name':1}}).populate({path:'officelocation',select:{'_id':0,'locname':1}});;
        // if(coordinator){// && coordinator.department.equals(hodDep)){
        //     allStaff.push(coordinator);
        // }
        //const profiles = allStaff.populate({path:'department',select:{'_id':0,'name':1}}).populate({path:'officelocation',select:{'_id':0,'locname':1}})
        res.json({ allStaff });
      }
    }
  } catch (error) {
    res.json({ msg: error.message });
  }
});

app.put("/viewDayoff", auth, async (req, res) => {
  try {
    if (req.tokenrole != "HOD") {
      return res.json({ msg: "You are not authorized to do this" });
    }
    const hod = await members.findOne({ id: req.id });
    const hodDep = hod.department;

    const { staffid } = req.body;
    const check = {
      staffid: staffid,
    };

    const result = viewDayoff.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }

    if (!staffid) {
      const staffinDep = await members.find({ department: hodDep });
      const days = staffinDep.map((s) => [s.id, s.name, s["dayoff"]]);
      res.json(days);
    } else {
      const s = await members.findOne({ id: staffid, department: hodDep });
      if (!s) {
        return res.json({ msg: "Staff id not found in department" });
      }
      const d = s.dayoff;
      res.json({ d });
    }
  } catch (error) {
    res.json({ msg: error.message });
  }
});

app.get("/viewHodRequests", auth, async (req, res) => {
  try {
    if (req.tokenrole != "HOD") {
      return res.json({ msg: "You are not authorized to do this" });
    }
    const hod = await members.findOne({ id: req.id });
    const hod_id = hod._id;
    //todo populate replacements
    const leave = await requests
      .find({ receiver: hod_id, reqtype: "Leave" }, { _id: 0, receiver: 0 })
      .populate({ path: "sender", select: { _id: 0, id: 1, name: 1 } });

    //.populate({path:'replacements',select:{'receiver':1,'course':1,'slottime':1,'status':1}})
    const change = await requests
      .find(
        { receiver: hod_id, reqtype: "Change day off" },
        { _id: 0, receiver: 0, replacements: 0 }
      )
      .populate({ path: "sender", select: { _id: 0, id: 1, name: 1 } });

    // for( const requ of leave){   //needs test    //use populate
    //     if(requ.leavetype=='Annual'){
    //         const repRequests = [];
    //         const replacements = requ.replacements;
    //         for(const rep of replacements){
    //             const repRequest = await requests.findById(rep);
    //             const repinfo = {
    //                 "Replacement_user_id": repRequest.receiver,
    //                 "slot_time": repRequest.slottime,
    //                 "course": repRequest.course,
    //                 "status": repRequest.status
    //             }
    //             repRequests.push(repinfo);
    //         }
    //         requ.replacementRequests = repRequests;
    //     }
    // }

    res.json({ Leave: leave, Changedayoff: change });
  } catch (error) {
    res.json({ msg: error.message });
  }
});

app.put("/acceptLeaveRequest", auth, async (req, res) => {
  try {
    if (req.tokenrole != "HOD") {
      return res.json({ msg: "You are not authorized to do this" });
    }
    const hod = await members.findOne({ id: req.id });
    const hod_id = hod._id;
    const { requestid } = req.body;

    const check = {
      request_id: requestid,
    };

    const result = acceptLeaveRequest.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({
        msg: error.details[0].message,
      });
    }

    const request = await requests.findOne({
      id: requestid,
      receiver: hod_id,
      reqtype: "Leave",
    });
    if (!request) {
      return res.json({
        msg:
          "Leave request not found. You can only accept leave requests from your department.",
      });
    }
    if (request.status == "Accepted") {
      return res.json({ msg: "Leave request already accepted" });
    }
    if (request.status == "Rejected") {
      return res.json({ msg: "Leave request already rejected" });
    }
    const staff = await members.findById(request.sender);
    // if(!staff.department.equals(hod.department)){
    //     return res.status(400).json({ msg: "Academic member is not in your department" })
    // }
    //type: annual  => status:accepted - decrement annual leave balance - do slot replacement - missing hours-8.24 - handle missing days
    //type:accidental =>status:accepted - decrement annual leave balance - decrement accidental leave balance - missing hours-8.24 - handle missing days
    let msgConfirm = [];
    if (request.leavetype == "Annual" || request.leavetype == "Accidental") {
      request.status = "Accepted";
      if (staff.annualLeaveBalance < 1) {
        return res.json({
          msg: "Cannot Accept Request. Annual leave balance is not enough",
        });
      }
      staff.annualLeaveBalance = staff.annualLeaveBalance - 1;
      //handle missing hours
      //handle missing days

      if (request.leavetype == "Annual") {
        //do slot replacement

        const replacements = request.replacements;

        for (const rep of replacements) {
          console.log(rep);

          const repRequest = await requests.findOne({ id: rep });
          console.log(!repRequest);

          if (!repRequest) {
            msgConfirm.push(
              "Replacement request " + rep + " is not a valid request. "
            );
          } else {
            if (repRequest.status != "Accepted") {
              msgConfirm.push("Replacements requests must be valid accepted ");
            }

            const slot = await slots.findOne({
              teachingid: repRequest.sender,
              slotday: repRequest.weekday,
              slottime: repRequest.slottime,
            });
            if (!slot) {
              msgConfirm.push(
                "Replacement Request " +
                  repRequest.id +
                  " is for a slot that doesn't exsit anymore"
              );
            } else {
              slot.replacementId = repRequest.receiver;
              slot.replacementDate = repRequest.date;
              await slot.save();
            }
          }
        }
        console.log("Bosyy" + msgConfirm);
      } else {
        //decrement  accidentalLeaveBalance
        if (staff.accidentalLeaveBalance < 1) {
          return res.json({ msg: "Accidental leave balance is not enough" });
        }
        staff.accidentalLeaveBalance = staff.accidentalLeaveBalance - 1;
      }
    }

    //type: sick/maternity => status:accepted - missing hours-8.24 - handle missing days
    else if (request.leavetype == "Sick" || request.leavetype == "Maternity") {
      request.status = "Accepted";
    }
    //type: compensation => status:accepted - handle day off
    else if (request.leavetype == "Compensation") {
      request.status = "Accepted";
      //handle day off
      // var compyear = request.compensationDate.getFullYear();
      // var compmonth = request.compensationDate.getMonth()+1;   //test
      // const compDay = request.compensationDate.getDate();
      // dd-mm-yyyy
      var compyear = parseInt(request.compensationDate.substring(6));
      var compmonth = parseInt(request.compensationDate.substring(3, 5));
      const compDay = parseInt(request.compensationDate.substring(0, 2));

      if (compDay < 11) {
        if (compmonth == 1) {
          compmonth = 12;
          compyear = compyear - 1;
        } else compmonth = compmonth - 1;
      }
      const attendance = await months.findOne({
        id: staff.id,
        year: compyear,
        month: compmonth,
      });
      if (!attendance) {
        const newmonth = new months({
          id: staff.id,
          month: compmonth,
          year: compyear,
          attendeddays: 0,
          attendedhrsinMin: 0,
          acceptedleavescount: [],
          acceptedCompensationscount: [compDay],
        });
        await newmonth.save();
      } else {
        attendance.acceptedCompensationscount.push(compDay);
        await attendance.save();
      }
      // const compDay = request.date.getDate();
      // const compDate = compDay+"-"+compmonth+"-"+compyear;
      // staff.compensations.push(compDate);
    }
    let notify =
      "Your Leave Request to Id " +
      hod.id +
      " On " +
      request.date +
      " has been accepted";

    staff.notifications.push(notify);
    //date -> string
    var leaveyear = parseInt(request.date.substring(6));
    var leavemonth = parseInt(request.date.substring(3, 5));
    const leaveDay = parseInt(request.date.substring(0, 2));
    if (leaveDay < 11) {
      if (leavemonth == 1) {
        leavemonth = 12;
        leaveyear = leaveyear - 1;
      } else leavemonth = leavemonth - 1;
    }
    const attendance = await months.findOne({
      id: staff.id,
      year: leaveyear,
      month: leavemonth,
    });
    if (!attendance) {
      const newmonth = new months({
        id: staff.id,
        month: leavemonth,
        year: leaveyear,
        attendeddays: 0,
        attendedhrsinMin: 0,
        acceptedleavescount: [leaveDay],
        acceptedCompensationscount: [],
      });
      await newmonth.save();
    } else {
      attendance.acceptedleavescount.push(leaveDay);
      await attendance.save();
    }
    // const leaveDay = request.date.getDate();
    // const leaveDate = leaveDay+"-"+leavemonth+"-"+leaveyear;
    //staff.leaves.push(leaveDate);    //handling missing days
    //save staff, request,slot
    await staff.save();
    await request.save();

    console.log(msgConfirm);

    res.json({ msgConfirm });
  } catch (error) {
    res.json({ msg: error.message });
  }
});

app.put("/acceptDayoffRequest", auth, async (req, res) => {
  try {
    if (req.tokenrole != "HOD") {
      return res.status(400).json({ msg: "You are not authorized to do this" });
    }
    const hod = await members.findOne({ id: req.id });
    const hod_id = hod._id;
    const { requestid } = req.body;
    const check = {
      request_id: requestid,
    };

    const result = acceptLeaveRequest.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.status(400).json(error.details[0].message);
    }
    const request = await requests.findOne({
      id: requestid,
      receiver: hod_id,
      reqtype: "Change day off",
    }); //
    if (!request) {
      return res.status(400).json({
        msg:
          "Change day off request not found. You can only accept Change day off requests from your department",
      });
    }
    if (request.status == "Accepted") {
      return res
        .status(400)
        .json({ msg: "Change day off request already accepted" });
    }
    if (request.status == "Rejected") {
      return res
        .status(400)
        .json({ msg: "Change day off request already rejected" });
    }

    const staff = await members.findById(request.sender);
    if (!staff.department.equals(hod.department)) {
      return res
        .status(400)
        .json({ msg: "Academic member is not in your department" });
    }
    staff.dayoff = request.weekday;
    request.status = "Accepted";
    let notify =
      "Your Change Dayoff Request to Id " +
      hod.id +
      " to be " +
      request.weekday +
      " has been accepted";

    staff.notifications.push(notify);
    await staff.save();
    await request.save();

    res.json("Request Accepted");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/rejectHodRequest", auth, async (req, res) => {
  try {
    if (req.tokenrole != "HOD") {
      return res.json({ msg: "You are not authorized to do this" });
    }
    const hod = await members.findOne({ id: req.id });
    const hod_id = hod._id;
    const { requestid, comment } = req.body;
    const check = {
      request_id: requestid,
      comment: comment,
    };

    const result = rejectHODRequest.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({
        msg: error.details[0].message,
      });
    }
    const request = await requests.findOne({ id: requestid, receiver: hod_id });
    if (!request) {
      return res.json({ msg: "Request not found" });
    }
    if (request.reqtype != "Leave" && request.reqtype != "Change day off") {
      return res.json({
        msg: "Request type should be Leave or Change day off",
      });
    }
    if (request.status == "Accepted") {
      return res.json({ msg: "Request already accepted" });
    }
    if (request.status == "Rejected") {
      return res.json({ msg: "Request already rejected" });
    }

    request.status = "Rejected";
    request.comment = comment;
    const staff = await members.findById(request.sender);
    let notify;
    if (request.reqtype == "Leave") {
      notify =
        "Your " +
        request.leavetype +
        " Leave Request on date " +
        request.date +
        " has been rejected.";
      if (comment) {
        notify += " HOD's comment: " + comment;
      }
      console.log(notify);
    }
    if (request.reqtype == "Change day off") {
      notify =
        "Your Change day off Request to be " +
        request.weekday +
        " has been rejected.";
      if (comment) {
        notify += " HOD's comment: " + comment;
      }
    }

    staff.notifications.push(notify);
    await staff.save();
    await request.save();

    res.json("Request Rejected");
  } catch (error) {
    res.json({ msg: error.message });
  }
});

app.get("/viewdepartmentcoverage", auth, async (req, res) => {
  try {
    if (req.tokenrole != "HOD") {
      return res.status(400).json({ msg: "You are not authorized to to this" });
    }
    const existinguser = await members.findOne({ id: req.id });
    //        const idmember=existinguser._id;
    const hodDep = existinguser.department;

    const coursefind = await courses.find({ departments: hodDep });

    const newArray = coursefind.map((element) => element.id);

    const newArray2 = coursefind.map((element) => element.slots);

    const lenarr = [];

    const lenarr2 = [];

    for (i = 0; i < newArray2.length; i++) {
      lenarr.push(newArray2[i].length);
    }

    for (i = 0; i < newArray2.length; i++) {
      var c = 0;
      for (j = 0; j < newArray2[i].length; j++) {
        const slotfound = await slots.findOne({ _id: newArray2[i][j] });
        if (slotfound) {
          if (slotfound.assigned) {
            c++;
          }
        }
      }
      lenarr2.push(c);
    }
    const coverage = [];

    for (i = 0; i < lenarr.length; i++) {
      const a = lenarr[i];
      const b = lenarr2[i];
      var result = (b / a) * 100;
      if (!result) {
        result = 0;
      }
      coverage.push({ courseid: newArray[i], "coverage precentage": result });
    }
    res.json(coverage);
  } catch (error) {
    //important
    res.status(500).json({ error: error.message });
  }
});

app.get("/viewdepartmentslots", auth, async (req, res) => {
  try {
    if (req.tokenrole != "HOD") {
      return res.json({ msg: "You are not authorized to to this" });
    }

    const existinguser = await members.findOne({ id: req.id });
    const hodDep = existinguser.department;
    const allinfo = await courses
      .find({ departments: hodDep }, { _id: 0, id: 1, name: 1 })
      .populate({
        path: "slots",
        select: { _id: 0, slotday: 1, slottime: 1, slottype: 1 },
        match: { assigned: true },
        populate: { path: "teachingid", select: { _id: 0, id: 1, name: 1 } },
      });

    res.json(allinfo);
  } catch (error) {
    //important
    res.json({ msg: error.message });
  }
});

//////////////////MONICS NEW ROUTES///////////////

app.put("/viewcourseslots", auth, async (req, res) => {
  try {
    if (req.tokenrole != "HOD") {
      return res.json({ msg: "You are not authorized to to this" });
    }

    const existinguser = await members.findOne({ id: req.id });
    const hodDep = existinguser.department;

    const { courseid } = req.body;

    const check = {
      courseid: courseid,
    };

    const result = viewStaffinDepartment.validate(check);
    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }

    const allinfo = await courses
      .findOne({ id: courseid, departments: hodDep }, { _id: 0, slots: 1 })
      .populate({
        path: "slots",
        select: { _id: 0, slotday: 1, slottime: 1, slottype: 1 },
        match: { assigned: true },
        populate: { path: "teachingid", select: { _id: 0, id: 1, name: 1 } },
      });

    if (!allinfo) {
      return res.json({ msg: "Course not found in department" });
    }

    res.json({ allinfo });
  } catch (error) {
    //important
    res.json({ msg: error.message });
  }
});

app.put("/viewcoursecoverage", auth, async (req, res) => {
  try {
    if (req.tokenrole != "HOD") {
      return res.json({ msg: "You are not authorized to to this" });
    }
    const existinguser = await members.findOne({ id: req.id });
    const hodDep = existinguser.department;

    const { courseid } = req.body;

    const check = {
      courseid: courseid,
    };
    const result = viewStaffinDepartment.validate(check);
    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }

    const coursefind = await courses.findOne({
      id: courseid,
      departments: hodDep,
    });
    if (!coursefind) {
      return res.json({ msg: "Course not found in your department" });
    }
    const slotsIDs = coursefind.slots;
    const totalSlots = slotsIDs.length;
    var assignedSlots = 0;
    for (i = 0; i < totalSlots; i++) {
      const slotfound = await slots.findOne({ _id: slotsIDs[i] });
      if (slotfound) {
        if (slotfound.assigned) {
          assignedSlots++;
        }
      }
    }

    var coverage = (assignedSlots / totalSlots) * 100;
    if (!coverage) {
      coverage = 0;
    }
    res.json({ coverage });
  } catch (error) {
    //important
    res.json({ msg: error.message });
  }
});

app.get("/viewdepartmentcourses", auth, async (req, res) => {
  try {
    if (req.tokenrole != "HOD") {
      return res.json({ msg: "You are not authorized to to this" });
    }
    const existinguser = await members.findOne({ id: req.id });
    const hodDep = existinguser.department;

    const depcourses = await courses.find(
      { departments: hodDep },
      { _id: 0, id: 1, name: 1 }
    );

    res.json({ depcourses });
  } catch (error) {
    //important
    res.json({ msg: error.message });
  }
});

app.put("/viewreplacementbyid", auth, async (req, res) => {
  try {
    const hod = await members.findOne({ id: req.id });
    const hod_id = hod._id;
    const { requestid } = req.body;
    const check = {
      request_id: requestid,
    };

    const result = acceptLeaveRequest.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }
    const request = await requests
      .findOne(
        { id: requestid, reqtype: "Replacement" },
        {
          _id: 0,
          id: 1,
          receiver: 1,
          course: 1,
          weekday: 1,
          slottime: 1,
          status: 1,
        }
      )
      .populate({ path: "receiver", select: { _id: 0, id: 1, name: 1 } })
      .populate({ path: "course", select: { _id: 0, id: 1 } });
    if (!request) {
      return res.json({
        msg: " This Replacement request was cancelled by the user",
      });
    }
    res.json({ request });
  } catch (error) {
    //important
    res.json({ msg: error.message });
  }
});

/////////////////////////////////////////FARAH//////////////////////////////////////////////////////////////
/////////////////////////////////////////FARAH//////////////////////////////////////////////////////////////
/////////////////////////////////////////FARAH//////////////////////////////////////////////////////////////
app.get("/viewstaff/:id", auth, async (req, res) => {
  try {
    if (req.tokenrole != "Course Instructor") {
      return res.json({ msg: "You are not authorized to to this" });
    }

    const existinguser = await members.findOne({ id: req.id });

    const userid = existinguser._id;

    /* const allinfo = await courses
      .find({ instructors: userid , id:req.params.id }, { _id: 0, instructors: 1, teachingassistants: 1 , coordinator:1 })
      .populate({
        path: "instructors ",
        select: {
          _id: 0,
          name: 1,
          email: 1,
          dayoff: 1,
          id: 1,
          gender: 1,
          officelocation: 1,
          faculty: 1,
        },

        populate: {
          path: "officelocation",
          select: { _id: 0, locname: 1 },
        },
      })
      .populate({
        path: "coordinator",
        select: {
          _id: 0,
          name: 1,
          email: 1,
          dayoff: 1,
          id: 1,
          gender: 1,
          officelocation: 1,
          faculty: 1,
        },
        populate: {
          path: "officelocation",
          select: { _id: 0, locname: 1 },
        },
      })
      .populate({
        path: " teachingassistants",
        select: {
          _id: 0,
          name: 1,
          email: 1,
          dayoff: 1,
          id: 1,
          gender: 1,
          officelocation: 1,
          faculty: 1,
        },
        populate: {
          path: "officelocation",
          select: { _id: 0, locname: 1 },
        },
      }); */

    const allinfo = await courses
      .findOne(
        { instructors: userid, id: req.params.id },
        { _id: 0, id: 1, instructors: 1, teachingassistants: 1, coordinator: 1 }
      )
      .populate({
        path: "instructors ",
        select: {
          _id: 0,
          name: 1,
          email: 1,
          dayoff: 1,
          id: 1,
          officelocation: 1,
          gender: 1,
          faculty: 1,
        },
        populate: {
          path: "officelocation",
          select: { _id: 0, locname: 1 },
        },
      })
      .populate({
        path: "coordinator",
        select: {
          _id: 0,
          name: 1,
          email: 1,
          dayoff: 1,
          id: 1,
          officelocation: 1,
          gender: 1,
          faculty: 1,
        },
        populate: {
          path: "officelocation",
          select: { _id: 0, locname: 1 },
        },
      })
      .populate({
        path: " teachingassistants",
        select: {
          _id: 0,
          name: 1,
          email: 1,
          dayoff: 1,
          id: 1,
          officelocation: 1,
          gender: 1,
          faculty: 1,
        },
        populate: {
          path: "officelocation",
          select: { _id: 0, locname: 1 },
        },
      });

    res.json(allinfo);
  } catch (error) {
    //important
    res.status(500).json({ error: error.message });
  }
});

app.post("/coursecoordinator/:id/:idcourse", auth, async (req, res) => {
  try {
    if (req.tokenrole != "Course Instructor") {
      return res.json({ msg: "You are not authorized to to this" });
    }

    const existinguser = await members.findOne({ id: req.params.id });

    if (!existinguser) {
      return res.json({ msg: "The id doesnot exist" });
    }

    const roleuser = existinguser.role;
    if (!roleuser == "Course coordinator") {
      return res.json({ msg: "the id must belong to course coordinator" });
    }

    coursesdelete = await courses.findOne({ id: req.params.idcourse });

    if (!coursesdelete) {
      return res.json({ msg: "The id of course doesnot exist" });
    }

    if (roleuser == "HR") {
      return res.json({ msg: "the id must belong to academic member" });
    }

    const idta = existinguser._id;

    // let { name, id} = req.body;

    const idcourse = req.params.idcourse;

    const foundcourse = await courses.findOne({ id: req.params.idcourse });

    const existinguser2 = await members.findOne({ id: req.id });
    const idmember2 = existinguser2._id;

    const match1 = await courses.findOne({
      instructors: idmember2,
      id: idcourse,
    });

    // const match2 = await courses.findOne({ teachingassistants: idta, id: idcourse });
    // const match3 = await courses.findOne({ coordinator: idta, id: idcourse });

    if (!match1) {
      return res.json({
        msg: " you not assigned (course instructor) to this course ",
      });
    }

    // if (match2 == false ) {
    //  return res.status(400).json({ msg: " the academic member is not assigned to the course" });

    // }

    //  if (foundcourse) {

    //const match = foundcourse.coordinator.includes(idta);

    const match = foundcourse.coordinator;

    if (match != undefined) {
      if (match.equals(idta)) {
        return res.json({
          msg:
            "this academic member is already assigned to be the coordinator of this  course ",
        });
      }

      // if (match) {
      //     return res.status(400).json({ msg: "this course is already assigned to a coordinator " });
      // }
    }

    //  const a = foundcourse.teachingassistants;

    //  const pos = a.indexOf(idta)
    //  a.splice(pos, 1);
    //  const savedcourse = await foundcourse.save();

    //existinguser.role = "Course coordinator";
    await existinguser.save();

    foundcourse.coordinator = idta;

    const match2 = await courses.findOne({
      teachingassistants: idta,
      id: idcourse,
    });

    if (!match2) {
      foundcourse.teachingassistants.push(idta);
    }

    const savedcourse1 = await foundcourse.save();
    res.json("done");
    // }
  } catch (error) {
    //important
    res.status(500).json({ error: error.message });
  }
});

app.post("/assignslot/:id/:idslot", auth, async (req, res) => {
  try {
    if (req.tokenrole != "Course Instructor") {
      return res.json({ msg: "You are not authorized to to this" });
    }

    const existinguser = await members.findOne({ id: req.params.id });
    const existinguser2 = await members.findOne({ id: req.id });

    if (!existinguser) {
      return res.json({ msg: "The id of academic member doesnot exist" });
    }
    const roleuser = existinguser.role;

    const idmember = existinguser._id;
    const idmember2 = existinguser2._id;

    //const d= existinguser.department;

    const slotinfo = await slots.findOne({ id: req.params.idslot });

    if (!slotinfo) {
      return res.json({ msg: "The id of slot doesnot exist " });
    }

    const slotid = slotinfo._id;
    const slotassigned = slotinfo.assigned;

    const slotcourse = await courses.findOne({ slots: slotid });
    //console.log(slotcourse);
    const slotcourseid = slotcourse.id;
    // const depart= slotcourse.departments;

    //  if(!depart.includes(d)){
    //    return res.status(400).json({ msg: " cannot assign this academic member to this slot as the academic member doesnot exist in the department of the course of the slot" });

    //  }

    const match1 = await courses.findOne({
      instructors: idmember2,
      id: slotcourseid,
    });

    const match2 = await courses.findOne({
      teachingassistants: idmember,
      id: slotcourseid,
    });
    //  const match3 = await courses.findOne({ instructors: idmember, id: slotcourseid });
    // const match4 = await courses.findOne({ coordinator: idmember, id: slotcourseid });

    if (!match1) {
      return res.json({
        msg:
          " you not  (course instructor) to the course of the slot you canot assign",
      });
    }

    // if (!match2 && !match3 && !match4) {
    //   return res.status(400).json({ msg: " the academic member is not assigned to the course of the slot" });

    // }

    if (slotassigned == true) {
      return res.json({
        msg: "This slot is already assigned to an academic member",
      });
    }

    const final2 = await slots.findOne({ id: req.params.idslot });

    const a1 = final2.slottime;
    const b1 = final2.slotday;

    const final = await slots.findOne({
      teachingid: idmember,
      slottime: a1,
      slotday: b1,
    });

    if (final) {
      console.log("enter");

      return res.json({
        msg:
          "you cannot assign this academic member to this slot as this academic member is assigned to another slot at the same day and time",
      });
    }

    slotinfo.assigned = true;
    slotinfo.teachingid = idmember;
    const savedslot = await slotinfo.save();

    if (!match2) {
      slotcourse.teachingassistants.push(idmember);
      const savedcourse = await slotcourse.save();
      // res.json(savedcourse);
    }

    // res.json(savedslot);
    res.json("done");
  } catch (error) {
    //important
    res.status(500).json({ error: error.message });
  }
});

app.get("/viewslots/:id", auth, async (req, res) => {
  try {
    if (req.tokenrole != "Course Instructor") {
      return res.json({ msg: "You are not authorized to to this" });
    }

    const existinguser = await members.findOne({ id: req.id });

    const roleuser = existinguser.role;

    //   if ( roleuser== "Course Instructor" || roleuser== "HOD" || roleuser== "HR" ) {
    //    return res.status(400).json({ msg: "the id must belong to course coordinator or TA to be assigned to view slot" });

    //  }

    const idmember = existinguser._id;

    const allinfo = await courses
      .findOne(
        { instructors: idmember, id: req.params.id },
        { _id: 0, id: 1, name: 1, slots: 1 }
      )
      .populate({
        path: "slots",
        select: {
          _id: 0,
          slotday: 1,
          slottime: 1,
          slottype: 1,
          teachingid: 1,
          location: 1,
          assigned: 1,
          id: 1,
        },
        populate: [
          {
            path: "location",
            select: { _id: 0, locname: 1 },
          },
          {
            path: "teachingid",
            select: { _id: 0, id: 1, name: 1 },
          },
        ],
      });

    res.json(allinfo.slots);
  } catch (error) {
    //important
    res.status(500).json({ error: error.message });
  }
});

app.delete("/deleteassigncourse/:id/:idcourse", auth, async (req, res) => {
  try {
    if (req.tokenrole != "Course Instructor") {
      return res.status(400).json({ msg: "You are not authorized to to this" });
    }

    const existinguser = await members.findOne({ id: req.params.id });
    const existinguser2 = await members.findOne({ id: req.id });

    if (!existinguser) {
      return res.json({ msg: "The id of academic member doesnot exist" });
    }
    const roleuser = existinguser.role;

    if (roleuser == "HR") {
      return res.json({ msg: "the id must belong to academic member" });
    }

    if (roleuser == "Course Instructor") {
      return res.json({
        msg:
          "id blong to  course instructor only HOD assign/delete courseinstructor to course ",
      });
    }

    const idmember = existinguser._id;
    const idmember2 = existinguser2._id;

    const courseinfo = await courses.findOne({ id: req.params.idcourse });
    if (!courseinfo) {
      return res.json({ msg: "The id of course doesnot exist " });
    }
    const course_id = courseinfo._id;

    const match1 = await courses.findOne({
      instructors: idmember2,
      id: req.params.idcourse,
    });

    if (!match1) {
      return res.json({ msg: " you not  (course instructor) to this course " });
    }

    const match2 = await courses.findOne({
      teachingassistants: idmember,
      id: req.params.idcourse,
    });
    const match3 = await courses.findOne({
      coordinator: idmember,
      id: req.params.idcourse,
    });

    if (match2 && match3) {
      const a = courseinfo.teachingassistants;

      const pos = a.indexOf(idmember);
      a.splice(pos, 1);

      courseinfo.coordinator = undefined;

      const savedcourse = await courseinfo.save();

      const slotfind = await slots.find({
        courseId: course_id,
        teachingid: idmember,
      });
      // console.log(slotfind);

      for (i = 0; i < slotfind.length; i++) {
        slotfind[i].teachingid = undefined;
        slotfind[i].assigned = false;
        const savedcourse2 = await slotfind[i].save();
      }

      // const savedcourse2 = await slotfind.save();

      const afterdelete = await courses.findOne({ id: req.params.idcourse });

      return res.json("done");
    }

    if (match2) {
      const a = courseinfo.teachingassistants;

      const pos = a.indexOf(idmember);
      a.splice(pos, 1);
      const savedcourse = await courseinfo.save();

      const slotfind = await slots.find({
        courseId: course_id,
        teachingid: idmember,
      });
      // console.log(slotfind);

      for (i = 0; i < slotfind.length; i++) {
        slotfind[i].teachingid = undefined;
        slotfind[i].assigned = false;
        const savedcourse2 = await slotfind[i].save();
      }

      const afterdelete = await courses.findOne({ id: req.params.idcourse });

      return res.json(savedcourse);
    }

    if (!match2 && !match3) {
      return res.json({
        msg:
          " the academic member you want to delete  is not assigned to  course id you entered ",
      });
    }
  } catch (error) {
    //important
    res.status(500).json({ error: error.message });
  }
});

app.post(
  "/updateassigncourse/:id/:idcourseold/:idcourse",
  auth,
  async (req, res) => {
    try {
      if (req.tokenrole != "Course Instructor") {
        return res.json({ msg: "You are not authorized to to this" });
      }

      const existinguser = await members.findOne({ id: req.params.id });
      const existinguser2 = await members.findOne({ id: req.id });

      if (!existinguser) {
        return res.json({ msg: "The id of academic member doesnot exist" });
      }

      const roleuser = existinguser.role;

      if (roleuser == "HR") {
        return res.json({ msg: "the id must belong to academic member" });
      }

      if (roleuser == "Course Instructor") {
        return res.json({
          msg:
            "id blong to  course instructor only HOD assign courseinstructor to course ",
        });
      }

      const idmember = existinguser._id;
      const idmember2 = existinguser2._id;

      const courseinfo = await courses.findOne({ id: req.params.idcourse });
      if (!courseinfo) {
        return res.json({ msg: "The id of course doesnot exist " });
      }

      const courseinfoold = await courses.findOne({
        id: req.params.idcourseold,
      });
      if (!courseinfoold) {
        return res.json({ msg: "The id of course doesnot exist " });
      }

      const course_id = courseinfoold._id;

      const match1 = await courses.findOne({
        instructors: idmember2,
        id: req.params.idcourse,
      });

      const match12 = await courses.findOne({
        instructors: idmember2,
        id: req.params.idcourseold,
      });

      if (!match1) {
        return res.json({
          msg:
            " you not assigned (course instructor) to this course you want to updae the academic member ",
        });
      }

      if (!match12) {
        return res.json({
          msg:
            " you not assigned (course instructor) to this course (the new course you want to be updated to ) ",
        });
      }

      const match2 = await courses.findOne({
        teachingassistants: idmember,
        id: req.params.idcourseold,
      });
      const match3 = await courses.findOne({
        coordinator: idmember,
        id: req.params.idcourseold,
      });

      if (match2 && match3) {
        const a = courseinfoold.teachingassistants;

        const pos = a.indexOf(idmember);
        a.splice(pos, 1);

        courseinfoold.coordinator = undefined;

        const savedcourse1 = await courseinfoold.save();

        courseinfo.teachingassistants.push(idmember);
        const savedcourse = await courseinfo.save();

        const slotfind = await slots.find({
          courseId: course_id,
          teachingid: idmember,
        });
        // console.log(slotfind);

        for (i = 0; i < slotfind.length; i++) {
          slotfind[i].teachingid = undefined;
          slotfind[i].assigned = false;
          const savedcourse2 = await slotfind[i].save();

          // console.log( slotfind[i].assigned);
        }

        return res.json("done");
      }

      if (match2) {
        const a = courseinfoold.teachingassistants;

        const pos = a.indexOf(idmember);
        a.splice(pos, 1);
        const savedcourse1 = await courseinfoold.save();

        courseinfo.teachingassistants.push(idmember);

        const slotfind = await slots.find({
          courseId: course_id,
          teachingid: idmember,
        });
        //console.log(slotfind);

        for (i = 0; i < slotfind.length; i++) {
          slotfind[i].teachingid = undefined;
          slotfind[i].assigned = false;
          const savedcourse2 = await slotfind[i].save();
          // console.log( slotfind[i].assigned);
        }

        const savedcourse = await courseinfo.save();
        return res.json(savedcourse);
      }

      if (!match2) {
        return res.json({
          msg:
            " the academic member you want to update is not assigned to  course id you entered ",
        });
      }

      if (!match2 && !match3) {
        return res.json({
          msg:
            " the academic member you want to update doesnot is not assigned to  course id you entered ",
        });
      }
    } catch (error) {
      //important
      res.status(500).json({ error: error.message });
    }
  }
);

app.get("/viewcoverage", auth, async (req, res) => {
  try {
    if (req.tokenrole != "Course Instructor") {
      return res.json({ msg: "You are not authorized to to this" });
    }

    const existinguser = await members.findOne({ id: req.id });
    const idmember = existinguser._id;

    const coursefind = await courses.find({ instructors: idmember });
    //console.log(coursefind);

    const newArray = coursefind.map((element) => element.id);
    const newArray3 = coursefind.map((element) => element.name);

    const newArray2 = coursefind.map((element) => element.slots);
    //console.log(newArray);

    const lenarr = [];

    const lenarr2 = [];

    for (i = 0; i < newArray2.length; i++) {
      lenarr.push(newArray2[i].length);
    }

    for (i = 0; i < newArray2.length; i++) {
      var c = 0;
      for (j = 0; j < newArray2[i].length; j++) {
        const slotfound = await slots.findOne({ _id: newArray2[i][j] });
        if (slotfound) {
          if (slotfound.assigned) {
            c++;
          }
        }
        //console.log(slotfound);
      }
      lenarr2.push(c);
    }

    //console.log(lenarr2);

    //console.log(lenarr);

    //const coverage  = new Array ( );
    const coverage = [];

    for (i = 0; i < lenarr.length; i++) {
      const a = lenarr[i];
      const b = lenarr2[i];
      var result = (b / a) * 100;

      console.log(result);
      if (!result) {
        result = 0;
      } else {
        result = result.toFixed(1);
      }

      //coverage[i]= new Array ( newArray[i] , result);
      coverage.push({
        courseid: newArray[i],
        coursename: newArray3[i],
        coveragepercentage: result,
      });
    }

    res.json(coverage);
  } catch (error) {
    //important
    res.status(500).json({ error: error.message });
  }
});

/* app.post("/assigncourse/:id/:idcourse", auth, async (req, res) => {
  try {
    if (req.tokenrole != "Course Instructor") {
      return res.status(400).json({ msg: "You are not authorized to to this" });
    }

    const existinguser = await members.findOne({ id: req.params.id });
    const existinguser2 = await members.findOne({ id: req.id });

    if (!existinguser) {
      return res
        .status(400)
        .json({ msg: "The id of academic member doesnot exist" });
    }
    const roleuser = existinguser.role;

    if (roleuser == "HR") {
      return res
        .status(400)
        .json({ msg: "the id must belong to academic member" });
    }

    if (roleuser == "Course Instructor") {
      return res.status(400).json({
        msg:
          "id blong to  course instructor only HOD assign courseinstructor to course ",
      });
    }

    const idmember = existinguser._id;
    const idmember2 = existinguser2._id;

    if (!courseinfo) {
      return res.status(400).json({ msg: "The id of course doesnot exist " });
    }

    const match1 = await courses.findOne({
      instructors: idmember2,
      id: req.params.idcourse,
    });

    if (!match1) {
      return res
        .status(400)
        .json({ msg: " you not assigned (course instructor) to this course " });
    }

    const match2 = await courses.findOne({
      teachingassistants: idmember,
      id: req.params.idcourse,
    });
    const match3 = await courses.findOne({
      coordinator: idmember,
      id: req.params.idcourse,
    });

    if (match2) {
      return res.status(400).json({
        msg: " the academic member is already assigned to the course ",
      });
    }

    if (match3) {
      return res.status(400).json({
        msg: " the academic member is already assigned to the course ",
      });
    }

    courseinfo.teachingassistants.push(idmember);
    const savedcourse = await courseinfo.save();
    res.json("done");
  } catch (error) {
    //important
    res.status(500).json({ error: error.message });
  }
});
 */
//////////////////////////////////////////////Coordinator////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////Coordinator///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////Coordinator///////////////////////////////////////////////////////////////////

app.get("/viewslotlinkingrequest", auth, async (req, res) => {
  try {
    if (req.tokenrole != "Course coordinator") {
      return res.json({ msg: "You are not authorized to to this" });
    }

    let myRecord = await members.findOne({ id: req.id });

    const memberid = myRecord._id;

    console.log("here");

    let myRequests = await requests
      .find({ receiver: myRecord._id, reqtype: "Slot-linking" })
      .populate({
        path: "course",
        match: { coordinator: memberid },
        select: { _id: 0, id: 1 },
      })
      .populate({
        path: "sender",
        select: { _id: 0, id: 1 },
      })
      .populate({
        path: "receiver",
        select: { _id: 0, id: 1 },
      })
      .select([
        "id",
        "sender",
        "slottype",
        "course",
        "status",
        "reqtype",
        "weekday",
        "slottime",
        "id",
      ]);

    console.log("here" + myRequests);
    res.json({ myRequests });
  } catch (error) {
    res.json({ msg: error.message });
  }
});

app.post("/acceptslotlinking", auth, async (req, res) => {
  try {
    if (req.tokenrole != "Course coordinator") {
      return res.json({ msg: "You are not authorized to to this" });
    }
    let { requestId } = req.body;

    let myRecord = await members.findOne({ id: req.id });

    const idmember = myRecord._id;

    let checkRequest = await requests.findOne({ id: requestId });
    const sender2 = checkRequest.sender;

    if (checkRequest.status != "Pending") {
      return res.json({
        msg: "This request is already " + checkRequest.status,
      });
    }

    // let checkRequest = await requests.findOne({ id : req.params.id});

    const check = checkRequest.course;

    const check2 = await courses.findOne({ _id: check, coordinator: idmember });

    if (!check2) {
      return res.json({
        msg:
          "you cannot accept this request you are not assigned to the course coordinator of this request",
      });
    }

    const checksender = await members.findOne({ _id: sender2 });

    if (!checksender) {
      return res.json({
        msg:
          "you cannot accept this request as this sender doesnot exist anymore",
      });
    }

    const sender = checkRequest.sender;

    const course = checkRequest.course;

    const check3 = await courses.findOne({ _id: course });

    const slot = check3.slots;

    const m = await courses.findOne({ _id: course }).populate({
      path: "slots",
      match: {
        slottype: checkRequest.slottype,
        slottime: checkRequest.slottime,
        slotday: checkRequest.weekday,
        assigned: false,
      },
    });

    const c = m.slots;
    if (c.length == 0) {
      return res.json({
        msg:
          "you cannot accept , this slot doesnot exist or is already assigned ",
      });
    }
    checkRequest.status = "Accepted";

    const savedrequest = await checkRequest.save();

    //console.log(c.length);

    if (c.length) {
      const a = c[0].assigned;

      c[0].teachingid = sender;

      c[0].assigned = true;
      const savedcourse = await c[0].save();
    }

    const match2 = await courses.findOne({
      teachingassistants: sender,
      _id: course,
    });
    const add = await courses.findOne({ _id: course });

    if (!match2) {
      add.teachingassistants.push(sender);
      const savedcourse = await add.save();
      // res.json(savedcourse);
    }

    res.json("done");
  } catch (error) {
    res.json({ msg: error.message });
  }
});

app.post("/rejectslotlinking", auth, async (req, res) => {
  try {
    if (req.tokenrole != "Course coordinator") {
      return res.json({ msg: "You are not authorized to to this" });
    }

    let { requestId } = req.body;

    let myRecord = await members.findOne({ id: req.id });

    const idmember = myRecord._id;

    let checkRequest = await requests.findOne({ id: requestId });

    if (checkRequest.status != "Pending") {
      return res.json({
        msg: "This request is already " + checkRequest.status,
      });
    }

    // let checkRequest = await requests.findOne({ id : req.params.id});

    const check = checkRequest.course;

    const check2 = await courses.findOne({ _id: check, coordinator: idmember });

    if (!check2) {
      return res.json({
        msg:
          "you cannot accept this request you are not assigned to the course of this request",
      });
    }

    checkRequest.status = "Rejected";
    const sender = checkRequest.sender;

    const savedrequest = await checkRequest.save();

    res.send("done");
  } catch (error) {
    res.json({ msg: error.message });
  }
});

app.get("/getCourseSlots", auth, async (req, res) => {
  try {
    if (req.tokenrole != "Course coordinator") {
      return res.json({
        msg: "You are not authorized to to this",
      });
    }

    let myRecord = await members.findOne({ id: req.id });
    let myCourses = await courses.find({ coordinator: myRecord._id });
    let mySlots = [];

    console.log(myCourses);

    for (var i = 0; i < myCourses.length; i++) {
      let courseSlots = await slots
        .find({
          courseId: myCourses[i]._id,
        })
        .populate({
          path: "teachingid",
          select: { _id: 0, id: 1 },
        })
        .populate({
          path: "location",
          select: { _id: 0, locname: 1 },
        })
        .populate({
          path: "courseId",
          select: { _id: 0, id: 1 },
        })
        .populate({
          path: "replacementId",
          select: { _id: 0, id: 1 },
        });

      mySlots.push(courseSlots);
    }

    res.json({ mySlots });
  } catch (error) {
    //important
    res.json({ msg: error.message });
  }
});

app.post("/addslot", auth, async (req, res) => {
  try {
    if (req.tokenrole != "Course coordinator") {
      return res.json({ msg: "You are not authorized to to this" });
    }

    let { slotday, slottype, slottime, courseid, locname } = req.body;

    if (!slotday) {
      return res.json({ msg: "Please enter slotday" });
    }
    if (!slottime) {
      return res.json({ msg: "Please enter slottime" });
    }

    if (!slottype) {
      return res.json({ msg: "Please enter slottime" });
    }

    if (!courseid) {
      return res.json({ msg: "Please enter courseid" });
    }

    if (!locname) {
      return res.json({ msg: "Please enter courseid" });
    }

    const check = {
      slotday: slotday,
      slottype: slottype,
      slottime: slottime,
      courseid: courseid,
      locname: locname,
    };

    const result = schemaslot.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }

    const myRecord = await members.findOne({ id: req.id });
    //console.log(myRecord);

    const idmember = myRecord._id;

    const foundcourse = await courses.findOne({
      id: courseid,
      coordinator: idmember,
    });
    const foundcourse2 = await courses.findOne({ id: courseid });

    if (!foundcourse) {
      return res.json({
        msg: "You not assigned to the course that you want to add to it slot",
      });
    }

    const courseidslot = await courses.findOne({ id: courseid });
    if (!courseidslot) {
      return res.json({ msg: "this couresid doesnot exits" });
    }
    const add = courseidslot._id;

    const location = await locations.findOne({ locname: locname });
    if (!location) {
      return res.json({ msg: "this locname doesnot exits" });
    }

    const add2 = location._id;

    const r = location.loctype;

    const test = await slots.findOne({
      location: add2,
      slotday: slotday,
      slottime: slottime,
    });

    if (test) {
      return res.json({
        msg:
          "You cannot add this slot as there is another slot assigned to this location at this time and day",
      });
    }

    if (r == "offices") {
      return res.json({ msg: "You cannot add a slot with location of office" });
    }

    const locationcheck = await locations.findOne({ locname: locname });
    if (!locationcheck) {
      return res.json({ msg: "this locname doesnot exists" });
    }

    const allslots = await slotsCounter.find({});
    if (allslots.length == 0) {
      id = 1;
    } else {
      let len = allslots.length;

      id = allslots[len - 1].counter + 1;
    }

    const newCounter = new slotsCounter({
      counter: id,
    });

    const savedCounter = await newCounter.save();

    const newslot = new slots({
      id: id,
      slotday: slotday,
      slottype: slottype,
      slottime: slottime,
      courseId: add,
      location: add2,
    });

    const savedslot = await newslot.save();

    const idslot = savedslot._id;
    foundcourse2.slots.push(idslot);
    const savedcourse = await foundcourse2.save();

    res.json({ savedcourse });
  } catch (error) {
    //important
    res.json({ msg: error.message });
  }
});

app.delete("/deleteslot", auth, async (req, res) => {
  try {
    if (req.tokenrole != "Course coordinator") {
      return res.json({ msg: "You are not authorized to to this" });
    }

    let { slotId } = req.body;

    const myRecord = await members.findOne({ id: req.id });

    const idmember = myRecord._id;

    const slotcheck = await slots.findOne({ id: slotId });

    const slotsearch = slotcheck._id;

    if (!slotcheck) {
      return res.json({ msg: "this slot id doesnot exist" });
    }

    const comp = slotcheck.courseId;

    const check2 = await courses.findOne({ _id: comp, coordinator: idmember });

    if (!check2) {
      return res.json({
        msg: "you canot delete slot to a course you are not assigned to",
      });
    }

    const match = await slots.findOneAndDelete({ id: slotId });

    const remove = await courses.findOne({ _id: comp });

    const a = remove.slots;

    const pos = a.indexOf(slotsearch);
    a.splice(pos, 1);
    const savedcourse1 = await remove.save();

    res.json({ savedcourse1 });
  } catch (error) {
    //important
    res.json({ msg: error.message });
  }
});

app.post("/updateslot", auth, async (req, res) => {
  try {
    if (req.tokenrole != "Course coordinator") {
      return res.json({ msg: "You are not authorized to to this" });
    }

    let { slotId } = req.body;

    const myRecord = await members.findOne({ id: req.id });

    const idmember = myRecord._id;

    const slotcheck = await slots.findOne({ id: slotId });

    if (!slotcheck) {
      return res.json({ msg: "this id slot doesnot exist" });
    }

    const comp = slotcheck.courseId;
    // console.log(comp);

    const comp2 = slotcheck._id;

    let { slotday, slottype, slottime, courseid, locname } = req.body;
    let id = slotId;

    console.log("TESTT");
    console.log(slottype);
    console.log(courseid);

    const check = {
      slotday: slotday,
      slottype: slottype,
      slottime: slottime,
      courseid: courseid,
      locname: locname,
    };

    const result = schemaslot2.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }

    const coursecheck = await courses.findOne({ _id: comp });
    const coursecompare = coursecheck.id;
    const typecompare = slotcheck.slottype;
    const daycompare = slotcheck.slotday;
    const loccompare = slotcheck.locname;
    const comparetime = slotcheck.slottime;

    const check2 = await courses.findOne({ _id: comp, coordinator: idmember });

    if (!check2) {
      return res.json({
        msg: "you canot update slot to a course you are not assigned to",
      });
    }

    if (locname) {
      const location = await locations.findOne({ locname: locname });
      if (!location) {
        return res.json({ msg: "this locname doesnot exists" });
      }
    }

    if (courseid) {
      const r = await courses.findOne({ id: courseid });
      if (!r) {
        return res.json({ msg: "this courseid doesnot exists" });
      }
    }

    if (slotday && slottime && locname) {
      const location = await locations.findOne({ locname: locname });
      const add2 = location._id;

      const test = await slots.findOne({
        location: add2,
        slotday: slotday,
        slottime: slottime,
      });

      const test2 = await slots.findOne({
        id: slotcheck.id,
        location: add2,
        slotday: slotday,
        slottime: slottime,
      });

      if (test2) {
        await slotcheck.save();
      } else {
        if (test) {
          return res.json({
            msg:
              "You cannot update this slot as there is another slot assigned to this location at this time and day",
          });
        }

        slotcheck.slotday = slotday;
        slotcheck.location = add2;
        slotcheck.slottime = slottime;

        await slotcheck.save();
      }

      //return res.json({ slotcheck });
    }

    if (slotday && slottime) {
      const test2 = await slots.findOne({
        id: slotcheck.id,
        location: slotcheck.location,
        slotday: slotday,
        slottime: slottime,
      });

      if (test2) {
        await slotcheck.save();
      } else {
        const test = await slots.findOne({
          location: slotcheck.location,
          slotday: slotday,
          slottime: slottime,
        });

        if (test) {
          return res.json({
            msg:
              "You cannot update this slot as there is another slot assigned to this location at this time and day",
          });
        }

        slotcheck.slotday = slotday;
        slotcheck.slottime = slottime;
        await slotcheck.save();
      }

      //return res.json(slotcheck);
    }

    if (slotday && locname) {
      const location = await locations.findOne({ locname: locname });
      const add2 = location._id;

      const test2 = await slots.findOne({
        id: slotcheck.id,
        location: add2,
        slotday: slotday,
        slottime: slotcheck.slottime,
      });

      if (test2) {
        await slotcheck.save();
      } else {
        const test = await slots.findOne({
          location: add2,
          slotday: slotday,
          slottime: slotcheck.slottime,
        });

        if (test) {
          return res.json({
            msg:
              "You cannot update this slot as there is another slot assigned to this location at this time and day",
          });
        }

        slotcheck.slotday = slotday;
        slotcheck.location = add2;

        await slotcheck.save();
      }
      //return res.json(slotcheck);
    }

    if (slottime && locname) {
      const location = await locations.findOne({ locname: locname });
      const add2 = location._id;

      const test2 = await slots.findOne({
        id: slotcheck.id,
        location: add2,
        slotday: slotcheck.slotday,
        slottime: slottime,
      });

      if (test2) {
        await slotcheck.save();
      } else {
        const test = await slots.findOne({
          location: add2,
          slotday: slotcheck.slotday,
          slottime: slottime,
        });

        if (test) {
          return res.json({
            msg:
              "You cannot update this slot as there is another slot assigned to this location at this time and day",
          });
        }

        slotcheck.slottime = slottime;
        slotcheck.location = add2;

        await slotcheck.save();
      }
      //return res.json({ slotcheck });
    }

    if (slotday) {
      // console.log(slotcheck.slotday);
      // console.log(slotday);

      const test2 = await slots.findOne({
        id: slotcheck.id,
        location: slotcheck.location,
        slotday: slotday,
        slottime: slotcheck.slottime,
      });

      if (test2) {
        slotcheck.slotday = slotday;
        await slotcheck.save();
      } else {
        const test = await slots.findOne({
          location: slotcheck.location,
          slotday: slotday,
          slottime: slotcheck.slottime,
        });

        if (test) {
          return res.json({
            msg:
              "You cannot update this slot as there is another slot assigned to this location at this time and day",
          });
        }

        slotcheck.slotday = slotday;
        await slotcheck.save();
      }
    }

    if (slottime) {
      const test2 = await slots.findOne({
        id: slotcheck.id,
        location: slotcheck.location,
        slotday: slotcheck.slotday,
        slottime: slottime,
      });

      if (test2) {
        slotcheck.slotday = slotday;
        await slotcheck.save();
      } else {
        const test = await slots.findOne({
          location: slotcheck.location,
          slotday: slotcheck.slotday,
          slottime: slottime,
        });

        if (test) {
          return res.json({
            msg:
              "You cannot update this slot as there is another slot assigned to this location at this time and day",
          });
        }

        slotcheck.slottime = slottime;
        await slotcheck.save();
      }
    }

    if (locname) {
      const location = await locations.findOne({ locname: locname });
      const add2 = location._id;

      const test2 = await slots.findOne({
        id: slotcheck.id,
        location: add2,
        slotday: slotcheck.slotday,
        slottime: slotcheck.slottime,
      });

      if (test2) {
        slotcheck.location = add2;
        await slotcheck.save();
      } else {
        const location = await locations.findOne({ locname: locname });
        const add2 = location._id;

        const test = await slots.findOne({
          location: add2,
          slotday: slotcheck.slotday,
          slottime: slotcheck.slottime,
        });

        if (test) {
          return res.json({
            msg:
              "You cannot update this slot as there is another slot assigned to this location at this time and day",
          });
        }

        slotcheck.location = add2;
        await slotcheck.save();
      }
    }

    // if (coursecompare != courseid) {

    //   console.log("enter");

    //   const check3 = await courses.findOne({
    //     id: courseid,
    //     coordinator: idmember,
    //   });

    //   if (!check3) {
    //     return res.json({
    //       msg: "you canot assign slot to a course you are not assigned to",
    //     });
    //   }

    //   const remove = await courses.findOne({ _id: comp });

    //   const a = remove.slots;

    //   const pos = a.indexOf(comp2);
    //   a.splice(pos, 1);
    //   const savedcourse1 = await remove.save();

    //   const ch = await courses.findOne({ id: courseid });
    //   const f = ch._id;

    //   slotcheck.courseId = f;

    //   ch.slots.push(comp2);

    //   await slotcheck.save();
    //   await ch.save();

    // }

    if (slottype != typecompare) {
      console.log("da5allllllllllll");
      slotcheck.slottype = slottype;
    }

    const savedslot = await slotcheck.save();
    console.log("ehhh");
    console.log(savedslot);
    res.json(savedslot);
  } catch (error) {
    //important
    res.json({ msg: error.message });
  }
});

////////////////////////////////////////YOMNA//////////////////////////////////////////////////////////////////
////////////////////////////////////////YOMNA//////////////////////////////////////////////////////////////////
////////////////////////////////////////YOMNA//////////////////////////////////////////////////////////////////
////////////////////////////////////////YOMNA//////////////////////////////////////////////////////////////////
////////////////////////////////////////YOMNA//////////////////////////////////////////////////////////////////
////////////////////////////////////////YOMNA//////////////////////////////////////////////////////////////////

app.post("/sendSlotLinking", auth, async (req, res) => {
  try {
    if (req.tokenrole == "HR") {
      return res.json({
        msg: "An Hr member cannot send a Slot Linking request",
      });
    }

    let { slotday, slottime, course, slottype } = req.body;
    const check = {
      slotday: slotday,
      slottime: slottime,
      course: course,
      slottype: slottype,
    };

    if (!slotday || !slottime) {
      return res.json({
        msg:
          "Please enter valid weekday of ['Monday', 'Tuesday','Wednesday','Thursday','Saturday','Sunday'] and slottime of ['1st', '2nd','3rd','4th','5th']",
      });
    }
    if (!course) {
      return res.json({ msg: "Please enter the course ID" });
    }

    if (!slottype) {
      return res.json({
        msg: "Please enter slot type of ['tutorial', 'lecture','lab']",
      });
    }

    const result = sendslotlinking.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }

    let sender = req.id;
    let status = "Pending";
    let senderRecord = await members.findOne({ id: sender });

    console.log("yehhh");

    let courseRecord = await courses.findOne({ id: course });

    if (!courseRecord) {
      return res.json({ msg: "Your entered course is currently unavaiable. " });
    }

    if (!courseRecord.coordinator) {
      return res.json({
        msg: "There's no course coordinator currently to approve your request.",
      });
    }

    let slotRecord = await courses.findOne({ id: course }).populate({
      path: "slots",
      select: { slotday: 1, slottime: 1, slottype: 1, assigned: 1 },
      match: { slottime: slottime, slotday: slotday, slottype: slottype },
    });

    var canBeAssigned = false;

    for (var i = 0; i < slotRecord.slots.length; i++) {
      if (slotRecord.slots[i].assigned == false) {
        canBeAssigned = true;
        break;
      }
    }

    if (slotRecord.slots.length == 0) {
      return res.json({
        msg:
          "There's no such slot , check your entered Slot Day , Slot Time & Slot Type ",
      });
    }

    if (canBeAssigned == false) {
      return res.json({ msg: "This slot is already assigned" });
    }

    let mySlots = await slots.find({
      teachingid: senderRecord._id,
      slottime: slottime,
      slotday: slotday,
    });

    if (mySlots.length != 0) {
      return res.json({
        msg:
          "You already have an assigned slot on " +
          slotday +
          " at " +
          slottime +
          " slot ",
      });
    }
    let requestId;

    const allrequests = await reqCounter.find({});
    if (allrequests.length == 0) {
      requestId = 1;
    } else {
      let len = allrequests.length;

      requestId = allrequests[len - 1].counter + 1;
    }

    const newCounter = new reqCounter({
      counter: requestId,
    });

    const savedCounter = await newCounter.save();

    const newRequest = new requests({
      id: requestId,
      reqtype: "Slot-linking",
      status: status,
      weekday: slotday,
      slottime: slottime,
      slottype: slottype,
      course: courseRecord._id,
      sender: senderRecord._id,
      receiver: courseRecord.coordinator,
    });

    const savedRequest = await newRequest.save();

    res.json({ savedRequest });
  } catch (error) {
    //important
    res.json({ msg: error.message });
  }
});

app.post("/sendChangeDayOff", auth, async (req, res) => {
  try {
    if (req.tokenrole == "HR") {
      return res.json({
        msg: "An Hr member cannot send a Change DayOff Request ",
      });
    }

    let { weekday, reason } = req.body;

    const check = {
      weekday: weekday,
      reason: reason,
    };

    const result = sendChangeDayOff.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }
    let sender = req.id;
    let status = "Pending";
    let senderRecord = await members.findOne({ id: sender });
    let senderdepRef = senderRecord.department;
    let senderdep = await departments.findOne({ _id: senderdepRef });

    if (!senderRecord.department) {
      return res.json({
        msg:
          "You don't belong to a department , so you can't send a request to the head of department.",
      });
    }

    if (!senderdep.head) {
      return res.json({
        msg: "There's no department head currently to approve your request.",
      });
    }

    if (!weekday) {
      return res.json({
        msg:
          "Please enter valid weekday of ['Monday', 'Tuesday','Wednesday','Thursday','Saturday','Sunday'] ",
      });
    }

    let allSlots = await slots.find({
      teachingid: senderRecord._id,
      slotday: weekday,
    });

    if (allSlots.length > 0) {
      return res.json({
        msg: "You have assigned slots in this day you can't take it as off day",
      });
    }

    let requestId;

    const allrequests = await reqCounter.find({});

    console.log("re" + allrequests);

    if (allrequests.length == 0) {
      requestId = 1;
    } else {
      let len = allrequests.length;

      requestId = allrequests[len - 1].counter + 1;
    }

    const newCounter = new reqCounter({
      counter: requestId,
    });
    console.log(newCounter);
    const savedCounter = await newCounter.save();

    const newRequest = new requests({
      id: requestId,
      reqtype: "Change day off",
      status: status,
      weekday: weekday,
      reason: reason,
      sender: senderRecord._id,
      receiver: senderdep.head,
    });

    const savedRequest = await newRequest.save();

    res.json({ savedRequest });
  } catch (error) {
    //important
    res.status(500).json({ error: error.message });
  }
});

app.post("/sendSlotReplacement", auth, async (req, res) => {
  try {
    if (req.tokenrole == "HR") {
      return res.json({
        msg: "An Hr member cannot send a Replacement Request ",
      });
    }

    let { receiver, date, weekday, slottime, course } = req.body;

    const check = {
      receiver: receiver,
      date: date,
      weekday: weekday,
      slottime: slottime,
      course: course,
    };

    const result = sendSlotReplacement.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }
    let sender = req.id;
    let status = "Pending";

    if (!weekday || !slottime) {
      return res.json({
        msg:
          "Please enter valid weekday of ['Monday', 'Tuesday','Wednesday','Thursday','Saturday','Sunday'] and slottime of ['1st', '2nd','3rd','4th','5th']",
      });
    }

    if (!course) {
      return res.json({ msg: "You must enter the course id " });
    }

    if (!receiver) {
      return res.json({ msg: "You must enter the receiver's id " });
    }
    if (!date) {
      return res.json({
        msg:
          "You must enter the date of the replacement day in the format dd/mm/yyyy ",
      });
    }
    var today = new Date();

    let dd = date.substring(0, 2);
    let mm = date.substring(3, 5);
    let yyyy = date.substring(6, 10);

    var leaveday = new Date(yyyy, mm - 1, dd);

    if (leaveday < today) {
      return res.json({
        msg: " The date of the replacement request must be after today",
      });
    }

    let senderRecord = await members.findOne({ id: sender });
    let receiverRecord = await members.findOne({ id: receiver });
    let courseRecord = await courses.findOne({ id: course });

    if (!receiverRecord) {
      return res.json({
        msg:
          "You are trying to send a replacment request to an unexciting member. ",
      });
    }

    if (!courseRecord) {
      return res.json({
        msg: "There's no course available with this courseID.",
      });
    }

    if (senderRecord.department.equals(receiverRecord.department) == false) {
      return res.json({
        msg:
          "You can only send replacemnet requests to members in the same department as you.",
      });
    }

    var found = false;

    if (
      senderRecord.role == "Course Instructor" ||
      senderRecord.role == "HOD"
    ) {
      for (var i = 0; i < courseRecord.instructors.length; i++) {
        if (courseRecord.instructors[i].equals(receiverRecord._id)) {
          found = true;
        }
      }
    }

    if (
      senderRecord.role == "Teaching assistant" ||
      senderRecord.role == "Course coordinator"
    ) {
      for (var j = 0; j < courseRecord.teachingassistants.length; j++) {
        if (courseRecord.teachingassistants[j].equals(receiverRecord._id)) {
          found = true;
        }
      }
    }

    if (found == false) {
      return res.json({
        msg:
          "You can only send replacemnet requests to members teaching your entered course",
      });
    }

    const slot = await slots.findOne({
      teachingid: senderRecord._id,
      slotday: weekday,
      slottime: slottime,
      courseId: courseRecord._id,
    });
    if (!slot) {
      return res.json({
        msg: "This slot doesn't exsit or not assigned to you",
      });
    }

    let requestId;

    const allrequests = await reqCounter.find({});
    if (allrequests.length == 0) {
      requestId = 1;
    } else {
      let len = allrequests.length;

      requestId = allrequests[len - 1].counter + 1;
    }

    const newCounter = new reqCounter({
      counter: requestId,
    });

    const savedCounter = await newCounter.save();

    const newRequest = new requests({
      id: requestId,
      reqtype: "Replacement",
      date: date,
      slottime: slottime,
      weekday: weekday,
      course: courseRecord._id,
      status: status,
      sender: senderRecord._id,
      receiver: receiverRecord._id,
    });

    const savedRequest = await newRequest.save();

    res.json({ savedRequest });
  } catch (error) {
    res.json({ msg: error.message });
  }
});

app.get("/viewReceivedReplacements", auth, async (req, res) => {
  try {
    if (req.tokenrole == "HR") {
      return res.json({
        msg: "An Hr member doesnot have replacement requests ",
      });
    }
    console.log(req.id);

    let myRecord = await members.findOne({ id: req.id });
    console.log(myRecord);
    let myRequests = await requests
      .find({
        receiver: myRecord._id,
        reqtype: "Replacement",
      })
      .populate({
        path: "course",
        select: { _id: 0, id: 1 },
      })
      .populate({
        path: "sender",
        select: { _id: 0, id: 1 },
      });

    res.send({ myRequests });
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.put("/viewSentRequests/", auth, async (req, res) => {
  try {
    if (req.tokenrole == "HR") {
      return res.json({ msg: "An Hr member doesnot have sent requests " });
    }

    let status = req.body.status;

    console.log("status " + status);

    let myRecord = await members.findOne({ id: req.id });
    let myRequests;

    if (!status) {
      myRequests = await requests
        .find({
          sender: myRecord._id,
        })
        .populate({
          path: "course",
          select: { _id: 0, id: 1 },
        })
        .populate({ path: "receiver", select: { _id: 0, id: 1 } });
    } else {
      myRequests = await requests
        .find({
          sender: myRecord._id,
          status: status,
        })
        .populate({ path: "course", select: { _id: 0, id: 1 } })
        .populate({ path: "receiver", select: { _id: 0, id: 1 } });
    }

    res.json({ myRequests });
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.put("/acceptReplacemant", auth, async (req, res) => {
  try {
    let { requestId } = req.body;
    const check = {
      requestId: requestId,
    };

    const result = acceptReplacemant.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }

    let myRecord = await members.findOne({ id: req.id });

    let checkRequest = await requests.findOne({
      id: requestId,
      reqtype: "Replacement",
    });

    if (!checkRequest) {
      return res.json({ msg: "There 's no replacement request with this ID " });
    }

    if (checkRequest.status != "Pending") {
      return res.json({
        msg: "This request is already " + checkRequest.status,
      });
    }

    let course = await courses.findOne({ _id: checkRequest.course });

    if (!course) {
      return res.json({
        msg: "This request is having a course that is currently unavailable. ",
      });
    }

    let senderRecord = await members.findOne({ _id: checkRequest.sender });

    if (!senderRecord) {
      return res.json({
        msg: "The person wh sent this request is no more an acdameic member.",
      });
    }

    let mySlots = await slots.find({
      teachingid: myRecord._id,
      slotday: checkRequest.weekday,
      slottime: checkRequest.slottime,
    });

    let myReplacements = await slots.find({
      replacementId: myRecord._id,
      slotday: checkRequest.weekday,
      slottime: checkRequest.slottime,
      replacementDate: checkRequest.date,
    });

    if (mySlots.length != 0) {
      return res.json({
        msg:
          "You can't accept this request , you have a slot assignemnt in the same time",
      });
    }

    if (myReplacements.length != 0) {
      return res.json({
        msg:
          "You can't accept this request , you have a slot replacement in the same time",
      });
    }

    let myRequest = await requests.findOneAndUpdate(
      { id: requestId },
      { status: "Accepted" },
      { new: true }
    );

    if (!myRequest) {
      return res.json({
        msg: "There's no such request submitted to you",
      });
    }

    let notify =
      "Your Replacement Request to Id " +
      myRecord.id +
      " in Course " +
      course.id +
      " On " +
      myRequest.weekday +
      " " +
      myRequest.date +
      " " +
      myRequest.slottime +
      " has been accepted by ID " +
      myRecord.id;

    console.log("HEREE2");

    senderRecord.notifications.push(notify);
    await senderRecord.save();
    console.log(notify);
    console.log(myRequest);

    res.send(myRequest);
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.put("/rejectReplacemant", auth, async (req, res) => {
  try {
    let { requestId } = req.body;

    const check = {
      requestId: requestId,
    };

    const result = rejectReplacemant.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }

    let myRecord = await members.findOne({ id: req.id });

    let myRequest = await requests.findOne({ id: requestId });

    if (!myRequest) {
      return res
        .status(400)
        .json({ msg: "There 's no request with this ID submitted to you." });
    }

    if (myRequest.status != "Pending") {
      return res.json({
        msg: "This request is already " + myRequest.status,
      });
    }

    let course = await courses.findOne({ _id: myRequest.course });
    if (!course) {
      return res.json({
        msg: "This request is having a course that is currently unavailable. ",
      });
    }

    let senderRecord = await members.findOne({ _id: myRequest.sender });

    if (!senderRecord) {
      return res.json({
        msg: "The person wh sent this request is no more an acdameic member.",
      });
    }

    if (!myRequest) {
      return res.json({
        msg: "There's no such request submitted to you",
      });
    }

    let newRequest = await requests.findOneAndUpdate(
      { id: requestId },
      { status: "Rejected" },
      { new: true }
    );

    let notify =
      "Your Replacement Request to Id " +
      myRecord.id +
      " in Course " +
      course.id +
      " On " +
      myRequest.weekday +
      " " +
      myRequest.date +
      " " +
      myRequest.slottime +
      " has been rejected by ID " +
      myRecord.id;
    senderRecord.notifications.push(notify);
    await senderRecord.save();
    console.log(notify);
    console.log(senderRecord.notifications);

    console.log(newRequest);

    res.json({ newRequest });
  } catch (error) {
    res.json({ msg: error.message });
  }
});

app.post("/sendLeave", auth, async (req, res) => {
  try {
    if (req.tokenrole == "HR") {
      return res.json({ msg: "An Hr member cannot send a Leave Request " });
    }

    let {
      leavetype,
      compensationDate,
      date,
      reason,
      document,
      replacement,
    } = req.body;

    const check = {
      leavetype: leavetype,
      compensationDate: compensationDate,
      date: date,
      reason: reason,
      document: document,
      //replacement: replacement
    };

    const result = sendLeave.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }
    let sender = req.id;
    let status = "Pending";

    let senderRecord = await members.findOne({ id: sender });
    let senderdepRef = senderRecord.department;
    let senderdep = await departments.findOne({ _id: senderdepRef });

    if (!senderRecord.department) {
      return res.json({
        msg:
          "You don't belong to a department , so you can't send a request to the head of department.",
      });
    }

    if (!senderdep.head) {
      return res.json({
        msg: "There's no deprtment head currently to approve your request.",
      });
    }

    //headdd
    //console.log(senderdep.head);

    if (!leavetype) {
      return res.json({
        msg:
          "Please enter valid leave type of ['Compensation', 'Annual','Sick','Maternity','Accidental']",
      });
    }

    if (!date) {
      return res.json({
        msg:
          "You must enter the date of the leave day in the format yyyy-mm-dd ",
      });
    }

    try {
      let dd = date.substring(0, 2);
      let mm = date.substring(3, 5);
      let yyyy = date.substring(6, 10);

      var leaveday = new Date(yyyy, mm - 1, dd);
    } catch (error) {
      res.json({
        error:
          "Please write the date in the format yyyy-mm-dd (example: 2019-11-20)",
      });
    }

    let today = new Date();

    console.log(
      "leaveday " +
        leaveday.getFullYear() +
        "-" +
        leaveday.getMonth() +
        "-" +
        leaveday.getDate()
    );
    console.log(
      "today " +
        today.getFullYear() +
        "-" +
        today.getMonth() +
        "-" +
        today.getDate()
    );

    const diffTime = Math.abs(today - leaveday);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    //console.log(diffTime + " milliseconds");
    console.log(diffDays + " between days");
    //console.log(diffDays>3)

    if (leavetype == "Annual") {
      if (today > leaveday) {
        return res.json({
          msg: " Annual leaves should be submitted before the targeted day .",
        });
      }
      if (!replacement) {
        replacement = [];
      }

      for (var i = 0; i < replacement.length; i++) {
        let requestRecord = await requests.findOne({ id: replacement[i] });

        console.log("look" + !requestRecord);
        if (!requestRecord) {
          return res.json({
            msg: "You are entering invalid requests in replacement",
          });
        }

        if (
          requestRecord.reqtype != "Replacement" ||
          requestRecord.status != "Accepted"
        ) {
          return res.json({
            msg:
              "Your submitted replacements must be accepted replacement requests.",
          });
        }
      }
    }

    if (leavetype == "Accidental") {
      if (senderRecord.annualLeaveBalance < 1) {
        return res.json({
          msg: "Your don't have enough Annual Level Balance ",
        });
      }

      if (senderRecord.accidentalLeaves < 1) {
        return res.json({
          msg: "You can have only up to six days for accidental leaves",
        });
      }
    }

    if (leavetype == "Sick") {
      if (!document) {
        return res.json({
          msg:
            "Proper documents should be submitted with the leave request to prove the medical condition (link to a google drive where you have your document) ",
        });
      }

      if (diffDays > 3 && today > leaveday) {
        return res.json({
          msg:
            "Sick leave request can be submitted by maximum three days after the sick day",
        });
      }
    }

    if (leavetype == "Maternity") {
      if (senderRecord.gender != "Female") {
        return res.json({
          msg:
            "Maternity leaves should only be submitted by female staff members.",
        });
      }

      if (!document) {
        return res.json({
          msg:
            "Proper documents should be submitted with the leave request to prove the maternity condition (link to a google drive where you have your document) ",
        });
      }
    }

    if (leavetype == "Compensation") {
      if (!reason) {
        return res.json({
          msg: "You must add your reason for the compenstaion leave",
        });
      }
      if (!compensationDate) {
        return res.json({
          msg:
            "You must add your Compensation Date ( In order for the request to be valid, you should attend one of your off days during the same month",
        });
      }

      try {
        let dd1 = date.substring(0, 2);
        let mm1 = date.substring(3, 5);
        let yyyy1 = date.substring(6, 10);

        var compDate = new Date(yyyy1, mm1 - 1, dd1);
      } catch (error) {
        res.json({
          error:
            "Please write the date in the format yyyy-mm-dd (example: 2019-11-20)",
        });
      }

      if (compDate < today || leaveday < today) {
        return res.json({
          msg:
            " The date you want to take as an off day and the compensation date must be after the request date.",
        });
      }

      //  console.log("compdate " + compensationDate.getFullYear() + "-" + compensationDate.getMonth() + "-" + compensationDate.getDate());
    }

    let requestId;

    const allrequests = await reqCounter.find({});
    if (allrequests.length == 0) {
      requestId = 1;
    } else {
      let len = allrequests.length;

      requestId = allrequests[len - 1].counter + 1;
    }

    const newCounter = new reqCounter({
      counter: requestId,
    });

    const savedCounter = await newCounter.save();

    const newRequest = new requests({
      id: requestId,
      reqtype: "Leave",
      leavetype: leavetype,
      //weekday:weekday,
      date: date,
      compensationDate: compensationDate,
      reason: reason,
      status: status,
      document: document,
      replacements: replacement,
      sender: senderRecord._id,
      receiver: senderdep.head,
    });

    const savedRequest = await newRequest.save();
    //console.log(savedRequest);
    res.json({ savedRequest });
  } catch (error) {
    //important
    res.json({ msg: error.message });
  }
});

app.delete("/cancelRequest", auth, async (req, res) => {
  try {
    if (req.tokenrole == "HR") {
      return res.json({ msg: "An Hr member cannot send a Leave Request " });
    }

    var today = new Date();

    let { requestId } = req.body;
    const check = {
      requestId: requestId,
    };

    const result = cancelRequest.validate(check);

    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
      return res.json({ msg: error.details[0].message });
    }

    let myRecord = await members.findOne({ id: req.id });
    console.lo;

    let myRequest1 = await requests.findOne({
      id: requestId,
      sender: myRecord._id,
    });

    console.log(myRequest1);

    if (!myRequest1) {
      return res.json({
        msg: "You don't have a request that you submitted with this ID ",
      });
    }

    console.log(myRequest1.status != "Pending");
    console.log(myRequest1.date > today);

    if (myRequest1.status != "Pending" && myRequest1.date < today) {
      return res.json({
        msg:
          " You can only cancel a still pending request or a request whose day is yet to come.",
      });
    }

    let myRequest = await requests.findOneAndRemove({
      id: requestId,
      sender: myRecord._id,
    });

    res.send(myRequest);
  } catch (error) {
    //important
    res.json({ msg: error.message });
  }
});

app.get("/viewMySchedule", auth, async (req, res) => {
  try {
    if (req.tokenrole == "HR") {
      return res.json({ msg: "An Hr member doesn't have a schedule" });
    }

    let sender = req.id;

    let senderRecord = await members.findOne({ id: sender });
    var today = new Date();

    let slotRecords = await slots
      .find(
        { teachingid: senderRecord._id },
        { slotday: 1, slottime: 1, slottype: 1, location: 1, courseId: 1 }
      )
      .populate({
        path: "courseId",
        select: { _id: 0, id: 1 },
      })
      .populate({
        path: "location",
        select: { _id: 0, locname: 1 },
      });
    //comebackk

    // replacementDate: { $gte: today

    let replacementRecords = await slots
      .find(
        { replacementId: senderRecord._id },
        {
          slotday: 1,
          slottime: 1,
          slottype: 1,
          location: 1,
          courseId: 1,
          replacementDate: 1,
        }
      )
      .populate({
        path: "courseId",
        select: { _id: 0, id: 1 },
      })
      .populate({
        path: "location",
        select: { _id: 0, locname: 1 },
      });

    let replacementRecordsToShow = [];

    //comebackkkk

    for (var i = 0; i < replacementRecords.length; i++) {
      let dd = replacementRecords[i].replacementDate.substring(0, 2);
      let mm = replacementRecords[i].replacementDate.substring(3, 5);
      let yyyy = replacementRecords[i].replacementDate.substring(6, 10);

      var repDate = new Date(yyyy, mm - 1, dd);
      var today = new Date();

      if (repDate > today) {
        replacementRecordsToShow.push(replacementRecords[i]);
      }
    }

    var allMySlots = [];

    allMySlots.push(slotRecords);
    allMySlots.push(replacementRecordsToShow);

    res.json({ allMySlots });
  } catch (error) {
    //important
    res.json({ msg: error.message });
  }
});

setInterval(async function () {
  console.log("Hello");
  const memberss = await members.find({});
  console.log(members);

  for (var i = 0; i < memberss.length; i++) {
    memberss[i].annualLeaveBalance = memberss[i].annualLeaveBalance + 2.5;

    await memberss[i].save();
    console.log(memberss[i]);
  }
}, 2147483647);

setInterval(async function () {
  //console.log("Hello");
  const memberss = await members.find({});

  for (var i = 0; i < memberss.length; i++) {
    memberss[i].accidentalLeaves = 6;

    await memberss[i].save();
    console.log(memberss[i]);
  }
}, 2147483647);

console.log("hereeee");
