import React, { useState } from 'react';
import { AuthContext } from '../../App';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import './Navbar.css';
import Logo from '../../assets/images/logo.png';
function Navbar() {
  const { auth, setAuth } = React.useContext(AuthContext);
  const history = useHistory();
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    localStorage.removeItem('token');
    setAuth({
      loggedIn: false,
      token: {},
      user: {},
      userType: '',
    });
    window.location = '/';
  };

  const button = () => <Button>asdf</Button>;
  if (auth.loggedIn && auth.userType === 'Recruiter') {
    return (
      <AppBar position='static'>
        <Toolbar className='Navbar'>
          <h1
            style={{
              flexGrow: 1,
              cursor: 'pointer',

              display: 'flex',
              alignItems: 'center',
            }}
            onClick={() => {
              history.push('/');
            }}
          >
            <img src={Logo} alt='JobHunt' width={50} height={50} />
            JobHunt
          </h1>

          <Button
            onClick={() => {
              history.push('/');
            }}
            variant='contained'
            style={{
              color: 'white',
              backgroundColor: 'rgb(143, 1, 143)',
              marginRight: 10,
            }}
          >
            Create Listing
          </Button>
          <Link component={RouterLink} to='/mylistings'>
            <Button
              variant='contained'
              style={{
                color: 'white',
                backgroundColor: 'rgb(143, 1, 143)',
                marginRight: 10,
              }}
            >
              My Listings
            </Button>
          </Link>
          <Button
            variant='contained'
            onClick={() => {
              history.push('/acceptedemployees');
            }}
            style={{
              color: 'white',
              backgroundColor: 'rgb(143, 1, 143)',
              marginRight: 10,
            }}
          >
            Accepted Employees
          </Button>
          <Button
            onClick={() => {
              history.push('/profile');
            }}
            variant='contained'
            color='primary'
            style={{
              marginRight: 10,
            }}
          >
            Profile
          </Button>
          <Button color='secondary' variant='contained' onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    );
  } else if (auth.loggedIn && auth.userType === 'Applicant') {
    return (
      <AppBar position='static'>
        <Toolbar className='Navbar'>
          <h1
            style={{
              flexGrow: 1,
              cursor: 'pointer',

              display: 'flex',
              alignItems: 'center',
            }}
            onClick={() => {
              history.push('/');
            }}
          >
            <img src={Logo} alt='JobHunt' width={50} height={50} />
            JobHunt
          </h1>
          <Button
            onClick={() => {
              history.push('/');
            }}
            variant='contained'
            style={{
              color: 'white',
              backgroundColor: 'rgb(143, 1, 143)',
              marginRight: 10,
            }}
          >
            Find Jobs
          </Button>
          {/* <Link component={RouterLink} to='/myapplications'> */}
          <Button
            variant='contained'
            onClick={() => {
              history.push('/myapplications');
            }}
            style={{
              color: 'white',
              backgroundColor: 'rgb(143, 1, 143)',
              marginRight: 10,
            }}
          >
            My Applications
          </Button>
          {/* </Link> */}
          <Button
            variant='contained'
            color='primary'
            style={{
              marginRight: 10,
            }}
            onClick={() => {
              history.push('/profile');
            }}
          >
            Profile
          </Button>
          <Button color='secondary' variant='contained' onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    );
  } else return null;
}

export default Navbar;
