import React, { Component } from "react";
import { Navbar, Nav, NavDropdown, NavItem } from 'react-bootstrap'
import ReactBootstrap, { Jumbotron, Grid, Panel, FormGroup, FormControl } from 'react-bootstrap'
import CourseRow from "./subComponents/courseRow";
import { Row, Col, Form, Modal, Table } from "react-bootstrap";
import DropdownMultiselect from "react-multiselect-dropdown-bootstrap";
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  InputLabel,
  Container,
} from "@material-ui/core";
import './NavBars/bell.css'
import BellIcon from 'react-bell-icon'
import axios from "axios";
import Swal from 'sweetalert2'
class Course extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Courseid: "",
      Coursename: "",
      Coursedeps: [],
      Course_departments: [
        // {
        //   name: "dep1",
        //   faculty: "met",
        //   head: "Someone"

        // },
        // {
        //   name: "dep2",
        //   faculty: "iet",
        //   head: "Jane Doe"
        // },
        // {
        //   name: "dep3",
        //   faculty: "mecha",
        //   head: "John Doe"
        // },
        // {
        //   name: "dep4",
        //   faculty: "bio",
        //   head: "Farah"
        // },
        // {
        //   name: "dep5",
        //   faculty: "pharmacy",
        //   head: "Monica"
        // },
        // {
        //   name: "dep6",
        //   faculty: "dmet",
        //   head: "Sandy"
        // }
      ],
      showCourse: false,
      courseData: [
        // {

        //   id: "csen701",
        //   name: "Computer Science",
        //   departments: ["MET", "IET"]


        // },
        // {
        //   id: "csen702",
        //   name: "Embedded",
        //   departments: ["Bio", "Pharmacy"]
        // },
        // {
        //   id: "csen703",
        //   name: "Advanced Computer",
        //   departments: ["MET"]
        // },
        // {
        //   id: "csen704",
        //   name: "Analysis",
        //   departments: ["Bio", "MET"]
        // },
        // {
        //   id: "csen705",
        //   name: "Microprocessors",
        //   departments: []
        // },
        // {
        //   id: "dmet701",
        //   name: "Audio",
        //   departments: ["IET", "Pharmacy"]
        // },
        // {
        //   id: "dmet702",
        //   name: "Video",
        //   departments: []
        // }
      ]
    };
  }
  addcourse() {
    this.setState({ Courseid: "" });
    this.setState({ Coursename: "" });
    this.setState({ Coursedeps: [] })
    this.setState({ showCourse: !this.state.showCourse });
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

  async handleAdd(e) {
    console.log(this.state.Courseid);
    console.log(this.state.Coursename);
    console.log(this.state.Coursedeps);
    try {
      
      await axios({
        method: "post",
        url: process.env.REACT_APP_SERVER + "/addcourse",
        headers: {'auth-token': localStorage.getItem('auth-token') },
        data: {
          id: this.state.Courseid,
          name: this.state.Coursename,
          departments_course: this.state.Coursedeps
          
        },
      }).then((res) => {
      console.log(res.data.msg)
       // this.setState({ repData: res.data.existingUser.notifications });
      
        if (res.status === 400) {
            Swal.fire(res.data.msg)
          } 
        
        if (!res.data.msg) {
           // console.log("here")

          window.location.reload();
        } else {
          Swal.fire(res.data.msg);
        }
          
       
      });
    } catch (e) {
      console.log(e);
    }


    this.setState({ showLoc: !this.state.showLoc });
    this.setState({refresh:!this.state.refresh})

  }
  async componentDidMount() {
   //this.setState({refresh:!this.state.refresh});
    try {
      
      await axios({
        method: "get",
        url: process.env.REACT_APP_SERVER + "/viewLocations",
        headers: {'auth-token': localStorage.getItem('auth-token') },
        data: {},
      }).then((res) => {
      console.log(res.data.existingLocation)
        this.setState({ locData: res.data.existingLocation });
      
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
    this.setState({ showCourse: !this.state.showCourse });

  }
  async componentDidMount() {
    //this.setState({refresh:!this.state.refresh});
     try {
       
       await axios({
         method: "get",
         url: process.env.REACT_APP_SERVER + "/viewCourses",
         headers: {'auth-token': localStorage.getItem('auth-token') },
         data: {},
       }).then((res) => {
       console.log(res.data.existingCourse)
         this.setState({ courseData: res.data.existingCourse });
       
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


     try {
       
      await axios({
        method: "get",
        url: process.env.REACT_APP_SERVER + "/viewDepartments",
        headers: {'auth-token': localStorage.getItem('auth-token') },
        data: {},
      }).then((res) => {
      console.log(res.data.existingDepartment)
        this.setState({ Course_departments: res.data.existingDepartment });
      
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



  render() {

    return (
      <>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/Viewhrprofile">My Profile</Nav.Link>
              <Nav.Link href="/viewhrattendence">My Attendance</Nav.Link>
              <Nav.Link href="/location">Locations</Nav.Link>
              <Nav.Link href="/faculty">Faculties</Nav.Link>
              <Nav.Link href="#" active>Courses</Nav.Link>
              <Nav.Link href="/member">Members</Nav.Link>
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
        <Col md={{ offset: 9, span: 3 }}>
          <button onClick={() => this.addcourse()} type="button" class="btn btn-block btn-primary data  text-white"><strong>Add a new Course</strong></button>
        </Col>
        <Table style={{ color: "black" }} responsive>
          <thead>
            <tr style={{ textAlign: "center", background: "#456268", color: "white" }}>
              <th key={0}> Course ID </th>
              <th key={1}> Course Name</th>
              <th key={2}> Departments </th>

              <th key={3}> </th>
              <th key={4}> </th>
            </tr>
          </thead>



          <tbody>
            {this.state.courseData.map((elem, index) => {
              return (

                <CourseRow courseData={elem}
                  index={index} Course_departments={this.state.Course_departments} />

              )
            })

            }
            {/* {this.state.Course_departments.map((elem, index) => {
                            return (

                                <CourseRow Course_departments={elem}
                                    index={index} />

                            )
                        })

                        } */}


          </tbody>
        </Table>

        <Modal
          show={this.state.showCourse}
          centered
          onHide={() => this.addcourse()}
        >
          <Modal.Header closeButton>
            <h4 style={{ textAlign: "center" }}>Add Course</h4>
          </Modal.Header>
          <Modal.Body>
            <Container>


              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Course ID</Form.Label>
                  <Form.Control
                    placeholder="Course ID"
                    onChange={(e) => {
                      this.setState({ Courseid: e.target.value });
                    }}
                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Course Name</Form.Label>
                  <Form.Control
                    placeholder="Course Name"
                    onChange={(e) => {
                      this.setState({ Coursename: e.target.value });
                    }}
                  />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Departments</Form.Label>
                  <DropdownMultiselect
                    options={this.state.Course_departments.map((elem, index) => {
                      return elem.name;
                    })}
                    name="Departments"
                    handleOnChange={(selected) => {
                      this.setState({ Coursedeps: selected });
                    }}
                    placeholder="Choose Departments.."

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


      </>




    );
  }
}





export default Course;