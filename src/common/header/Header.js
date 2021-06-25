import React, { Component } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import SearchIcon from '@material-ui/icons/Search';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';

const styles = theme => ({

  header:{
    backgroundColor:'#263238'
  },
  
  searchBox: {
    width: '300px',
    borderRadius: '4px',
    position: 'relative',
    backgroundColor: '#c0c0c0',
  },

  headerFlexGrow: {
    flexGrow: 2.5
  },

  searchIcon: {
    display: 'flex',
    color: 'black',
    marginLeft: '1%',
    position: 'absolute',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  searchTextArea: {
    padding: '5%',
    marginLeft: '15%'
  },

  displayPicture: {
    width: 45,
    height: 45,
  }

})

class Header extends Component{

  constructor(props){
    super(props);
    this.state = {
      anchorEl: null,
    };
  }

  closeHandler = () => {
    this.setState({ anchorEl: null });
  }

  profilePicClickHandler = (event) => {
    this.setState({
      anchorEl: event.currentTarget
    })
  }

  accountHandler = ()=> {
    this.props.accountHandler();
    this.closeHandler();
  }

  logoutHandler = ()=> {
    this.props.logoutHandler();
    this.closeHandler();
  }

  render(){
    const { classes, section } = this.props;
    return (
    <div>
        <AppBar className = {classes.header}>
          <Toolbar>
            {(section === "Login" || section === "Home") && <span className = "logo">Image Viewer</span>}
            
            {/* The logo in the profile section links to the home section */}
            {(section === "Profile") && <Link style={{textDecoration: 'none'}} to="/home"><span className="logo">Image Viewer</span></Link>}
            
            <div className={classes.headerFlexGrow}/>
            {/* The search bar is available in the home section */}
            {(section === "Home") &&
              <div className={classes.searchBox}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase onChange = {(e) => {this.props.searchHandler(e.target.value)}} placeholder = "Search…" classes={{input: classes.searchTextArea}} />
              </div>
            }

            {/* The profile picture is displayed on the side in the Home and Profile sections */}
            {(section === "Home" || section === "Profile")  &&
              <div>
                <IconButton onClick={this.profilePicClickHandler}>
                  <Avatar alt = "Instagram Profile Picture" src = {this.props.userProfileUrl} className = {classes.displayPicture} />
                </IconButton>
                <Popover id = "simple-menu" anchorEl = {this.state.anchorEl} open = {Boolean(this.state.anchorEl)} onClose = {this.closeHandler} anchorOrigin = {{ vertical: 'bottom', horizontal: 'left'}} transformOrigin={{ vertical: 'top', horizontal: 'left'}}>
                    <div>
                      { (section === "Home") &&
                        <div>
                          {/* Takes you to the profile section */}
                          <MenuItem onClick={this.accountHandler}>My Account</MenuItem> 
                          <hr />
                        </div>
                      }
                      <MenuItem onClick={this.logoutHandler}>Logout</MenuItem>
                    </div>
                </Popover>
              </div>
            }
          </Toolbar>
        </AppBar>
    </div>)
  }

}

export default withStyles(styles)(Header)