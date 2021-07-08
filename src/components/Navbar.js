import React, { Fragment, useEffect, useState, useRef } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Modal, Form, Input, Button } from 'semantic-ui-react'
import axios from 'axios'
import { host } from "../constant"
import "./Navbar.css";
const NavbarCom = () => {

  const [userInfo, setUserInfo] = useState();
  const [isLogin, setIsLogin] = useState(false);
  const [open, setOpen] = React.useState(false);

  const refEmail = useRef();
  const refPassword = useRef();

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

  const handleLogout = () => {
    //setIsLogin(false);
    localStorage.removeItem('x-access-token');
    window.location.reload();
  }

  const handleLogin = async () => {
    const res = await axios.post(`${host}/api/users/login`, {
      email: refEmail.current.inputRef.current.value,
      password: refPassword.current.inputRef.current.value,
    });
    if(res.headers['x-access-token']){
      //setIsLogin(true);
      localStorage.setItem('x-access-token', res.headers['x-access-token'])
      window.location.reload();
      //fetchData();
    } else {
      alert("Tài khoản hoặc mật khẩu không đúng")
    }
  }
  const Login = ({trigger}) => {

    return (
      <Modal
        centered={true}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={trigger}
        size={"mini"}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          marginRight: '-50%',
          transform: "translate(-50%, -50%)",
          height: 250
        }}
      >
        <Modal.Header>Login</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Form>
              <Input label="Email" type="text" size="small"
              ref={refEmail} placeholder='Type email...' />
              <br></br>
              <br></br>
              <Input label="Password  " type="password" size="small" 
              ref={refPassword} placeholder='Type password...' />
            </Form>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button
            content="Login"
            labelPosition='right'
            onClick={handleLogin}
            icon
          />
        </Modal.Actions>
      </Modal>
    )
  }


  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">Review-Forum</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
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
              <a href="#" onClick={handleLogout}>Logout</a>
            </Nav>
          </Fragment> :
            <Nav style={{ marginRight: 50 }}>
              <Login trigger={<a href="#" >Login</a>} />
            </Nav>}
        </Navbar.Collapse>
      </Navbar>
    </div >
  );
};

export default NavbarCom;
