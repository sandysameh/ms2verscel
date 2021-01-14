import React, { Component } from "react";
//import axios from "axios";
//import "sweetalert2/src/sweetalert2.scss";

//import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import MyAttendence from "./subComponents/myAttendence";
import { Row, Col, Form, Modal, Table, Container,ModalBody } from "react-bootstrap";

import Hrnavbar from './NavBars/hrnavbarattend'
import MonthYearPicker from 'react-month-year-picker';
import Swal from 'sweetalert2'
import axios from "axios";


import {
  Card,
  CardContent,
  CardHeader,
  Button,
  InputLabel
} from "@material-ui/core";
import Hrnavbarmisses from "./NavBars/hrnavbarmisses";
//import Missingmembers from "./subComponents/missingmembershrs";
import Missingmembershrs from "./subComponents/missingmembershrs";
import Missingmemdays from "./subComponents/missingmemdays";


class Misses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      misshrs: [],
      missday:[],
      month: 12,
      year: 2020,
      showattendence:false,
      showdays:false,
      showhrs:false
     // role:"" //from token
    };
  }
  closeAttendence() {
    this.setState({ showattendence: !this.state.showattendence });
  }
  closeDays() {
    this.setState({ showdays: !this.state.showdays });
  }
  closehrs() {
    this.setState({ showhrs: !this.state.showhrs });
  }
  async viewmissingdays(e) {
    this.setState({ showdays: !this.state.showdays });
     try {
        await axios({
          method: "put",
          url: process.env.REACT_APP_SERVER + "/members/missesdays",
          headers: {'auth-token': localStorage.getItem('auth-token') },
          data: {month:this.state.month,
          year:this.state.year},
        }).then((res) => {
          console.log("####" + res.data.output);
          //this.setState({Missingdays:res.data.missingdays})
        // Swal.fire('Your Missing days in :' + `${this.state.month}` + '/' + `${this.state.year}` + ' are : ' + `${res.data.missingdays}`)
  
          if (!res.data.msg) {
            //window.location.reload();
            this.setState({missday:res.data.output})
          } else {
              
            Swal.fire(res.data.msg);
          }
        });
      } catch (e) {
        console.log(e);
      }
  }
  async viewmissinghrs(e) {
    // this.setState({ showSlotLinking: !this.state.showSlotLinking });
     // const accesstoken =
     //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFjLTE1IiwidG9rZW5yb2xlIjoiQ291cnNlIGNvb3JkaW5hdG9yIiwiaWF0IjoxNjA4OTIzMTMxfQ.tSLFR5PXbFlDRqogpI2CggbqTDldRLUBMxlZ_0Z9pUI";
     this.setState({ showhrs: !this.state.showhrs });
     try {
        await axios({
          method: "put",
          url: process.env.REACT_APP_SERVER + "/members/misseshrs",
          headers: {'auth-token': localStorage.getItem('auth-token') },
          data: {month:this.state.month,
          year:this.state.year},
        }).then((res) => {
          console.log("####" + res.data.output);
          //this.setState({Missingdays:res.data.missingdays})
        // Swal.fire('Your Missing days in :' + `${this.state.month}` + '/' + `${this.state.year}` + ' are : ' + `${res.data.missingdays}`)
  
          if (!res.data.msg) {
            //window.location.reload();
            this.setState({misshrs:res.data.output})
          } else {
              
            Swal.fire(res.data.msg);
          }
        });
      } catch (e) {
        console.log(e);
      }}
     

  render() {
    return (
      <div>
        {/* <Membersnavbar /> */}
                        {/* Depending on ur role i will view the bar */}

      <Hrnavbarmisses/>

        <Container>

          <Row>

            <MonthYearPicker
              selectedMonth={this.state.month}
              selectedYear={this.state.year}
              minYear={2000}
              maxYear={2030}
              onChangeYear={year => this.setState({ year: year })}
              onChangeMonth={month => this.setState({ month: month })}
            //Calculate it here
            />
            {/* <h3>Selected month: {this.state.month}</h3>
        <h3>Selected year: {this.state.year}</h3> */}

          </Row>
          <br />

          <Row className="justify-content-md-center">
            <Col xs lg="2">
              <Button onClick={()=>{this.viewmissingdays()}}
                type="submit"
                style={{
                  backgroundColor: "#456268",
                  color: "white"
                }}
             
              >
                {" "}
                View Members with Missing Days
              </Button>{" "}
              <br />
            </Col>
            <Col xs lg="2">
                <Button onClick={()=>{this.viewmissinghrs()}}
                type="submit"
                style={{
                  backgroundColor: "#456268",
                  color: "white"
                }}
              >
                {" "}
                View Members with Missing hours
              </Button>{" "}
              <br />
            </Col>
            
          </Row>

          
          <Modal
            show={this.state.showhrs}
            centered
            onHide={() => this.closehrs()}>

            <ModalBody>
              <Table style={{ color: "black" }} responsive>
                <thead>
                  <tr style={{ textAlign: "center", background: "#456268", color: "white" }}>
                    <th key={0}> Name </th>
                    <th key={1}> E-mail</th>

                  </tr>
                </thead>



                <tbody>
                  {this.state.misshrs.map((elem, index) => {
                    return (

                      <Missingmembershrs misshrs={elem}
                        index={index} />

                    )
                  })

                  }
                </tbody>
              </Table>
            </ModalBody>

          </Modal>
          
          <Modal
            show={this.state.showdays}
            centered
            onHide={() => this.closeDays()}>

            <ModalBody>
              <Table style={{ color: "black" }} responsive>
                <thead>
                  <tr style={{ textAlign: "center", background: "#456268", color: "white" }}>
                    <th key={0}> Name </th>
                    <th key={1}> E-mail</th>

                  </tr>
                </thead>



                <tbody>
                  {this.state.missday.map((elem, index) => {
                    return (

                      <Missingmemdays missday={elem}
                        index={index} />

                    )
                  })

                  }
                </tbody>
              </Table>
            </ModalBody>

          </Modal>
          
        </Container>

      </div>
    );
  }
}
export default Misses;
