import React, { Component } from "react";
import Header from '../../common/header/Header';
import userProfilePicture from "../../assets/userProfilePicture.jpeg";

class Home extends Component {
    constructor(props) {
        super(props);
        if (sessionStorage.getItem('access-token') == null) {
            props.history.replace('/');
        }
        this.state = {
            profilePicture: null,
        }
    }

    logout = () => {
        sessionStorage.clear();
        this.props.history.replace('/');
    }

    myAccount = () => {
        this.props.history.replace('/profile');
    }

    render() {
        return (
            <div>
                <Header title="Image Viewer" section="Home" userProfileUrl={userProfilePicture} logoutHandler={this.logout} accountHandler={this.myAccount}/>
                <div>You have reached the Home component</div>
            </div>
        );
    }
}

export default Home;