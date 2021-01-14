import React, { Component } from "react";
import { Navbar, Nav, NavDropdown, NavItem } from 'react-bootstrap'
import ReactBootstrap, { Jumbotron, Grid, Panel, FormGroup, FormControl } from 'react-bootstrap'
import DepsRow from "./subComponents/DepsRow";
import { Row, Col, Form, Modal, Table } from "react-bootstrap";
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

class Department extends Component {
  constructor(props) {
    super(props);
    this.state = {
      depname: "",
      depfaculty: "",
      dephead: "",
      depData: [
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
        // },
        // {
        //   name: "dep7",
        //   faculty: "bi",
        //   head: "Yo"
        // },
        // {
        //   name: "dep8",
        //   faculty: "csen",
        //   head: "Martha"
        // },
        // {
        //   name: "dep9",
        //   faculty: "",
        //   head: ""
        // }
      ],
      filteredName: [
      //   {
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
      // },
      // {
      //   name: "dep7",
      //   faculty: "bi",
      //   head: "Yo"
      // },
      // {
      //   name: "dep8",
      //   faculty: "csen",
      //   head: "Martha"
      // },
      // {
      //   name: "dep9",
      //   faculty: "",
      //   head: ""
      // }
    ],
      showdep: false
    };
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

  addLoc() {

    this.setState({ depname: "" });
    this.setState({ depfaculty: "" });
    this.setState({ dephead: "" });
    this.setState({ showdep: !this.state.showdep });
  }
 async handleAdd(e) {
    console.log(this.state.depname);
    console.log(this.state.depfaculty);
    console.log(this.state.dephead);
    try {
      
      await axios({
        method: "post",
        url: process.env.REACT_APP_SERVER + "/adddepartment",
        headers: {'auth-token': localStorage.getItem('auth-token') },
        data: {
          name:this.state.depname,
          facultyname:this.state.depfaculty,
          //capacity:this.state.capacity
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



    this.setState({ showdep: !this.state.showdep });

  }

  handleChangeName = (event) => {
    //           let allValues=[];

    //         allValues = this.state.filteredName;
    //  console.log(allValues)
    //         this.setState({ depData: allValues });


    let searchValue = event.target.value;

    let faculties = [];
    let searchString = searchValue.trim().toLowerCase();


    faculties = this.state.filteredName;

    faculties = faculties.filter((value) => {
      return value.faculty.name.toLowerCase().includes(searchString.toLowerCase());
    });

    this.setState({ depData: faculties });
    // if (event.target.value=="") {
    //     console.log("ana hena")


    //   }
  };
  async componentDidMount() {
    //this.setState({refresh:!this.state.refresh});
     try {
       
       await axios({
         method: "get",
         url: process.env.REACT_APP_SERVER + "/viewDepartments",
         headers: {'auth-token': localStorage.getItem('auth-token') },
         data: {},
       }).then((res) => {
       console.log(res.data.existingDepartment)
         this.setState({ depData: res.data.existingDepartment });
         this.setState({ filteredName: res.data.existingDepartment });
       
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
            <Nav.Link href="/viewhrprofile">My Profile</Nav.Link>
              <Nav.Link href="/viewhrattendence">My Attendance</Nav.Link>
              <Nav.Link href="/location" >Locations</Nav.Link>
              <Nav.Link href="/faculty">Faculties</Nav.Link>
              <Nav.Link href="/course">Courses</Nav.Link>
              <Nav.Link href="/member">Members</Nav.Link>
              <Nav.Link href="#" active>Departments</Nav.Link>
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
          <button onClick={() => this.addLoc()} type="button" class="btn btn-block btn-primary data  text-white"><strong>Add a new Department</strong></button>
        </Col>

        <Form.Control
          placeholder="Search by faculty name.."
          onChange={(e) => this.handleChangeName(e)} />
        <Table style={{ color: "black" }} responsive>
          <thead>
            <tr style={{ textAlign: "center", background: "#456268", color: "white" }}>
              <th key={0}> Department Name </th>
              <th key={1}> Faculty</th>
              <th key={2}> Head  </th>

              <th key={3}> </th>
              <th key={4}> </th>
            </tr>
          </thead>



          <tbody>
            {this.state.depData.map((elem, index) => {
              return (

                <DepsRow depData={elem}
                  index={index} />

              )
            })

            }
          </tbody>
        </Table>
        <Modal
          show={this.state.showdep}
          centered
          onHide={() => this.addLoc()}
        >
          <Modal.Header closeButton>
            <h4 style={{ textAlign: "center" }}>Add Department</h4>
          </Modal.Header>
          <Modal.Body>
            <Container>


              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Department Name</Form.Label>
                  <Form.Control

                    placeholder="Department Name"
                    onChange={(e) => {
                      this.setState({ depname: e.target.value });
                    }}

                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Faculty</Form.Label>
                  <Form.Control

                    placeholder="Faculty"
                    onChange={(e) => {
                      this.setState({ depfaculty: e.target.value });
                    }}

                  />
                </Form.Group>
              </Row>


              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Head Can Only Be assigned Through updating Member's Role</Form.Label>
                
                  
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





export default Department;