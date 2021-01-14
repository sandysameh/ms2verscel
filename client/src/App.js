






import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import CoordinatorSlots from "./components/CoordinatorSlots";
import Header from "./components/Header";
import Login from "./components/login";

import Hrmain from "./components/hrmain";
import Location from "./components/location";
import Member from "./components/member";
import Course from "./components/course";
import Faculty from "./components/faculty";
import Department from "./components/department";


import Replacements from "./components/Replacements";
import Viewattendence from "./components/viewattendence";
import Viewmyprofile from "./components/viewmyprofile";
import Viewhrprofile from "./components/viewhrprofile";

import Schedule from "./components/Schedule";
import SlotLinkingRequests from "./components/SlotLinkingRequests";
import SubmittedRequests from "./components/SubmittedRequests";


import Viewhrattendence from "./components/viewhrattendence";
import Viewhrnotifications from "./components/viewhrnotifications";
import { isMoment } from "moment";
import Misses from './components/misses'
import Instructorcourse from "./components/instructorcourse";
import Instructorstaff from "./components/instructorstaff";
import Instructorslots from "./components/instructorslots";
import Instructormain from "./components/instructormain"


import ManageCourses from "./components/ManageCourses";
import LeaveRequests from "./components/LeaveRequests";
import ChangedayOffRequests from "./components/ChangedayOffRequests";
import DepartmentStaff from "./components/DepartmentStaff";
import mynotifications from "./components/mynotifications";
import ViewMyAttendence from "./components/viewattendence";
import jwt_decode from "jwt-decode";

const AppWrapper = styled.div`
  margin: 0 auto;
  overflow-x: hidden;
  display: flex;
  min-height: 100%;
  height: inherit;
  flex-direction: column;
`;

class App extends Component {


  constructor(props) {
    super(props);
    this.state = { error: null };
    //this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    try {
      var token = localStorage.getItem('auth-token');
      var decoded = jwt_decode(token);

      console.log(jwt_decode(localStorage.getItem('auth-token')))

      // Do something that could throw
    } catch (error) {
      this.setState({ error });


    }
  }
  render() {
    return (
      <AppWrapper>
        <Router>

          {/* <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          /> */}





          <Header />
          {/* {(localStorage.getItem('auth-token'))&&(localStorage.getItem('auth-token')!="undefined") */}
          {!this.state.error
            ?
            <Switch>


              <Route exact path="/login" component={Login} />


              {/* condition that u can only route fl hagat di law enta hr bas  */}

              {localStorage.getItem('tokenrole') === "HR" ?
                <Switch>
                  <Route exact path="/hrmain" component={Hrmain} />
                  <Route exact path="/location" component={Location} />
                  <Route exact path="/member" component={Member} />
                  <Route exact path="/course" component={Course} />
                  <Route exact path="/faculty" component={Faculty} />
                  <Route exact path="/department" component={Department} />
                  <Route exact path="/viewhrprofile" component={Viewhrprofile} />
                  <Route exact path="/viewhrattendence" component={Viewhrattendence} />
                  <Route exact path="/viewhrnorifications" component={Viewhrnotifications} />
                  <Route exact path="/misses" component={Misses} />
                </ Switch> : <Switch>

                  {localStorage.getItem('tokenrole') === "HOD" ?
                    <Switch>

                      {/* all members must have those */}
                      <Route exact path="/viewattendence" component={ViewMyAttendence} />
                      <Route exact path="/viewmyprofile" component={Viewmyprofile} />
                      <Route exact path="/mynotifications" component={mynotifications} />
                      <Route exact path="/schedule" component={Schedule} />
                      <Route exact path="/replacements" component={Replacements} />
                      <Route exact path="/submittedrequests" component={SubmittedRequests} />

                      {/* HOD */}
                      <Route exact path="/leaverequests" component={LeaveRequests} />
                      <Route exact path="/changedayoffrequests" component={ChangedayOffRequests} />
                      <Route exact path="/managecourses" component={ManageCourses} />
                      <Route exact path="/departmentstaff" component={DepartmentStaff} />
                    </Switch> :
                    <Switch>


                      {localStorage.getItem('tokenrole') === "Course coordinator" ?
                        <Switch>
                          {/*ALL USERS  */}
                          <Route exact path="/viewattendence" component={ViewMyAttendence} />
                          <Route exact path="/viewmyprofile" component={Viewmyprofile} />
                          <Route exact path="/mynotifications" component={mynotifications} />
                          <Route exact path="/schedule" component={Schedule} />
                          <Route exact path="/replacements" component={Replacements} />
                          <Route exact path="/submittedrequests" component={SubmittedRequests} />
                          {/*co-ordinator  */}
                          <Route exact path="/slotlinkingrequests" component={SlotLinkingRequests} />
                          <Route exact path="/coordinatorslots" component={CoordinatorSlots} />
                        </Switch> :
                        <Switch>

                          {localStorage.getItem('tokenrole') === "Course Instructor" ?
                            <Switch>
                              {/*ALL USERS  */}
                              <Route exact path="/viewattendence" component={ViewMyAttendence} />
                              <Route exact path="/viewmyprofile" component={Viewmyprofile} />
                              <Route exact path="/mynotifications" component={mynotifications} />
                              <Route exact path="/schedule" component={Schedule} />
                              <Route exact path="/replacements" component={Replacements} />
                              <Route exact path="/submittedrequests" component={SubmittedRequests} />
                              {/*INSTRUCTOR  */}
                              <Route exact path="/instructorcourse" component={Instructorcourse} />
                              <Route exact path="/instructorstaff" component={Instructorstaff} />
                              <Route exact path="/instructorslots" component={Instructorslots} />

                              <Route exact path="/instructormain" component={Instructormain} />
                            </Switch> :
                            <Switch>
                              {/* Teachingggggg Assistants */}
                              <Route exact path="/viewattendence" component={ViewMyAttendence} />
                              <Route exact path="/viewmyprofile" component={Viewmyprofile} />
                              <Route exact path="/mynotifications" component={mynotifications} />
                              <Route exact path="/schedule" component={Schedule} />
                              <Route exact path="/replacements" component={Replacements} />
                              <Route exact path="/submittedrequests" component={SubmittedRequests} />

                                </Switch>}




                            </Switch>}
                        </Switch>}

                    </Switch>}
                </Switch>
            : <Route exact path="/login" component={Login} />}
        </Router>
      </AppWrapper>
    );
  }
}

export default App