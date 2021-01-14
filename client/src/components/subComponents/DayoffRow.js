import React, { Component } from "react";
import axios from "axios";
//import "sweetalert2/src/sweetalert2.scss";

//import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import { Row, Col, Form, Modal, Table, Button } from "react-bootstrap";

import {
  Card,
  CardContent,
  CardHeader,
  InputLabel,
  Container,
} from "@material-ui/core";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";

class DayoffRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showReject: false,
      reason: "",
    };
  }

  acceptDayoff(e) {
    Swal.fire({
      title: "Are you sure you want to accept this?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, accept it!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
         
          axios({
            method: "put",
            url: process.env.REACT_APP_SERVER + "/acceptDayoffRequest",
            headers: { "auth-token": localStorage.getItem("auth-token") },
            data: {
              requestid: this.props.requestId,
            },
          }).then((res) => {
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

  rejectDayoff(e) {
    try {
     
      axios({
        method: "put",
        url: process.env.REACT_APP_SERVER + "/rejectHodRequest",
        headers: { "auth-token": localStorage.getItem("auth-token") },
        data: {
          requestid: this.props.requestId,
          comment: this.state.reason,
        },
      }).then((res) => {
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

  resetReject() {
    this.setState({ showReject: !this.state.showReject });
    this.setState({ reason: "" });
  }

  render() {
    return (
      <tr
        style={{
          textAlign: "center",
          backgroundColor: this.props.index % 2 == 0 ? "#cfd3ce" : "#eeeeee",
        }}
      >
        <td> {this.props.dayoffdata.id}</td>
        <td> {this.props.dayoffdata.sender.id}</td>
        <td> {this.props.dayoffdata.sender.name}</td>
        <td> {this.props.dayoffdata.weekday}</td>
        <td>{this.props.dayoffdata.reason} </td>
        <td>{this.props.dayoffdata.status} </td>
        <td>
          {" "}
          <Button
            type="submit"
            style={{
              backgroundColor: "#456268",

              color: "white",
            }}
            onClick={() => this.acceptDayoff()}
          >
            {" "}
            Accept
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
            onClick={() => this.resetReject()}
          >
            {" "}
            Reject
          </Button>{" "}
        </td>
        <Modal
          show={this.state.showReject}
          centered
          onHide={() => this.resetReject()}
        >
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <div class="swal2-icon swal2-warning">
                  <div class="swal2-icon-content">` ! </div>
                </div>
              </Row>
              <Row>
                <h2 style={{ textAlign: "center" }}>
                  Are you sure you want to reject this ?
                </h2>
              </Row>
              <Row>
                <Col>
                  <h6 style={{ textAlign: "center" }}>
                    {" "}
                    You won't be able to revert this!
                  </h6>
                </Col>
              </Row>
              <Row>
                <Form.Group as={Col}>
                  <Form.Control
                    placeholder="Type your comment (Optional)"
                    onChange={(e) => {
                      this.setState({ reason: e.target.value });
                    }}
                  />
                </Form.Group>
              </Row>
              <br></br>

              <Row>
                <Col md={{ offset: 2, span: 4 }}>
                  <Button
                    // style={{ backgroundColor: "#007bff", color: "white" }}

                    color="primary"
                    onClick={(e) => {
                      this.rejectDayoff(e);
                    }}
                  >
                    Yes, reject it!
                  </Button>
                </Col>
                <Col md={{ offset: 1, span: 4 }}>
                  <Button
                    style={{ backgroundColor: "Red", color: "white" }}
                    onClick={() => this.resetReject()}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
        </Modal>
      </tr>
    );
  }
}
export default DayoffRow;
