import React, {useState, useEffect} from 'react';
import config from '../config.json'
import { AppBar, Typography, Toolbar, Avatar, Button } from '@material-ui/core';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';
/* 
import memoriesLogo from '../../images/memoriesLogo.png';
import memoriesText from '../../images/memoriesText.png'; */
import * as actionType from '../constants/actionTypes';
import useStyles from './styles'; 

export default function Header(props) {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();

  const logout = () => {
    dispatch({ type: actionType.LOGOUT });

    history.push('/login');

    setUser(null);
  };

  useEffect(() => {
    const token = user?.token;

    if (token) {
      const decodedToken = decode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [location]);
    return (
        <nav className="navbar navbar-expand-xs navbar-expand-sm navbar-expand-md navbar-light bg-light">
            <a className="navbar-brand text-white" href="/">
                <i className="fas fa-clipboard-check" style={{fontSize: '26px', marginRight: '10px'}}></i>
                {config.appTitle}
            </a>

            <Toolbar className={classes.toolbar}>
        {user?.result ? (
          <div className={classes.profile}>
            {/* <Avatar className={classes.purple} alt={user?.result.name} src={user?.result.imageUrl}>{user?.result.name.charAt(0)}</Avatar> */}
            <Typography className={classes.userName} variant="h6">{user?.result.name}</Typography>
            <Button variant="contained" className={classes.logout} color="secondary"
            onClick={logout}
             >Logout</Button>
          </div>
        ) : (
          <Button component={Link} to="/login" variant="contained" color="primary">Sign In</Button>
        )}
      </Toolbar>

            <a className="navbar-brand text-white" href="/user/logout" style={{
                marginLeft: 1000
            }}>
                <i className="fas fa-sign-out-alt" style={{fontSize: '26px', marginRight: '10px'}}></i>
                Logoooooooooooout
            </a>
        </nav>
    );
}