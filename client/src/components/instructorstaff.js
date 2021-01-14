import React, { Component, useEffect } from "react";
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
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

import "./farah.css";
import Swal from "sweetalert2/dist/sweetalert2.js";

import axios from "axios";
import BellIcon from "react-bell-icon";
import AcademicMemberNav from "./NavBars/AcademicMemberNav";

class Instructorstaff extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      newcourse: "",
      idcourse: "",
      id: "",
      title: this.props.location.data,
      show2: false,
      showinfo: false,
      showinfo2: false,
      showinfo3: false,
      showinfo4: false,
      coordinator: {},
      teachingassistants: [],

      instructors: [],
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


  handleModel(id) {
    this.setState({ show: !this.state.show });
    this.setState({ newcourse: "" });
    this.setState({ id: id });
  }
  handleModel2() {
    this.setState({ show2: !this.state.show2 });
    this.setState({ idmember: "" });
  }

  async assign2() {
    this.setState({ show2: !this.state.show2 });

    if (this.state.idmember == "") {
      return Swal.fire({
        icon: "question",
        title: "Oops...",
        text: "Please enter id of the academic member",
      });
    }

    try {
      await axios({
        method: "post",
        url:
          process.env.REACT_APP_SERVER +
          "/coursecoordinator/" +
          this.state.idmember +
          "/" +
          this.state.title,
        headers: { "auth-token": localStorage.getItem("auth-token") },
        //headers: { "auth-token": `${accesstoken}` },
      }).then((res) => {
        let tokenRole = localStorage.getItem("tokenrole");
        if (tokenRole == "HOD") {
          this.setState({ displayHOD: "block" });
        } else if (tokenRole == "Course coordinator") {
          this.setState({ displayCoordinator: "block" });
        } else if (tokenRole == "Course Instructor") {
          this.setState({ displayInstructor: "block" });
        }

        if (!res.data.msg) {
          Swal.fire(
            "Academic member is assgined to be course coordinator",
            "",
            "success"
          ).then(function () {
            window.location.reload();
          });
          //window.location.reload();
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: res.data.msg,
          });
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  async assign() {
    this.setState({ show: !this.state.show2 });
    console.log(this.state.newcourse);
    console.log(this.state.id);

    if (this.state.newcourse == "") {
      return Swal.fire({
        icon: "question",
        title: "Oops...",
        text: "Please enter id of the course",
      });
    }

    try {
      await axios({
        method: "post",
        url:
          process.env.REACT_APP_SERVER +
          "/updateassigncourse/" +
          this.state.id +
          "/" +
          this.state.title +
          "/" +
          this.state.newcourse,

        headers: { "auth-token": localStorage.getItem("auth-token") },
      }).then((res) => {
        let tokenRole = localStorage.getItem("tokenrole");
        if (tokenRole == "HOD") {
          this.setState({ displayHOD: "block" });
        } else if (tokenRole == "Course coordinator") {
          this.setState({ displayCoordinator: "block" });
        } else if (tokenRole == "Course Instructor") {
          this.setState({ displayInstructor: "block" });
        }

        if (!res.data.msg) {
          Swal.fire("Academic member assigment updated", "", "success").then(
            function () {
              window.location.reload();
            }
          );
          //window.location.reload();
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: res.data.msg,
          });
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  ShowDiv() {
    this.setState({ showinfo: true });
    this.setState({ showinfo2: false });
    this.setState({ showinfo3: false });
  }
  ShowDiv2() {
    this.setState({ showinfo2: true });
    this.setState({ showinfo3: false });
    this.setState({ showinfo: false });
  }
  ShowDiv3() {
    this.setState({ showinfo3: true });
    this.setState({ showinfo2: false });
    this.setState({ showinfo: false });
  }
  functionA(e) {
    let v;
    if (e == undefined) {
      v = "";
    } else {
      v = e.locname;
    }

    return v;
  }

  async Remove(e) {
    console.log(e);

    try {
      await axios({
        method: "delete",
        url:
          process.env.REACT_APP_SERVER +
          "/deleteassigncourse/" +
          e +
          "/" +
          this.state.title,
        headers: { "auth-token": localStorage.getItem("auth-token") },
      }).then((res) => {
        let tokenRole = localStorage.getItem("tokenrole");
        if (tokenRole == "HOD") {
          this.setState({ displayHOD: "block" });
        } else if (tokenRole == "Course coordinator") {
          this.setState({ displayCoordinator: "block" });
        } else if (tokenRole == "Course Instructor") {
          this.setState({ displayInstructor: "block" });
        }

        if (!res.data.msg) {
          Swal.fire(
            "Removed!",
            "This academic member has been removed from course.",
            "success"
          ).then(function () {
            window.location.reload();
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: res.data.msg,
          });
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  async componentDidMount() {
    try {
      await axios({
        method: "get",
        url: process.env.REACT_APP_SERVER + "/viewstaff/" + this.state.title,
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
        this.setState({ teachingassistants: res.data.teachingassistants });
        this.setState({ coordinator: res.data.coordinator });
        this.setState({ instructors: res.data.instructors });
      });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    let button;
    let button2;
    let space1;
    let space4;
    let space3;
    let space2;
    let space;
    let e;

    let v;
    if (this.state.coordinator != undefined) {
      if (this.state.coordinator.officelocation === undefined) {
        v = "  ";
      } else {
        v = this.state.coordinator.officelocation.locname;
      }
    }

    if (!(this.state.coordinator == null)) {
      e = (
        <div className="box">
          <Col>
            {" "}
            <b>Name:</b> {this.state.coordinator.name}
          </Col>
          <Col>
            {" "}
            <b>Id:</b> {this.state.coordinator.id}
          </Col>
          <Col>
            {" "}
            <b>Email:</b> {this.state.coordinator.email}
          </Col>
          <Col>
            {" "}
            <b>Dayoff:</b> {this.state.coordinator.dayoff}
          </Col>
          <Col>
            {" "}
            <b>Gender:</b> {this.state.coordinator.gender}
          </Col>
          <Col>
            {" "}
            <b>officelocation:</b> {v}
          </Col>
          <br></br>
          <Button
            onClick={() => this.handleModel(this.state.coordinator.id)}
            color="primary"
            size="md"
            block
          >
            {" "}
            Update Assignment{" "}
          </Button>

          <Button
            onClick={() => this.Remove(this.state.coordinator.id)}
            color="danger"
            size="md"
            block
          >
            {" "}
            Remove{" "}
          </Button>
        </div>
      );

      //this.setState({showinfo4:true});
    }

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

        <div className="box22">
          <Button
            onClick={() => this.ShowDiv()}
            variant="outline-dark"
            size="lg"
            style={{ margin: "10px 10px 0px 10px" }}
          >
            {" "}
            Teaching Assitants{" "}
          </Button>
          <Button
            onClick={() => this.ShowDiv3()}
            variant="outline-dark"
            size="lg"
            style={{ margin: "10px 10px 0px 10px" }}
          >
            {" "}
            coordinator{" "}
          </Button>
          <Button
            onClick={() => this.ShowDiv2()}
            variant="outline-dark"
            size="lg"
            style={{ margin: "10px 10px 0px 10px" }}
          >
            {" "}
            Instructors{" "}
          </Button>
        </div>

        <div
          className="box2"
          style={{ display: this.state.showinfo ? "block" : "none" }}
        >
          <Container>
            <Row className="justify-content-md-center">
              {this.state.teachingassistants.map((person, index) => (
                <div className="box">
                  <Col>
                    {" "}
                    <b>Name:</b> {person.name}
                  </Col>

                  <Col>
                    {" "}
                    <b>Id:</b> {person.id}
                  </Col>
                  <Col>
                    {" "}
                    <b>Email:</b> {person.email}
                  </Col>

                  <Col>
                    {" "}
                    <b>Dayoff:</b> {person.dayoff}
                  </Col>
                  <Col>
                    {" "}
                    <b>Gender:</b> {person.gender}
                  </Col>

                  <Col>
                    {" "}
                    <b>officelocation:</b>{" "}
                    {this.functionA(person.officelocation)}
                  </Col>
                  <br></br>
                  <Button
                    onClick={() => this.handleModel(person.id)}
                    color="primary"
                    size="md"
                    block
                  >
                    {" "}
                    Update Assignment{" "}
                  </Button>

                  <Button
                    onClick={() => this.Remove(person.id)}
                    color="danger"
                    size="md"
                    block
                  >
                    {" "}
                    Remove{" "}
                  </Button>
                </div>
              ))}
            </Row>
          </Container>
        </div>

        <div
          className="box2"
          style={{ display: this.state.showinfo2 ? "block" : "none" }}
        >
          <Container>
            <Row className="justify-content-md-center">
              {this.state.instructors.map((person, index) => (
                <div className="box">
                  <Col>
                    {" "}
                    <b>Name:</b> {person.name}
                  </Col>

                  <Col>
                    {" "}
                    <b>Id:</b> {person.id}
                  </Col>
                  <Col>
                    {" "}
                    <b>Email:</b> {person.email}
                  </Col>

                  <Col>
                    {" "}
                    <b>Dayoff:</b> {person.dayoff}
                  </Col>
                  <Col>
                    {" "}
                    <b>Gender:</b> {person.gender}
                  </Col>

                  <Col>
                    {" "}
                    <b>officelocation:</b>{" "}
                    {this.functionA(person.officelocation)}
                  </Col>
                  <br></br>
                </div>
              ))}
            </Row>
          </Container>
        </div>

        <div
          className="box2"
          style={{ display: this.state.showinfo3 ? "block" : "none" }}
        >
          <Container>
            <Row className="justify-content-md-center">
              <Button
                onClick={() => this.handleModel2()}
                color="info"
                size="lg"
              >
                {" "}
                Assign A Course Coordinator{" "}
              </Button>
            </Row>

            <Row className="justify-content-md-center">{e}</Row>
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
            {" "}
            Assign Slot{" "}
          </ModalHeader>
          <ModalBody style={{ padding: "80px" }}>
            <FormGroup>
              <Label for="newcourse">
                {" "}
                Please enter The ID of the new course assignment{" "}
              </Label>
              <Input
                type="text"
                id="newcourse"
                onChange={(e) => {
                  this.setState({ newcourse: e.target.value });
                }}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => this.assign()} color="success">
              Submit
            </Button>
            <Button onClick={() => this.handleModel()} color="danger">
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.show2} fade={false} size="lg">
          <ModalHeader
            close={
              <button className="close" onClick={() => this.handleModel2()}>
                {" "}
                &times;
              </button>
            }
          >
            {" "}
            Assign coordinator{" "}
          </ModalHeader>
          <ModalBody style={{ padding: "80px" }}>
            <FormGroup>
              <Label for="newcourse">
                {" "}
                Please enter The ID of the academic member{" "}
              </Label>
              <Input
                type="text"
                id="newcourse"
                onChange={(e) => {
                  this.setState({ idmember: e.target.value });
                }}
                required
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => this.assign2()} color="success">
              Submit
            </Button>
            <Button onClick={() => this.handleModel2()} color="danger">
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Instructorstaff;
