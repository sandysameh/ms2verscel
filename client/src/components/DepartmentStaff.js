import React, { Component } from "react";
import axios from "axios";
//import "sweetalert2/src/sweetalert2.scss";

//import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import {
  Row,
  Col,
  Form,
  Modal,
  Table,
  Navbar,
  Nav,
  NavDropdown,
  Container,
} from "react-bootstrap";

import {
  //   Card,
  //   CardContent,
  //   CardHeader,
  Button,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import AcademicMemberNav from "./NavBars/AcademicMemberNav";

class DepartmentStaff extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDayoff: false,
      showSingleDayoff: false,
      dayoffid: "",
      dayoff: "",
      showDay: false,
      //staffData -> /viewStaffinDepartment (no body)
      staffData: [],
      displayCoordinator: "none",
      displayHOD: "none",
      displayInstructor: "none"
    };
  }

  async componentDidMount() {
    try {
      await axios({
        method: "put",
        url: process.env.REACT_APP_SERVER + "/viewStaffinDepartment",
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

        if (res.data.msg) {
          alert(res.data.msg);
        } else {
          this.setState({ staffData: res.data });
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  resetDayoff() {
    this.setState({ showDayoff: !this.state.showDayoff });
  }

  resetSingleDayoff() {
    this.setState({ showSingleDayoff: !this.state.showSingleDayoff });
  }

  async viewSingleDayoff() {
    try {
      await axios({
        method: "put",
        url: process.env.REACT_APP_SERVER + "/viewDayoff",
        headers: { "auth-token": localStorage.getItem("auth-token") },
        data: { staffid: this.state.dayoffid },
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

        if (res.data.msg) {
          alert(res.data.msg);
        } else {
          this.setState({ showSingleDayoff: !this.state.showSingleDayoff });
          this.setState({ dayoff: res.data.d });
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  // showDay() {
  //     this.setState({ showDay: !this.state.showDay });
  // }

  render() {
    return (
      <div>
       
       <AcademicMemberNav
          displayHOD={this.state.displayHOD}
          displayCoordinator={this.state.displayCoordinator}
          displayInstructor={this.state.displayInstructor}
        
        />
        <Row style={{ background: "#eeeeee" }}>
          <Col md={{ offset: 1 }}>
            {/* <InputLabel>Show Dayoff only</InputLabel>
                        <Checkbox color="default" onClick={() => this.resetDayoff()}></Checkbox> */}
            <FormControlLabel
              control={
                <Checkbox color="default" onClick={() => this.resetDayoff()} />
              }
              label="Show Dayoff only"
              style={{ marginTop: "5px" }}
            />
          </Col>
          {/* <Container> */}

          {/* <Form.Group as={Col}> */}
          {/* <Form.Label>Staff ID</Form.Label> */}
          <Col md={{ offset: 1, span: 1 }}>
            <Form.Control
              size="sm"
              placeholder="ac-xxx"
              onChange={(e) => {
                this.setState({ dayoffid: e.target.value });
              }}
              style={{ marginTop: "10px" }}
            />
            {/* </Form.Group> */}
          </Col>

          <Col>
            <Button
              style={{
                backgroundColor: "#456268",
                color: "white",
                marginTop: "8px",
              }}
              onClick={(e) => {
                this.viewSingleDayoff();
              }}
            >
              Show Staff's Dayoff
            </Button>
          </Col>
          {/* </Container> */}

          {/* <Col >
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
                            onClick={() => this.resetSingleDayoff()}
                        >
                            View Staff's Dayoff by ID
                        </Button>

                    </Col> */}
        </Row>

        {!this.state.showDayoff ? (
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
        ) : (
          <Table style={{ color: "black" }} responsive display={false}>
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
                <th key={2}> Dayoff </th>
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
                    <td> {elem.dayoff}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}

        {/* <Modal
                    show={this.state.showSingleDayoff}
                    centered
                    onHide={() => this.resetSingleDayoff()}
                >
                     <Modal.Header closeButton>
                        <h4 style={{ textAlign: "center" }}>Staff's dayoff</h4>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Staff ID</Form.Label>
                                    <Form.Control
                                        placeholder="ac-xxx"
                                        onChange={(e) => {
                                            this.setState({ dayoffid: e.target.value });
                                        }}
                                    />
                                </Form.Group>
                            </Row>
                            <br></br> */}

        {/* <Row>
                                <Col md={{ offset: 2, span: 4 }}>
                                    <Button
                                        style={{ backgroundColor: "#007bff", color: "white" }}
                                        onClick={(e) => {
                                            this.showDay(e);
                                        }}
                                    >
                                        Show
                                    </Button>
                                </Col>
                                <Col md={{ offset: 2, span: 4 }}>
                                    <Button
                                        style={{ backgroundColor: "Red", color: "white" }}
                                        onClick={() => this.resetSingleDayoff()}
                                    >
                                        Cancel
                                    </Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    {this.state.showDay?<h5>{this.state.dayoff}</h5>:null}
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                </Modal> */}
        <Modal
          show={this.state.showSingleDayoff}
          centered
          onHide={() => this.resetSingleDayoff()}
        >
          <Modal.Header closeButton>
            <h4 style={{ textAlign: "center" }}>
              {this.state.dayoffid} Dayoff
            </h4>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col md={{ offset: 5 }}>
                  <h4>{this.state.dayoff}</h4>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
export default DepartmentStaff;
