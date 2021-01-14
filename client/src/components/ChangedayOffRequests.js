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

class ChangedayOffRequests extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayCoordinator: "none",
      displayHOD: "none",
      displayInstructor: "none",
      dayoffdata: [],
  
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
        
        console.log("####", res.data.dayoffdata);
        this.setState({ dayoffdata: res.data.Changedayoff });
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
                  <th key={3}> New Day Off </th>
                  <th key={4}> Reason </th>
                  <th key={5}> Status </th>
                  <th key={6}> </th>
                  <th key={7}> </th>
                </tr>
              </thead>

              <tbody>
                {this.state.dayoffdata.map((elem, index) => {
                  return (
                    <DayoffRow
                      dayoffdata={elem}
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
export default ChangedayOffRequests;
