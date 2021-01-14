import React, { Component } from "react";
//import axios from "axios";
//import "sweetalert2/src/sweetalert2.scss";

//import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import { Row, Col, Form, Modal, Table } from "react-bootstrap";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import DropdownMultiselect from "react-multiselect-dropdown-bootstrap";
import axios from "axios";

import {
  Card,
  CardContent,
  CardHeader,
  Button,
  InputLabel,
  Container,
} from "@material-ui/core";

class courseRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CourseidUpdate: "",
      CoursenameUpdate: "",
      CoursedepsUpdate:[],
      showCourseUpdate: false,
    };
  }
  async handleDelete(id) {

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
            url: process.env.REACT_APP_SERVER + "/courses/" + id,
            headers: { 'auth-token': localStorage.getItem('auth-token') },
            data: {},
          }).then((res) => {
            console.log(id)
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
    this.setState({showCourseUpdate : !this.state.showCourseUpdate})
    this.setState({ CourseidUpdate: ""});
    this.setState({ CoursenameUpdate: this.props.courseData.name});
    let x=[] 
    {this.props.courseData.departments.map((e)=>{x.push(e.name)})}
    //console.log(x)
    this.setState({ CoursedepsUpdate:x});
  }
  async handleUpdate(id){
    
  
    this.setState({showCourseUpdate : !this.state.showCourseUpdate})
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
            url: process.env.REACT_APP_SERVER + "/courses/" + id,
            headers: { 'auth-token': localStorage.getItem('auth-token') },
            data: {
              id:this.state.CourseidUpdate,
              name:this.state.CoursenameUpdate,
              departments_course:this.state.CoursedepsUpdate
            },
          }).then((res) => {
            console.log("my id "+id)
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
    console.log(this.state.CourseidUpdate);
    console.log(this.state.CoursenameUpdate);
    console.log(this.state.CoursedepsUpdate);


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
            <td> {this.props.courseData.departments.map((e)=>{
              return <td>{e.name}</td>
            })}</td>
            
          
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
                onClick={() => this.handleDelete(this.props.courseData.id)}
              >
                {" "}
                Delete
              </Button>{" "}
            </td>
            <Modal
            show={this.state.showCourseUpdate}
            centered
            onHide={() => this.addLoc()}
          >
            <Modal.Header closeButton>
              <h4 style={{ textAlign: "center" }}>Update Course</h4>
            </Modal.Header>
            <Modal.Body>
              <Container>
                
              
              <Row>
                  <Form.Group as={Col}>
                    <Form.Label>Course ID</Form.Label>
                    <Form.Control
                      defaultValue={this.props.courseData.id}
                      onChange={(e) => {
                        this.setState({ CourseidUpdate: e.target.value });
                      }}
                    />
                  </Form.Group>
  
                  <Form.Group as={Col}>
                    <Form.Label>Course Name</Form.Label>
                    <Form.Control
                       defaultValue={this.props.courseData.name}
                      onChange={(e) => {
                        this.setState({ CoursenameUpdate: e.target.value });
                      }}
                    />
                  </Form.Group>
                </Row>
                <Row>
                <Form.Group as={Col}>
                    <Form.Label>Departments</Form.Label>
                    <DropdownMultiselect
                    selected={this.state.CoursedepsUpdate}
                    options={this.props.Course_departments.map((elem, index) => {
                      return elem.name ;
                    })}

                    name = "Departments"
                    handleOnChange={(selected) => {
                      this.setState({ CoursedepsUpdate: selected });
                      }}
                    placeholder ="Choose Departments.."
                     
                  />
                  </Form.Group>

                </Row>
               
             
                
                <Row>
                  <Col md={{ offset: 2, span: 4 }}>
                    <Button
                      style={{ backgroundColor: "#007bff", color: "white" }}
                      onClick={() => {
                        this.handleUpdate(this.props.courseData.id);
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
export default courseRow;