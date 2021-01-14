import React, { Component } from "react";
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

import ManageCourseRow from "./subComponents/ManageCourseRow";
import axios from "axios";

import {
  Card,
  CardContent,
  CardHeader,
  Button,
  InputLabel,
} from "@material-ui/core";
import AcademicMemberNav from "./NavBars/AcademicMemberNav";

class ManageCourses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseData: [],
      displayCoordinator: "none",
      displayHOD: "none",
      displayInstructor: "none",
    };
  }

  // handleAdd(e) {
  //     console.log(this.state.Courseid);
  //     console.log(this.state.Coursename);
  //     console.log(this.state.Coursedeps);
  //     this.setState({ showCourse: !this.state.showCourse });

  // }

  async componentDidMount() {
    try {
      await axios({
        method: "get",
        url: process.env.REACT_APP_SERVER + "/viewdepartmentcourses",
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
        console.log("####", res.data.depcourses);
        this.setState({ courseData: res.data.depcourses });
      });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <>
        <AcademicMemberNav
          displayHOD={this.state.displayHOD}
          displayCoordinator={this.state.displayCoordinator}
          displayInstructor={this.state.displayInstructor}
        />

        <Table style={{ color: "black", height: "400px" }} responsive>
          <thead>
            <tr
              style={{
                textAlign: "center",
                background: "#456268",
                color: "white",
              }}
            >
              <th key={0}> Course ID </th>
              <th key={1}> Course Name</th>

              <th key={2}> </th>
            </tr>
          </thead>

          <tbody>
            {this.state.courseData.map((elem, index) => {
              return (
                <ManageCourseRow courseData={elem} index={index} key={index} />
              );
            })}
          </tbody>
        </Table>
      </>
    );
  }
}

export default ManageCourses;
