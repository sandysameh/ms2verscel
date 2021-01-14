import React, { Component } from "react";
//import axios from "axios";
//import "sweetalert2/src/sweetalert2.scss";

//import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import ScheduleRow from "./subComponents/ScheduleRow";
import RepRow from "./subComponents/RepRow";
import "./NavBars/bell.css";
import BellIcon from "react-bell-icon";
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

import {
  Card,
  CardContent,
  CardHeader,
  Button,
  InputLabel,
  Container,
} from "@material-ui/core";
import axios from "axios";
import AcademicMemberNav from "./NavBars/AcademicMemberNav";

class Schedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slotsData: [],
      replacementsData: [],
      displayCoordinator: "none",
      displayHOD: "none",
      displayInstructor : "none"
    };
  }

  async componentDidMount() {
    try {
    
      await axios({
        method: "get",
        url: process.env.REACT_APP_SERVER + "/viewMySchedule",
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
      
        console.log("####", res.data.allMySlots[1]);

        this.setState({ slotsData: res.data.allMySlots[0] });
        this.setState({ replacementsData: res.data.allMySlots[1] });
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

        <h5 style={{ textAlign: "center", backgroundColor: "#eeeeee" }}>
          My Schedule
        </h5>
        <Table style={{ color: "black" }} responsive>
          <thead>
            <tr
              style={{
                textAlign: "center",
                background: "#456268",
                color: "white",
              }}
            >
              <th key={0}> Day </th>
              <th key={1}> Slot </th>
              <th key={2}> type </th>
              <th key={3}> location </th>
              <th key={4}> Course </th>
            </tr>
          </thead>

          <tbody>
            {this.state.slotsData.map((elem, index) => {
              return <ScheduleRow slotsData={elem} index={index} key={index} />;
            })}
          </tbody>
        </Table>

        <h5 style={{ textAlign: "center", backgroundColor: "#eeeeee" }}>
          My Replacements
        </h5>
        <Table style={{ color: "black" }} responsive>
          <thead>
            <tr
              style={{
                textAlign: "center",
                background: "#456268",
                color: "white",
              }}
            >
              <th key={0}> Day </th>
              <th key={1}> Slot </th>
              <th key={2}> type </th>
              <th key={3}> location </th>
              <th key={4}> Course </th>
              <th key={5}> Replacement Date </th>
            </tr>
          </thead>

          <tbody>
            {this.state.replacementsData.map((elem, index) => {
              return (
                <RepRow replacementsData={elem} index={index} key={index} />
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}
export default Schedule;
