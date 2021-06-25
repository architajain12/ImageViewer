import React, { Component } from "react";

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
            <div>You have reached the Profile component</div>
        );
    }
}

export default Profile;