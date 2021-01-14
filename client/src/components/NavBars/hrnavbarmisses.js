import React from 'react';
import { Navbar, Nav, NavDropdown, NavItem, Button, Container, Row, Col, Form, Table } from 'react-bootstrap'
import Viewattendence from '../viewattendence';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useParams,
} from "react-router-dom";
import './bell.css'
import axios from "axios";
import Swal from 'sweetalert2'
import BellIcon from 'react-bell-icon';
function Hrnavbarmisses() {
  const handlesignin = async(e) => {

    //setShowrreset(!showreset);
    // Swal.fire(passwordcheck)
    Swal.fire({
      title: 'SIGN IN?',
      text: "Are You SURE !You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Sign in!'
    }).then( async(result) => {
      if (result.isConfirmed) {
        try {
  
          await axios({
            method: "get",
            url: process.env.REACT_APP_SERVER + "/signin",
            headers: {'auth-token': localStorage.getItem('auth-token') },
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
const handlesignout = async(e) => {

  //setShowrreset(!showreset);
  // Swal.fire(passwordcheck)
  Swal.fire({
    title: 'SIGN OUT?',
    text: "Are You SURE !You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Sign OUT!'
  }).then( async(result) => {
    if (result.isConfirmed) {
      try {

        await axios({
          method: "get",
          url: process.env.REACT_APP_SERVER + "/signout",
          headers: {'auth-token': localStorage.getItem('auth-token') },
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
    return (
       
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link  href="/viewhrprofile">My Profile</Nav.Link>
        <Nav.Link href="/viewhrattendence">My Attendance</Nav.Link>
        <Nav.Link href="/location">Locations</Nav.Link>
        <Nav.Link href="/faculty">Faculties</Nav.Link>
        <Nav.Link href="/course">Courses</Nav.Link>
        <Nav.Link href="/member">Members</Nav.Link>
        <Nav.Link href="/department" >Departments</Nav.Link>
        <Nav.Link  href="/misses" >Misses</Nav.Link>


      </Nav>
      <Nav>

      <Nav.Link href='/viewhrnorifications'> <BellIcon width='20' height='20' active={true} animate={true} /> </Nav.Link>
      <Nav.Link onClick={(e) => { handlesignin(e)}}>Sign in </Nav.Link>
      <Nav.Link onClick={(e) => { handlesignout(e)}}>Sign out </Nav.Link>
      {/* <Nav.Link href="#deets">Log out </Nav.Link> */}
    </Nav>
    </Navbar.Collapse>
    </Navbar>
 );
}

export default Hrnavbarmisses;