import React, { Component } from "react";
//import axios from "axios";
//import "sweetalert2/src/sweetalert2.scss";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
//import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import { Row, Col, Form, Modal, Table } from "react-bootstrap";
import axios from "axios";

import {
  Card,
  CardContent,
  CardHeader,
  Button,
  InputLabel,
  Container,
} from "@material-ui/core";

class DepsRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      depnameUpdate: "",
      depfacultyUpdate: "",
      depheadUpdate: "",
      showUpdatedep : false
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
            url: process.env.REACT_APP_SERVER + "/departments/" + name,
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
    this.setState({showUpdatedep : !this.state.showUpdatedep})
    this.setState({ depnameUpdate: ""});
    this.setState({ depfacultyUpdate: this.props.depData.faculty.name});
  //  this.setState({ depheadUpdate: ""});
  }






  async handleUpdate(name){
    this.setState({showUpdatedep : !this.state.showUpdatedep})
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
            url: process.env.REACT_APP_SERVER + "/departments/" + name,
            headers: { 'auth-token': localStorage.getItem('auth-token') },
            data: {
              name: this.state.depnameUpdate,
      facultyname:this.state.depfacultyUpdate
             
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
    console.log(this.state.depnameUpdate);
    console.log(this.state.depfacultyUpdate);
    console.log(this.state.depheadUpdate);


  }

  render() {
    return (
     

     
          <tr
            style={{
              textAlign: "center",
               backgroundColor: this.props.index % 2 == 0 ? "#cfd3ce" : "#eeeeee",
            }}
          >
            <td> {this.props.depData.name}</td>
            <td> {this.props.depData.faculty.name}</td>
            {(this.props.depData.head===undefined)?<td></td>:<td> {this.props.depData.head.name}</td>}
            {/* <td> {this.props.depData.head.name}</td> */}
          
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
                onClick={() => this.handleDelete(this.props.depData.name)}
              >
                {" "}
                Delete
              </Button>{" "}
            </td>
            <Modal
            show={this.state.showUpdatedep}
            centered
            onHide={() => this.addLoc()}
          >
            <Modal.Header closeButton>
              <h4 style={{ textAlign: "center" }}>Update Department</h4>
            </Modal.Header>
            <Modal.Body>
              <Container>
                
              
              <Row>
                  <Form.Group as={Col}>
                    <Form.Label>Department Name</Form.Label>
                    <Form.Control
                      defaultValue={this.props.depData.name}
                      onChange={(e) => {
                        this.setState({ depnameUpdate: e.target.value });
                      }}

                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Faculty</Form.Label>
                    <Form.Control
                      defaultValue={this.props.depData.faculty.name}
                      onChange={(e) => {
                        this.setState({ depfacultyUpdate: e.target.value });
                      }}

                    />
                  </Form.Group>
  
                  
                </Row>
               
               
              <Row>
                  <Form.Group as={Col}>
                    <Form.Label>Head  can only assign head through update member's role" </Form.Label>
                    
                  </Form.Group>
                  </Row>
                
                <Row>
                  <Col md={{ offset: 2, span: 4 }}>
                    <Button
                      style={{ backgroundColor: "#007bff", color: "white" }}
                      onClick={() => {
                        this.handleUpdate(this.props.depData.name);
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
        
    );
  }
}
export default DepsRow;