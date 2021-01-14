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
      repID: "",
      repreceiver: "",
      repslottime: "",
      repweekday: "",
      repcourse: "",
      repstatus: "",
      show: false,
    };
  }

  async viewReplacement(e) {
    try {
      console.log(e);
      var id = String(e)
      

      this.setState({ show: !this.state.show });

      await axios({
        method: "put",
        url: process.env.REACT_APP_SERVER + "/viewreplacementbyid",
        headers: { "auth-token": localStorage.getItem("auth-token") },
        data: {
          requestid:  e ,
        },
      }).then((res) => {
        if (!res.data.msg) {

         
          this.setState({ repID: res.data.request.id });
          this.setState({ repreceiver: res.data.request.receiver.id });
          this.setState({ repslottime: res.data.request.slottime });
          this.setState({ repweekday: res.data.request.weekday });
          this.setState({ repcourse: res.data.request.course.id });
          this.setState({ repstatus: res.data.request.status });
          


        } else {
          this.setState({ show: !this.state.show });
          Swal.fire({
            text: res.data.msg,
            cancelButtonText: "OK",
            showConfirmButton: true,
            cancelButtonColor: "#007bff",
          });
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  cancelRequest(e) {
    Swal.fire({
      title: "Are you sure you want to cancel this?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axios({
            method: "delete",
            url: process.env.REACT_APP_SERVER + "/cancelRequest",
            headers: { "auth-token": localStorage.getItem("auth-token") },
            data: {
              requestId: this.props.requestId,
            },
          }).then((res) => {
            console.log(res.data);
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
          backgroundColor: this.props.index % 2 == 0 ? "#cfd3ce" : "#eeeeee",
        }}
      >
        <td> {this.props.reqData.id}</td>
        <td>
          {" "}
          {this.props.reqData.reqtype}
          <br></br>
          {this.props.reqData.leavetype}{" "}
        </td>
        <td> {this.props.reqData.date}</td>
        <td>{this.props.reqData.compensationDate} </td>

        <td>
          {this.props.reqData.weekday} {this.props.reqData.slottime}{" "}
        </td>
        <td>
          {this.props.reqData.course == undefined
            ? " "
            : this.props.reqData.course.id}{" "}
          {this.props.reqData.slottype}{" "}
        </td>
        <td>
          {this.props.reqData.status}

          <br></br>

          {this.props.reqData.comment == undefined
            ? " "
            : this.props.reqData.comment}
        </td>
        <td>{this.props.reqData.reason} </td>
        <td>{this.props.reqData.document} </td>

        <td>
          {this.props.reqData.replacements.map((e, i) => {
            return (
              <td>
                <div
                  style={{ color: "blue", textDecoration: "underline" }}
                  onClick={() => this.viewReplacement(e)}
                >
                  {e}
                </div>
              </td>
            );
          })}
        </td>
        <td>{this.props.reqData.receiver.id} </td>

        <td>
          {" "}
          <Button
            type="submit"
            style={{
              backgroundColor: "#456268",

              color: "white",
            }}
            onClick={() => this.cancelRequest()}
          >
            {" "}
            Cancel
          </Button>{" "}
        </td>

        <Modal
          show={this.state.show}
          centered
          onHide={(e) => this.setState({ show: !this.state.show })}
          size="lg"
        >
          <Modal.Header closeButton>
            <h4> Replacement Id {this.state.repID}</h4>
          </Modal.Header>
          <Modal.Body>
            <Table responsive>
              <thead>
                <tr style={{ textAlign: "center", fontSize: "18px" }}>
                  <th key={0}> Receiver </th>
                  <th key={1}> Slot Time </th>
                  <th key={2}> Slot Day </th>
                  <th key={3}> Course </th>
                  <th key={4}> Status </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  style={{
                    textAlign: "center",
                    backgroundColor: "#eeeeee",
                  }}
                >
                  <td>{this.state.repreceiver}</td>
                  <td>{this.state.repslottime}</td>
                  <td>{this.state.repweekday}</td>
                  <td>{this.state.repcourse}</td>
                  <td>{this.state.repstatus}</td>
                </tr>
              </tbody>
            </Table>
          </Modal.Body>
        </Modal>
      </tr>
    );
  }
}
export default Replacements;
