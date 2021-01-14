import React, { Component } from "react";
import axios from "axios";
//import "sweetalert2/src/sweetalert2.scss";

//import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import LeavesRow from "./subComponents/LeavesRow";
import DayoffRow from "./subComponents/DayoffRow";
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

import classnames from "classnames";

import AcademicMemberNav from "./NavBars/AcademicMemberNav";

class LeaveRequests extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayCoordinator: "none",
      displayHOD: "none",
      displayInstructor: "none",

      leaveData: [],
    };
  }

  async componentDidMount() {
    try {
      

      await axios({
        method: "get",
        url: process.env.REACT_APP_SERVER + "/viewHodRequests",
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
       
        console.log("####", res.data.Leave);
        this.setState({ leaveData: res.data.Leave });
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
        <Row>
          <Col sm="12">
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
                  <th key={1}> Sender ID </th>
                  <th key={2}> Sender name </th>
                  <th key={3}> Leave Date </th>
                  <th key={4}> Leave Type </th>
                  <th key={5}> Replacements </th>
                  <th key={6}> Status </th>
                  <th key={7}> </th>
                  <th key={8}> </th>
                </tr>
              </thead>

              <tbody>
                {this.state.leaveData.map((elem, index) => {
                  return (
                    <LeavesRow
                      leaveData={elem}
                      index={index}
                      key={index}
                      requestId={elem.id}
                    />
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </div>
    );
  }
}
export default LeaveRequests;
