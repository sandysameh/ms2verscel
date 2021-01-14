import React, { Component } from "react";
import Slotrowinstructor from "./subComponents/slotrowin";
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
  Table,
} from "reactstrap";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2/dist/sweetalert2.js";

import "./farah.css";
import BellIcon from "react-bell-icon";
import AcademicMemberNav from "./NavBars/AcademicMemberNav";

class Instructorslots extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      courseId: "",
      title: this.props.location.data,
      slotday: "",
      slottime: "",
      slottype: "",
      location: "",
      slotsData: [],
      displayCoordinator: "none",
      displayHOD: "none",
      displayInstructor: "none",
    };
    console.log(this.state.title);
    if (this.state.title != null) {
      window.localStorage.setItem("courseid", this.state.title);
    } else {
      var c = window.localStorage.getItem("courseid");
      this.state.title = c;
    }
  }

  async componentDidMount() {
    try {
      await axios({
        method: "get",
        url: process.env.REACT_APP_SERVER + "/viewslots/" + this.state.title,
        // headers: { "auth-token": `${accesstoken}` },
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
        this.setState({ slotsData: res.data });
      });
    } catch (e) {
      console.log(e);
    }
  }

 

  render() {
    // console.log(this.props.location.state);
    console.log(this.state.slotsData);
    return (
      <div>
       
        <AcademicMemberNav
          displayHOD={this.state.displayHOD}
          displayCoordinator={this.state.displayCoordinator}
          displayInstructor={this.state.displayInstructor}
        />

        <div className="header">
          <div className="f1"> {this.state.title} </div>
        </div>

        <br></br>

        <Table style={{ color: "black" }} responsive>
          <thead>
            <tr
              style={{
                textAlign: "center",
                background: "#456268",
                color: "white",
              }}
            >
              <th key={0}> Slot ID </th>
              <th key={1}> Slot Day </th>
              <th key={2}> Slot Time </th>
              <th key={3}> Slot Type </th>
              <th key={4}> Location </th>
              <th key={5}> Teaching Name </th>
              <th key={6}> Teaching Id </th>
              <th key={7}></th>
            </tr>
          </thead>

          <tbody>
            {this.state.slotsData.map((elem, index) => {
              return <Slotrowinstructor slotsData={elem} index={index} />;
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default Instructorslots;
