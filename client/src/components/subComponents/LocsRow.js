import React, { Component } from "react";
//import axios from "axios";
//import "sweetalert2/src/sweetalert2.scss";
// import Swal from "sweetalert2/dist/sweetalert2.js";
// import "sweetalert2/src/sweetalert2.scss";
//import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import { Row, Col, Form, Modal, Table } from "react-bootstrap";
import axios from "axios";
//import Swal from 'sweetalert2'

import {
  Card,
  CardContent,
  CardHeader,
  Button,
  InputLabel,
  Container,
} from "@material-ui/core";

class LocsRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locnameUpdate: "",
      capacityUpdate: "",
      loctypeUpdate: "",
      showUpdate: false

    };
  }

  async handleDelete(name) {

    Swal.fire({
      title: "Are you sure you want to Delete this?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // const accesstoken =
          //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFjLTE1IiwidG9rZW5yb2xlIjoiQ291cnNlIGNvb3JkaW5hdG9yIiwiaWF0IjoxNjA4OTIzMTMxfQ.tSLFR5PXbFlDRqogpI2CggbqTDldRLUBMxlZ_0Z9pUI";

          await axios({
            method: "delete",
            url: process.env.REACT_APP_SERVER + "/locations/" + name,
            headers: { 'auth-token': localStorage.getItem('auth-token') },
            data: {},
          }).then((res) => {
            console.log(name)
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
   addLoc() {
    this.setState({ showUpdate: !this.state.showUpdate })
    this.setState({ locnameUpdate: "" });
    this.setState({ loctypeUpdate: this.props.locData.loctype });
    this.setState({ capacityUpdate: this.props.locData.capacity });
  }
 async handleUpdate(name) {
    this.setState({ showUpdate: !this.state.showUpdate })
    Swal.fire({
      title: "Are you sure you want to update this?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // const accesstoken =
          //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFjLTE1IiwidG9rZW5yb2xlIjoiQ291cnNlIGNvb3JkaW5hdG9yIiwiaWF0IjoxNjA4OTIzMTMxfQ.tSLFR5PXbFlDRqogpI2CggbqTDldRLUBMxlZ_0Z9pUI";

          await axios({
            method: "put",
            url: process.env.REACT_APP_SERVER + "/locations/" + name,
            headers: { 'auth-token': localStorage.getItem('auth-token') },
            data: {
              locname:this.state.locnameUpdate,
              loctype:this.state.loctypeUpdate,
              capacity:this.state.capacityUpdate
            },
          }).then((res) => {
            console.log("my name "+name)
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
    console.log(this.state.locnameUpdate);
    console.log(this.state.loctypeUpdate);
    console.log(this.state.capacityUpdate);


  }

  render() {
    return (
      <>


        <tr
          style={{
            textAlign: "center",
            backgroundColor: this.props.index % 2 == 0 ? "#cfd3ce" : "#eeeeee",
          }}
        >
          <td> {this.props.locData.locname}</td>
          <td> {this.props.locData.capacity}</td>
          <td> {this.props.locData.loctype}</td>

          <td>
            {" "}
            <Button
              type="submit"
              style={{
                backgroundColor: "#456268",

                color: "white",
              }}
              onClick={() => this.addLoc()}
            >
              {" "}
                Update
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
              onClick={() => this.handleDelete(this.props.locData.locname)}
            >
              {" "}
                Delete
              </Button>{" "}
          </td>
          <Modal
            show={this.state.showUpdate}
            centered
            onHide={() => this.addLoc()}
          >
            <Modal.Header closeButton>
              <h4 style={{ textAlign: "center" }}>Update Location</h4>
            </Modal.Header>
            <Modal.Body>
              <Container>


                <Row>
                  <Form.Group as={Col}>
                    <Form.Label>Location Name</Form.Label>
                    <Form.Control
                      defaultValue={this.props.locData.locname}
                      onChange={(e) => {
                        this.setState({ locnameUpdate: e.target.value });
                      }}

                    />
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Location Type</Form.Label>
                    <Form.Control
                      as="select"
                      defaultValue={this.props.locData.loctype}
                      onChange={(e) => {
                        this.setState({ loctypeUpdate: e.target.value });
                      }}
                    >
                      <option>lecture hall</option>
                      <option>tutorial room</option>
                      <option>offices</option>
                      <option>lab</option>

                    </Form.Control>
                  </Form.Group>
                </Row>


                <Row>
                  <Form.Group as={Col}>
                    <Form.Label>Capacity</Form.Label>
                    <Form.Control
                      defaultValue={this.props.locData.capacity}
                      onChange={(e) => {
                        this.setState({ capacityUpdate: e.target.value });
                      }}
                    />
                  </Form.Group>
                </Row>

                <Row>
                  <Col md={{ offset: 2, span: 4 }}>
                    <Button
                      style={{ backgroundColor: "#007bff", color: "white" }}
                      onClick={() => {
                        this.handleUpdate(this.props.locData.locname);
                      }}
                    >
                      Update
                    </Button>
                  </Col>
                </Row>
              </Container>
            </Modal.Body>
          </Modal>
        </tr>



      </>
    );
  }
}
export default LocsRow;