import React, { useState, useEffect, memo } from 'react'
import UserIcon from '../UserIcon.png'
//import axios from 'axios';
// import { Image } from 'cloudinary-react';
import { Row, Col, Container, Card, Image, Modal, Form } from 'react-bootstrap';
import Membersnavbar from './membersnavbar';
import Hrnavbar from './NavBars/hrnavbarprofile';
import axios from "axios";


import {

    Button,
    InputLabel
} from "@material-ui/core";
import Swal from 'sweetalert2'
import { set } from 'mongoose';

export default function Viewhrprofile() {

    const [name, setName] = useState("");
    const [id, setId] = useState("");
    const [salary, setSalary] = useState(0);
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [officelocation, setOfficelocation] = useState("")
    const [dayoff, setDayoff] = useState("")
    const [role, setRole] = useState("")
    const [annualLeaveBalance, setAnnualleavebalance] = useState("")
    const [accidentalleavebalance, setAccidentalleavebalance] = useState("")
    const [bio, setBio] = useState("")
    const [faculty, setFaculty] = useState("")
    const [oldpassword, setOldpassword] = useState("")
    const [newpassword, setNewpassword] = useState("")
    const [passwordcheck, setPasswordcheck] = useState("")
    const [department, setDepartment] = useState("")
    const [refresh, setRefresh] = useState(false)



    const [dummygender, setDummygender] = useState(gender);
    const [dummydayoff, setDummydayoff] = useState(dayoff)
    const [dummyrole, setDummyrole] = useState(role)
    const [dummybio, setDummybio] = useState(bio)
    const [dummyfaculty, setDummyfaculty] = useState(faculty)
    const [dummydepartment, setDummydepartment] = useState(department)
    const [dummysalary, setDummysalary] = useState(salary);

    const [showreset, setShowrreset] = useState(false)
    const [showupdate, setShowupdate] = useState(false)



    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })

    const sendUpdate = () => {
        setShowupdate(!showupdate);
        //Reseting all the Values
        //setSalary()//
         

    }
    const ResetUpdate = () => {
        setShowupdate(!showupdate);
        //Reseting all the Values
        setDayoff(dayoff)
        setDummybio(bio)
        setDummydepartment(department)
        setDummyfaculty(faculty)
        setDummygender(gender)
        setDummysalary(salary)
        setDummyrole(role)
        
         

    }
    const handleupdateclick = async(e) => {

        setShowupdate(!showupdate);
        try {

            await axios({
                method: "put",
                url: process.env.REACT_APP_SERVER + "/updatemyProfile",
                headers: { 'auth-token': localStorage.getItem('auth-token') },
                data: {
                    initial_salary:dummysalary,
                   faculty:dummyfaculty,
                   department:dummydepartment,
                   role:dummyrole,
                   dayoff:dummydayoff,
                   bio:dummybio
                },
            }).then((res) => {
                setRefresh(!refresh)
                //setDayoff(dayoff)
               // setDummybio(bio)
                // console.log(bio)
                
                // setDummygender(gender)
                // setDummysalary(salary)
                // setDummyrole(role)
                
                console.log(department)
                console.log(dummydepartment)
                
               // Swal.fire(res.data.msg);
                
                

                if (res.status === 400) {
                    Swal.fire(res.data.msg)
                }

                if (!res.data.msg) {
                    console.log("here")

                    //   window.location.reload();
                } else {
                   
                    Swal.fire(res.data.msg);
                   // setTimeout( window.location.reload(),10000);
                }


            });
        } catch (e) {
            console.log(e);
        }

        // swalWithBootstrapButtons.fire(
        //     'Updated!',
        //     'Your Profile has been updated.',
        //     'success'
        // )
        // Swal.fire(passwordcheck)

        // make API call



    };



    const sendReset = () => {
        setShowrreset(!showreset);
        setOldpassword("");
        setNewpassword("");
        setPasswordcheck("");
    }

    const handleresetclick = async (e) => {

        setShowrreset(!showreset);
        // Swal.fire(passwordcheck)
        if (newpassword !== passwordcheck) {
            Swal.fire("Passwords don't match");
        } else {
            // make API call
            try {

                await axios({
                    method: "put",
                    url: process.env.REACT_APP_SERVER + "/resetPassword",
                    headers: { 'auth-token': localStorage.getItem('auth-token') },
                    data: {
                        oldPassword: oldpassword,
                        newPassword: newpassword,
                        passwordCheck: passwordcheck
                    },
                }).then((res) => {
                    console.log(res.data)


                    if (res.status === 400) {
                        Swal.fire(res.data.msg)
                    }

                    if (!res.data.msg) {
                        console.log("here")

                        //   window.location.reload();
                    } else {
                        Swal.fire(res.data.msg);
                    }


                });
            } catch (e) {
                console.log(e);
            }



            // swalWithBootstrapButtons.fire(
            //     'Passward Reset!',
            //     'Your Password has been updated.',
            //     'success'
            // )
        }


    };

    useEffect(async () => {

        try {
           await axios({
                method: 'get',
                url: process.env.REACT_APP_SERVER + '/viewProfile',
                headers: { 'auth-token': localStorage.getItem('auth-token') },
                data: {},
            }).then(
                res => {


                    // setUserInfo(res.data.userInfo)
                    // let fullAddr = (res.data.userInfo.country).concat(" - ").concat(res.data.userInfo.city).concat(" - ").concat(res.data.userInfo.address)
                    // setAddress(fullAddr)
                    // setFirstName(res.data.userInfo.firstName)
                    // setLastName(res.data.userInfo.lastName)
                    // setEmail(res.data.userInfo.email)
                    // setPhoneNumber(res.data.userInfo.phoneNumber)
                    setName(res.data.existingUser.name)
                    setId(res.data.existingUser.id)
                    setEmail(res.data.existingUser.email)
                    setSalary(res.data.existingUser.initial_salary)                        
                    setGender(res.data.existingUser.gender)
                    setOfficelocation(res.data.existingUser.officelocation.locname)
                    setDayoff(res.data.existingUser.dayoff)
                    setRole(res.data.existingUser.role)
                    
                    //setDayoff(res.data.existingUser.dayoff)
                    if (!((res.data.existingUser.faculty) === undefined)) {
                        setFaculty(res.data.existingUser.faculty.name)
                        setDummyfaculty(res.data.existingUser.faculty.name)
                    }else{
                        setDummyfaculty("")
                    }

                    if (!((res.data.existingUser.department) === undefined)) {
                        setDepartment(res.data.existingUser.department.name)
                        setDummydepartment(res.data.existingUser.department.name)
                    }
                    else{
                        setDummydepartment("")
                    }
                    setAnnualleavebalance(res.data.existingUser.annualLeaveBalance)
                    setAccidentalleavebalance(res.data.existingUser.accidentalLeaveBalance)
                    setBio(res.data.existingUser.bio)

                    if (res.status === 400) {
                        Swal.fire(res.data.msg)
                    }

                    if (!res.data.msg) {
                        console.log("here")

                        //   window.location.reload();
                    } else {
                        Swal.fire(res.data.msg);
                    }


                }
            )
        }
        catch (e) {
            console.log(e)
        }
    }, [refresh])

    return (
        <div>
            <div>

                <Hrnavbar />

            </div>
            <div className="card" style={{ marginTop: '20px', backgroundColor: '#F4F4F0' }}>
                <div className="row" style={{ display: 'flex', justifyContent: 'center', padding: '10px 0px 20px 0px' }}>

                    <Image src={UserIcon} style={{ width: '7%', height: '7%' }} roundedCircle />

                </div>
                <div className="row" style={{ fontSize: 21, fontFamily: 'Bodoni MT', padding: '0px 0px 10px 0px' }}>
                    <div className=" offset-1  col-md-3 " >
                        Name : {name}
                    </div>

                </div>
                <div className="row" style={{ fontSize: 21, fontFamily: 'Bodoni MT', padding: '0px 0px 10px 0px' }}>
                    <div className="col-11 offset-1 col-md-2 " >
                        id : {id}
                    </div>
                    {/* <div className="col-11 offset-1 col-md-4" >
                        <input type="text" className="form-control custom_input" id="lastname" defaultValue={lastName}
                            formControlName="lastname" style={{ backgroundColor: '#F4F4F0', width: '80%' }} placeholder="Last Name" required onChange={(e) => { setLastName(e.target.value) }} />

                    </div> */}

                </div>
                <div className="row" style={{ fontSize: 20, fontFamily: 'Bodoni MT', padding: '0px 0px 10px 0px' }}>
                    <div className="offset-1 col-md-3 " >
                        E-Mail : {email}
                    </div>
                    {/* <div className="col-11 offset-1 col-md-4" >
                        <input type="text" className="form-control custom_input" id="email" defaultValue={email}
                            formControlName="user_mail" style={{ backgroundColor: '#F4F4F0', width: '80%' }} placeholder="email" required onChange={(e) => { setEmail(e.target.value) }} />

                    </div> */}

                </div>


                <div className="row" style={{ fontSize: 20, fontFamily: 'Bodoni MT', padding: '0px 0px 10px 0px' }}>
                    <div className="col-11 offset-1 col-md-2 " >
                        Salary : {salary}
                    </div>
                    {/* <div className="col-11 offset-1 col-md-4" >
                        <input type="text" className="form-control custom_input" id="mobile" defaultValue={phoneNumber}
                            formControlName="mobile" style={{ backgroundColor: '#F4F4F0', width: '80%' }} placeholder="01XXXXXXXXX" required onChange={(e) => { setPhoneNumber(e.target.value) }} />

                    </div> */}

                </div>

                <div className="row" style={{ fontSize: 21, fontFamily: 'Bodoni MT', padding: '0px 0px 10px 0px' }}>
                    <div className="col-11 offset-1 col-md-2 " >
                        Gender : {gender}
                    </div>


                </div>
                <div className="row" style={{ fontSize: 21, fontFamily: 'Bodoni MT', padding: '0px 0px 10px 0px' }}>
                    <div className="col-11 offset-1 col-md-2 " >
                        Office : {officelocation}
                    </div>


                </div>
                <div className="row" style={{ fontSize: 21, fontFamily: 'Bodoni MT', padding: '0px 0px 10px 0px' }}>
                    <div className="col-11 offset-1 col-md-2 " >
                        dayoff : {dayoff}
                    </div>

                </div>

                <div className="row" style={{ fontSize: 21, fontFamily: 'Bodoni MT', padding: '0px 0px 10px 0px' }}>
                    <div className="col-11 offset-1 col-md-2 " >
                        Role : {role}
                    </div>

                </div>
                {faculty === "" ? <div></div> : <div className="row" style={{ fontSize: 21, fontFamily: 'Bodoni MT', padding: '0px 0px 10px 0px' }}>
                    <div className="offset-1 col-md-3 " >
                        Faculty : {faculty}
                    </div>
                </div>}
                {department === "" ? <div></div> : <div className="row" style={{ fontSize: 21, fontFamily: 'Bodoni MT', padding: '0px 0px 10px 0px' }}>
                    <div className=" offset-1 col-md-3 " >
                        Department : {department}
                    </div>
                </div>}



                <div className="row" style={{ fontSize: 21, fontFamily: 'Bodoni MT', padding: '0px 0px 10px 0px' }}>
                    <div className="col-11 offset-1 col-md-2 " >
                        AnnualLeave : {annualLeaveBalance}
                    </div>

                </div>
                <div className="row" style={{ fontSize: 21, fontFamily: 'Bodoni MT', padding: '0px 0px 10px 0px' }}>
                    <div className="col-11 offset-1 col-md-2 " >
                        AccidentalLeave : {accidentalleavebalance}
                    </div>

                </div>

                <div className="row" style={{ fontSize: 21, fontFamily: 'Bodoni MT', padding: '0px 0px 10px 0px' }}>
                    <div className=" offset-1 col-md-3" >
                        Bio : {bio}
                    </div>




                </div>
            </div>

            <Row className="justify-content-md-center">
                <Col xs lg="2">
                    <Button onClick={sendReset}
                        type="submit"
                        style={{
                            backgroundColor: "#456268",
                            color: "white"
                        }}
                    >
                        {" "}
                Reset Password
              </Button>{" "}
                    <br />
                </Col>
                <Col xs lg="2">
                    <Button onClick={ResetUpdate}
                        type="submit"
                        style={{
                            backgroundColor: "#456268",
                            color: "white"
                        }}
                    >
                        {" "}
                Update My Account
              </Button>{" "}
                    <br />
                </Col>
            </Row>
            <Modal
                show={showreset}
                centered
                onHide={sendReset}
            >
                <Modal.Header closeButton>
                    <h4 style={{ textAlign: "center" }}>Reset Password</h4>
                </Modal.Header>
                <Modal.Body>
                    <Container>


                        <Row>
                            <Form.Group as={Col}>
                                <Form.Label>old Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    required
                                    placeholder="Old Password"
                                    onChange={(e) => {
                                        setOldpassword(e.target.value);
                                    }}
                                />
                            </Form.Group>

                        </Row>
                        <Row>
                            <Form.Group as={Col}>
                                <Form.Label>New Password</Form.Label>
                                <Form.Control
                                    placeholder="New Password"
                                    required
                                    type="password"
                                    onChange={(e) => {
                                        setNewpassword(e.target.value);
                                    }}
                                />
                            </Form.Group>

                        </Row>
                        <Row>
                            <Form.Group as={Col}>
                                <Form.Label>Check Password</Form.Label>
                                <Form.Control
                                    placeholder="Check Password"
                                    type="password"
                                    required
                                    onChange={(e) => {
                                        setPasswordcheck(e.target.value);
                                    }}
                                />
                            </Form.Group>

                        </Row>

                        <Row>
                            <Col md={{ offset: 2, span: 4 }}>
                                <Button
                                    style={{ backgroundColor: "#007bff", color: "white" }}
                                    onClick={(e) => {
                                        handleresetclick(e)
                                    }}
                                >
                                    Reset
                    </Button>
                            </Col>
                            <Col md={{ offset: 2, span: 4 }}>
                                <Button
                                    style={{ backgroundColor: "Red", color: "white" }}
                                    onClick={sendReset}
                                >
                                    Cancel
                    </Button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
            <Modal
                show={showupdate}
                centered
                onHide={ResetUpdate}
            >
                <Modal.Header closeButton>
                    <h4 style={{ textAlign: "center" }}>Update Profile</h4>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Form.Group as={Col}>
                                <Form.Label>Salary</Form.Label>
                                <Form.Control
                                type={Number}
                                value={dummysalary}
                                    placeholder="Salary"
                                    onChange={(e) => {
                                        setDummysalary(e.target.value);
                                    }}
                                />
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>Faculty</Form.Label>
                                <Form.Control
                                value={dummyfaculty}
                                    placeholder="Faculty"
                                    onChange={(e) => {
                                        setDummyfaculty(e.target.value);
                                    }}
                                />
                            </Form.Group>
                        </Row>
                        <br></br>
                        <Row>
                            <Form.Group as={Col}>
                                <Form.Label>Department</Form.Label>
                                <Form.Control
                                value={dummydepartment}
                                    placeholder="Department"
                                    onChange={(e) => {
                                        setDummydepartment(e.target.value);
                                    }}
                                />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Role</Form.Label>
                                <Form.Control
                                
                                    as="select"
                                    value={dummyrole}
                                    onChange={(e) => {
                                       setDummyrole(e.target.value);
                                    }}
                                >

                                    <option>HR</option>
                                    <option>Course coordinator</option>
                                    <option>HOD</option>
                                    <option>Course Instructor</option>
                                    <option>Teaching assistant</option>
                                </Form.Control>
                            </Form.Group>



                        </Row>

                        <br></br>
                        <Row>

                            <Form.Group as={Col}>
                                <Form.Label>Dayoff</Form.Label>
                                <Form.Control
                                    value={dummydayoff}
                                    as="select"
                                    onChange={(e) => {
                                        setDummydayoff(e.target.value);
                                       
                                    }}
                                >
                                    <option>Saturday</option>
                                    <option>Sunday</option>
                                    <option>Monday</option>
                                    <option>Tuesday</option>
                                    <option>Wednesday</option>
                                    <option>Thursday</option>
                                    </Form.Control>


                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Bio</Form.Label>
                                <Form.Control
                                value={bio}
                                    placeholder="Bio"
                                    onChange={(e) => {
                                        setDummybio(e.target.value);
                                    }}
                                />
                            </Form.Group>
                        </Row>



                        <Row>
                            <Col md={{ offset: 2, span: 4 }}>
                                <Button
                                    style={{ backgroundColor: "#007bff", color: "white" }}
                                    onClick={(e) => {
                                        handleupdateclick(e)
                                    }}
                                >
                                    Update
                    </Button>
                            </Col>
                            <Col md={{ offset: 2, span: 4 }}>
                                <Button
                                    style={{ backgroundColor: "Red", color: "white" }}
                                    onClick={ResetUpdate}
                                >
                                    Cancel
                    </Button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>




        </div>

    );




}