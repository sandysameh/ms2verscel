import React, { Component } from "react";

import SlotsRow from "./subComponents/SlotsRow";
import {
  Row,
  Col,
  Form,
  Modal,
  Table,
  Navbar,
  Nav,
  NavDropdown,
} from "react-bootstrap";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import MultipleValueTextInput from "react-multivalue-text-input";
import MultiSelect from "react-multi-select-component";

import {
  Card,
  CardContent,
  CardHeader,
  Button,
  InputLabel,
  Container,
} from "@material-ui/core";
import "./NavBars/bell.css";
import BellIcon from "react-bell-icon";
import axios from "axios";
import AcademicMemberNav from "./NavBars/AcademicMemberNav";

class CoordinatorSlots extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      courseId: "",
      slotday: "",
      slottime: "",
      slottype: "",
      location: "",

      slotsData: [],

      show: false,
     
      displayCoordinator: "none",
      displayHOD: "none",
      displayInstructor : "none"
    };
  }

  resetSlot() {
    this.setState({ show: !this.state.show });

    this.setState({ courseId: "" });
    this.setState({ slotday: "" });
    this.setState({ slottime: "" });
    this.setState({ slottype: "" });
    this.setState({ location: "" });
  }

  async componentDidMount() {
    try {
      await axios({
        method: "get",
        url: process.env.REACT_APP_SERVER + "/getCourseSlots",
        headers: { "auth-token": localStorage.getItem("auth-token") },
        data: {},
      }).then((res) => {
        // console.log("####", res.data.mySlots);
        
        let tokenRole = localStorage.getItem("tokenrole");
        if (tokenRole=="HOD") {
          this.setState({ displayHOD: "block" });
        } else if (tokenRole == "Course coordinator") {
          this.setState({ displayCoordinator: "block" });
        }
        else if (tokenRole =="Course Instructor") {
          this.setState({ displayInstructor: "block" });
        }

        this.setState({ slotsData: res.data.mySlots });
      });
    } catch (e) {
      console.log(e);
    }
  }
  async addSlot(e) {
    try {
     
      this.setState({ show: !this.state.show });
      await axios({
        method: "post",
        url: process.env.REACT_APP_SERVER + "/addslot",
        headers: { "auth-token": localStorage.getItem("auth-token") },
        data: {
          slotday: this.state.slotday,
          slottype: this.state.slottype,
          slottime: this.state.slottime,
          courseid: this.state.courseId,
          locname: this.state.location,
        },
      }).then((res) => {

        let tokenRole = localStorage.getItem("tokenrole");
        if (tokenRole=="HOD") {
          this.setState({ displayHOD: "block" });
        } else if (tokenRole == "Course coordinator") {
          this.setState({ displayCoordinator: "block" });
        }
        else if (tokenRole =="Course Instructor") {
          this.setState({ displayInstructor: "block" });
        }

        if (!res.data.msg) {
          window.location.reload();
        } else {
          alert(res.data.msg);
        }
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

        <Row style={{ background: "#eeeeee" }}>
          <Col md={{ offset: 5, span: 4 }}>
            <Button
              type="submit"
              centered
              style={{
                backgroundColor: "#456268",

                color: "white",
                textAlign: "center",
                marginTop: "5px",
                marginBottom: "5px",
              }}
              onClick={() => this.resetSlot()}
            >
              Add New Slot
            </Button>
          </Col>
        </Row>

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
              <th key={1}> Course ID</th>
              <th key={2}> Slot Day </th>
              <th key={3}> Slot Time </th>
              <th key={4}> Slot Type </th>
              <th key={5}> Teaching Id </th>
              <th key={6}> Location </th>
              <th key={7}> Replacement Id</th>
              <th key={8}> Replacement Date </th>
              <th key={9}> </th>
              <th key={10}> </th>
            </tr>
          </thead>

          <tbody>
            {console.log(this.state.slotsData)}
            {this.state.slotsData.map((elem1, index) => {
              return elem1.map((elem, index1) => {
                return (
                  <SlotsRow
                    slotsData={elem}
                    index={index}
                    key={index1}
                    slotId={elem.id}
                  />
                );
              });
            })}
          </tbody>
        </Table>
        <Modal show={this.state.show} centered onHide={() => this.resetSlot()}>
          <Modal.Header closeButton>
            <h4 style={{ textAlign: "center" }}>Add Slot</h4>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Course Id</Form.Label>
                  <Form.Control
                    placeholder="Course Id"
                    onChange={(e) => {
                      this.setState({ courseId: e.target.value });
                    }}
                  />
                </Form.Group>
              </Row>
              <br></br>
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Slot Day</Form.Label>
                  <Form.Control
                    as="select"
                    defaultValue="Week Day"
                    onChange={(e) => {
                      this.setState({ slotday: e.target.value });
                    }}
                  >
                    <option>...</option>
                    <option>Saturday</option>
                    <option>Sunday</option>
                    <option>Monday</option>
                    <option>Tuesday</option>
                    <option>Wednesday</option>
                    <option>Thursday</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    placeholder="Location"
                    onChange={(e) => {
                      this.setState({ location: e.target.value });
                    }}
                  />
                </Form.Group>
              </Row>
              <br></br>
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Slot Time</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => {
                      this.setState({ slottime: e.target.value });
                    }}
                  >
                    <option>...</option>
                    <option>1st</option>
                    <option>2nd</option>
                    <option>3rd</option>
                    <option>4th</option>
                    <option>5th</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Slot Type</Form.Label>
                  <Form.Control
                    as="select"
                    placeholder="Slot Type"
                    onChange={(e) => {
                      this.setState({ slottype: e.target.value });
                    }}
                  >
                    <option>...</option>
                    <option>tutorial</option>
                    <option>lab</option>
                    <option>lecture</option>
                  </Form.Control>
                </Form.Group>
              </Row>
              <br></br>

              <Row>
                <Col md={{ offset: 2, span: 4 }}>
                  <Button
                    style={{ backgroundColor: "#007bff", color: "white" }}
                    onClick={(e) => {
                      this.addSlot(e);
                    }}
                  >
                    ADD
                  </Button>
                </Col>
                <Col md={{ offset: 2, span: 4 }}>
                  <Button
                    style={{ backgroundColor: "Red", color: "white" }}
                    onClick={() => this.resetSlot()}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
export default CoordinatorSlots;
