import React, { Component } from "react";
//import axios from "axios";
//import "sweetalert2/src/sweetalert2.scss";

//import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import MyAttendence from "./subComponents/myAttendence";
import {
  Row,
  Col,
  Form,
  Modal,
  Table,
  Container,
  ModalBody,
} from "react-bootstrap";

import Hrnavbar from "./NavBars/hrnavbarattend";
import MonthYearPicker from "react-month-year-picker";
import Swal from "sweetalert2";
import axios from "axios";

import {
  Card,
  CardContent,
  CardHeader,
  Button,
  InputLabel,
} from "@material-ui/core";

class Viewhrattendence extends Component {
  constructor(props) {
    super(props);
    this.state = {
      repData: [],
      month: 12,
      year: 2020,
      Missingdays: 0,
      Missinghrs: 0,
      showattendence: false,
      Missingdaydeduction: 0,
      Missinghrsdeduction: 0,
      Missingminsdeduction: 0,
      calchrs: 0,
      salary: 0, //get it from the user,
      salaryatend: 0, //will be calculated
      // role:"" //from token
    };
  }
  closeAttendence() {
    this.setState({ showattendence: !this.state.showattendence });
  }

  async viewAttendence() {
    //console.log(this.state.month)
    try {
      await axios({
        method: "put",
        url: process.env.REACT_APP_SERVER + "/viewAttendence",
        headers: { "auth-token": localStorage.getItem("auth-token") },
        data: {
          month: this.state.month,
          year: this.state.year,
        },
      }).then((res) => {
        this.closeAttendence();
        this.setState({ repData: res.data.joined });

        if (res.status === 400) {
          Swal.fire(res.data.msg);
        }

        if (!res.data.msg) {
          console.log("here");

          //   window.location.reload();
        } else {
          Swal.fire(res.data.msg);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  async viewSalary(e) {
    try {
      await axios({
        method: "put",
        url: process.env.REACT_APP_SERVER + "/helpsalary",
        headers: { "auth-token": localStorage.getItem("auth-token") },
        data: { month: this.state.month, year: this.state.year },
      }).then((res) => {
        // console.log("##hrs##" + res.data.output[0]);
        // console.log("##days##" + res.data.output[1]);
        // console.log("##salary##" + res.data.output[2]);

        //  Swal.fire('Your Missing days in :' + `${this.state.month}` + '/' + `${this.state.year}` + ' are : ' + `${res.data.missingdays}`)

        if (res.data.msg) {
          Swal.fire(res.data.msg);
        } else {
          console.log("here");
          if (res.data.output[1] > 0) {
            //  console.log("here")
            //if my missing days are greater than 0
            this.setState({
              Missingdaydeduction:
                res.data.output[1] * (res.data.output[2] / 60),
            });
            //salary=salary
            console.log(this.state.Missingdaydeduction);
          }
          if (res.data.output[0] < 0) {
            //if my missing hrs in mins is negative ya3nie 3andie missing hrs
            this.setState({ calchrs: res.data.output[0] * -1 - 179 }); //if u have hrs =2:59 then i am going to calculate ba3d keda
            console.log(this.state.calchrs);
            if (this.state.calchrs > 0) {
              //law a3t aktar men 2 hr 59 mins
              this.setState({
                Missinghrsdeduction:
                  Math.floor(this.state.calchrs / 60) *
                  (res.data.output[2] / 180),
              });
              this.setState({
                Missingminsdeduction:
                  (this.state.calchrs % 60) * (res.data.output[2] / 10800),
              });
              console.log(
                Math.floor(this.state.calchrs / 60) +
                  "daydayday" +
                  this.state.Missinghrsdeduction
              );
              console.log("minminmin" + this.state.Missingminsdeduction);
            }
          }
          this.setState({
            salary:
              res.data.output[2] -
              this.state.Missingdaydeduction -
              this.state.Missinghrsdeduction -
              this.state.Missingminsdeduction,
          });
          Swal.fire(
            "My Salary in" +
              this.state.month +
              "/" +
              this.state.year +
              " is " +
              this.state.salary
          );

          //window.location.reload();
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  async viewmissingdays(e) {
    // this.setState({ showSlotLinking: !this.state.showSlotLinking });
    // const accesstoken =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFjLTE1IiwidG9rZW5yb2xlIjoiQ291cnNlIGNvb3JkaW5hdG9yIiwiaWF0IjoxNjA4OTIzMTMxfQ.tSLFR5PXbFlDRqogpI2CggbqTDldRLUBMxlZ_0Z9pUI";

    try {
      await axios({
        method: "put",
        url: process.env.REACT_APP_SERVER + "/viewMissingDays",
        headers: { "auth-token": localStorage.getItem("auth-token") },
        data: {
          month: this.state.month,
          year: this.state.year,
        },
      }).then((res) => {
        console.log("####" + res.data.missingdays);
        this.setState({ Missingdays: res.data.missingdays });
        Swal.fire(
          "Your Missing days in :" +
            `${this.state.month}` +
            "/" +
            `${this.state.year}` +
            " are : " +
            `${res.data.missingdays}`
        );

        if (!res.data.msg) {
          //window.location.reload();
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

    try {
      await axios({
        method: "put",
        url: process.env.REACT_APP_SERVER + "/viewMissinghrs",
        headers: { "auth-token": localStorage.getItem("auth-token") },
        data: {
          month: this.state.month,
          year: this.state.year,
        },
      }).then((res) => {
        console.log("####" + res.data.mymissinghrs);
        this.setState({ Missinghrs: res.data.mymissinghrs });
        if (res.data.mymissinghrs > 0) {
          Swal.fire(
            "Extra hrs In " +
              `${this.state.month}` +
              "/" +
              `${this.state.year}` +
              " are : " +
              Math.floor(res.data.mymissinghrs / 60) +
              ":" +
              (res.data.mymissinghrs % 60)
          );
        } else {
          let x = 0;
          x = res.data.mymissinghrs * -1;
          Swal.fire(
            "Missin hrs In " +
              `${this.state.month}` +
              "/" +
              `${this.state.year}` +
              " are : " +
              Math.floor(x / 60) +
              ":" +
              (x % 60)
          );
        }
        //  this.setState({Missingdays:res.data.missingdays})
        // Swal.fire('Your Missing days in month :' + `${this.state.month}` + ' year : ' + `${this.state.year}` + ' are : ' + `${res.data.missingdays}`)

        if (!res.data.msg) {
          //window.location.reload();
        } else {
          Swal.fire(res.data.msg);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <div>
        {/* <Membersnavbar /> */}
        {/* Depending on ur role i will view the bar */}

        <Hrnavbar />

        <Container>
          <Row>
            <MonthYearPicker
              selectedMonth={this.state.month}
              selectedYear={this.state.year}
              minYear={2000}
              maxYear={2030}
              onChangeYear={(year) => this.setState({ year: year })}
              onChangeMonth={(month) => this.setState({ month: month })}
              //Calculate it here
            />
            {/* <h3>Selected month: {this.state.month}</h3>
        <h3>Selected year: {this.state.year}</h3> */}
          </Row>
          <br />

          <Row className="justify-content-md-center">
            <Col md="6" lg="2">
              <Button
                onClick={() => {
                  this.viewmissingdays();
                }}
                type="submit"
                style={{
                  backgroundColor: "#456268",
                  color: "white",
                }}
              >
                {" "}
                View Missing Days
              </Button>{" "}
              <br />
            </Col>
            <br />
            <br />
            <Col md="6" lg="2">
              <Button
                onClick={() => {
                  this.viewmissinghrs();
                }}
                type="submit"
                style={{
                  backgroundColor: "#456268",
                  color: "white",
                }}
              >
                {" "}
                View Missing hours
              </Button>{" "}
              <br />
            </Col>
            <br />
            <br />
            <Col md="6" lg="2">
              <Button
                onClick={() => {
                  this.viewAttendence();
                }}
                type="submit"
                style={{
                  backgroundColor: "#456268",
                  color: "white",
                }}
              >
                {" "}
                View My Attendence
              </Button>{" "}
              <br />
            </Col>
            <br />
            <br />
            <Col md="6" lg="2">
              <Button
                onClick={() => {
                  this.viewSalary();
                }}
                type="submit"
                style={{
                  backgroundColor: "#456268",
                  color: "white",
                }}
              >
                {" "}
                Current Salary
              </Button>{" "}
              <br />
            </Col>
          </Row>
          <Modal
            show={this.state.showattendence}
            centered
            onHide={() => this.closeAttendence()}
          >
            <ModalBody>
              <Table style={{ color: "black" }} responsive>
                <thead>
                  <tr
                    style={{
                      textAlign: "center",
                      background: "#456268",
                      color: "white",
                    }}
                  >
                    <th key={0}> SignType </th>
                    <th key={1}> Date/Time</th>
                  </tr>
                </thead>

                <tbody>
                  {this.state.repData.map((elem, index) => {
                    return <MyAttendence repData={elem} index={index} />;
                  })}
                </tbody>
              </Table>
            </ModalBody>
          </Modal>
          {/* 
          <Table style={{ color: "black" }} responsive show={this.state.showattendence}>
            <thead>
              <tr style={{ textAlign: "center", background: "#456268", color: "white" }}>
                <th key={0}> SignType </th>
                <th key={1}> Date/Time</th>

              </tr>
            </thead>



            <tbody>
            
              {this.state.repData.map((elem, index) => {
                return (
                    
                  <MyAttendence repData={elem}
                    index={index} />
                    

                )
              })

              }
            </tbody>
          </Table> */}
        </Container>
      </div>
    );
  }
}
export default Viewhrattendence;
