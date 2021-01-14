import React from 'react';
import { Navbar, Nav, NavDropdown, NavItem, Button, Container, Row, Col, Form, Table } from 'react-bootstrap'
import Viewattendence from './viewattendence';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useParams,
} from "react-router-dom";
function Membersnavbar() {

    return (
       
<Navbar bg="light" expand="lg" sticky="top">
<Navbar.Brand href="/gucstaff">Back</Navbar.Brand>
<Navbar.Toggle aria-controls="basic-navbar-nav" />
<Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto">
        <Nav.Link href="/viewattendence">ViewAttendence</Nav.Link>
        <Nav.Link href="/viewmyprofile">ViewProfile</Nav.Link>

    </Nav>

</Navbar.Collapse>
</Navbar>
 );
}

export default Membersnavbar;