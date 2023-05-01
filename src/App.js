import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import Home from './components/Home/Home';
import Profile from './components/Profile/Profile';
import FindJobs from './components/FindJobs/FindJobs';
import MyApplications from './components/MyApplications/MyApplications';
import CreateListing from './components/CreateListing/CreateListing';
import MyListings from './components/MyListings/MyListings';
import Applications from './components/Applications/Applications';
import AcceptedEmployees from './components/AcceptedEmployees/AcceptedEmployees';
import Montserrat from './assets/fonts/Montserrat-Regular.ttf';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { createTheme } from '@mui/material/styles';

const defaultAuth = {
  loggedIn: false,
  token: {},
  user: {},
  userType: '',
};

export const AuthContext = React.createContext(null);
function App() {
  const theme = createTheme({
    typography: {
      fontFamily: 'Montserrat, Arial',
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          @font-face {
            font-family: 'Montserrat';
            font-style: normal;
            font-display: swap;
            font-weight: 400;
            src: local('Montserrat'), local('Montserrat-Regular'), url(${Montserrat}) format('ttf');
            unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
          }
        `,
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <div>
        <AppContainer />
      </div>
    </ThemeProvider>
  );
}
function AppContainer() {
  const [auth, setAuth] = useState(defaultAuth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (
      localStorage.getItem('token') &&
      localStorage.getItem('userType') &&
      localStorage.getItem('user')
    ) {
      let userType = localStorage.getItem('userType');
      let user = JSON.parse(localStorage.getItem('user'));
      let token = localStorage.getItem('token');
      if (userType === 'Recruiter' || userType === 'Applicant') {
        let url = `/api/auth/${userType}/${user._id}`;
        let config = {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        };
        //setLoading(true);
        axios
          .get(url, config)
          .then((response) => {
            setAuth({
              loggedIn: true,
              user: user,
              token: token,
              userType: userType,
            });
          })
          .catch((error) => {
            localStorage.removeItem('user');
            localStorage.removeItem('userType');
            localStorage.removeItem('token');
            setAuth(defaultAuth);
          });
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
        localStorage.removeItem('token');
        setAuth(defaultAuth);
      }
    }
  }, []);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, [auth]);

  if (loading) return <LoadingScreen />;
  else
    return (
      <AuthContext.Provider value={{ auth, setAuth }}>
        <Switch>
          <Route path='/acceptedemployees'>
            {() => {
              if (auth.loggedIn && auth.userType === 'Recruiter')
                return <AcceptedEmployees />;
              else return <Redirect to='/' />;
            }}
          </Route>
          <Route path='/applications/:listingId'>
            {() => {
              if (auth.loggedIn && auth.userType === 'Recruiter')
                return <Applications />;
              else return <Redirect to='/' />;
            }}
          </Route>
          <Route path='/myapplications'>
            {() => {
              if (auth.loggedIn && auth.userType === 'Applicant')
                return <MyApplications />;
              else return <Redirect to='/' />;
            }}
          </Route>
          <Route path='/mylistings'>
            {() => {
              if (auth.loggedIn && auth.userType === 'Recruiter')
                return <MyListings />;
              else return <Redirect to='/' />;
            }}
          </Route>
          <Route path='/profile'>
            <Profile />
          </Route>
          <Route path='/'>
            {() => {
              if (auth.loggedIn) {
                if (auth.userType === 'Recruiter') {
                  return <CreateListing />;
                } else {
                  return <FindJobs />;
                }
              } else return <Home />;
            }}
          </Route>
        </Switch>
      </AuthContext.Provider>
    );
}

export default App;
