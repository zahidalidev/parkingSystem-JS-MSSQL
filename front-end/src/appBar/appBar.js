import React, { useEffect, useState } from 'react';
import _ from "lodash";
import {useHistory} from "react-router"
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import Button from "@material-ui/core/Button"
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import colors from '../config/colors';
import logo from "../assets/SuperParkingService.png"

const drawerWidth = 130;
const appBarHeight = 80;


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    backgroundColor: colors.primary,
    height: appBarHeight,
    alignItems: "center",
    [theme.breakpoints.up('sm')]: {
      // width: `calc(100% - ${drawerWidth}px)`,
      // marginLeft: drawerWidth,
      height: appBarHeight
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    marginLeft: window.innerWidth < 768 ? -260 : null,
    marginTop: window.innerWidth < 768 ? 10 : null,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: {
    marginTop: 10,
    width: "100%",
  },

  drawerPaper: {
    // top: 50,
    marginTop: appBarHeight,
    width: drawerWidth,
    backgroundColor: colors.secondary,
    color: colors.white,
    alignItems: "center"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  subBranches: {
    fontSize: "14px",
    color: "#cecece",
    whiteSpace: 'nowrap',
    marginLeft: -30
  },
  logo: {
    marginTop: window.innerWidth < 768 ? -90 : 5, 
    marginLeft: 20,
    width: window.innerWidth < 768 ? 200 : 370,
    height: window.innerWidth < 768 ? appBarHeight - 30 : appBarHeight - 10,
  }
}));

