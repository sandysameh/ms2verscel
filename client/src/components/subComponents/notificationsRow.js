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

class NotificationsRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
        display:false
    };
  }
//   handleAccept() {
//     Swal.fire({
//       title: "Are you sure you want to accept this?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, accept it!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         Swal.fire("Accepted!", " Request has been accpeted .", "success");
//       }
//     });
//   }
//   handleReject() {
//     Swal.fire({
//       title: "Are you sure you want to reject this ?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, reject it!",
//     }).then((result) => {
//       if (result.isConfirmed) {
          
//         Swal.fire("Rejected!", "Request has been rejected.", "success");
//       }
//     });

//   }
//   handleClick(){
//       console.log('yeahh')
//   }

  render() {
    return (
     
        
          <tr
            style={{
              textAlign: "center",
              backgroundColor:
                this.props.index % 2 == 0 ? "#cfd3ce" : "#eeeeee",
            }}
          >
             
          
             <td> {this.props.repData} </td>
          
        
            
        
          </tr>
        
        
      
    );
  }
}
export default NotificationsRow;
