import React, { Component } from "react";
//import axios from "axios";
import "sweetalert2/src/sweetalert2.scss";
import {
  Container,
  Row,
  Col,
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Progress,
  Table,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import axios from "axios";

import Swal from "sweetalert2/dist/sweetalert2.js";
//import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";

class Slotrowinstructor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      teachingid: "",
    };
  }

  handleModel() {
    this.setState({ show: !this.state.show });
    this.setState({ teachingid: "" });
  }

  async assign(id) {
    this.setState({ show: !this.state.show });

    console.log(this.state.teachingid);
    console.log(id);

    try {
      await axios({
        method: "post",
        url:
          process.env.REACT_APP_SERVER +
          "/assignslot/" +
          this.state.teachingid +
          "/" +
          id,
        headers: { "auth-token": localStorage.getItem("auth-token") },
      }).then((res) => {
        ///////////////hewar el message

        if (!res.data.msg) {
          Swal.fire(
            "Academic member is assgined this slot",
            "",
            "success"
          ).then(function () {
            window.location.reload();
          });
          //window.location.reload();
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: res.data.msg,
          });
        }
      });
    } catch (e) {
      console.log(e);
    }

    // id slot we teaching id
  }

  render() {
    let button;
    if (!this.props.slotsData.teachingid) {
      button = (
        <Button
          type="submit"
          style={{ backgroundColor: "#456268", color: "white" }}
          onClick={() => this.handleModel()}
        >
          Assign This Slot
        </Button>
      );
    }

    let v;
    let v2;
    if (this.props.slotsData.teachingid == undefined) {
      v = "not assigned";
      v2 = "not assigned";
    } else {
      v = this.props.slotsData.teachingid.id;
      v2 = this.props.slotsData.teachingid.name;
    }

    return (
      <tr
        style={{
          textAlign: "center",
          backgroundColor: this.props.index % 2 == 0 ? "#cfd3ce" : "#eeeeee",
        }}
      >
        <td> {this.props.slotsData.id}</td>

        <td> {this.props.slotsData.slotday}</td>
        <td>{this.props.slotsData.slottime} </td>

        <td>{this.props.slotsData.slottype} </td>
        <td>{this.props.slotsData.location.locname} </td>
        <td>{v2} </td>
        <td>{v} </td>

        <td>{button}</td>

        <Modal
          isOpen={this.state.show}
          fade={false}
          onHide={() => this.handleModel()}
          size="lg"
        >
          <ModalHeader
            close={
              <button className="close" onClick={() => this.handleModel()}>
                {" "}
                &times;
              </button>
            }
          >
            {" "}
            Assign Slot{" "}
          </ModalHeader>
          <ModalBody style={{ padding: "80px" }}>
            <FormGroup>
              <Label for="teachingid">
                {" "}
                PLease Enter The ID of academic member{" "}
              </Label>
              <Input
                type="text"
                id="teachingid"
                onChange={(e) => {
                  this.setState({ teachingid: e.target.value });
                }}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => this.assign(this.props.slotsData.id)}
              color="success"
            >
              Submit
            </Button>
            <Button onClick={() => this.handleModel()} color="danger">
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </tr>
    );
  }
}
export default Slotrowinstructor;
