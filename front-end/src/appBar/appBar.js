import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import $ from "jquery";

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
  const [currentCityCss, setCurrentCityCss] = useState();
  const [currentBranchCss, setCurrentBranchCss] = useState();


  // like componentDidMount() in class
  useEffect(() => {
    setBranches(props.onBranches);
  })

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCityColor = (cityClass) => {
    $(`.${currentCityCss}`).css("background-color", "");

    $(`.${cityClass}`).css("background-color", colors.primary);
    setCurrentCityCss(cityClass);
  }

  const handlebranchColor = (branchClass) => {
    $(`.${currentBranchCss}`).css("background-color", "");

    $(`.${branchClass}`).css("background-color", colors.darkGray);
    setCurrentBranchCss(branchClass);
  }

  const drawer = (
    <div style={{width: "100%", marginTop: 20}}>
      {/* render side bar buttons */}
        {branches.map((text, index) => (
          <ListItem className={`cityStyel${index}`} button key={text.cityName} onClick={() => {
            setSubBranches(text.branches)
            handleCityColor(`cityStyel${index}`);
          }}>
            <ListItemIcon style={{marginLeft: -10}}><LocationCityIcon style={{color: colors.white}} /></ListItemIcon>
            <Typography style={{fontSize: 12, marginLeft: -27, marginTop: 5}} >{text.cityName.toUpperCase()}</Typography>
          </ListItem>
        ))}

        {subBranches.map((subBranch, index) => (
          <ListItem  className={`branchStyel${index}`} button key={subBranch.branchID} onClick={() => {
            handlebranchColor(`branchStyel${index}`);
            props.onHandleCurrentBranch(subBranch.branchID)
          }} >
            <ListItemIcon ><DonutLargeIcon fontSize="small" style={{color: colors.white}} /></ListItemIcon>
            <Typography className={classes.subBranches} >{subBranch.branchName}</Typography>
          </ListItem>
        ))}
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
