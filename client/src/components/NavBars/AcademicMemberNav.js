import React, { Component } from "react";
import {
  Navbar,
  Nav,
  NavDropdown,
  NavItem,
  Button,
  Container,
  Row,
  Col,
  Form,
  Table,
} from "react-bootstrap";
import Viewattendence from "../viewattendence";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
} from "react-router-dom";
import "./bell.css";
import BellIcon from "react-bell-icon";
import axios from "axios";
import Swal from "sweetalert2/dist/sweetalert2.js";

class AcademicMemberNav extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  async handlesignin(e) {
    //setShowrreset(!showreset);
    // Swal.fire(passwordcheck)
    Swal.fire({
      title: "SIGN IN?",
      text: "Are You sure ?You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Sign in!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios({
            method: "get",
            url: process.env.REACT_APP_SERVER + "/signin",
            headers: { "auth-token": localStorage.getItem("auth-token") },
            data: {},
          }).then((res) => {
            let tokenRole = localStorage.getItem("tokenrole");
            if (tokenRole == "HOD") {
              this.setState({ displayHOD: "block" });
            } else if (tokenRole == "Course coordinator") {
              this.setState({ displayCoordinator: "block" });
            } else if (tokenRole == "Course Instructor") {
              this.setState({ displayInstructor: "block" });
            }

            console.log(res.data);

            if (res.status === 400) {
              Swal.fire(res.data.msg);
            }

            if (!res.data.msg) {
              console.log("here");

              //   window.location.reload();
            } else {
              Swal.fire(res.data.msg);
            }
          });
        } catch (e) {
          console.log(e);
        }
      }
    });

    // make API call
  }

  async handlesignout(e) {
    //setShowrreset(!showreset);
    // Swal.fire(passwordcheck)
    Swal.fire({
      title: "SIGN OUT?",
      text: "Are You sure ?You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Sign OUT!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios({
            method: "get",
            url: process.env.REACT_APP_SERVER + "/signout",
            headers: { "auth-token": localStorage.getItem("auth-token") },
            data: {},
          }).then((res) => {
           
            let tokenRole = localStorage.getItem("tokenrole");
            if (tokenRole == "HOD") {
              this.setState({ displayHOD: "block" });
            } else if (tokenRole == "Course coordinator") {
              this.setState({ displayCoordinator: "block" });
            } else if (tokenRole == "Course Instructor") {
              this.setState({ displayInstructor: "block" });
            }

            console.log(res.data);

            if (res.status === 400) {
              Swal.fire(res.data.msg);
            }

            if (!res.data.msg) {
              console.log("here");

              //   window.location.reload();
            } else {
              Swal.fire(res.data.msg);
            }
          });
        } catch (e) {
          console.log(e);
        }
      }
    });

    // make API call
  }

  render() {
    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/viewmyprofile">Profile</Nav.Link>
            <Nav.Link href="/viewattendence">Attendence</Nav.Link>
            <Nav.Link href="/Schedule"> Schedule </Nav.Link>
            <NavDropdown title="Requests" id="collasible-nav-dropdown " display ="block">
              <NavDropdown.Item href="/replacements">
                Replacements
              </NavDropdown.Item>
              <NavDropdown.Item href="/submittedrequests">
                Submitted Requests
              </NavDropdown.Item>
              <NavDropdown.Item
                href="/slotLinkingrequests"
                style={{ display: this.props.displayCoordinator }}
              >
                Slot linking Requests
              </NavDropdown.Item>
              <NavDropdown.Item
                href="/leaverequests"
                style={{ display: this.props.displayHOD }}
              >
                Leave Requests
              </NavDropdown.Item>
              <NavDropdown.Item
                href="/changedayoffrequests"
                style={{ display: this.props.displayHOD }}
              >
                Change DayOff Requests
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link
              href="/coordinatorslots"
              style={{ display: this.props.displayCoordinator }}
            >
              {" "}
              My Courses Slots{" "}
            </Nav.Link>
            <Nav.Link
              href="/managecourses"
              style={{ display: this.props.displayHOD }}
            >
              {" "}
              Manage Courses{" "}
            </Nav.Link>
            <Nav.Link
              href="/departmentstaff"
              style={{ display: this.props.displayHOD }}
            >
              {" "}
              Department Staff{" "}
            </Nav.Link>
            <Nav.Link
              href="/instructorcourse"
              style={{ display: this.props.displayInstructor }}
            >
              {" "}
              Courses{" "}
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href="/mynotifications">
               <BellIcon width="20" height="20" active={true} animate={true} />
               
            </Nav.Link>

            {/* <Nav.Link href='/mynotifications'> <BellIcon style={{width:'4vw' ,height:'4vh'}} active={true} animate={true} /> </Nav.Link> */}

            <Nav.Link
              onClick={(e) => {
                this.handlesignin(e);
              }}
            >
              Sign in{" "}
            </Nav.Link>
            <Nav.Link
              onClick={(e) => {
                this.handlesignout(e);
              }}
            >
              Sign out{" "}
            </Nav.Link>
            {/* <Nav.Link href="#deets">Logout </Nav.Link> */}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default AcademicMemberNav;
