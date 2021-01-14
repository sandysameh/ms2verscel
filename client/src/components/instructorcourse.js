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

class Instructorcourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      name: "",
      id: "",
      number: 0,

      Courses: [],
      displayCoordinator: "none",
      displayHOD: "none",
      displayInstructor: "none",
    };
  }

  ///////function lel coveragee ana ma3aya id ha3delha fel backend

  handleModel(e, a, c) {
    this.setState({ show: !this.state.show });
    this.setState({ name: e });
    this.setState({ id: a });

    this.setState({ number: c });
  }

  async componentDidMount() {
    try {
      await axios({
        method: "get",
        url: process.env.REACT_APP_SERVER + "/viewcoverage",
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
        this.setState({ Courses: res.data });
      });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <div>
        <AcademicMemberNav
          displayHOD={this.state.displayHOD}
          displayCoordinator={this.state.displayCoordinator}
          displayInstructor={this.state.displayInstructor}
        />

        <div className="header">
          <div className="f1"> Courses </div>
        </div>

        <div className="box1">
          <Container>
            <Row className="justify-content-md-center">
              {this.state.Courses.map((person, index) => (
                <Button
                  onClick={() =>
                    this.handleModel(
                      person.coursename,
                      person.courseid,
                      person.coveragepercentage
                    )
                  }
                  variant="outline-dark"
                  size="lg"
                  block
                  style={{ height: "150px", margin: "15px" }}
                >
                  <Col> {person.coursename}</Col>
                  <Col>{person.courseid}</Col>
                </Button>
              ))}
            </Row>
          </Container>
        </div>

        <Modal isOpen={this.state.show} fade={false} size="lg">
          <ModalHeader
            close={
              <button className="close" onClick={() => this.handleModel()}>
                {" "}
                &times;
              </button>
            }
          >
            {this.state.name} {this.state.id}{" "}
          </ModalHeader>
          <ModalBody style={{ padding: "80px" }}>
            <h3 style={{ textAlign: "center", fontSize: "16px" }}>
              {" "}
              Course Coverage
            </h3>
            <Progress animated  value={this.state.number}>
              {this.state.number}%
            </Progress>
            <br></br>
            <br></br>

            <Link
              to={{ pathname: "/instructorstaff", data: this.state.id }}
              style={{ textDecoration: "none" }}
            >
              <Button color="primary" size="md" block>
                {" "}
                Manage Staff{" "}
              </Button>
            </Link>

            <br></br>
            <Link
              to={{ pathname: "/instructorslots", data: this.state.id }}
              style={{ textDecoration: "none" }}
            >
              <Button color="primary" size="md" block>
                {" "}
                Manage Slots
              </Button>
            </Link>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => this.handleModel()} color="danger">
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Instructorcourse;