function ResponsiveDrawer(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [branches, setBranches] = useState([]);
  const [subBranches, setSubBranches] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [atBranch, setAtBranch] = useState(null);
  const history = useHistory();

  // like componentDidMount() in class
  useEffect(() => {
    setBranches(props.onBranches);
    setCurrentUser(props.onCurrentUser);
  })

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAtBranch(null)
    history.push("/");
    props.onHandleLogout();
  }

  const drawer = (
    <div style={{width: "100%", marginTop: 20}}>
      {/* render side bar buttons */}

        {/* Select City */}
          <FormControl variant="filled" style={{minWidth: drawerWidth}}>
            <InputLabel style={{color: "white"}} id="demo-simple-select-filled-label">Select City</InputLabel>
            <Select
                style={{color: "white"}}
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                onChange={(e) => {
                  setSubBranches(e.target.value)
                  setAtBranch(null)
                }}
            >
                {branches.map((text, index) => (
                  <MenuItem key={index} value={text.branches}>{text.cityName}</MenuItem>
                ))}
            </Select>
          </FormControl>

        {/* Select Branch of City */}
          <FormControl variant="filled" style={{minWidth: drawerWidth, marginTop: 10}}>
            <InputLabel style={{color: "white"}} id="demo-simple-select-filled-label">Select Branch</InputLabel>
            <Select
                style={{color: "white"}}
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                onChange={(e) => {
                  props.onHandleCurrentBranch(e.target.value);
                  setAtBranch(true)
                  console.log(e.target.value)
                }}
            >
                {subBranches.map((subBranch, index) => (
                  <MenuItem key={index} value={subBranch.branchID}>{subBranch.branchName}</MenuItem>
                ))}
            </Select>
          </FormControl>

        {/* select Entry or Exit For vehicle, only for employee */}
        {currentUser.roll === "employee" && atBranch != null ? 
          <div style={{marginTop: 20}}>
            <ListItem button >
              <ListItemIcon ><LocalShippingIcon fontSize="small" style={{color: colors.white}} /></ListItemIcon>
              <Button onClick={() => history.push("/home/city/branch/entry")} color="primary" variant="contained" style={{marginLeft: -20, backgroundColor: colors.darkGray}} >ENTRY</Button>
            </ListItem>
            <ListItem button >
              <ListItemIcon ><DriveEtaIcon fontSize="small" style={{color: colors.white}} /></ListItemIcon>
              <Button onClick={() => history.push("/home/city/branch/exit")} color="primary" variant="contained" style={{marginLeft: -20, backgroundColor: colors.primary}} >EXIT</Button>
            </ListItem>
          </div>: null
        }

        {/* select today's current report of branch component, for admin and super visor */}
        {(currentUser.roll === "super Visor" || currentUser.roll === "admin") && atBranch != null ? 
          <div style={{marginTop: 30, marginLeft: 5}}>
              <Button onClick={() => history.push("/home/city/branch/currentreport")} color="primary" variant="contained" style={{backgroundColor: colors.sideBarButton, whiteSpace: "nowrap", width: drawerWidth - 12, fontSize: 12}} >Today Report</Button>
          </div>: null
        }

        {/* select day report of month component */}
        {(currentUser.roll === "admin") && atBranch != null ? 
          <div style={{marginTop: 30, marginLeft: 5}}>
              <Button onClick={() => history.push("/home/dayodmonthreport")} color="primary" variant="contained" style={{backgroundColor: colors.sideBarButton, whiteSpace: "nowrap", width: drawerWidth - 12, fontSize: 12}} >Month Report</Button>
          </div>: null
        }

        {/* select summary report of year component */}
        {currentUser.roll === "admin" ? 
          <div style={{marginTop: 30, marginLeft: 5}}>
              <Button onClick={() => history.push("/home/summaryreport")} color="primary" variant="contained" style={{backgroundColor: colors.sideBarButton, whiteSpace: "nowrap", width: drawerWidth - 12, fontSize: 12}} >Summary Rep</Button>
          </div>: null
        }

        {/* select branches component */}
        {currentUser.roll === "admin" ? 
          <div style={{marginTop: 30, marginLeft: 5}}>
              <Button onClick={() => history.push("/home/branches")} color="primary" variant="contained" style={{backgroundColor: colors.sideBarButton, whiteSpace: "nowrap", width: drawerWidth - 12, fontSize: 12}} >Branches</Button>
          </div>: null
        }

        {/* select employee component */}
        {currentUser.roll === "admin" ? 
          <div style={{marginTop: 30, marginLeft: 5}}>
              <Button onClick={() => history.push("/home/employee")} color="primary" variant="contained" style={{backgroundColor: colors.sideBarButton, whiteSpace: "nowrap", width: drawerWidth - 12, fontSize: 12}} >Employees</Button>
          </div>: null
        }

        {/* select staffEmployee Serial component */}
        {currentUser.roll === "admin" ? 
          <div style={{marginTop: 30, marginLeft: 5}}>
              <Button onClick={() => history.push("/home/staffemployeeserial")} color="primary" variant="contained" style={{backgroundColor: colors.sideBarButton, whiteSpace: "nowrap", width: drawerWidth - 12, fontSize: 12}} >Emp Serial No.</Button>
          </div>: null
        }

        {/* handling logout button */}
        {!_.isEmpty(currentUser) ? 
          <div style={{bottom: 10, position: "fixed", bottom: "10px"}}>
            <ListItem button >
              <Button onClick={() => handleLogout() } color="primary" variant="contained" style={{marginLeft: -11, backgroundColor: colors.primary}} >
                LOGOUT 
                <ExitToAppIcon fontSize="small" style={{color: colors.white, marginLeft: 5}} />
              </Button>
            </ListItem>
          </div>: null
        }

    </div>
  );
  
  const container = window !== undefined ? () => window().document.body : undefined;
  
  return (
    <div className={classes.root}>
      <CssBaseline />

      {/* App Bar to render drawer conditionally */}
      <AppBar position="fixed" className={classes.appBar}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
        <Toolbar>
          <img src={logo} className={classes.logo} />
        </Toolbar>
      </AppBar>

      {_.isEmpty(currentUser) ? null :
        <nav className={classes.drawer} aria-label="mailbox folders">
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          {/* for mobile */}
          <Hidden smUp implementation="css">
            <Drawer
              container={container}
              variant="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={mobileOpen}
              onClose={handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
            {/* for windows */}
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              {drawer}
            </Drawer>
          </Hidden>
          
        </nav>
      }
    </div>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
