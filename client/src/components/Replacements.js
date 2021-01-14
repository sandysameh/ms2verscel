import React, { Component } from "react";
//import axios from "axios";
//import "sweetalert2/src/sweetalert2.scss";

//import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import ReplacementsRow from "./subComponents/ReplacementsRow";

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

import "./NavBars/bell.css";
import BellIcon from "react-bell-icon";
import AcademicMemberNav from "./NavBars/AcademicMemberNav";
class Replacements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      repData: [],
      displayCoordinator: "unset",
      acceptModels: [],
      rejectModels: [],

      displayCoordinator: "none",
      displayHOD: "none",
      displayInstructor: "none",
    };
  }

  async componentDidMount() {
    try {
      await axios({
        method: "get",
        url: process.env.REACT_APP_SERVER + "/viewReceivedReplacements",
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

        console.log("####", res.data.myRequests);
        this.setState({ repData: res.data.myRequests });
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

        <Table style={{ color: "black" }} responsive>
          <thead>
            <tr
              style={{
                textAlign: "center",
                background: "#456268",
                color: "white"
              }}
            >
              <th key={0}> Request ID </th>
              <th key={1}> Sender ID </th>
              <th key={2}> Date </th>
              <th key={3}> Slot Time </th>
              <th key={4}> Slot Day </th>
              <th key={5}> Course </th>
              <th key={6}> Status </th>
              <th key={7}> </th>
              <th key={8}> </th>
            </tr>
          </thead>

          <tbody>
            {this.state.repData.map((elem, index) => {
              return (
                <ReplacementsRow
                  repData={elem}
                  index={index}
                  key={index}
                  requestId={elem.id}
                />
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}
export default Replacements;
