import React, { Component } from "react";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavbarToggler,
  Collapse,
  NavItem,
  Jumbotron,
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Card,
  CardBody,
  Row,
  Col,
} from "reactstrap";
import axios from "axios";
import { swal } from "sweetalert2/dist/sweetalert2";
import Swal from "sweetalert2";
import { Container, Modal } from "react-bootstrap";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      msg: "",
      showreset: false,
      oldpassword: "",
      newpassword: "",
      passwordcheck: "",
    };
  }
  async handlereset(e) {
    console.log("hereeeeee");
    e.preventDefault();
    try {
      await axios({
        method: "put",
        url: process.env.REACT_APP_SERVER + "/resetFirstPassword",

        data: {
          email: this.state.email,
          oldPassword: this.state.oldpassword,
          newPassword: this.state.newpassword,
          passwordCheck: this.state.passwordcheck,
        },
      }).then((res) => {
        // if (res.status === 400) {
        //     Swal.fire(res.data.msg)
        //   }

        if (!res.data.msg) {
          window.location.reload();
          localStorage.setItem("auth-token", res.data.token);
          localStorage.setItem("tokenrole", res.data.tokenrole);
          console.log(res.data.token);
          console.log(res.data.tokenrole);

          if (res.data.tokenrole === "HR") {
            window.location.href = "/viewhrprofile";
          } else {
            window.location.href = "/viewmyprofile";
          }
        } else {
          Swal.fire(res.data.msg);
        }
      });
    } catch (e) {
      console.log(e);
      Swal.fire(e);
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    try {
      await axios({
        method: "post",
        url: process.env.REACT_APP_SERVER + "/login",

        data: {
          email: this.state.email,
          password: this.state.password,
        },
      }).then((res) => {
        // if (res.status === 400) {
        //     Swal.fire(res.data.msg)
        //   }
        if (
          res.data.msg ===
          "This is your Firsttime logging in please reset your password"
        ) {
          //Swal.fire("sandoraaa")
          this.setState({ showreset: true });
        } else {
          if (!res.data.msg) {
            //  window.location.reload();
            localStorage.setItem("auth-token", res.data.token);
            localStorage.setItem("tokenrole", res.data.tokenrole);
            console.log(res.data.token);
            console.log(res.data.tokenrole);

            if (res.data.tokenrole === "HR") {
              window.location.href = "/viewhrprofile";
            } else {
              window.location.href = "/viewmyprofile";
            }
          } else {
            Swal.fire(res.data.msg);
          }
        }
      });
    } catch (e) {
      console.log(e);
      Swal.fire(e);
    }
  }
  // const handleSubmit = async e=>{
  //     e.preventDefault();
  //     // console.log("handler pass " + password)

  //     axios.post('http://localhost:5000/login',{
  //     email: email,
  //     password: password
  // })
  // .then(res =>{
  //     setColour("teal")
  //     localStorage.setItem('auth-token', res.data.token)
  //     if(res.data.type == "HOD"){
  //     window.location.href = "/HODHomePage";
  //   }
  //   else if(res.data.type == "TA"){
  //     window.location.href = "/TAHomePage";

  //   }
  //   else if(res.data.type == "CI"){
  //     window.location.href = "/CIHomePage";

  //   }

  //   else if(res.data.type == "CC"){
  //     window.location.href = "/CCHomePage";

  //   }
  //   else {
  //     window.location.href = "/HRHomePage";

  //   }
  // })
  // .catch((error) =>{
  //     // console.log("e: "+error.response.data.message)
  //     setColour("tomato")
  //     setMessage(error.response.data.message)
  // })
  // }

  render() {
    return (
      //  <Modal></Modal>
      <div>
        <Row>
          <Col md={{ size: 6, offset: 3 }}>
            <Card>
              <CardBody>
                {/* <Row>

                        <Col > */}

                <Form>
                  <FormGroup>
                    <Label htmlFor="username">Email</Label>
                    <Input
                      onChange={(e) => {
                        this.setState({ email: e.target.value });
                      }}
                      type="text"
                      id="username"
                      name="email"
                      //innerRef={(input) => this.username = input}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      onChange={(e) => {
                        this.setState({ password: e.target.value });
                      }}
                      type="password"
                      id="password"
                      name="password"
                      // innerRef={(input) => this.password = input}
                    />
                  </FormGroup>

                  <Button
                    type="submit"
                    onClick={(e) => this.handleSubmit(e)}
                    value="submit"
                    color="primary"
                  >
                    Login
                  </Button>
                </Form>
                {/* </Col>
                    </Row> */}
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Modal show={this.state.showreset} centered>
          <Modal.Header>
            <h4 style={{ textAlign: "center" }}>Reset First Password</h4>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Form>
                <FormGroup>
                  <Label htmlFor="password">Old Password</Label>
                  <Input
                    onChange={(e) => {
                      this.setState({ oldpassword: e.target.value });
                    }}
                    type="password"
                    id="oldpassword"
                    name="Old Password"
                    //innerRef={(input) => this.username = input}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    onChange={(e) => {
                      this.setState({ newpassword: e.target.value });
                    }}
                    type="password"
                    id="newpassword"
                    name="New Password"
                    // innerRef={(input) => this.password = input}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="password">Password Check</Label>
                  <Input
                    onChange={(e) => {
                      this.setState({ passwordcheck: e.target.value });
                    }}
                    type="password"
                    id="passwordcheck"
                    name="passwordcheck"
                    // innerRef={(input) => this.password = input}
                  />
                </FormGroup>

                <Button
                  type="submit"
                  onClick={(e) => this.handlereset(e)}
                  value="submit"
                  color="primary"
                >
                  Reset
                </Button>
              </Form>
            </Container>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default Login;
