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
import axios from "axios";

class Replacements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: false,
    };
  }

  acceptReplacement(e) {
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
            url: process.env.REACT_APP_SERVER + "/acceptReplacemant",
            headers: { "auth-token": localStorage.getItem("auth-token") },

            data: {
              requestId: this.props.requestId,
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
  rejectReplacement(e) {
    Swal.fire({
      title: "Are you sure you want to reject this?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reject it!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axios({
            method: "put",
            url: process.env.REACT_APP_SERVER + "/rejectReplacemant",
            headers: { "auth-token": localStorage.getItem("auth-token") },
            data: {
              requestId: this.props.requestId,
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

  render() {
    return (
      <tr
        style={{
          textAlign: "center",
          backgroundColor: this.props.index % 2 == 0 ? "#cfd3ce" : "#eeeeee"
        }}
      >
        <td> {this.props.repData.id}</td>
        <td> {this.props.repData.sender.id}</td>
        <td> {this.props.repData.date}</td>
        <td>{this.props.repData.slottime} </td>

        <td>{this.props.repData.weekday} </td>
        <td>{this.props.repData.course.id} </td>
        <td>{this.props.repData.status} </td>
        <td>
          {" "}
          <Button
            type="submit"
            style={{
              backgroundColor: "#456268",

              color: "white",
            }}
            onClick={(e) => this.acceptReplacement(e)}
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
            onClick={() => this.rejectReplacement()}
          >
            {" "}
            Reject
          </Button>{" "}
        </td>
      </tr>
    );
  }
}
export default Replacements;
