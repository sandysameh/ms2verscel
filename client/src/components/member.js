import React, { Component } from "react";
import { Navbar, Nav, NavDropdown, NavItem, Button } from 'react-bootstrap'
import ReactBootstrap, { Jumbotron, Container, Col, Row, Grid, Panel, FormGroup, FormControl, Card } from 'react-bootstrap'
import {
  NavbarBrand, NavbarToggler, Collapse,
  ModalHeader, ModalBody, Input, Label, CardBody, CardHeader
} from 'reactstrap';
import Datetime from "react-datetime";
import Swal, { swal } from "sweetalert2/dist/sweetalert2.js";
import { Form, Modal, Table } from "react-bootstrap";
import MyAttendence from "./subComponents/myAttendence";
import './NavBars/bell.css'
import BellIcon from 'react-bell-icon'
import axios from "axios";

class Member extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedID: "",
      currentId:"",
      showUpdate: false,
      name: "",
      email: "",
      sex: "",
      Salary: "",
      Role: "",

      office: "",
      faculty: "",
      department: "",
      bio: "",
      showLoc: false,
      nameU: "",
      sexU: "",
      SalaryU: 0,
      RoleU: "",

      officeU: "",
      facultyU: "",
      departmentU: "",
      bioU: "",
      signinday: 0,
      signinmonth: 0,
      signinyear: 0,
      signinhour: 0,
      signinmin: 0,
      signoutday: 0,
      signoutmonth: 0,
      signoutyear: 0,
      signouthour: 0,
      signoutmin: 0,
      showsignin: false,
      showsignout: false,
      showattendence: false,
      buttonenable: false,
      repData: [],//The List u get of this certain User for his attendence
      user: {//member
        // officelocation: { locname: "l7" },
        // faculty: { name: "cs" },
        //department:{name:"df"}
      }
    };
  }
  resetSignin() {
    this.setState({ showsignin: !this.state.showsignin });
    this.setState({ signinday: 0 });
    this.setState({ signinmonth:  0});
    this.setState({ signinyear: 0 });
    this.setState({ signinhour: 0 });
    this.setState({ signinmin: 0 });
  }
  handlesignin(e) {

    //setShowrreset(!showreset);
    // Swal.fire(passwordcheck)
    Swal.fire({
      title: 'SIGN IN?',
      text: "Are You sure ?You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Sign in!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {

          await axios({
            method: "get",
            url: process.env.REACT_APP_SERVER + "/signin",
            headers: { 'auth-token': localStorage.getItem('auth-token') },
            data: {

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
      }
    })


    // make API call



  };
  handlesignout(e) {

    //setShowrreset(!showreset);
    // Swal.fire(passwordcheck)
    Swal.fire({
      title: 'SIGN OUT?',
      text: "Are You sure ?You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Sign OUT!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {

          await axios({
            method: "get",
            url: process.env.REACT_APP_SERVER + "/signout",
            headers: { 'auth-token': localStorage.getItem('auth-token') },
            data: {

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
      }
    })


    // make API call



  };


  closeAttendence() {
    this.setState({ showattendence: !this.state.showattendence });
  }
  async openAttendnce(id) {
    this.setState({ showattendence: !this.state.showattendence });
    try {
      // const accesstoken =
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFjLTE1IiwidG9rZW5yb2xlIjoiQ291cnNlIGNvb3JkaW5hdG9yIiwiaWF0IjoxNjA4OTIzMTMxfQ.tSLFR5PXbFlDRqogpI2CggbqTDldRLUBMxlZ_0Z9pUI";

      await axios({
        method: "get",
        url: process.env.REACT_APP_SERVER + "/attendance/" + id,
        headers: { 'auth-token': localStorage.getItem('auth-token') },
        data: {},
      }).then((res) => {
        console.log(id)
        if (res.data.msg) {
          Swal.fire({
            text: res.data.msg,
            showCancelButton: true,
            cancelButtonText: "OK",
            showConfirmButton: false,
            cancelButtonColor: "#007bff",
          });
        } else {
        
          this.setState({repData:res.data.fetchedMembers.signinglist})
          console.log("dkh "+this.state.repData)
  
          
//reset rep bardo ll attendenece
         // window.location.reload();
        }
      });
    } catch (e) {
      console.log(e);
    }


    
  }
  resetSignout() {
    this.setState({ showsignout: !this.state.showsignout });
    this.setState({ signoutday: 0 });
    this.setState({ signoutmonth: 0 });
    this.setState({ signoutyear: 0 });
    this.setState({ signouthour: 0 });
    this.setState({ signoutmin: 0 });

  }

  async handleSignin(id) {
    this.setState({ showsignin: !this.state.showsignin });
    console.log(this.state.signinday);
    console.log(this.state.signinmonth);
    console.log(this.state.signinyear);
    console.log(this.state.signinhour);
    console.log(this.state.signinmin);
    try {
      // const accesstoken =
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFjLTE1IiwidG9rZW5yb2xlIjoiQ291cnNlIGNvb3JkaW5hdG9yIiwiaWF0IjoxNjA4OTIzMTMxfQ.tSLFR5PXbFlDRqogpI2CggbqTDldRLUBMxlZ_0Z9pUI";

      await axios({
        method: "put",
        url: process.env.REACT_APP_SERVER + "/updatesignin/" + id,
        headers: { 'auth-token': localStorage.getItem('auth-token') },
        data: {
          day:this.state.signinday,
          month:this.state.signinmonth,
          year:this.state.signinyear,
          hour:this.state.signinhour,
          min:this.state.signinmin

        },
      }).then((res) => {
        console.log(id)
        if (res.data.msg) {
          Swal.fire({
            text: res.data.msg,
            showCancelButton: true,
            cancelButtonText: "OK",
            showConfirmButton: false,
            cancelButtonColor: "#007bff",
          });
        } else {
        
        //  this.setState({repData:res.data.fetchedMembers.signinglist})
         // console.log("dkh "+this.state.repData)
          
//reset rep bardo ll attendenece
         // window.location.reload();
         Swal.fire("Manual Sign in Added Successfully")
        }
      });
    } catch (e) {
      console.log(e);
    }

    




   // Swal.fire("Manual Sign in Added Successfully")

  }
  async handleSignout(id) {
    this.setState({ showsignout: !this.state.showsignout });
    console.log(this.state.signoutday);
    console.log(this.state.signoutmonth);
    console.log(this.state.signoutyear);
    console.log(this.state.signouthour);
    console.log(this.state.signoutmin);

 
    try {
      // const accesstoken =
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFjLTE1IiwidG9rZW5yb2xlIjoiQ291cnNlIGNvb3JkaW5hdG9yIiwiaWF0IjoxNjA4OTIzMTMxfQ.tSLFR5PXbFlDRqogpI2CggbqTDldRLUBMxlZ_0Z9pUI";

      await axios({
        method: "put",
        url: process.env.REACT_APP_SERVER + "/updatesignout/" + id,
        headers: { 'auth-token': localStorage.getItem('auth-token') },
        data: {
          day:this.state.signoutday,
          month:this.state.signoutmonth,
          year:this.state.signoutyear,
          hour:this.state.signouthour,
          min:this.state.signoutmin

        },
      }).then((res) => {
        console.log(id)
        if (res.data.msg) {
          Swal.fire({
            text: res.data.msg,
            showCancelButton: true,
            cancelButtonText: "OK",
            showConfirmButton: false,
            cancelButtonColor: "#007bff",
          });
        } else {
        
        //  this.setState({repData:res.data.fetchedMembers.signinglist})
         // console.log("dkh "+this.state.repData)
          
//reset rep bardo ll attendenece
         // window.location.reload();
         Swal.fire("Manual Sign Out Added Successfully")
        }
      });
    } catch (e) {
      console.log(e);
    }

    



    // Swal.fire("Manual Sign Out Added Successfully")



  }

  addLoc() {


    this.setState({ name: "" });
    this.setState({ email: "" });
    this.setState({ sex: "Female" });
    this.setState({ Salary: "" });
    this.setState({ Role: "HR" });
    this.setState({ office: "" });
    this.setState({ faculty: "" });
    this.setState({ department: "" });
    this.setState({ bio: "" });
    this.setState({ showLoc: !this.state.showLoc });
  }
  async handleAdd(e) {
    console.log(this.state.name);
    console.log(this.state.email);
    console.log(this.state.sex);
    console.log(this.state.Salary);
    console.log(this.state.Role);


    console.log(this.state.office);
    console.log(this.state.faculty);
    console.log(this.state.department);
    console.log(this.state.bio);

    try {
      
      await axios({
        method: "post",
        url: process.env.REACT_APP_SERVER + "/addmember",
        headers: {'auth-token': localStorage.getItem('auth-token') },
        data: {
          name:this.state.name,
          email:this.state.email,
          initial_salary:this.state.Salary,
          gender:this.state.sex,
          role:this.state.Role,
          office:this.state.office,
          bio:this.state.bio,
          department:this.state.department,
          faculty:this.state.faculty
        },
      }).then((res) => {
      console.log(res.data.msg)
       // this.setState({ repData: res.data.existingUser.notifications });
      
        if (res.status === 400) {
            Swal.fire(res.data.msg)
          } 
        
        if (!res.data.msg) {
           // console.log("here")
          Swal.fire( {
          icon: 'success',
          title: 'This new user '+res.data.savedUser.id+ ' has been saved',
          showConfirmButton: false,
          timer: 2500})
          //window.location.reload();
        } else {
          Swal.fire(res.data.msg);
        }
          
       
      });
    } catch (e) {
      console.log(e);
    }

    this.setState({ showLoc: !this.state.showLoc });

  }
  async handleDelete(id) {
    console.log("hfkdjlkm "+this.state.selectedID)
    console.log("++++++ "+this.state.currentId)
    Swal.fire({
      title: "Are you sure you want to Delete this?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // const accesstoken =
          //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFjLTE1IiwidG9rZW5yb2xlIjoiQ291cnNlIGNvb3JkaW5hdG9yIiwiaWF0IjoxNjA4OTIzMTMxfQ.tSLFR5PXbFlDRqogpI2CggbqTDldRLUBMxlZ_0Z9pUI";

          await axios({
            method: "delete",
            url: process.env.REACT_APP_SERVER + "/members/" + id,
            headers: { 'auth-token': localStorage.getItem('auth-token') },
            data: {},
          }).then((res) => {
            console.log(id)
            if (res.data.msg) {
              Swal.fire({
                text: res.data.msg,
                showCancelButton: true,
                cancelButtonText: "OK",
                showConfirmButton: false,
                cancelButtonColor: "#007bff",
              });
            } else {
              this.setState({currentId:""});
              this.setState({user:[]})
              this.setState({repData:[]})
              this.setState({buttonenable:false})
              Swal.fire({
                // position: 'top-end',
              icon: 'success',
              title: res.data.success,
              showConfirmButton: false,
              timer: 1500})
//reset rep bardo ll attendenece
             // window.location.reload();
            }
          });
        } catch (e) {
          console.log(e);
        }
      }
    });










  }
  async handleUpdate(id) {
    this.setState({ showUpdate: !this.state.showUpdate })
    console.log(this.state.nameU);

    console.log(this.state.sexU);
    console.log(this.state.SalaryU);
    console.log(this.state.RoleU);


    console.log(this.state.officeU);
    console.log(this.state.facultyU);
    console.log(this.state.departmentU);
    console.log(this.state.bioU);
    Swal.fire({
      title: "Are you sure you want to update this?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // const accesstoken =
          //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFjLTE1IiwidG9rZW5yb2xlIjoiQ291cnNlIGNvb3JkaW5hdG9yIiwiaWF0IjoxNjA4OTIzMTMxfQ.tSLFR5PXbFlDRqogpI2CggbqTDldRLUBMxlZ_0Z9pUI";
    
          await axios({
            method: "put",
            url: process.env.REACT_APP_SERVER + "/updatemember/" + id,
            headers: { 'auth-token': localStorage.getItem('auth-token') },
            data: {
              name:this.state.nameU,
              role:this.state.RoleU,
              office:this.state.officeU,
              faculty:this.state.facultyU,
              department: this.state.departmentU,
              bio:this.state.bioU,
               gender:this.state.sexU,
               salary:this.state.SalaryU
    
    
            },
          }).then((res) => {
            console.log("my id "+id)
            if (res.data.msg) {
              Swal.fire({
                text: res.data.msg,
                showCancelButton: true,
                cancelButtonText: "OK",
                showConfirmButton: false,
                cancelButtonColor: "#007bff",
              });
            } else {
              Swal.fire("Succesfully update")
              window.location.reload();
              setTimeout (this.setState({buttonenable:true}),8000);

            }
          });
        } catch (e) {
          console.log(e);
        }
      }
    });



    
   }
  updateLoc() {
    // this.setState({ nameU: this.state.user.name});

    // this.setState({ sexU: this.state.user.gender });
    // this.setState({ SalaryU: this.state.user.initial_salary });
    // this.setState({ RoleU: this.state.user.role });

    // this.setState({ officeU: this.state.user.officelocation===undefined?"":this.state.user.officelocation.locname });
    // this.setState({ facultyU: this.state.user.faculty===undefined?"":this.state.user.faculty.name });
    // this.setState({ departmentU: this.state.user.department===undefined?"":this.state.user.department.name });
    // this.setState({ bioU: this.state.user.bio });
    // this.setState({ showUpdate: !this.state.showUpdate })
    this.setState({ nameU:""});

    this.setState({ sexU:"" });
    this.setState({ SalaryU:this.state.user.initial_salary});
    this.setState({ RoleU: "" });

    this.setState({ officeU: "" });
    this.setState({ facultyU: "" });
    this.setState({ departmentU: "" });
    this.setState({ bioU: ""});
    this.setState({ showUpdate: !this.state.showUpdate })

  }
  async connect(id) {
    console.log("whyy "+id);
    if (this.state.selectedID===""){
      Swal.fire("Please Enter an ID")
      this.setState({buttonenable:false})
    }else{


    try {
       
      await axios({
        method: "get",
        url: process.env.REACT_APP_SERVER + "/viewmember/"+id,
        headers: {'auth-token': localStorage.getItem('auth-token') },
        data: {},
      }).then((res) => {
      console.log(res.data.member)
        
      
        if (res.status === 400) {
            Swal.fire(res.data.msg)
            this.setState({buttonenable:false})

          } 
        
        if (!res.data.msg) {
           // console.log("here")
          this.setState({buttonenable:true})
          this.setState({currentId:this.state.selectedID})
          this.setState({ user: res.data.member });
          //window.location.reload();
        } else {
          Swal.fire(res.data.msg);
          this.setState({buttonenable:false})

        }
          
       
      });
    } catch (e) {
      console.log(e);
    }
    console.log(this.state.selectedID);

  }
  }




  


  render() {

    return (
      <div>

        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">

            <Nav className="mr-auto">
              <Nav.Link href="/viewhrprofile">My Profile</Nav.Link>
              <Nav.Link href="/viewhrattendence">My Attendance</Nav.Link>
              <Nav.Link href="/location" >Locations</Nav.Link>
              <Nav.Link href="/faculty">Faculties</Nav.Link>
              <Nav.Link href="/course">Courses</Nav.Link>
              <Nav.Link href="#" active>Members</Nav.Link>
              <Nav.Link href="/department" >Departments</Nav.Link>
              <Nav.Link  href="/misses" >Misses</Nav.Link>

            </Nav>
            <Nav>
              <Nav.Link href='/viewhrnorifications'> <BellIcon width='20' height='20' active={true} animate={true} /> </Nav.Link>
              <Nav.Link onClick={(e) => { this.handlesignin(e) }}>Sign in </Nav.Link>
              <Nav.Link onClick={(e) => { this.handlesignout(e) }}>Sign out </Nav.Link>
              {/* <Nav.Link href="#deets">Log out </Nav.Link> */}
            </Nav>
          </Navbar.Collapse>

        </Navbar>

        <Jumbotron>

          <Row>
            <Col md={{ offset: 1, span: 3 }}>
              <button onClick={() => this.addLoc()} type="button" class="btn btn-block btn-primary data  text-white"><strong>Add a new member</strong></button>
            </Col>
            <Col md={{ offset: 1, span: 4 }}>
              <label>Get a member by id:</label>
              <input onChange={(e) => {
                this.setState({ selectedID: e.target.value });

              }} id="input" />
              <button type="submit" class="btn btn-primary data btn-sm text-white" onClick={() => this.connect(this.state.selectedID)}>Get member</button>

            </Col>


          </Row>
        </Jumbotron>
        <Modal
              show={this.state.showLoc}
              centered
              onHide={() => this.addLoc()}
            >
              <Modal.Header closeButton>
                <h4 style={{ textAlign: "center" }}>Add Member</h4>
              </Modal.Header>
              <Modal.Body>
                <Container>


                  <Row>
                    <Form.Group as={Col}>
                      <Form.Label>Name</Form.Label>
                      <Form.Control

                        placeholder="Name"
                        onChange={(e) => {
                          this.setState({ name: e.target.value });
                        }}

                      />
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label>Email</Form.Label>
                      <Form.Control

                        placeholder="Email"
                        onChange={(e) => {
                          this.setState({ email: e.target.value });
                        }}

                      />
                    </Form.Group>
                  </Row>


                  <Row>
                    <Form.Group as={Col}>
                      <Form.Label>Salary</Form.Label>
                      <Form.Control
                        placeholder="Salary"
                        onChange={(e) => {
                          this.setState({ Salary: e.target.value });
                        }}
                      />
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Role</Form.Label>
                      <Form.Control
                        as="select"

                        onChange={(e) => {
                          this.setState({ Role: e.target.value });
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



                  <Row>
                    <Form.Group as={Col}>
                      <Form.Label>Gender</Form.Label>
                      <Form.Control
                        as="select"
                        //value={this.}
                        onChange={(e) => {
                          this.setState({ sex: e.target.value });
                        }}
                      >
                        <option>Female</option>
                        <option>Male</option>

                      </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Office</Form.Label>
                      <Form.Control
                        placeholder="Office"
                        onChange={(e) => {
                          this.setState({ office: e.target.value });
                        }}
                      />

                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group as={Col}>
                      <Form.Label>Faculty</Form.Label>
                      <Form.Control
                        placeholder="Faculty"
                        onChange={(e) => {
                          this.setState({ faculty: e.target.value });
                        }}
                      />
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Department</Form.Label>
                      <Form.Control
                        placeholder="Department"
                        onChange={(e) => {
                          this.setState({ department: e.target.value });
                        }}
                      />
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group as={Col}>
                      <Form.Label>Bio</Form.Label>
                      <Form.Control
                        placeholder="Bio"
                        onChange={(e) => {
                          this.setState({ bio: e.target.value });
                        }}
                      />
                    </Form.Group>
                  </Row>
                  <Row>
                    <Col md={{ offset: 2, span: 4 }}>
                      <Button
                        style={{ backgroundColor: "#007bff", color: "white" }}
                        onClick={(e) => {
                          this.handleAdd(e);
                        }}
                      >
                        Add
                    </Button>
                    </Col>
                  </Row>
                </Container>
              </Modal.Body>
            </Modal>

        {/* <div class="container">
            <div class="row ">
          
                <div class="col-sm-3 align-self-center">
              
                    <a id="addmem">
                    <button type="button" class="btn btn-block btn-primary data  text-white"><strong>Add a new member</strong></button>
                </a>
                </div>
                <div class="col-sm-3">
              
                <p>
            <label>Get a member by id:</label>
            <input  ref={(input) => this.textInput = input}  id="input"/>
            <button type="submit" class="btn btn-primary data btn-sm text-white" onClick={() => this.connect()}>Get member</button>
          </p>
                </div>
            </div>
        </div> */}
        {/* {this.state.buttonenable?} */}
        {this.state.buttonenable ?

          <div>
            <Modal
              show={this.state.showattendence}
              centered
              onHide={() => this.closeAttendence()}>

              <ModalBody>
                <Table style={{ color: "black" }} responsive>
                  <thead>
                    <tr style={{ textAlign: "center", background: "#456268", color: "white" }}>
                      <th key={0}> SignType </th>
                      <th key={1}> Date/Time</th>

                    </tr>
                  </thead>



                  <tbody>
                    {this.state.repData.map((elem, index) => {
                      return (

                        <MyAttendence repData={elem}
                          index={index} />

                      )
                    })

                    }
                  </tbody>
                </Table>
              </ModalBody>

            </Modal>



            <Modal
              show={this.state.showsignin}
              centered
              onHide={() => this.resetSignin()}
            >
              <Modal.Header closeButton>
                <h4 style={{ textAlign: "center" }}>Manual Add Sign in</h4>
              </Modal.Header>
              <Modal.Body>
                <Container>
                  <br></br>
                  <Row>
                    <Form.Group as={Col}>
                      <Form.Label>Date</Form.Label>
                      <Datetime
                       
                        dateFormat="DD/MM/YYYY HH:MM"
                        //timeFormat="HH
                        input={false}
                        inputProps={{
                          placeholder: "Date ",
                        }}
                        onChange={(e) => {

                          this.setState({ signinday: e._d.getDate(), signinmonth: e._d.getMonth() + 1, signinyear: e._d.getFullYear(), signinhour: e._d.getHours(), signinmin: e._d.getMinutes() });
                        //  this.setState({ signinday: e.getDate(), signinmonth: e.getMonth() + 1, signinyear: e.getFullYear(), signinhour: e.getHours(), signinmin: e.getMinutes() });
                        }}
                      />
                    </Form.Group>

                    {/* <Form.Group as={Col}>
                  <Form.Label>Hour</Form.Label>
                  <Datetime
                   dateFormat={false}
                    timeFormat="HH:MM:ss"
                    inputProps={{
                      placeholder: "Time ",
                    }}
                    onChange={(e) => {

                      console.log(e)
                      //this.setState({ compensationDate: new Date(e._d) });
                    }}
                  />
                </Form.Group> */}

                  </Row>
                  <br />
                  <Row>
                    <Col md={{ offset: 2, span: 4 }}>
                      <Button
                        style={{ backgroundColor: "#007bff", color: "white" }}
                        onClick={() => {
                          this.handleSignin(this.state.currentId);
                        }}
                      >
                        Send
                  </Button>
                    </Col>
                    <Col md={{ offset: 2, span: 4 }}>
                      <Button
                        style={{ backgroundColor: "Red", color: "white" }}
                        onClick={() => this.resetSignin()}
                      >
                        Cancel
                  </Button>
                    </Col>
                  </Row>
                </Container>
              </Modal.Body>
            </Modal>

            <Modal
              show={this.state.showsignout}
              centered
              onHide={() => this.resetSignout()}
            >
              <Modal.Header closeButton>
                <h4 style={{ textAlign: "center" }}>Manual Add Sign Out</h4>
              </Modal.Header>
              <Modal.Body>
                <Container>
                  <br></br>
                  <Row>
                    <Form.Group as={Col}>
                      <Form.Label>Date</Form.Label>
                      <Datetime
                        dateFormat="DD/MM/YYYY HH:MM"
                        //timeFormat="HH
                        input={false}
                        inputProps={{
                          placeholder: "Date ",
                        }}
                        onChange={(e) => {
                        //  console.log(e)
                          this.setState({ signoutday: e._d.getDate(), signoutmonth: e._d.getMonth() + 1, signoutyear: e._d.getFullYear(), signouthour: e._d.getHours(), signoutmin: e._d.getMinutes() });
                        }}
                      />
                    </Form.Group>

                    {/* <Form.Group as={Col}>
                  <Form.Label>Hour</Form.Label>
                  <Datetime
                   dateFormat={false}
                    timeFormat="HH:MM:ss"
                    inputProps={{
                      placeholder: "Time ",
                    }}
                    onChange={(e) => {

                      console.log(e)
                      //this.setState({ compensationDate: new Date(e._d) });
                    }}
                  />
                </Form.Group> */}

                  </Row>
                  <br />
                  <Row>
                    <Col md={{ offset: 2, span: 4 }}>
                      <Button
                        style={{ backgroundColor: "#007bff", color: "white" }}
                        onClick={() => {
                          this.handleSignout(this.state.currentId);
                        }}
                      >
                        Send
                  </Button>
                    </Col>
                    <Col md={{ offset: 2, span: 4 }}>
                      <Button
                        style={{ backgroundColor: "Red", color: "white" }}
                        onClick={() => this.resetSignout()}
                      >
                        Cancel
                  </Button>
                    </Col>
                  </Row>
                </Container>
              </Modal.Body>
            </Modal>



            



            <Container>
              <Card>

                <div class="row">
                  <div class="col-sm-12">


                    <button type="button" class="btn btn-warning" onClick={() => this.openAttendnce(this.state.currentId)}  >View Attendance</button>  <button type="button" class="btn btn-success" onClick={() => this.resetSignin()}>Add Sign In</button>
                    <br></br>
                    <br></br>
                    <button onClick={() => this.handleDelete(this.state.currentId)} type="button" class="btn btn-danger">Delete Member</button>  <button type="button" class="btn btn-success" onClick={() => this.resetSignout()}>Add Sign Out</button>
                  </div>
                  <div class="col-sm-6">
                    <ul class="list-group">
                      <li class="list-group-item text-muted" >Profile</li>
                      <li class="list-group-item "><span class="pull-left"><strong class="">Name: </strong></span> {this.state.user.name}</li>
                      <li class="list-group-item "><span class="pull-left"><strong class="">Email: </strong></span>{this.state.user.email} </li>
                      <li class="list-group-item "><span class="pull-left"><strong class="">ID: </strong></span>{this.state.user.id}</li>
                      <li class="list-group-item "><span class="pull-left"><strong class="">Sex: </strong></span>{this.state.user.gender}</li>
                      <li class="list-group-item "><span class="pull-left"><strong class="">Initial Salary: </strong></span>{this.state.user.initial_salary}</li>
                      <li class="list-group-item "><span class="pull-left"><strong class="">Role: </strong></span> {this.state.user.role}</li>
                      <li class="list-group-item "><span class="pull-left"><strong class="">Dayoff: </strong></span>{this.state.user.dayoff}</li>
                      <div>
                        {this.state.user.officelocation === undefined ?
                          <li class="list-group-item "><span class="pull-left"><strong class="">Office: </strong></span>{'N/A'}</li> :
                          <li class="list-group-item "><span class="pull-left"><strong class="">Office: </strong></span>{this.state.user.officelocation.locname}</li>
                        }
                        
                        {this.state.user.faculty === undefined ?
                          <li class="list-group-item "><span class="pull-left"><strong class="">Faculty: </strong></span>{'N/A'}</li> :
                          <li class="list-group-item "><span class="pull-left"><strong class="">Faculty: </strong></span>{this.state.user.faculty.name}</li>
                        }
                        
                        {this.state.user.department === undefined ?
                          <li class="list-group-item "><span class="pull-left"><strong class="">Department: </strong></span>{'N/A'}</li> :
                          <li class="list-group-item "><span class="pull-left"><strong class="">Department: </strong></span>{this.state.user.department.name}</li>
                        }

                      </div>
                      <li class="list-group-item "><span class="pull-left"><strong class="">Bio: </strong></span>{this.state.user.bio}</li>
                    </ul>
                  </div>    </div>
                <br></br>
                <Col md={{ offset: 1, span: 3 }}>
                  <button onClick={() => this.updateLoc()} type="button" class="btn btn-block btn-primary data  text-white"><strong>Update member</strong></button>
                </Col>

                <Modal
                  show={this.state.showUpdate}
                  centered
                  onHide={() => this.updateLoc()}
                >
                  <Modal.Header closeButton>
                    <h4 style={{ textAlign: "center" }}>Update This Profile</h4>
                  </Modal.Header>
                  <Modal.Body>
                    <Container>


                      <Row>
                        <Form.Group as={Col}>
                          <Form.Label>Name</Form.Label>
                          <Form.Control

                            defaultValue={this.state.user.name}
                            onChange={(e) => {
                              this.setState({ nameU: e.target.value });
                            }}

                          />
                        </Form.Group>


                      </Row>


                      <Row>
                        <Form.Group as={Col}>
                          <Form.Label>Role</Form.Label>
                          <Form.Control
                            as="select"
                            defaultValue={this.state.user.role}
                            onChange={(e) => {
                              this.setState({ RoleU: e.target.value });
                            }}
                          >

                            <option>HR</option>
                            <option>Course coordinator</option>
                            <option>HOD</option>
                            <option>Course Instructor</option>
                            <option>Teaching assistant</option>
                          </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                          <Form.Label>Salary</Form.Label>
                          <Form.Control
                            defaultValue={this.state.user.initial_salary}
                            onChange={(e) => {
                              this.setState({ SalaryU: parseInt(e.target.value, 10 ) });
                            }}
                          />
                        </Form.Group>

                      </Row>



                      <Row>
                        <Form.Group as={Col}>
                          <Form.Label>Gender</Form.Label>
                          <Form.Control
                            as="select"
                            defaultValue={this.state.user.gender}
                            onChange={(e) => {
                              this.setState({ sexU: e.target.value });
                            }}
                          >
                            <option>Female</option>
                            <option>Male</option>

                          </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                          <Form.Label>Office</Form.Label>
                          <Form.Control
                            defaultValue={this.state.user.officelocation===undefined?"":this.state.user.officelocation.locname}
                            onChange={(e) => {
                              this.setState({ officeU: e.target.value });
                            }}
                          />

                        </Form.Group>
                      </Row>
                      <Row>
                        <Form.Group as={Col}>
                          <Form.Label>Faculty</Form.Label>
                          <Form.Control

                          
                            defaultValue={this.state.user.faculty===undefined?"":this.state.user.faculty.name}
                            onChange={(e) => {
                              this.setState({ facultyU: e.target.value });
                            }}
                          />
                        </Form.Group>
                        <Form.Group as={Col}>
                          <Form.Label>Department</Form.Label>
                          <Form.Control
                            defaultValue={this.state.user.department===undefined?"":this.state.user.department.name}
                            onChange={(e) => {
                              this.setState({ departmentU: e.target.value });
                            }}
                          />
                        </Form.Group>
                      </Row>
                      <Row>
                        <Form.Group as={Col}>
                          <Form.Label>Bio</Form.Label>
                          <Form.Control
                            defaultValue={this.state.user.bio}
                            onChange={(e) => {
                              this.setState({ bioU: e.target.value });
                            }}
                          />
                        </Form.Group>
                      </Row>
                      <Row>
                        <Col md={{ offset: 2, span: 4 }}>
                          <Button
                            style={{ backgroundColor: "#007bff", color: "white" }}
                            onClick={() => {
                              this.handleUpdate(this.state.currentId);
                            }}
                          >
                            Update
                    </Button>
                        </Col>
                      </Row>
                    </Container>
                  </Modal.Body>
                </Modal>


              </Card>
            </Container>
          </div> : <div></div>}
      </div>



    );
  }
}





export default Member;