import React, { Component } from "react";
//import axios from "axios";
//import "sweetalert2/src/sweetalert2.scss";

//import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import { Row, Col, Form, Modal, Table } from "react-bootstrap";

import {
  Card,
  CardContent,
  CardHeader,
  Button,
  InputLabel,
  Container,
} from "@material-ui/core";

class MyAttendence extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
     

     
          <tr
            style={{
              textAlign: "center",
               backgroundColor: this.props.index % 2 == 0 ? "#cfd3ce" : "#eeeeee",
            }}
          >
            
            <td> {this.props.repData.signtype}</td>
            <td> {this.props.repData.created}</td>
            
            
          </tr>
        
    );
  }
}
export default MyAttendence;
