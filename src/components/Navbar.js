import React, { Fragment, useEffect, useState } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import "./Navbar.css";
import axios from "axios";
import { host } from "../constant"
const NavbarCom = () => {

  const [userInfo, setUserInfo] = useState();
  const [isLogin, setIsLogin] = useState(false);

  const fetchData = async () => {
    const res = await axios.get(`${host}/api/users/me`, {
      headers: {
        'x-access-token': localStorage.getItem('x-access-token')
      }
    })
    //console.log(res.data.username)
    if (res.data.username === undefined) {
      setIsLogin(false);
    } else {
      setUserInfo(res.data);
      setIsLogin(true);
    }
  }
  useEffect(() => {
    fetchData();
  }, [])

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">Review-Forum</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav style={{ marginRight: 100 }}>

          </Nav>
          {isLogin === true ? <Fragment>
            <Nav style={{ marginRight: 50 }}>
              <div>
                <img style={{ height: 40, width: 40, borderRadius: 50 }} alt="avatar" src={userInfo.avatar !== undefined ? userInfo.avatar
                  : "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg"}></img>
                <b style={{ marginLeft: 10 }}>{userInfo.username}</b>
              </div>
            </Nav>
            <Nav style={{ marginRight: 50 }}>
              <Nav.Link href="#link">Logout</Nav.Link>
            </Nav>
          </Fragment> : null}
        </Navbar.Collapse>
      </Navbar>
    </div >
  );
};

export default NavbarCom;
