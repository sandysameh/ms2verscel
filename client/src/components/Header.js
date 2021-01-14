import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown, NavItem, Button } from 'react-bootstrap'
import Guc from '../guc.png'
import Login from './login'
import Swal from 'sweetalert2'
import axios from "axios";
import jwt_decode from "jwt-decode";

function Header() {
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      var token = localStorage.getItem('auth-token');
      var decoded = jwt_decode(token);

      // Do something that could throw
    } catch (error) {
      setError(error);


    }
  }, []);
  const handlelogout = async (e) => {
    //setShowrreset(!showreset);
    // Swal.fire(passwordcheck)
    Swal.fire({
      title: 'LOG OUT?',
      text: "Are You SURE !?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Log Out!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {

          await axios({
            method: "get",
            url: process.env.REACT_APP_SERVER + "/logout",
            headers: { 'auth-token': localStorage.getItem('auth-token') },
            data: {

            },
          }).then((res) => {
            // console.log(res.data)


            if (res.status === 400) {
              Swal.fire(res.data.msg)
            }

            if (!res.data.msg) {
              Swal.fire("LOGGED OUT");
              localStorage.clear()
              window.location.href = '/'

              //  window.location.reload('/')
              //window.location.replace('/')

              //   window.location.reload();
            } else {
              Swal.fire(res.data.msg);
            }


          });
        } catch (e) {
          console.log(e);


        }
      }
    })


    // make API call




  }

  return (

    <Navbar bg="secondary" variant="dark">
      {/* {localStorage.clear()} */}
      {/* <Navbar.Brand href ="/" >GUC</Navbar.Brand> */}

      {/* <Navbar.Brand className="mr-auto" href="/"><img src='guc-logo.png' height="40"  alt='GUC' /></Navbar.Brand> */}

      <Navbar.Brand className="mr-auto" ><img src={Guc} style={{ width: '9%', height: '9%' }} alt='GUC' /></Navbar.Brand>

      <Nav className="mr-auto">



      </Nav>
      {!error ?
        <Nav className="ml-auto" navbar>
          <NavItem>
            <Button outline onClick={(e) => { handlelogout(e) }} > <span className="fa fa-sign-in fa-lg"></span> Log Out</Button>
          </NavItem>
        </Nav> :
        <Nav className="ml-auto" navbar>
          <NavItem>
            <Button outline onClick={() => window.location.href = '/login'}> <span className="fa fa-sign-in fa-lg"></span> Login</Button>
          </NavItem>
        </Nav>}
      {/* <Nav className="ml-auto" navbar>
                 <NavItem>
                    <Button outline onClick={()=>window.location.href='/login'}> <span className="fa fa-sign-in fa-lg"></span> Login</Button>
                 </NavItem>
             </Nav> */}
    </Navbar>
  );
}

export default Header;