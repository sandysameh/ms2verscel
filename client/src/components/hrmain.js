import React, { Component } from "react";
import { Navbar, Nav, NavDropdown, NavItem, Button } from 'react-bootstrap'
import ReactBootstrap, { Jumbotron, Col, Grid, Panel, FormGroup, FormControl, Form } from 'react-bootstrap'
import './NavBars/bell.css'
import BellIcon from 'react-bell-icon'

class Hrmain extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }




  render() {

    return (
      <>

        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link active href="/viewhrprofile">My Profile</Nav.Link>
              <Nav.Link href="/viewhrattendence">My Attendance</Nav.Link>
              <Nav.Link href="./location">Locations</Nav.Link>
              <Nav.Link href="./faculty">Faculties</Nav.Link>
              <Nav.Link href="./course">Courses</Nav.Link>
              <Nav.Link href="./member">Members</Nav.Link>
              <Nav.Link href="./department" >Departments</Nav.Link>
              <Nav.Link  href="/misses" >Misses</Nav.Link>

            </Nav>
            <Nav>
              <Nav.Link href='/mynotifications'> <BellIcon width='20' height='20' active={true} animate={true} /> </Nav.Link>
              <Nav.Link href="#deets">Sign in </Nav.Link>
              <Nav.Link href="#deets">Sign out </Nav.Link>
              {/* <Nav.Link href="#deets">Log out </Nav.Link> */}
            </Nav>
          </Navbar.Collapse>
        </Navbar>



      </>




    );
  }
}





export default Hrmain;