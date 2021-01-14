import React, { Component } from "react";
import axios from "axios";
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

class SlotLinkingRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
        display:false
    };
  }
 
  acceptSlotLinking(e) {
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
            method: "post",
            url: process.env.REACT_APP_SERVER + "/acceptslotlinking",
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
  rejectSlotLinking(e) {
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
            method: "post",
            url: process.env.REACT_APP_SERVER + "/rejectslotlinking",
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
              backgroundColor:
                this.props.index % 2 == 0 ? "#cfd3ce" : "#eeeeee",
            }}
          >
            <td> {this.props.slotData.id}</td>
            <td> {this.props.slotData.sender.id}</td>
            <td> {this.props.slotData.slottime}</td>
            <td>{this.props.slotData.weekday} </td>

            <td>{this.props.slotData.slottype} </td>
            <td>{this.props.slotData.course.id} </td>
            <td>{this.props.slotData.status} </td>
            <td>
              {" "}
              <Button
                type="submit"
                style={{
                  backgroundColor: "#456268",

                  color: "white",
                }}
                onClick={() => this.acceptSlotLinking()}
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
                onClick={() => this.rejectSlotLinking()}
              >
                {" "}
                Reject
              </Button>{" "}
            </td>
          </tr>
        
        
      
    );
  }
}
export default SlotLinkingRow;
