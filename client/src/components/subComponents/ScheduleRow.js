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

class ScheduleRow extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <tr
        style={{
          textAlign: "center",
          backgroundColor: this.props.index % 2 == 0 ? "#cfd3ce" : "#eeeeee",
        }}
      >
        <td> {this.props.slotsData.slotday}</td>
        <td> {this.props.slotsData.slottime}</td>
        <td> {this.props.slotsData.slottype}</td>
        <td>{this.props.slotsData.location.locname} </td>

        <td>{this.props.slotsData.courseId.id} </td>
      </tr>
    );
  }
}
export default ScheduleRow;
