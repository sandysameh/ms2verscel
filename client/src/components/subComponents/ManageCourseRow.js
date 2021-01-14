import React, { Component } from "react";
import axios from "axios";

import { Table, Modal, Dropdown, Row, Col, Form } from "react-bootstrap";
import "sweetalert2/src/sweetalert2.scss";
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  InputLabel,
  Container,
} from "@material-ui/core";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";

class ManageCourseRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showStaff: false,
      //staffData -> backend(/viewStaffinDepartment) body: courseid->{this.props.courseData.id}
      staffData: [],

      showAssign: false,
      instructoridassign: "",

      showDelete: false,
      instructoridDelete: "",

      showUpdate: false,
      instructoridUpdate: "",
      newcourseidUpdate: "",

      showCoverage: false,
      //coverage -> backend(/viewcoursecoverage) "new route"
      coverage: "0",

      showSlots: false,
      //slotsData -> backend(/viewcourseslots) "new route" body(courseid) ->{this.props.courseData.id}
      slotsData: {
        slots: [],
      },

      // CoursenameUpdate: "",
      // CoursedepsUpdate: [],
      // showCourseUpdate: false,
    };
  }
  //   handleDelete() {
  //     Swal.fire({
  //       title: 'Are you sure?',
  //       text: "You won't be able to revert this!",
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonColor: '#3085d6',
  //       cancelButtonColor: '#d33',
  //       confirmButtonText: 'Yes, delete it!'
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         Swal.fire(
  //           'Deleted!',
  //           'Your file has been deleted.',
  //           'success'
  //         )
  //       }
  //     })
  //   }
  //   addLoc() {
  //     this.setState({showCourseUpdate : !this.state.showCourseUpdate})
  //     this.setState({ CourseidUpdate: ""});
  //     this.setState({ CoursenameUpdate: ""});
  //     this.setState({ CoursedepsUpdate:[]});
  //   }
  //   handleUpdate(){

  //     this.setState({showCourseUpdate : !this.state.showCourseUpdate})
  //     console.log(this.state.CourseidUpdate);
  //     console.log(this.state.CoursenameUpdate);
  //     console.log(this.state.CoursedepsUpdate);

  //   }

  showstaff() {
    this.setState({ showStaff: !this.state.showStaff });
    //get staffData here??
  }

  async componentDidMount() {
    try {
     // this.setState({ showStaff: !this.state.showStaff });
      
      await axios({
        method: "put",
        url: process.env.REACT_APP_SERVER + "/viewStaffinDepartment",
        headers: { "auth-token": localStorage.getItem("auth-token") },
        data: {
          courseid: this.props.courseData.id,
        },
      }).then((res) => {
        console.log(res.data);
        this.setState({ staffData: res.data.allStaff });
      });
    } catch (e) {
      console.log(e);
    }
  }

  resetAssign() {
    this.setState({ showAssign: !this.state.showAssign });
    this.setState({ instructoridassign: "" });
  }

  async viewStaff() {
    try {
      this.setState({ showStaff: !this.state.showStaff });
     
      await axios({
        method: "put",
        url: process.env.REACT_APP_SERVER + "/viewStaffinDepartment",
        headers: { "auth-token": localStorage.getItem("auth-token") },
        data: {
          courseid: this.props.courseData.id,
        },
      }).then((res) => {
        console.log(res.data);
        this.setState({ staffData: res.data.allStaff });
      });
    } catch (e) {
      console.log(e);
    }
  }

  resetAssign() {
    this.setState({ showAssign: !this.state.showAssign });
    this.setState({ instructoridassign: "" });
  }

  async assignInstructor(e) {
    this.setState({ showAssign: !this.state.showAssign });

   
    try {
      await axios({
        method: "put",
        url: process.env.REACT_APP_SERVER + "/assigninstructor",
        headers: { "auth-token": localStorage.getItem("auth-token") },
        data: {
          instructor: this.state.instructoridassign,
          courseid: this.props.courseData.id,
        },
      }).then((res) => {
        if (!res.data.msg) {

          Swal.fire({
            title: "Assigned!",
            icon: "success",
            confirmButtonColor: 'ok',
          });
          window.location.reload();
          
        } else {
          alert(res.data.msg);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  resetDelete() {
    this.setState({ showDelete: !this.state.showDelete });
    this.setState({ instructoridDelete: "" });
  }

  async unassignInstructor(e) {
    this.setState({ showDelete: !this.state.showDelete });

    try {
      await axios({
        method: "delete",
        url: process.env.REACT_APP_SERVER + "/removeinstructorfromcourse",
        headers: { "auth-token": localStorage.getItem("auth-token") },
        data: {
          instructor: this.state.instructoridDelete,
          courseid: this.props.courseData.id,
        },
      }).then((res) => {
        
        if (!res.data.msg) {

          Swal.fire({
            title: "unassigned!",
            icon: "success",
            confirmButtonColor: 'ok',
          });
          window.location.reload();
          
        } else {
          alert(res.data.msg);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  resetUpdate() {
    this.setState({ showUpdate: !this.state.showUpdate });
    this.setState({ instructoridUpdate: "" });
    this.setState({ newcourseidUpdate: "" });
  }

  async updateInstructor(e) {
    this.setState({ showUpdate: !this.state.showUpdate });

    try {
      await axios({
        method: "put",
        url: process.env.REACT_APP_SERVER + "/updateinstructorcourses",
        headers: { "auth-token": localStorage.getItem("auth-token") },
        data: {
          instructor: this.state.instructoridDelete,
          oldcourse: this.props.courseData.id,
          newcourse: this.state.newcourseidUpdate,
        },
      }).then((res) => {
        if (!res.data.msg) {

          Swal.fire({
            title: "moved!",
            icon: "success",
    
            confirmButtonColor: 'ok',
          });
          window.location.reload();
          
        } else {
          alert(res.data.msg);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  resetCoverage() {
    this.setState({ showCoverage: !this.state.showCoverage });
    //get coverage here??
  }

  async viewCoverage(e) {
    this.setState({ showCoverage: !this.state.showCoverage });

    try {
      await axios({
        method: "put",
        url: process.env.REACT_APP_SERVER + "/viewcoursecoverage",
        headers: { "auth-token": localStorage.getItem("auth-token") },
        data: {
          courseid: this.props.courseData.id,
        },
      }).then((res) => {
        console.log(res.data);

        this.setState({ coverage: res.data.coverage });
      });
    } catch (e) {
      console.log(e);
    }
  }

  resetSlots() {
    this.setState({ showSlots: !this.state.showSlots });
    //get slotsData here??
  }

  async viewcourseslots() {
    try {
      this.setState({ showSlots: !this.state.showSlots });
  
      await axios({
        method: "put",
        url: process.env.REACT_APP_SERVER + "/viewcourseslots",
        headers: { "auth-token": localStorage.getItem("auth-token") },
        data: {
          courseid: this.props.courseData.id,
        },
      }).then((res) => {
        console.log(res.data);
        this.setState({ slotsData: res.data.allinfo });
      });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <tr
        style={{
          textAlign: "center",
          backgroundColor: this.props.index % 2 == 0 ? "#cfd3ce" : "#eeeeee",
        }}
      >
        <td> {this.props.courseData.id}</td>
        <td> {this.props.courseData.name}</td>

        <td>
          <Dropdown>
            <Dropdown.Toggle
              variant="primary"
              id="dropdown-basic"
              style={{ backgroundColor: "#456268", color: "white" }}
            >
              Manage Course
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => this.viewStaff()}>
                View Staff
              </Dropdown.Item>
              <Dropdown.Item onClick={() => this.resetAssign()}>
                Assign Instructor
              </Dropdown.Item>
              <Dropdown.Item onClick={() => this.resetDelete()}>
                Unassign Instructor
              </Dropdown.Item>
              <Dropdown.Item onClick={() => this.resetUpdate()}>
                Move Instructor
              </Dropdown.Item>
              <Dropdown.Item onClick={() => this.viewCoverage()}>
                View Coverage
              </Dropdown.Item>
              <Dropdown.Item onClick={() => this.viewcourseslots()}>
                View Slots Assignments
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>

        {/* view staff modal */}
        <Modal
          show={this.state.showStaff}
          centered
          size="lg"
          onHide={() => this.showstaff()}
        >
          <Modal.Header closeButton>
            <h4 style={{ textAlign: "center" }}>Course Staff</h4>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Table style={{ color: "black" }} responsive>
                <thead>
                  <tr
                    style={{
                      textAlign: "center",
                      background: "#456268",
                      color: "white",
                    }}
                  >
                    <th key={0}> Staff ID </th>
                    <th key={1}> Name</th>
                    <th key={2}> Email</th>
                    <th key={3}> Role</th>
                    <th key={4}> Dayoff </th>
                    <th key={5}> Office Location</th>
                    <th key={6}> Bio</th>
                  </tr>
                </thead>

                <tbody>
                  {this.state.staffData.map((elem, index) => {
                    return (
                      <tr
                        style={{
                          textAlign: "center",
                          backgroundColor:
                            this.props.index % 2 == 0 ? "#cfd3ce" : "#eeeeee",
                        }}
                      >
                        <td> {elem.id}</td>
                        <td> {elem.name}</td>
                        <td> {elem.email}</td>
                        <td> {elem.role}</td>
                        <td> {elem.dayoff}</td>
                        <td>
                          {" "}
                          {elem.officelocation == undefined
                            ? ""
                            : elem.officelocation.locname}
                        </td>

                        <td> {elem.bio}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Container>
          </Modal.Body>
        </Modal>

        {/* assign instructor */}

        <Modal
          show={this.state.showAssign}
          centered
          onHide={() => this.resetAssign()}
        >
          <Modal.Header closeButton>
            <h4 style={{ textAlign: "center" }}>
              Assign Instructor to {this.props.courseData.id}
            </h4>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Instructor ID</Form.Label>
                  <Form.Control
                    placeholder="ac-xxx"
                    onChange={(e) => {
                      this.setState({ instructoridassign: e.target.value });
                    }}
                  />
                </Form.Group>
              </Row>
              <br></br>

              <Row>
                <Col md={{ offset: 2, span: 4 }}>
                  <Button
                    style={{ backgroundColor: "#007bff", color: "white" }}
                    onClick={(e) => {
                      this.assignInstructor(e);
                    }}
                  >
                    Assign
                  </Button>
                </Col>
                <Col md={{ offset: 2, span: 4 }}>
                  <Button
                    style={{ backgroundColor: "Red", color: "white" }}
                    onClick={() => this.resetAssign()}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
        </Modal>

        {/* delete instructor from course */}

        <Modal
          show={this.state.showDelete}
          centered
          onHide={() => this.resetDelete()}
        >
          <Modal.Header closeButton>
            <h4 style={{ textAlign: "center" }}>
              Remove Instructor from {this.props.courseData.id}
            </h4>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Instructor ID</Form.Label>
                  <Form.Control
                    as="select"
                    defaultValue="Instructor ID"
                    onChange={(e) => {
                      this.setState({ instructoridDelete: e.target.value });
                    }}
                  >
                        <option>...</option>

                    {this.state.staffData.map((elem, index) => {
                      return elem.role === "Course Instructor" ? (
                        <option>{elem.id}</option>
                      ) : null;
                    })}
                  </Form.Control>
                </Form.Group>
              </Row>
              <br></br>

              <Row>
                <Col md={{ offset: 2, span: 4 }}>
                  <Button
                    style={{ backgroundColor: "#007bff", color: "white" }}
                    onClick={(e) => {
                      this.unassignInstructor(e);
                    }}
                  >
                    Remove
                  </Button>
                </Col>
                <Col md={{ offset: 2, span: 4 }}>
                  <Button
                    style={{ backgroundColor: "Red", color: "white" }}
                    onClick={() => this.resetDelete()}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
        </Modal>

        {/* update instructor courses */}

        <Modal
          show={this.state.showUpdate}
          centered
          onHide={() => this.resetUpdate()}
        >
          <Modal.Header closeButton>
            <h4 style={{ textAlign: "center" }}>
              Move Instructor from {this.props.courseData.id}
            </h4>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Instructor ID</Form.Label>
                  <Form.Control
                    as="select"
                    defaultValue="Instructor ID"
                    onChange={(e) => {
                      this.setState({ instructoridDelete: e.target.value });
                    }}
                  >
                        <option>...</option>


                    {this.state.staffData.map((elem, index) => {
                      return elem.role === "Course Instructor" ? (
                        <option>{elem.id}</option>
                      ) : null;
                    })}
                  </Form.Control>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>New Course</Form.Label>
                  <Form.Control
                    placeholder="Course"
                    onChange={(e) => {
                      this.setState({ newcourseidUpdate: e.target.value });
                    }}
                  />
                </Form.Group>
              </Row>
              <br></br>

              <Row>
                <Col md={{ offset: 2, span: 4 }}>
                  <Button
                    style={{ backgroundColor: "#007bff", color: "white" }}
                    onClick={(e) => {
                      this.updateInstructor(e);
                    }}
                  >
                    Move
                  </Button>
                </Col>
                <Col md={{ offset: 2, span: 4 }}>
                  <Button
                    style={{ backgroundColor: "Red", color: "white" }}
                    onClick={() => this.resetUpdate()}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
        </Modal>

        {/* view course coverage */}

        <Modal
          show={this.state.showCoverage}
          centered
          onHide={() => this.resetCoverage()}
        >
          <Modal.Header closeButton>
            <h4 style={{ textAlign: "center" }}>Course Coverage</h4>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col>
                  <h4 style={{ textAlign: "center" }}>{this.state.coverage}%</h4>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
        </Modal>

        {/* view course slot assignments */}
        <Modal
          show={this.state.showSlots}
          centered
          size="lg"
          onHide={() => this.resetSlots()}
        >
          <Modal.Header closeButton>
            <h4 style={{ textAlign: "center" }}>Course Slot Assignments</h4>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Table style={{ color: "black" }} responsive>
                <thead>
                  <tr
                    style={{
                      textAlign: "center",
                      background: "#456268",
                      color: "white",
                    }}
                  >
                    <th key={0}> Slot Type </th>
                    <th key={1}> Slot Day</th>
                    <th key={2}> Slot Time</th>
                    <th key={3}> Staff ID</th>
                    <th key={4}> Staff Name</th>
                  </tr>
                </thead>

                <tbody>
                  {this.state.slotsData.slots.map((elem, index) => {
                    return (
                      <tr
                        style={{
                          textAlign: "center",
                          backgroundColor:
                            this.props.index % 2 == 0 ? "#cfd3ce" : "#eeeeee",
                        }}
                      >
                        <td> {elem.slottype}</td>
                        <td> {elem.slotday}</td>
                        <td> {elem.slottime}</td>
                        <td> {elem.teachingid.id}</td>
                        <td> {elem.teachingid.name}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Container>
          </Modal.Body>
        </Modal>
      </tr>
    );
  }
}
export default ManageCourseRow;
