import React, { Component } from "react";
import { Navbar, Nav, NavDropdown, NavItem } from 'react-bootstrap'
import ReactBootstrap, { Jumbotron, Grid, Panel, FormGroup, FormControl } from 'react-bootstrap'
import LocsRow from "./subComponents/LocsRow";
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

class Location extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locname: "",
      capacity: "",
      loctype: "",
      locData: [

      ],
      showLoc: false,
      refresh: false
    };
  }
  addLoc() {
    this.setState({ loctype: "lecture hall" });
    this.setState({ locname: "" });
    this.setState({ capacity: "" });
    this.setState({ showLoc: !this.state.showLoc });
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
    console.log(this.state.locname);
    console.log(this.state.loctype);
    console.log(this.state.capacity);
    try {

      await axios({
        method: "post",
        url: process.env.REACT_APP_SERVER + "/addlocation",
        headers: { 'auth-token': localStorage.getItem('auth-token') },
        data: {
          locname: this.state.locname,
          loctype: this.state.loctype,
          capacity: this.state.capacity
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
    this.setState({ refresh: !this.state.refresh })

  }
  async componentDidMount() {
    //this.setState({refresh:!this.state.refresh});
    try {

      await axios({
        method: "get",
        url: process.env.REACT_APP_SERVER + "/viewLocations",
        headers: { 'auth-token': localStorage.getItem('auth-token') },
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
              <Nav.Link href="#" active>Locations</Nav.Link>
              <Nav.Link href="/faculty">Faculties</Nav.Link>
              <Nav.Link href="/course">Courses</Nav.Link>
              <Nav.Link href="/member">Members</Nav.Link>
              <Nav.Link href="/department" >Departments</Nav.Link>
              <Nav.Link href="/misses" >Misses</Nav.Link>

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
          <button onClick={() => this.addLoc()} type="button" class="btn btn-block btn-primary data  text-white"><strong>Add a new location</strong></button>
        </Col>
        <Table style={{ color: "black" }} responsive>
          <thead>
            <tr style={{ textAlign: "center", background: "#456268", color: "white" }}>
              <th key={0}> Location Name </th>
              <th key={1}> Capacity</th>
              <th key={2}> Location Type </th>

              <th key={3}> </th>
              <th key={4}> </th>
            </tr>
          </thead>



          <tbody>
            {this.state.locData.map((elem, index) => {
              return (

                <LocsRow locData={elem}
                  index={index} />

              )
            })

            }
          </tbody>
        </Table>

        <Modal
          show={this.state.showLoc}
          centered
          onHide={() => this.addLoc()}
        >
          <Modal.Header closeButton>
            <h4 style={{ textAlign: "center" }}>Add Location</h4>
          </Modal.Header>
          <Modal.Body>
            <Container>


              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Location Name</Form.Label>
                  <Form.Control

                    placeholder="Location Name"
                    onChange={(e) => {
                      this.setState({ locname: e.target.value });
                    }}

                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Location Type</Form.Label>
                  <Form.Control
                    as="select"
                    // value={this.state.loctype

                    onChange={(e) => {
                      this.setState({ loctype: e.target.value });
                    }}
                  >
                    <option>lecture hall</option>
                    <option>tutorial room</option>
                    <option>offices</option>
                    <option>lab</option>

                  </Form.Control>
                </Form.Group>
              </Row>


              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Capacity</Form.Label>
                  <Form.Control
                    placeholder="Capacity"
                    onChange={(e) => {
                      this.setState({ capacity: e.target.value });
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
      </>




    );
  }
}





export default Location;