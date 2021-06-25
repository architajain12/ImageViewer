import React, { Component } from "react";
import Header from '../../common/header/Header';

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

    render() {
        return (
            <div>
                <Header title="Image Viewer" section="home"/>
                <div>You have reached the Home component</div>
            </div>
        );
    }
}

export default Home;