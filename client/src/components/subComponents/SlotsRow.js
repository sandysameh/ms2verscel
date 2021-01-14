import React, { Component } from "react";
//import axios from "axios";
//import "sweetalert2/src/sweetalert2.scss";

//import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import { Row, Col, Form, Modal, Table, ModalBody } from "react-bootstrap";

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
import axios from "axios";

class SlotsRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showUpdate: false,
      idUpdate: "",
      courseIdUpdate: "",
      slotdayUpdate: "",
      slottimeUpdate: "",
      slottypeUpdate: "",
      locationUpdate: "",
    };
  }
  resetUpdate() {
    this.setState({ showUpdate: !this.state.showUpdate });
    this.setState({ idUpdate: this.props.slotsData.id });
    this.setState({ courseIdUpdate: this.props.slotsData.courseId.id});
    this.setState({ slotdayUpdate:  this.props.slotsData.slotday });
    this.setState({ slottimeUpdate:  this.props.slotsData.slottime });
    this.setState({ slottypeUpdate:  this.props.slotsData.slottype });
    this.setState({ locationUpdate:  this.props.slotsData.location.locname});
  }

  deleteSlot(e) {
    Swal.fire({
      title: "Are you sure you want to delete this?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          const accesstoken =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFjLTE1IiwidG9rZW5yb2xlIjoiQ291cnNlIGNvb3JkaW5hdG9yIiwiaWF0IjoxNjA4OTQyMTgyfQ.8sFnH8t_T2_4XDycLM1HEvfvsrILHr3fhRAESWEB6Dk  ";
          axios({
            method: "delete",
            url: process.env.REACT_APP_SERVER + "/deleteslot",
          //  headers: { "auth-token": `${accesstoken}` },
          headers: { "auth-token": localStorage.getItem("auth-token") },
            data: {
              requestId: this.props.requestId,
            },
          }).then((res) => {
            console.log(res.data);
            if (res.data.msg) {
              Swal.fire({
                text: res.data.msg,
                showCancelButton: true,
                cancelButtonText: "OK",
                showConfirmButton: false,
                cancelButtonColor: "#007bff",
              });
            } else {
              window.location.reload();
            }
          });
        } catch (e) {
          console.log(e);
        }
      }
    });
  }

  async updateSlot(e) {
    try {

      const accesstoken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFjLTE1IiwidG9rZW5yb2xlIjoiQ291cnNlIGNvb3JkaW5hdG9yIiwiaWF0IjoxNjA4OTQyMTgyfQ.8sFnH8t_T2_4XDycLM1HEvfvsrILHr3fhRAESWEB6Dk  ";
        this.setState({ showUpdate: !this.state.showUpdate });
        console.log(this.state.courseIdUpdate);
        console.log(this.state.slottypeUpdate)
      await axios({
        method: "post",
        url: process.env.REACT_APP_SERVER + "/updateslot",
       // headers: { "auth-token": `${accesstoken}` },
        headers: { "auth-token": localStorage.getItem("auth-token") },
        data: {
          slotId : this.props.slotId,
          slotday: this.state.slotdayUpdate,
          slottype: this.state.slottypeUpdate,
          slottime: this.state.slottimeUpdate,
          courseid: this.state.courseIdUpdate,
          locname: this.state.locationUpdate,
        },
      }).then((res) => {

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
      <tr
        style={{
          textAlign: "center",
          backgroundColor: this.props.index % 2 == 0 ? "#cfd3ce" : "#eeeeee",
        }}
      >
        <td> {this.props.slotsData.id}</td>
        <td> {this.props.slotsData.courseId.id}</td>
        <td> {this.props.slotsData.slotday}</td>
        <td>{this.props.slotsData.slottime} </td>

        <td>{this.props.slotsData.slottype} </td>
        <td>
          {" "}
          {this.props.slotsData.teachingid == undefined
            ? " "
            : this.props.slotsData.teachingid.id}
        </td>
        <td>{this.props.slotsData.location.locname} </td>
        <td>
          {this.props.slotsData.replacementId == undefined
            ? " "
            : this.props.slotsData.replacementId.id}
        </td>
        <td>{this.props.slotsData.replacementDate} </td>
        <td>
          {" "}
          <Button
            type="submit"
            style={{
              backgroundColor: "#456268",

              color: "white",
            }}
            onClick={() => this.resetUpdate()}
          >
            {" "}
            UPDATE
          </Button>{" "}
        </td>
        <td>
          {" "}
          <Button
            type="submit"
            style={{
              backgroundColor: "#456268",

              color: "white",
            }}
            onClick={() => this.deleteSlot()}
          >
            {" "}
            DELETE
          </Button>{" "}
          <Modal
            show={this.state.showUpdate}
            centered
            onHide={() => this.resetUpdate()}
          >
            <Modal.Header closeButton>
              <h4 style={{ textAlign: "center" }}>Update Slot</h4>
            </Modal.Header>
            <Modal.Body>
              <Container>
                <Row>
               

                  <Form.Group as={Col}>
                    <Form.Label>Slot Day</Form.Label>
                    <Form.Control
                      as="select"
                      defaultValue={this.props.slotsData.slotday}
                      onChange={(e) => {
                        this.setState({ slotdayUpdate: e.target.value });
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
                      defaultValue={this.props.slotsData.location.locname}
                      onChange={(e) => {
                        this.setState({ locationUpdate: e.target.value });
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
                      defaultValue={this.props.slotsData.slottime}
                      onChange={(e) => {
                        this.setState({ slottimeUpdate: e.target.value });
                      }}
                    >
                      

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
                      defaultValue={this.props.slotsData.slottype}
                      onChange={(e) => {
                        this.setState({ slottypeUpdate: e.target.value });
                      }}
                    >
                     
                     
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
                        this.updateSlot(e);
                      }}
                    >
                      Update
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
        </td>
      </tr>
    );
  }
}
export default SlotsRow;
