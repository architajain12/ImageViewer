import React, { Component } from "react";
import { UserInfo } from "../../assets/UserInfo";
import { URLConfiguration } from "../../assets/APIdetails";
import Modal from '@material-ui/core/Modal';
import Header from '../../common/header/Header';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import FormHelperText from '@material-ui/core/FormHelperText';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIconBorder from '@material-ui/icons/FavoriteBorder';
import FavoriteIconFill from '@material-ui/icons/Favorite';
import EditIcon from '@material-ui/icons/Edit';


class Profile extends Component {
    constructor(props) {
        super(props);
        if (sessionStorage.getItem('access-token') == null) {
            props.history.replace('/');
        }
        this.state = {
            profilePicture: null,
        }
    }

    render() {
        return (
            <div>
                <Header title="Image Viewer" section="profile"/>
                <div>You have reached the Profile component</div>
            </div>
        );
    }
}

export default Profile;