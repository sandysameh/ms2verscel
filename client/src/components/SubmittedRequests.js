import React, { Component } from "react";

import RequestsRow from "./subComponents/RequestsRow";
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
import './NavBars/bell.css'
import BellIcon from 'react-bell-icon'

import * as moment from "moment";
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  InputLabel,
  Container,
} from "@material-ui/core";

import DropdownMultiselect from "react-multiselect-dropdown-bootstrap";
import axios from "axios";
import AcademicMemberNav from "./NavBars/AcademicMemberNav";

class SubmittedRequests extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reqtype: "",
      leavetype: "",
      date: "",
      compensationDate: "",
      course: "",
      weekday: "",
      slottime: "",
      slottype: "",
      reason: "",
      document: "",
      receiver: "",
      replacements: [""],

      reqData: [],

      showSlotLinking: false,
      showChangeDayoff: false,
      showLeave: false,
      showReplacement: false,
      displayCoordinator: "none",
      displayHOD: "none",
      displayInstructor : "none"

    };
  }

  async componentDidMount(e) {
    try {
    
      await axios({
        method: "put",
        url: process.env.REACT_APP_SERVER + "/viewSentRequests",
        headers: { "auth-token": localStorage.getItem("auth-token") },
        data: {},
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
       
        this.setState({ reqData: res.data.myRequests });

        
      });
    } catch (e) {
      console.log(e);
    }
  }

  async filterStatus(e) {
    try {
      
      await axios({
        method: "put",
        url: process.env.REACT_APP_SERVER + "/viewSentRequests",
        headers: { "auth-token": localStorage.getItem("auth-token") },
  
        data: {status:  e.target.value},
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
        
        this.setState({ reqData: res.data.myRequests });
      });
    } catch (e) {
      console.log(e);
    }
  }



  resetSlotLinking() {
    this.setState({ showSlotLinking: !this.state.showSlotLinking });
    this.setState({ course: "" });
    this.setState({ weekday: "" });
    this.setState({ slottime: "" });
    this.setState({ slottype: "" });
  }
  resetChangeDayoff() {
    this.setState({ showChangeDayoff: !this.state.showChangeDayoff });
    this.setState({ weekday: "" });
    this.setState({ reason: "" });
  }
  resetReplacement() {
    this.setState({ showReplacement: !this.state.showReplacement });

    this.setState({ date: "" });
    this.setState({ course: "" });
    this.setState({ weekday: "" });
    this.setState({ slottime: "" });
    this.setState({ receiver: "" });
  }

  resetLeave() {
    this.setState({ showLeave: !this.state.showLeave });
    this.setState({ leavetype: "" });
    this.setState({ date: "" });
    this.setState({ compensationDate: "" });
    this.setState({ reason: "" });
    this.setState({ document: "" });
    this.setState({ replacements: [] });
  }

  async sendSlotLinking(e) {
    this.setState({ showSlotLinking: !this.state.showSlotLinking });
    
    try {
      await axios({
        method: "post",
        url: process.env.REACT_APP_SERVER + "/sendSlotLinking",
        headers: { "auth-token": localStorage.getItem("auth-token") },
        data: {
          slotday: this.state.weekday,
          slottime: this.state.slottime,
          course: this.state.course,
          slottype: this.state.slottype,
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

  async sendChangeDayoff(e) {
    this.setState({ showChangeDayoff: !this.state.showChangeDayoff });
    
    try {
      await axios({
        method: "post",
        url: process.env.REACT_APP_SERVER + "/sendChangeDayOff",
        headers: { "auth-token": localStorage.getItem("auth-token") },
        data: {
          weekday: this.state.weekday,
          reason: this.state.reason,
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
          console.log(res.data.savedRequest);
           window.location.reload();
        } else {
          alert(res.data.msg);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  async sendReplacement(e) {
    this.setState({ showReplacement: !this.state.showReplacement });
    
    try {
      await axios({
        method: "post",
        url: process.env.REACT_APP_SERVER + "/sendSlotReplacement",
        headers: { "auth-token": localStorage.getItem("auth-token") },
        data: {
          date: this.state.date,
          course: this.state.course,
          weekday: this.state.weekday,
          slottime: this.state.slottime,
          receiver: this.state.receiver,
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

  async sendLeave(e) {
    this.setState({ showLeave: !this.state.showLeave });
    
    try {
      await axios({
        method: "post",
        url: process.env.REACT_APP_SERVER + "/sendLeave",
        headers: { "auth-token": localStorage.getItem("auth-token") },
        data: {
          leavetype: this.state.leavetype,
          date: this.state.date,
          compensationDate: this.state.compensationDate,
          reason: this.state.reason,
          document: this.state.document,
          replacement: this.state.replacements,
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
       
        console.log(res.data);
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
          <Col md={{ offset: 1, span: 3 }}>
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
              onClick={() => this.resetSlotLinking()}
            >
              Send Slot-Linking Request
            </Button>
          </Col>

          <Col md={{ span: 3 }}>
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
              onClick={() => this.resetChangeDayoff()}
            >
              Send Change-DayOff Request
            </Button>
          </Col>

          <Col md={{ span: 2 }}>
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
              onClick={() => this.resetLeave()}
            >
              Send Leave Request
            </Button>
          </Col>
          <Col md={{ span: 3 }}>
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
              onClick={() => this.resetReplacement()}
            >
              Send Replacement Request
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
              <th key={0}> Request ID </th>
              <th key={1}> Request Type </th>
              <th key={2}> Date </th>
              <th key={3}> Compensation Date </th>
              <th key={4}> Slot Time </th>
              <th key={5}> Course </th>

              <th key={6}>
                <Row>
                  <Col>
                  <Form.Control
                    as="select"
                    onChange={(e) => {
                      this.filterStatus(e);
                    }}
                  >
                    <option> </option>
                    <option>Pending</option>
                    <option>Accepted</option>
                    <option>Rejected</option>
                    
                  </Form.Control>
                  </Col>
                </Row>
                <br></br> Status{" "}
              </th>
              <th key={7}> Reason</th>
              <th key={8}> Document </th>
              <th key={9}> Replacements </th>
              <th key={10}> Receiver </th>
              <th key={11}> </th>
            </tr>
          </thead>

          <tbody>
            {this.state.reqData.map((elem, index) => {
              return (
                <RequestsRow
                  reqData={elem}
                  index={index}
                  key={index}
                  requestId={elem.id}
                />
              );
            })}
          </tbody>
        </Table>
        <Modal
          show={this.state.showSlotLinking}
          centered
          onHide={() => this.resetSlotLinking()}
        >
          <Modal.Header closeButton>
            <h4 style={{ textAlign: "center" }}>Send Slot-linking Request</h4>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Course</Form.Label>
                  <Form.Control
                    placeholder="Course"
                    onChange={(e) => {
                      this.setState({ course: e.target.value });
                    }}
                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Week day</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => {
                      this.setState({ weekday: e.target.value });
                    }}
                  >
                    <option> ...</option>
                    <option>Saturday</option>
                    <option>Sunday</option>
                    <option>Monday</option>
                    <option>Tuesday</option>
                    <option>Wednesday</option>
                    <option>Thursday</option>
                  </Form.Control>
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
                    <option> ...</option>
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
                    onChange={(e) => {
                      this.setState({ slottype: e.target.value });
                    }}
                  >
                    <option> ...</option>
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
                    onClick={() => {
                      this.sendSlotLinking();
                    }}
                  >
                    Send
                  </Button>
                </Col>
                <Col md={{ offset: 2, span: 4 }}>
                  <Button
                    style={{ backgroundColor: "Red", color: "white" }}
                    onClick={() => this.resetSlotLinking()}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
        </Modal>
        <Modal
          show={this.state.showChangeDayoff}
          centered
          onHide={() => this.resetChangeDayoff()}
        >
          <Modal.Header closeButton>
            <h4 style={{ textAlign: "center" }}>Send Change DayOff Request</h4>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Reason</Form.Label>
                  <Form.Control
                    placeholder="Reason"
                    onChange={(e) => {
                      this.setState({ reason: e.target.value });
                    }}
                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Week day</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => {
                      this.setState({ weekday: e.target.value });
                    }}
                  >
                    <option> ...</option>
                    <option>Saturday</option>
                    <option>Sunday</option>
                    <option>Monday</option>
                    <option>Tuesday</option>
                    <option>Wednesday</option>
                    <option>Thursday</option>
                  </Form.Control>
                </Form.Group>
              </Row>

              <br></br>
              <Row>
                <Col md={{ offset: 2, span: 4 }}>
                  <Button
                    style={{ backgroundColor: "#007bff", color: "white" }}
                    onClick={() => {
                      this.sendChangeDayoff();
                    }}
                  >
                    Send
                  </Button>
                </Col>
                <Col md={{ offset: 2, span: 4 }}>
                  <Button
                    style={{ backgroundColor: "Red", color: "white" }}
                    onClick={() => this.resetChangeDayoff()}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
        </Modal>
        <Modal
          show={this.state.showReplacement}
          centered
          onHide={() => this.resetReplacement()}
        >
          <Modal.Header closeButton>
            <h4 style={{ textAlign: "center" }}>
              Send Slot- Replacement Request
            </h4>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Course</Form.Label>
                  <Form.Control
                    placeholder="Course"
                    onChange={(e) => {
                      this.setState({ course: e.target.value });
                    }}
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Date</Form.Label>
                  <Datetime
                    dateFormat="DD/MM/YYYY"
                    timeFormat={false}
                    inputProps={{
                      placeholder: "Date ",
                    }}
                   
                    onChange={(e) => {
                      let day = "";
                      let month = "";
                      let year = "";
                      day = e._d.getDate();
                      month = parseInt(e._d.getMonth() + 1);
                      year = e._d.getFullYear();

                      if (parseInt(e._d.getMonth() + 1) < 10) {
                        month = "0" + parseInt(e._d.getMonth() + 1);
                      }
                      if (parseInt(e._d.getDate()) < 10) {
                        day = "0" + parseInt(e._d.getDate());
                      }
                      this.setState({ date: day + "-" + month + "-" + year });
                      console.log(day + "-" + month + "-" + year);
                    }}
                  />
                </Form.Group>
              </Row>
              <br></br>
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Week day</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => {
                      this.setState({ weekday: e.target.value });
                    }}
                  >
                    <option> ...</option>
                    <option>Saturday</option>
                    <option>Sunday</option>
                    <option>Monday</option>
                    <option>Tuesday</option>
                    <option>Wednesday</option>
                    <option>Thursday</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Slot Time</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => {
                      this.setState({ slottime: e.target.value });
                    }}
                  >
                    <option> ...</option>
                    <option>1st</option>
                    <option>2nd</option>
                    <option>3rd</option>
                    <option>4th</option>
                    <option>5th</option>
                  </Form.Control>
                </Form.Group>
              </Row>
              <br></br>
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Receiver</Form.Label>
                  <Form.Control
                    placeholder="Sent To"
                    onChange={(e) => {
                      this.setState({ receiver: e.target.value });
                    }}
                  />
                </Form.Group>
              </Row>
              <Row>
                <Col md={{ offset: 2, span: 4 }}>
                  <Button
                    style={{ backgroundColor: "#007bff", color: "white" }}
                    onClick={() => {
                      this.sendReplacement();
                    }}
                  >
                    Send
                  </Button>
                </Col>
                <Col md={{ offset: 2, span: 4 }}>
                  <Button
                    style={{ backgroundColor: "Red", color: "white" }}
                    onClick={() => this.resetReplacement()}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
        </Modal>

        <Modal
          show={this.state.showLeave}
          centered
          onHide={() => this.resetLeave()}
        >
          <Modal.Header closeButton>
            <h4 style={{ textAlign: "center" }}>Send Leave Request</h4>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Leave Type</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => {
                      this.setState({ leavetype: e.target.value });
                    }}
                  >
                    <option>...</option>
                    <option>Compensation</option>
                    <option>Annual</option>
                    <option>Sick</option>
                    <option>Maternity</option>
                    <option>Accidental</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Date</Form.Label>
                  <Datetime
                    dateFormat="DD/MM/YYYY"
                    timeFormat={false}
                    inputProps={{
                      placeholder: "Date ",
                    }}
                    onChange={(e) => {
                      let day = "";
                      let month = "";
                      let year = "";
                      day = e._d.getDate();
                      month = parseInt(e._d.getMonth() + 1);
                      year = e._d.getFullYear();

                      if (parseInt(e._d.getMonth() + 1) < 10) {
                        month = "0" + parseInt(e._d.getMonth() + 1);
                      }
                      if (parseInt(e._d.getDate()) < 10) {
                        day = "0" + parseInt(e._d.getDate());
                      }
                      this.setState({ date: day + "-" + month + "-" + year });
                      console.log(day + "-" + month + "-" + year);
                    }}
                  />
                </Form.Group>
              </Row>
              <br></br>
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Compensation Date</Form.Label>
                  <Datetime
                    dateFormat="DD/MM/YYYY"
                    timeFormat={false}
                    inputProps={{
                      placeholder: "Date ",
                    }}
                    onChange={(e) => {
                      let day = "";
                      let month = "";
                      let year = "";
                      day = e._d.getDate();
                      month = parseInt(e._d.getMonth() + 1);
                      year = e._d.getFullYear();

                      if (parseInt(e._d.getMonth() + 1) < 10) {
                        month = "0" + parseInt(e._d.getMonth() + 1);
                      }
                      if (parseInt(e._d.getDate()) < 10) {
                        day = "0" + parseInt(e._d.getDate());
                      }
                      this.setState({
                        compensationDate: day + "-" + month + "-" + year,
                      });
                    }}
                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Replacements Ids</Form.Label>

                  <MultipleValueTextInput
                    onItemAdded={(item, allItems) =>
                      this.setState({ replacements: allItems })
                    }
                    onItemDeleted={(item, allItems) =>
                      this.setState({
                        replacements: this.state.replacements.filter(function (
                          elem
                        ) {
                          return elem !== item;
                        }),
                      })
                    }
                    placeholder="separate them with coma"
                  />
                </Form.Group>
              </Row>
              <br></br>
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Reason</Form.Label>
                  <Form.Control
                    placeholder="Reason"
                    onChange={(e) => {
                      this.setState({ reason: e.target.value });
                    }}
                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Document</Form.Label>
                  <Form.Control
                    placeholder="Doucment"
                    onChange={(e) => {
                      this.setState({ document: e.target.value });
                    }}
                  />
                </Form.Group>
              </Row>
              <br></br>
              <Row>
                <Col md={{ offset: 2, span: 4 }}>
                  <Button
                    style={{ backgroundColor: "#007bff", color: "white" }}
                    onClick={() => {
                      this.sendLeave();
                    }}
                  >
                    Send
                  </Button>
                </Col>
                <Col md={{ offset: 2, span: 4 }}>
                  <Button
                    style={{ backgroundColor: "Red", color: "white" }}
                    onClick={() => this.sendLeave()}
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
export default SubmittedRequests;
