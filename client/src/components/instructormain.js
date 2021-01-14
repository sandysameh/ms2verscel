import React, { Component } from "react";

import {
  Container,
  Row,
  Col,
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Progress,
} from "reactstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import "./farah.css";
import "../components/NavBars/bell.css";
import BellIcon from "react-bell-icon";
import Swal from "sweetalert2/dist/sweetalert2.js";
import AcademicMemberNav from "./NavBars/AcademicMemberNav";

class Instructormain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayCoordinator: "none",
      displayHOD: "none",
      displayInstructor: "none",
    };
  }

  // make API call

  ///////function lel coveragee ana ma3aya id ha3delha fel backend

  render() {
    return (
      <div>
        <AcademicMemberNav
          displayHOD={this.state.displayHOD}
          displayCoordinator={this.state.displayCoordinator}
          displayInstructor={this.state.displayInstructor}
        />
      </div>
    );
  }
}

export default Instructormain;
